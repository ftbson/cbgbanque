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
        title: "Espace de compte créé",
        message: "Votre espace de compte a été initialisé.",
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

export function getDeterministicIban(userId: string) {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }
  const cleanId = userId.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  const codeBanque = "30092";
  const codeGuichet = "70002";
  const numeroCompte = (cleanId.slice(0, 11) || "23C23069369").padEnd(11, "0");
  const cleRib = (Math.abs(hash % 89) + 10).toString();
  const rawIban = `FR76${codeBanque}${codeGuichet}${numeroCompte}${cleRib}`;
  const formattedIban = rawIban.match(/.{1,4}/g)?.join(" ") || rawIban;
  return {
    iban: formattedIban,
    rawIban,
    bic: "C23QBEBB",
    codeBanque,
    codeGuichet,
    numeroCompte,
    cleRib,
  };
}
