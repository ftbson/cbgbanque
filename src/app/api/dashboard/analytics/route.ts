import { and, eq, gte, or, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getApprovedUser } from "@/lib/auth";
import { getOrCreateAccount } from "@/lib/dashboard-data";
import { db } from "@/lib/db";
import { transactionsTable } from "@/lib/schema";

export async function GET(request: Request) {
  try {
    const user = await getApprovedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });

    const period = new URL(request.url).searchParams.get("period");
    if (period !== "7days" && period !== "month" && period !== "year") {
      return NextResponse.json({ success: false, message: "Période invalide." }, { status: 400 });
    }

    const now = new Date();
    const from = new Date(now);
    if (period === "7days") {
      from.setDate(from.getDate() - 7);
    } else if (period === "month") {
      from.setDate(1);
      from.setHours(0, 0, 0, 0);
    } else {
      from.setMonth(0, 1);
      from.setHours(0, 0, 0, 0);
    }

    const [account, [totals]] = await Promise.all([
      getOrCreateAccount(user.id),
      db.select({
        vaultDeposits: sql<number>`coalesce(sum(case when ${transactionsTable.type} = 'vault_deposit' then ${transactionsTable.amountCents} else 0 end), 0)`,
        vaultWithdrawals: sql<number>`coalesce(sum(case when ${transactionsTable.type} = 'vault_withdrawal' then ${transactionsTable.amountCents} else 0 end), 0)`,
        pendingWithdrawals: sql<number>`coalesce(sum(case when ${transactionsTable.type} = 'withdrawal_request' and ${transactionsTable.status} = 'pending' then ${transactionsTable.amountCents} else 0 end), 0)`,
      })
        .from(transactionsTable)
        .where(and(
          eq(transactionsTable.userId, user.id),
          gte(transactionsTable.createdAt, from.toISOString()),
          or(
            eq(transactionsTable.status, "completed"),
            eq(transactionsTable.type, "withdrawal_request"),
          ),
        )),
    ]);

    return NextResponse.json({
      success: true,
      currency: account.currency,
      period,
      vaultDepositsCents: totals?.vaultDeposits ?? 0,
      vaultWithdrawalsCents: totals?.vaultWithdrawals ?? 0,
      pendingWithdrawalsCents: totals?.pendingWithdrawals ?? 0,
    });
  } catch (error) {
    console.error("Erreur lors du chargement des analyses :", error);
    return NextResponse.json({ success: false, message: "Impossible de charger les analyses." }, { status: 500 });
  }
}
