import { randomUUID } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getApprovedUser } from "@/lib/auth";
import { getOrCreateAccount } from "@/lib/dashboard-data";
import { db } from "@/lib/db";
import { accountsTable, notificationsTable, transactionsTable, usersTable, withdrawalRequestsTable } from "@/lib/schema";
import { sendTransferInitiatedAdminEmail } from "@/lib/mail";

function parseAmountCents(value: unknown) {
  if (typeof value !== "string" || !/^\d{1,7}(?:[.,]\d{1,2})?$/.test(value.trim())) return null;
  const [whole, fraction = ""] = value.trim().replace(",", ".").split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(cents) && cents > 0 ? cents : null;
}

export async function POST(request: Request) {
  try {
    const user = await getApprovedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });

    const [userInfo] = await db
      .select({
        status: usersTable.status,
        transfersBlocked: usersTable.transfersBlocked,
        email: usersTable.email,
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
      })
      .from(usersTable)
      .where(eq(usersTable.id, user.id))
      .limit(1);

    if (userInfo?.status === "blocked") {
      return NextResponse.json({
        success: false,
        message: "Votre compte est bloqué par mesure de sécurité. Les virements ne sont pas autorisés.",
      }, { status: 403 });
    }

    if (userInfo?.transfersBlocked === 1) {
      return NextResponse.json({
        success: false,
        message: "Les opérations de virement sont temporairement suspendues sur votre compte par l'administration. Veuillez contacter votre conseiller CBG.",
      }, { status: 403 });
    }

    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || !("recipientName" in body) || !("iban" in body)) {
      return NextResponse.json({ success: false, message: "Données de virement invalides." }, { status: 400 });
    }

    const { recipientName, iban, bic, amount, description } = body as Record<string, unknown>;

    if (
      typeof recipientName !== "string" ||
      typeof iban !== "string" ||
      (bic !== undefined && typeof bic !== "string") ||
      (description !== undefined && typeof description !== "string")
    ) {
      return NextResponse.json({ success: false, message: "Bénéficiaire, coordonnées ou motif de virement invalides." }, { status: 400 });
    }

    const cleanRecipient = recipientName.trim();
    const cleanIban = iban.replace(/\s/g, "").toUpperCase();
    const cleanBic = typeof bic === "string" ? bic.trim().toUpperCase() : "";
    const amountCents = parseAmountCents(amount);
    const cleanDescription = (typeof description === "string" ? description.trim() : "") || "Virement bancaire SEPA";

    if (
      !cleanRecipient ||
      cleanRecipient.length > 120 ||
      !/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(cleanIban) ||
      (cleanBic && !/^[A-Z0-9]{8}(?:[A-Z0-9]{3})?$/.test(cleanBic)) ||
      !amountCents ||
      cleanDescription.length > 120
    ) {
      return NextResponse.json({ success: false, message: "Bénéficiaire, coordonnées ou montant de virement invalides." }, { status: 400 });
    }

    const account = await getOrCreateAccount(user.id);
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const recorded = await db.transaction(async (tx) => {
      const reserved = await tx
        .update(accountsTable)
        .set({ reservedCents: sql`${accountsTable.reservedCents} + ${amountCents}` })
        .where(and(
          eq(accountsTable.userId, user.id),
          sql`${accountsTable.balanceCents} - ${accountsTable.reservedCents} >= ${amountCents}`,
        ))
        .returning({ userId: accountsTable.userId });

      if (reserved.length === 0) return false;

      await tx.insert(withdrawalRequestsTable).values({
        id,
        userId: user.id,
        recipientName: cleanRecipient,
        iban: cleanIban,
        bic: cleanBic,
        amountCents,
        description: cleanDescription,
        status: "pending_review",
        createdAt,
      });

      await tx.insert(transactionsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: "withdrawal_request",
        relatedId: id,
        description: `Virement vers ${cleanRecipient}`,
        amountCents,
        currency: account.currency,
        status: "pending",
        createdAt,
      });

      await tx.insert(notificationsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: "transaction",
        title: "Demande de virement enregistrée",
        message: "Votre demande est en attente de validation par l'administration. Aucun virement n'a encore été exécuté.",
        createdAt,
      });
      return true;
    });

    if (!recorded) {
      return NextResponse.json({
        success: false,
        message: `Solde disponible insuffisant (${((account.balanceCents - account.reservedCents) / 100).toFixed(2)} € disponible).`,
      }, { status: 409 });
    }

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
          cleanRecipient,
          cleanIban
        );
      } catch (emailError) {
        console.error("Email admin notification failed:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      requestId: id,
      message: "Votre demande est enregistrée et en attente de validation par l'administration. Aucun virement n'a encore été exécuté.",
    });
  } catch (error) {
    console.error("Erreur lors de la préparation du virement :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
