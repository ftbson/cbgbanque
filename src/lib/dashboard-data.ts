import "server-only";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { accountsTable, notificationsTable, usersTable } from "@/lib/schema";

function generateUserIban(userId: string) {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }
  const s = String(hash).padStart(14, "7").slice(0, 14);
  return `FR76 3092 7000 ${s.slice(0, 4)} ${s.slice(4, 8)} ${s.slice(8, 12)} ${s.slice(12, 14)}`;
}

export async function getOrCreateAccount(userId: string, requestedCurrency?: string) {
  let currency = requestedCurrency;
  if (!currency) {
    const [user] = await db.select({ currency: usersTable.currency })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);
    currency = user?.currency ?? "EUR";
  }

  const userIban = generateUserIban(userId);

  await db.transaction(async (tx) => {
    const [createdAccount] = await tx
      .insert(accountsTable)
      .values({ userId, currency, balanceCents: 0, iban: userIban, bic: "C23QBEBB", createdAt: new Date().toISOString() })
      .onConflictDoNothing({ target: accountsTable.userId })
      .returning({ userId: accountsTable.userId });

    if (createdAccount) {
      await tx.insert(notificationsTable).values({
        id: randomUUID(),
        userId,
        type: "account",
        title: "Compte créé",
        message: "Votre compte bancaire a été activé avec succès.",
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

  if (!account.iban) {
    await db.update(accountsTable).set({ iban: userIban, bic: "C23QBEBB" }).where(eq(accountsTable.userId, userId));
    account.iban = userIban;
    account.bic = "C23QBEBB";
  }

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
