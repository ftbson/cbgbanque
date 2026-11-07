import { randomUUID } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getApprovedUser } from "@/lib/auth";
import { getOrCreateAccount } from "@/lib/dashboard-data";
import { db } from "@/lib/db";
import { accountsTable, notificationsTable, transactionsTable, vaultsTable } from "@/lib/schema";

function amountToCents(value: unknown) {
  if (typeof value !== "string" || !/^\d{1,7}(?:[.,]\d{1,2})?$/.test(value.trim())) return null;
  const [whole, fraction = ""] = value.trim().replace(",", ".").split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(cents) && cents > 0 ? cents : null;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getApprovedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });
    const { id } = await params;
    const body: unknown = await request.json();
    if (
      !body ||
      typeof body !== "object" ||
      !("amount" in body) ||
      !("direction" in body) ||
      (body.direction !== "deposit" && body.direction !== "withdraw")
    ) {
      return NextResponse.json({ success: false, message: "Données de mouvement invalides." }, { status: 400 });
    }
    const amountCents = amountToCents(body.amount);
    if (!amountCents) return NextResponse.json({ success: false, message: "Montant invalide." }, { status: 400 });

    const account = await getOrCreateAccount(user.id);
    const description = body.direction === "deposit" ? "Versement dans un coffre" : "Retrait d'un coffre";
    const createdAt = new Date().toISOString();
    const updated = await db.transaction(async (tx) => {
      const vaultChange = body.direction === "deposit"
        ? await tx.update(vaultsTable)
            .set({ currentCents: sql`${vaultsTable.currentCents} + ${amountCents}` })
            .where(and(eq(vaultsTable.id, id), eq(vaultsTable.userId, user.id)))
            .returning({ id: vaultsTable.id })
        : await tx.update(vaultsTable)
            .set({ currentCents: sql`${vaultsTable.currentCents} - ${amountCents}` })
            .where(and(
              eq(vaultsTable.id, id),
              eq(vaultsTable.userId, user.id),
              sql`${vaultsTable.currentCents} >= ${amountCents}`,
            ))
            .returning({ id: vaultsTable.id });
      if (vaultChange.length === 0) return false;

      if (body.direction === "deposit") {
        const debited = await tx.update(accountsTable)
          .set({ balanceCents: sql`${accountsTable.balanceCents} - ${amountCents}` })
          .where(and(
            eq(accountsTable.userId, user.id),
            sql`${accountsTable.balanceCents} - ${accountsTable.reservedCents} >= ${amountCents}`,
          ))
          .returning({ userId: accountsTable.userId });
        if (debited.length === 0) throw new Error("INSUFFICIENT_AVAILABLE_BALANCE");
      } else {
        await tx.update(accountsTable)
          .set({ balanceCents: sql`${accountsTable.balanceCents} + ${amountCents}` })
          .where(eq(accountsTable.userId, user.id));
      }

      await tx.insert(transactionsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: body.direction === "deposit" ? "vault_deposit" : "vault_withdrawal",
        description,
        amountCents,
        currency: account.currency,
        status: "completed",
        createdAt,
      });
      await tx.insert(notificationsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: "savings",
        title: description,
        message: `${(amountCents / 100).toFixed(2)} ${account.currency}`,
        createdAt,
      });
      return true;
    });

    if (!updated) return NextResponse.json({ success: false, message: "Coffre introuvable ou solde du coffre insuffisant." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "INSUFFICIENT_AVAILABLE_BALANCE") {
      return NextResponse.json({ success: false, message: "Solde disponible insuffisant." }, { status: 409 });
    }
    console.error("Erreur lors du mouvement sur le coffre :", error);
    return NextResponse.json({ success: false, message: "Impossible d'effectuer ce mouvement." }, { status: 500 });
  }
}
