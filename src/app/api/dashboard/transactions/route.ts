import { randomUUID } from "node:crypto";
import { and, desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getApprovedUser } from "@/lib/auth";
import { getOrCreateAccount } from "@/lib/dashboard-data";
import { db } from "@/lib/db";
import { accountsTable, notificationsTable, transactionsTable } from "@/lib/schema";

function parseAmountCents(value: unknown) {
  if (typeof value !== "string" || !/^\d{1,7}(?:[.,]\d{1,2})?$/.test(value.trim())) return null;
  const [whole, fraction = ""] = value.trim().replace(",", ".").split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(cents) && cents > 0 ? cents : null;
}

export async function GET(request: Request) {
  try {
    const user = await getApprovedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });

    const requestUrl = new URL(request.url);
    const offsetValue = Number(requestUrl.searchParams.get("offset") ?? 0);
    if (!Number.isSafeInteger(offsetValue) || offsetValue < 0 || offsetValue > 1000000) {
      return NextResponse.json({ success: false, message: "Pagination invalide." }, { status: 400 });
    }

    const [account, transactions] = await Promise.all([
      getOrCreateAccount(user.id),
      db.select().from(transactionsTable)
        .where(eq(transactionsTable.userId, user.id))
        .orderBy(desc(transactionsTable.createdAt))
        .limit(100)
        .offset(offsetValue),
    ]);
    return NextResponse.json({
      success: true,
      availableBalanceCents: account.balanceCents - account.reservedCents,
      currency: account.currency,
      transactions,
      hasMore: transactions.length === 100,
    });
  } catch (error) {
    console.error("Erreur lors du chargement des opérations :", error);
    return NextResponse.json({ success: false, message: "Impossible de charger les opérations." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getApprovedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });

    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || !("amount" in body) || !("description" in body)) {
      return NextResponse.json({ success: false, message: "Données de retrait invalides." }, { status: 400 });
    }
    const amountCents = parseAmountCents(body.amount);
    const description = typeof body.description === "string" ? body.description.trim() : "";
    if (!amountCents || !description || description.length > 120) {
      return NextResponse.json({ success: false, message: "Montant ou motif de retrait invalide." }, { status: 400 });
    }

    const account = await getOrCreateAccount(user.id);
    const transactionId = randomUUID();
    const createdAt = new Date().toISOString();
    const result = await db.transaction(async (tx) => {
      const reserved = await tx.update(accountsTable)
        .set({ reservedCents: sql`${accountsTable.reservedCents} + ${amountCents}` })
        .where(and(
          eq(accountsTable.userId, user.id),
          sql`${accountsTable.balanceCents} - ${accountsTable.reservedCents} >= ${amountCents}`,
        ))
        .returning({ userId: accountsTable.userId });
      if (reserved.length === 0) return false;

      await tx.insert(transactionsTable).values({
        id: transactionId,
        userId: user.id,
        type: "withdrawal_request",
        description,
        amountCents,
        currency: account.currency,
        status: "pending",
        createdAt,
      });
      await tx.insert(notificationsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: "transaction",
        title: "Demande de retrait enregistrée",
        message: "Votre demande est en attente de traitement. Aucun virement n'a encore été exécuté.",
        createdAt,
      });
      return true;
    });

    if (!result) {
      return NextResponse.json({ success: false, message: "Solde disponible insuffisant." }, { status: 409 });
    }
    return NextResponse.json({ success: true, transactionId, message: "Demande enregistrée en attente de traitement." }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la demande de retrait :", error);
    return NextResponse.json({ success: false, message: "Impossible d'enregistrer la demande de retrait." }, { status: 500 });
  }
}
