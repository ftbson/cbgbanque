import { randomUUID } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getOrCreateAccount } from "@/lib/dashboard-data";
import { db } from "@/lib/db";
import { accountsTable, loansTable, notificationsTable, transactionsTable, usersTable } from "@/lib/schema";

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
    }

    const loansWithUsers = await db
      .select({
        id: loansTable.id,
        userId: loansTable.userId,
        amount: loansTable.amount,
        durationMonths: loansTable.durationMonths,
        interestRate: loansTable.interestRate,
        monthlyPayment: loansTable.monthlyPayment,
        totalPayment: loansTable.totalPayment,
        dossierFees: loansTable.dossierFees,
        purpose: loansTable.purpose,
        status: loansTable.status,
        createdAt: loansTable.createdAt,
        userEmail: usersTable.email,
        userName: usersTable.firstName,
        userLastName: usersTable.lastName,
        userPhone: usersTable.phone,
        monthlyIncome: usersTable.monthlyIncome,
        profession: usersTable.profession,
      })
      .from(loansTable)
      .leftJoin(usersTable, eq(loansTable.userId, usersTable.id))
      .orderBy(desc(loansTable.createdAt));

    return NextResponse.json({ success: true, loans: loansWithUsers });
  } catch (error) {
    console.error("Erreur chargement prêts admin :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { loanId, status } = body;

    if (!loanId || (status !== "approved" && status !== "rejected")) {
      return NextResponse.json({ success: false, message: "Données invalides" }, { status: 400 });
    }

    const [loan] = await db
      .select()
      .from(loansTable)
      .where(eq(loansTable.id, loanId))
      .limit(1);

    if (!loan) {
      return NextResponse.json({ success: false, message: "Demande de prêt introuvable." }, { status: 404 });
    }

    if (loan.status === status) {
      return NextResponse.json({ success: true, message: "Statut déjà appliqué." });
    }

    const createdAt = new Date().toISOString();

    await db.transaction(async (tx) => {
      await tx
        .update(loansTable)
        .set({ status })
        .where(eq(loansTable.id, loanId));

      if (status === "approved") {
        const account = await getOrCreateAccount(loan.userId);
        const amountCents = Math.round(loan.amount * 100);

        // Créditer le compte du montant du prêt
        await tx
          .update(accountsTable)
          .set({ balanceCents: account.balanceCents + amountCents })
          .where(eq(accountsTable.userId, loan.userId));

        // Enregistrer la transaction
        await tx.insert(transactionsTable).values({
          id: randomUUID(),
          userId: loan.userId,
          type: "vault_deposit",
          description: `Déblocage des fonds - Prêt accordé (${loan.purpose})`,
          amountCents,
          currency: account.currency,
          status: "completed",
          createdAt,
        });

        // Notifier le client
        await tx.insert(notificationsTable).values({
          id: randomUUID(),
          userId: loan.userId,
          type: "transaction",
          title: "Prêt accordé !",
          message: `Félicitations, votre demande de prêt de ${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(loan.amount)} a été approuvée et les fonds sont crédités sur votre compte.`,
          createdAt,
        });
      } else {
        await tx.insert(notificationsTable).values({
          id: randomUUID(),
          userId: loan.userId,
          type: "transaction",
          title: "Demande de prêt non retenue",
          message: `Votre demande de prêt de ${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(loan.amount)} n'a pas pu être acceptée par notre comité.`,
          createdAt,
        });
      }
    });

    return NextResponse.json({ success: true, message: `Prêt mis à jour : ${status}` });
  } catch (error) {
    console.error("Erreur modification prêt admin :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}
