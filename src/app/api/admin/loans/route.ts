import { randomUUID } from "node:crypto";
import { and, desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";
import { loansTable, notificationsTable, transactionsTable, usersTable, accountsTable } from "@/lib/schema";
import { sendAccountCreditedEmail, sendAccountStatusEmail } from "@/lib/mail";

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
        currency: usersTable.currency,
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

    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || !("loanId" in body) || !("status" in body)) {
      return NextResponse.json({ success: false, message: "Données invalides" }, { status: 400 });
    }
    const { loanId, status } = body;

    if (typeof loanId !== "string" || (status !== "approved" && status !== "rejected")) {
      return NextResponse.json({ success: false, message: "Données invalides" }, { status: 400 });
    }

    const [loan] = await db
      .select({
        id: loansTable.id,
        userId: loansTable.userId,
        amount: loansTable.amount,
        status: loansTable.status,
        currency: usersTable.currency,
        email: usersTable.email,
        firstName: usersTable.firstName,
      })
      .from(loansTable)
      .leftJoin(usersTable, eq(loansTable.userId, usersTable.id))
      .where(eq(loansTable.id, loanId))
      .limit(1);

    if (!loan) {
      return NextResponse.json({ success: false, message: "Demande de prêt introuvable." }, { status: 404 });
    }

    const createdAt = new Date().toISOString();
    if (!loan.currency) {
      return NextResponse.json({ success: false, message: "Devise du compte introuvable." }, { status: 409 });
    }

    const formattedAmount = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: loan.currency,
    }).format(loan.amount);

    let amountCents = 0;
    let credited = false;

    const updated = await db.transaction(async (tx) => {
      const [updatedLoan] = await tx.update(loansTable)
        .set({ status })
        .where(and(eq(loansTable.id, loanId), eq(loansTable.status, "pending")))
        .returning({ id: loansTable.id });
      if (!updatedLoan) return false;

      await tx.update(transactionsTable)
        .set({ status: "completed" })
        .where(and(
          eq(transactionsTable.relatedId, loanId),
          eq(transactionsTable.userId, loan.userId),
          eq(transactionsTable.type, "loan_request"),
        ));

      // Si approuvé, créditer le compte
      if (status === "approved") {
        amountCents = Math.round(loan.amount * 100);
        await tx
          .update(accountsTable)
          .set({ balanceCents: sql`${accountsTable.balanceCents} + ${amountCents}` })
          .where(eq(accountsTable.userId, loan.userId));

        const currency = loan.currency ?? "EUR";
        await tx.insert(transactionsTable).values({
          id: randomUUID(),
          userId: loan.userId,
          type: "transfer_in",
          description: `Prêt approuvé : ${formattedAmount}`,
          amountCents,
          currency,
          status: "completed",
          createdAt,
        });
        credited = true;
      }

      await tx.insert(notificationsTable).values({
        id: randomUUID(),
        userId: loan.userId,
        type: "transaction",
        title: status === "approved" ? "Prêt approuvé et fonds crédités" : "Demande de financement refusée",
        message: status === "approved"
          ? `Votre demande de prêt de ${formattedAmount} a été acceptée et les fonds ont été crédités sur votre compte.`
          : `Votre demande de ${formattedAmount} a été refusée.`,
        createdAt,
      });
      return true;
    });

    if (!updated) {
      return NextResponse.json({ success: false, message: "Cette demande a déjà été traitée." }, { status: 409 });
    }

    // Envoyer email de notification
    if (status === "approved") {
      try {
        if (loan.email && loan.firstName) {
          await sendAccountCreditedEmail(
            loan.email,
            loan.firstName,
            (amountCents / 100).toFixed(2),
            loan.currency,
            `Prêt approuvé : ${formattedAmount}`
          );
        }
      } catch (error) {
        console.error("Email de crédit prêt non envoyé :", error);
      }
    } else if (status === "rejected") {
      try {
        if (loan.email && loan.firstName) {
          await sendAccountStatusEmail(loan.email, loan.firstName, "rejected", "Demande de prêt refusée par l'administration");
        }
      } catch (error) {
        console.error("Email de refus prêt non envoyé :", error);
      }
    }

    return NextResponse.json({
      success: true,
      message: status === "approved"
        ? `Prêt approuvé et ${formattedAmount} crédités sur le compte du client.`
        : `Demande refusée. Aucun fonds n'a été crédité.`,
    });
  } catch (error) {
    console.error("Erreur modification prêt admin :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}
