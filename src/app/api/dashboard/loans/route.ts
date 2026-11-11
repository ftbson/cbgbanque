import { randomUUID } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getApprovedUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { loansTable, notificationsTable } from "@/lib/schema";

export async function GET() {
  try {
    const user = await getApprovedUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
    }

    const loans = await db
      .select()
      .from(loansTable)
      .where(eq(loansTable.userId, user.id))
      .orderBy(desc(loansTable.createdAt));

    return NextResponse.json({ success: true, loans });
  } catch (error) {
    console.error("Erreur chargement prêts :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getApprovedUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const amount = Number(body.amount);
    const durationMonths = Number(body.durationMonths);
    const purpose = typeof body.purpose === "string" ? body.purpose.trim() : "Projet personnel";

    if (!amount || amount < 500 || amount > 100000) {
      return NextResponse.json(
        { success: false, message: "Le montant doit être compris entre 500 € et 100 000 €." },
        { status: 400 }
      );
    }

    if (!durationMonths || durationMonths < 3 || durationMonths > 120) {
      return NextResponse.json(
        { success: false, message: "La durée doit être comprise entre 3 et 120 mois." },
        { status: 400 }
      );
    }

    // Taux d'intérêt annuel fixe attractif (ex: 3.49%)
    const annualRate = 0.0349;
    const monthlyRate = annualRate / 12;
    // Formule classique d'amortissement : M = P * [r / (1 - (1+r)^(-n))]
    const monthlyPayment =
      (amount * (monthlyRate * Math.pow(1 + monthlyRate, durationMonths))) /
      (Math.pow(1 + monthlyRate, durationMonths) - 1);

    const totalPayment = monthlyPayment * durationMonths;
    // Frais de dossier : 1% avec minimum de 50 € et max de 250 €
    const dossierFees = Math.min(250, Math.max(50, Math.round(amount * 0.01)));

    const loanId = `loan_${randomUUID()}`;
    const createdAt = new Date().toISOString();

    await db.insert(loansTable).values({
      id: loanId,
      userId: user.id,
      amount: Math.round(amount * 100) / 100,
      durationMonths,
      interestRate: annualRate * 100,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      dossierFees,
      purpose,
      status: "pending",
      createdAt,
    });

    // Insérer une notification pour l'utilisateur
    await db.insert(notificationsTable).values({
      id: randomUUID(),
      userId: user.id,
      type: "transaction",
      title: "Demande de prêt soumise",
      message: `Votre demande de prêt de ${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount)} sur ${durationMonths} mois a été transmise au service financier.`,
      createdAt,
    });

    return NextResponse.json({
      success: true,
      message: "Votre demande de prêt a été enregistrée avec succès.",
      loanId,
    });
  } catch (error) {
    console.error("Erreur création prêt :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur lors de la demande." }, { status: 500 });
  }
}
