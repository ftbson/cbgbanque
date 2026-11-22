import { randomUUID } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getApprovedUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { accountsTable, notificationsTable, transactionsTable, withdrawalRequestsTable } from "@/lib/schema";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getApprovedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });
    const { id } = await params;

    // Cherche par ID de demande de virement
    let [reqRow] = await db
      .select()
      .from(withdrawalRequestsTable)
      .where(and(eq(withdrawalRequestsTable.id, id), eq(withdrawalRequestsTable.userId, user.id)))
      .limit(1);

    if (!reqRow) {
      // Sinon cherche par ID de transaction liée
      const [txRow] = await db
        .select()
        .from(transactionsTable)
        .where(and(eq(transactionsTable.id, id), eq(transactionsTable.userId, user.id)))
        .limit(1);

      if (txRow?.relatedId) {
        const [related] = await db
          .select()
          .from(withdrawalRequestsTable)
          .where(and(eq(withdrawalRequestsTable.id, txRow.relatedId), eq(withdrawalRequestsTable.userId, user.id)))
          .limit(1);
        reqRow = related;
      }
    }

    if (!reqRow) {
      return NextResponse.json({ success: false, message: "Virement introuvable." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      transfer: {
        id: reqRow.id,
        recipientName: reqRow.recipientName,
        iban: reqRow.iban,
        bic: reqRow.bic,
        amountCents: reqRow.amountCents,
        description: reqRow.description,
        status: reqRow.status,
        requiresOtp: reqRow.status === "pending_otp",
        createdAt: reqRow.createdAt,
      },
    });
  } catch (error) {
    console.error("Erreur chargement virement :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

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
