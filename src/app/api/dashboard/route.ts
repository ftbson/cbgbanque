import { desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getApprovedUser } from "@/lib/auth";
import { getOrCreateAccount } from "@/lib/dashboard-data";
import { db } from "@/lib/db";
import { cardsTable, notificationsTable, transactionsTable, usersTable } from "@/lib/schema";

export async function GET() {
  try {
    const sessionUser = await getApprovedUser();
    if (!sessionUser) {
      return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });
    }

    const [user] = await db
      .select({ firstName: usersTable.firstName, currency: usersTable.currency })
      .from(usersTable)
      .where(eq(usersTable.id, sessionUser.id))
      .limit(1);
    if (!user) return NextResponse.json({ success: false, message: "Compte introuvable." }, { status: 404 });

    const [account, transactions, cards, [unread]] = await Promise.all([
      getOrCreateAccount(sessionUser.id, user.currency),
      db
        .select()
        .from(transactionsTable)
        .where(eq(transactionsTable.userId, sessionUser.id))
        .orderBy(desc(transactionsTable.createdAt))
        .limit(5),
      db
        .select({ id: cardsTable.id, name: cardsTable.name, reference: cardsTable.reference, status: cardsTable.status })
        .from(cardsTable)
        .where(eq(cardsTable.userId, sessionUser.id))
        .orderBy(desc(cardsTable.createdAt))
        .limit(3),
      db
        .select({ count: sql<number>`count(*)` })
        .from(notificationsTable)
        .where(sql`${notificationsTable.userId} = ${sessionUser.id} AND ${notificationsTable.readAt} IS NULL`),
    ]);

    return NextResponse.json({
      success: true,
      user,
      currency: account.currency,
      availableBalanceCents: account.balanceCents - account.reservedCents,
      transactions,
      cards,
      unreadNotifications: unread?.count ?? 0,
    });
  } catch (error) {
    console.error("Erreur lors du chargement du tableau de bord :", error);
    return NextResponse.json({ success: false, message: "Impossible de charger le tableau de bord." }, { status: 500 });
  }
}
