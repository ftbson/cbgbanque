import { randomUUID } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getApprovedUser } from "@/lib/auth";
import { getOrCreateAccount } from "@/lib/dashboard-data";
import { db } from "@/lib/db";
import { loansTable, notificationsTable, transactionsTable } from "@/lib/schema";

export async function GET() {
  try {
    const user = await getApprovedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });

    const [account, loans] = await Promise.all([
      getOrCreateAccount(user.id),
      db.select({
        id: loansTable.id,
        amount: loansTable.amount,
        durationMonths: loansTable.durationMonths,
        purpose: loansTable.purpose,
        status: loansTable.status,
        createdAt: loansTable.createdAt,
      })
        .from(loansTable)
        .where(eq(loansTable.userId, user.id))
        .orderBy(desc(loansTable.createdAt)),
    ]);
    return NextResponse.json({ success: true, currency: account.currency, loans });
  } catch (error) {
    console.error("Erreur chargement des demandes de financement :", error);
    return NextResponse.json({ success: false, message: "Impossible de charger les demandes." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getApprovedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });

    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || !("amount" in body) || !("durationMonths" in body) || !("purpose" in body)) {
      return NextResponse.json({ success: false, message: "Données de demande invalides." }, { status: 400 });
    }

    const amount = typeof body.amount === "number" ? body.amount : Number(body.amount);
    const durationMonths = typeof body.durationMonths === "number" ? body.durationMonths : Number(body.durationMonths);
    const purpose = typeof body.purpose === "string" ? body.purpose.trim() : "";
    if (!Number.isFinite(amount) || amount < 500 || amount > 100000) {
      return NextResponse.json({ success: false, message: "Le montant doit être compris entre 500 et 100 000." }, { status: 400 });
    }
    if (!Number.isSafeInteger(durationMonths) || durationMonths < 3 || durationMonths > 120) {
      return NextResponse.json({ success: false, message: "La durée doit être comprise entre 3 et 120 mois." }, { status: 400 });
    }
    if (!purpose || purpose.length > 120) {
      return NextResponse.json({ success: false, message: "Le motif doit contenir de 1 à 120 caractères." }, { status: 400 });
    }

    const account = await getOrCreateAccount(user.id);
    const loanId = randomUUID();
    const createdAt = new Date().toISOString();
    const formattedAmount = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: account.currency,
    }).format(amount);

    await db.transaction(async (tx) => {
      await tx.insert(loansTable).values({
        id: loanId,
        userId: user.id,
        amount: Math.round(amount * 100) / 100,
        durationMonths,
        interestRate: 0,
        monthlyPayment: 0,
        totalPayment: 0,
        dossierFees: 0,
        purpose,
        status: "pending",
        createdAt,
      });
      await tx.insert(transactionsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: "loan_request",
        relatedId: loanId,
        description: `Demande de financement · ${purpose}`,
        amountCents: 0,
        currency: account.currency,
        status: "pending",
        createdAt,
      });
      await tx.insert(notificationsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: "transaction",
        title: "Demande de financement enregistrée",
        message: `Votre demande de ${formattedAmount} sur ${durationMonths} mois a été enregistrée. Elle ne constitue pas une offre de crédit et n'entraîne aucun versement automatique.`,
        createdAt,
      });
    });

    return NextResponse.json({
      success: true,
      message: "Demande enregistrée. Aucun fonds ne sera crédité automatiquement.",
      loanId,
    }, { status: 201 });
  } catch (error) {
    console.error("Erreur création de demande de financement :", error);
    return NextResponse.json({ success: false, message: "Impossible d'enregistrer la demande." }, { status: 500 });
  }
}
