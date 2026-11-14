import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getApprovedUser } from "@/lib/auth";
import { getOrCreateAccount } from "@/lib/dashboard-data";
import { db } from "@/lib/db";
import { usersTable, withdrawalRequestsTable } from "@/lib/schema";
import { sendTransferInitiatedAdminEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const user = await getApprovedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });

    const body = await request.json();
    const { recipientName, iban, bic, amount, description } = body as {
      recipientName?: string;
      iban?: string;
      bic?: string;
      amount?: string | number;
      description?: string;
    };

    if (!recipientName?.trim() || !iban?.trim() || !amount) {
      return NextResponse.json({ success: false, message: "Tous les champs obligatoires doivent être renseignés." }, { status: 400 });
    }

    const numAmount = typeof amount === "string" ? parseFloat(amount.replace(",", ".")) : Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ success: false, message: "Montant invalide." }, { status: 400 });
    }

    const account = await getOrCreateAccount(user.id);
    const amountCents = Math.round(numAmount * 100);

    if (account.balanceCents < amountCents) {
      return NextResponse.json({
        success: false,
        message: `Solde insuffisant (${(account.balanceCents / 100).toFixed(2)} € disponible).`,
      }, { status: 400 });
    }

    // Generate 6-digit OTP code (e.g. 583912)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const id = randomUUID();
    const createdAt = new Date().toISOString();

    await db.insert(withdrawalRequestsTable).values({
      id,
      userId: user.id,
      recipientName: recipientName.trim(),
      iban: iban.trim().toUpperCase(),
      bic: (bic?.trim() || "C23QBEBB").toUpperCase(),
      amountCents,
      description: description?.trim() || "Virement bancaire SEPA",
      otpCode,
      status: "pending_otp",
      createdAt,
    });

    // Récupérer les infos utilisateur pour l'email admin
    const [userInfo] = await db
      .select({ email: usersTable.email, firstName: usersTable.firstName, lastName: usersTable.lastName })
      .from(usersTable)
      .where(eq(usersTable.id, user.id))
      .limit(1);

    // Envoyer notification email à l'admin (email admin configurable via env)
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && userInfo) {
      try {
        await sendTransferInitiatedAdminEmail(
          adminEmail,
          userInfo.firstName,
          userInfo.lastName,
          userInfo.email,
          (amountCents / 100).toFixed(2),
          account.currency,
          recipientName.trim(),
          iban.trim().toUpperCase()
        );
      } catch (emailError) {
        console.error("Email admin notification failed:", emailError);
        // Ne pas bloquer le virement si l'email échoue
      }
    }

    return NextResponse.json({
      success: true,
      requestId: id,
      message: "Un code de validation à 6 chiffres a été généré et transmis au superviseur de conformité.",
    });
  } catch (error) {
    console.error("Erreur lors de la préparation du virement :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
