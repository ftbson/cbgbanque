import { randomUUID } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getApprovedUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { accountsTable, notificationsTable, transactionsTable } from "@/lib/schema";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getApprovedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });
    const { id } = await params;
    const now = new Date().toISOString();

    const cancelled = await db.transaction(async (tx) => {
      const [transaction] = await tx.update(transactionsTable)
        .set({ status: "cancelled" })
        .where(and(
          eq(transactionsTable.id, id),
          eq(transactionsTable.userId, user.id),
          eq(transactionsTable.type, "withdrawal_request"),
          eq(transactionsTable.status, "pending"),
        ))
        .returning({ amountCents: transactionsTable.amountCents });
      if (!transaction) return false;

      const [account] = await tx.update(accountsTable)
        .set({ reservedCents: sql`${accountsTable.reservedCents} - ${transaction.amountCents}` })
        .where(and(
          eq(accountsTable.userId, user.id),
          sql`${accountsTable.reservedCents} >= ${transaction.amountCents}`,
        ))
        .returning({ userId: accountsTable.userId });
      if (!account) throw new Error("WITHDRAWAL_RESERVATION_NOT_FOUND");

      await tx.insert(notificationsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: "transaction",
        title: "Demande de retrait annulée",
        message: "Le montant réservé est de nouveau disponible.",
        createdAt: now,
      });
      return true;
    });

    if (!cancelled) return NextResponse.json({ success: false, message: "Demande introuvable ou déjà traitée." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de l'annulation du retrait :", error);
    return NextResponse.json({ success: false, message: "Impossible d'annuler la demande." }, { status: 500 });
  }
}
