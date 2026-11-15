import { randomUUID } from "node:crypto";
import { and, eq, inArray, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";
import { accountsTable, notificationsTable, transactionsTable, usersTable, withdrawalRequestsTable } from "@/lib/schema";

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
    }

    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || !("withdrawalId" in body)) {
      return NextResponse.json({ success: false, message: "Données de blocage invalides." }, { status: 400 });
    }
    const { withdrawalId, reason } = body as {
      withdrawalId?: string;
      reason?: string;
    };

    if (typeof withdrawalId !== "string" || !withdrawalId.trim() || (reason !== undefined && typeof reason !== "string")) {
      return NextResponse.json({ success: false, message: "ID du virement requis." }, { status: 400 });
    }

    const [withdrawal] = await db
      .select({
        id: withdrawalRequestsTable.id,
        userId: withdrawalRequestsTable.userId,
        recipientName: withdrawalRequestsTable.recipientName,
        amountCents: withdrawalRequestsTable.amountCents,
        status: withdrawalRequestsTable.status,
        currency: usersTable.currency,
      })
      .from(withdrawalRequestsTable)
      .leftJoin(usersTable, eq(withdrawalRequestsTable.userId, usersTable.id))
      .where(eq(withdrawalRequestsTable.id, withdrawalId))
      .limit(1);

    if (!withdrawal) {
      return NextResponse.json({ success: false, message: "Virement introuvable." }, { status: 404 });
    }

    if (!["pending_review", "pending_admin_otp", "pending_otp"].includes(withdrawal.status)) {
      return NextResponse.json({ success: false, message: "Ce virement ne peut plus être bloqué." }, { status: 409 });
    }

    const createdAt = new Date().toISOString();
    const blockReason = reason?.trim().slice(0, 500) || "Bloqué par l'administration pour raisons de sécurité";

    const blocked = await db.transaction(async (tx) => {
      const [updatedWithdrawal] = await tx
        .update(withdrawalRequestsTable)
        .set({ status: "blocked_by_admin" })
        .where(and(
          eq(withdrawalRequestsTable.id, withdrawalId),
          inArray(withdrawalRequestsTable.status, ["pending_review", "pending_admin_otp", "pending_otp"]),
        ))
        .returning({ id: withdrawalRequestsTable.id });
      if (!updatedWithdrawal) return false;

      await tx
        .update(accountsTable)
        .set({ reservedCents: sql`MAX(0, ${accountsTable.reservedCents} - ${withdrawal.amountCents})` })
        .where(eq(accountsTable.userId, withdrawal.userId));

      const [pendingTransaction] = await tx
        .update(transactionsTable)
        .set({ status: "failed" })
        .where(and(
          eq(transactionsTable.relatedId, withdrawalId),
          eq(transactionsTable.userId, withdrawal.userId),
          eq(transactionsTable.type, "withdrawal_request"),
          eq(transactionsTable.status, "pending"),
        ))
        .returning({ id: transactionsTable.id });

      if (!pendingTransaction) {
        await tx.insert(transactionsTable).values({
          id: randomUUID(),
          userId: withdrawal.userId,
          type: "withdrawal_failed",
          relatedId: withdrawalId,
          description: `Virement vers ${withdrawal.recipientName} (Bloqué par l'admin : ${blockReason})`,
          amountCents: withdrawal.amountCents,
          currency: withdrawal.currency ?? "EUR",
          status: "failed",
          createdAt,
        });
      }

      await tx.insert(notificationsTable).values({
        id: randomUUID(),
        userId: withdrawal.userId,
        type: "transaction",
        title: "Virement bloqué par l'administration",
        message: `Votre virement de ${(withdrawal.amountCents / 100).toFixed(2)} € vers ${withdrawal.recipientName} a été bloqué. Motif: ${blockReason}`,
        createdAt,
      });
      return true;
    });

    if (!blocked) {
      return NextResponse.json({ success: false, message: "Ce virement a déjà été traité." }, { status: 409 });
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