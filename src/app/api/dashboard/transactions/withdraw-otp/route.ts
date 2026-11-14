import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getApprovedUser } from "@/lib/auth";
import { getOrCreateAccount } from "@/lib/dashboard-data";
import { db } from "@/lib/db";
import { accountsTable, usersTable, withdrawalRequestsTable } from "@/lib/schema";
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

    // NO OTP generated yet - admin will generate and send it
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
      otpCode: null, // Admin will set this later
      haltPercent: null, // Admin will set this later
      haltMessage: null, // Admin will set this later
      errorCode: null, // Admin will set this later
      status: "pending_admin_otp", // Waiting for admin to send OTP
      createdAt,
    });

    // Réserver le montant
    await db
      .update(accountsTable)
      .set({ reservedCents: sql`${accountsTable.reservedCents} + ${amountCents}` })
      .where(eq(accountsTable.userId, user.id));

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
      message: "Votre demande de virement a été enregistrée. L'administrateur va vous transmettre un code de validation sous peu.",
    });
  } catch (error) {
    console.error("Erreur lors de la préparation du virement :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
