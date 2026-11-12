import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getOrCreateAccount } from "@/lib/dashboard-data";
import { db } from "@/lib/db";
import { accountsTable, notificationsTable, transactionsTable, usersTable } from "@/lib/schema";

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
    }

    const body = await request.json();
    const { userId, amount, description } = body as {
      userId?: string;
      amount?: number | string;
      description?: string;
    };

    if (!userId || !amount) {
      return NextResponse.json({ success: false, message: "Utilisateur et montant requis." }, { status: 400 });
    }

    const numAmount = typeof amount === "string" ? parseFloat(amount.replace(",", ".")) : Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ success: false, message: "Montant invalide." }, { status: 400 });
    }

    const amountCents = Math.round(numAmount * 100);

    const [user] = await db
      .select({ firstName: usersTable.firstName, lastName: usersTable.lastName })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ success: false, message: "Utilisateur introuvable." }, { status: 404 });
    }

    const account = await getOrCreateAccount(userId);
    const desc = description?.trim() || "Crédit bancaire CBG Finance";
    const createdAt = new Date().toISOString();

    await db.transaction(async (tx) => {
      await tx
        .update(accountsTable)
        .set({ balanceCents: sql`${accountsTable.balanceCents} + ${amountCents}` })
        .where(eq(accountsTable.userId, userId));

      await tx.insert(transactionsTable).values({
        id: randomUUID(),
        userId,
        type: "transfer_in",
        description: desc,
        amountCents,
        currency: account.currency,
        status: "completed",
        createdAt,
      });

      await tx.insert(notificationsTable).values({
        id: randomUUID(),
        userId,
        type: "transaction",
        title: "Fonds reçus sur votre compte",
        message: `Votre compte a été crédité de ${(amountCents / 100).toFixed(2)} ${account.currency} (${desc}).`,
        createdAt,
      });
    });

    return NextResponse.json({
      success: true,
      message: `Le compte de ${user.firstName} ${user.lastName} a été crédité de ${(amountCents / 100).toFixed(2)} € avec succès.`,
    });
  } catch (error) {
    console.error("Erreur lors du crédit administrateur :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
