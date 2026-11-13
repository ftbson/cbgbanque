import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";
import { notificationsTable, transactionsTable, usersTable, withdrawalRequestsTable } from "@/lib/schema";
import { sendTransferBlockedEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
    }

    const body = await request.json();
    const { withdrawalId, reason } = body as {
      withdrawalId?: string;
      reason?: string;
    };

    if (!withdrawalId) {
      return NextResponse.json({ success: false, message: "ID du virement requis." }, { status: 400 });
    }

    const [withdrawal] = await db
      .select({
        id: withdrawalRequestsTable.id,
        userId: withdrawalRequestsTable.userId,
        recipientName: withdrawalRequestsTable.recipientName,
        amountCents: withdrawalRequestsTable.amountCents,
        status: withdrawalRequestsTable.status,
        email: usersTable.email,
        firstName: usersTable.firstName,
      })
      .from(withdrawalRequestsTable)
      .leftJoin(usersTable, eq(withdrawalRequestsTable.userId, usersTable.id))
      .where(eq(withdrawalRequestsTable.id, withdrawalId))
      .limit(1);

    if (!withdrawal) {
      return NextResponse.json({ success: false, message: "Virement introuvable." }, { status: 404 });
    }

    if (withdrawal.status !== "pending_otp") {
      return NextResponse.json({ success: false, message: "Ce virement ne peut plus être bloqué." }, { status: 409 });
    }

    const createdAt = new Date().toISOString();
    const blockReason = reason?.trim() || "Bloqué par l'administration pour raisons de sécurité";

    await db.transaction(async (tx) => {
      // Mettre à jour le statut du retrait
      await tx
        .update(withdrawalRequestsTable)
        .set({ status: "blocked_at_routing" })
        .where(eq(withdrawalRequestsTable.id, withdrawalId));

      // Enregistrer la transaction comme échouée
      await tx.insert(transactionsTable).values({
        id: randomUUID(),
        userId: withdrawal.userId,
        type: "withdrawal_failed",
        description: `Virement externe vers ${withdrawal.recipientName} (Bloqué par l'admin: ${blockReason})`,
        amountCents: withdrawal.amountCents,
        currency: "EUR",
        status: "failed",
        createdAt,
      });

      // Notification in-app
      await tx.insert(notificationsTable).values({
        id: randomUUID(),
        userId: withdrawal.userId,
        type: "transaction",
        title: "Virement bloqué par l'administration",
        message: `Votre virement de ${(withdrawal.amountCents / 100).toFixed(2)} € vers ${withdrawal.recipientName} a été bloqué. Motif: ${blockReason}`,
        createdAt,
      });
    });

    // Envoyer email de notification
    if (withdrawal.email && withdrawal.firstName) {
      try {
        await sendTransferBlockedEmail(
          withdrawal.email,
          withdrawal.firstName,
          (withdrawal.amountCents / 100).toFixed(2),
          "EUR",
          withdrawal.recipientName,
          blockReason
        );
      } catch (error) {
        console.error("Email de blocage virement non envoyé :", error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Le virement vers ${withdrawal.recipientName} a été bloqué avec succès.`,
    });
  } catch (error) {
    console.error("Erreur lors du blocage du virement :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}