import "server-only";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { accountsTable, notificationsTable, usersTable } from "@/lib/schema";

export async function getOrCreateAccount(userId: string, requestedCurrency?: string) {
  let currency = requestedCurrency;
  if (!currency) {
    const [user] = await db.select({ currency: usersTable.currency })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);
    currency = user?.currency ?? "EUR";
  }

  await db.transaction(async (tx) => {
    const [createdAccount] = await tx
      .insert(accountsTable)
      .values({ userId, currency, balanceCents: 0, createdAt: new Date().toISOString() })
      .onConflictDoNothing({ target: accountsTable.userId })
      .returning({ userId: accountsTable.userId });

    if (createdAccount) {
      await tx.insert(notificationsTable).values({
        id: randomUUID(),
        userId,
        type: "account",
        title: "Compte créé",
        message: "Votre compte de démonstration a été créé avec un solde initial de 0.",
        createdAt: new Date().toISOString(),
      });
    }
  });

  const [account] = await db
    .select()
    .from(accountsTable)
    .where(eq(accountsTable.userId, userId))
    .limit(1);

  if (!account) throw new Error("Unable to load the account.");
  return account;
}

export async function createNotification(
  userId: string,
  type: "account" | "card" | "transaction" | "savings",
  title: string,
  message: string,
) {
  await db.insert(notificationsTable).values({
    id: randomUUID(),
    userId,
    type,
    title,
    message,
    createdAt: new Date().toISOString(),
  });
}
