import { desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getApprovedUser } from "@/lib/auth";
import { getDeterministicIban, getOrCreateAccount } from "@/lib/dashboard-data";
import { db } from "@/lib/db";
import { cardsTable, loansTable, notificationsTable, transactionsTable, usersTable, vaultsTable } from "@/lib/schema";

export async function GET() {
  try {
    const sessionUser = await getApprovedUser();
    if (!sessionUser) {
      return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });
    }

    const [user] = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        civility: usersTable.civility,
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
        phone: usersTable.phone,
        birthDate: usersTable.birthDate,
        nationality: usersTable.nationality,
        residenceCountry: usersTable.residenceCountry,
        address: usersTable.address,
        city: usersTable.city,
        postalCode: usersTable.postalCode,
        profession: usersTable.profession,
        monthlyIncome: usersTable.monthlyIncome,
        currency: usersTable.currency,
        status: usersTable.status,
      })
      .from(usersTable)
      .where(eq(usersTable.id, sessionUser.id))
      .limit(1);
    if (!user) return NextResponse.json({ success: false, message: "Compte introuvable." }, { status: 404 });

    const [account, transactions, cards, vaults, loans, [unread]] = await Promise.all([
      getOrCreateAccount(sessionUser.id, user.currency),
      db
        .select()
        .from(transactionsTable)
        .where(eq(transactionsTable.userId, sessionUser.id))
        .orderBy(desc(transactionsTable.createdAt))
        .limit(10),
      db
        .select({
          id: cardsTable.id,
          name: cardsTable.name,
          reference: cardsTable.reference,
          status: cardsTable.status,
          createdAt: cardsTable.createdAt,
        })
        .from(cardsTable)
        .where(eq(cardsTable.userId, sessionUser.id))
        .orderBy(desc(cardsTable.createdAt)),
      db
        .select()
        .from(vaultsTable)
        .where(eq(vaultsTable.userId, sessionUser.id))
        .orderBy(desc(vaultsTable.createdAt)),
      db
        .select({
          id: loansTable.id,
          amount: loansTable.amount,
          durationMonths: loansTable.durationMonths,
          purpose: loansTable.purpose,
          status: loansTable.status,
          createdAt: loansTable.createdAt,
        })
        .from(loansTable)
        .where(eq(loansTable.userId, sessionUser.id))
        .orderBy(desc(loansTable.createdAt)),
      db
        .select({ count: sql<number>`count(*)` })
        .from(notificationsTable)
        .where(sql`${notificationsTable.userId} = ${sessionUser.id} AND ${notificationsTable.readAt} IS NULL`),
    ]);

    const bankCoords = getDeterministicIban(sessionUser.id);

    return NextResponse.json({
      success: true,
      user,
      account: {
        currency: account.currency,
        balanceCents: account.balanceCents,
        reservedCents: account.reservedCents,
        iban: bankCoords.iban,
        bic: bankCoords.bic,
      },
      availableBalanceCents: account.balanceCents - account.reservedCents,
      transactions,
      cards,
      vaults,
      loans,
      unreadNotifications: unread?.count ?? 0,
    });
  } catch (error) {
    console.error("Erreur lors du chargement du tableau de bord :", error);
    return NextResponse.json({ success: false, message: "Impossible de charger le tableau de bord." }, { status: 500 });
  }
}
