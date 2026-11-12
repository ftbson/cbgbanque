import { randomBytes, randomUUID } from "node:crypto";
import { and, desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getApprovedUser } from "@/lib/auth";
import { getOrCreateAccount } from "@/lib/dashboard-data";
import { db } from "@/lib/db";
import { accountsTable, cardsTable, notificationsTable, transactionsTable, usersTable } from "@/lib/schema";

function generateCardNumber(): string {
  // Generates a valid-looking 16-digit Visa debit card number (starting with 4532)
  const p1 = "4532";
  const p2 = Math.floor(1000 + Math.random() * 9000).toString();
  const p3 = Math.floor(1000 + Math.random() * 9000).toString();
  const p4 = Math.floor(1000 + Math.random() * 9000).toString();
  return `${p1} ${p2} ${p3} ${p4}`;
}

function generateExpiry(): string {
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const year = (now.getFullYear() + 4).toString().slice(-2);
  return `${month}/${year}`;
}

function generateCVV(): string {
  return Math.floor(100 + Math.random() * 900).toString();
}

function generatePIN(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function GET() {
  try {
    const user = await getApprovedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });

    const [account, cards, [userData]] = await Promise.all([
      getOrCreateAccount(user.id),
      db.select().from(cardsTable).where(eq(cardsTable.userId, user.id)).orderBy(desc(cardsTable.createdAt)),
      db.select({
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
      }).from(usersTable).where(eq(usersTable.id, user.id)).limit(1),
    ]);

    const fullName = userData ? `${userData.firstName} ${userData.lastName}`.toUpperCase() : "CLIENT CBG";

    return NextResponse.json({
      success: true,
      cards,
      fullName,
      balanceCents: account.balanceCents,
      currency: account.currency,
    });
  } catch (error) {
    console.error("Erreur lors du chargement des cartes :", error);
    return NextResponse.json({ success: false, message: "Impossible de charger les cartes." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getApprovedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });

    const body: unknown = await request.json().catch(() => ({}));
    const action = typeof body === "object" && body !== null && "action" in body ? (body as { action?: string }).action : "create";

    const [userData] = await db
      .select({ firstName: usersTable.firstName, lastName: usersTable.lastName })
      .from(usersTable)
      .where(eq(usersTable.id, user.id))
      .limit(1);

    const cardHolder = userData ? `${userData.firstName} ${userData.lastName}`.toUpperCase() : "CLIENT CBG";
    const account = await getOrCreateAccount(user.id);

    // ACTION: Activate an existing card or order with 6.99 €
    if (action === "activate") {
      const cardId = typeof body === "object" && body !== null && "cardId" in body ? (body as { cardId?: string }).cardId : undefined;
      if (!cardId) {
        return NextResponse.json({ success: false, message: "Identifiant de carte manquant." }, { status: 400 });
      }

      const [existingCard] = await db
        .select()
        .from(cardsTable)
        .where(and(eq(cardsTable.id, cardId), eq(cardsTable.userId, user.id)))
        .limit(1);

      if (!existingCard) {
        return NextResponse.json({ success: false, message: "Carte introuvable." }, { status: 404 });
      }

      const feeCents = 699; // 6,99 €
      const createdAt = new Date().toISOString();

      await db.transaction(async (tx) => {
        // Debit fee from account balance if possible
        if (account.balanceCents >= feeCents) {
          await tx
            .update(accountsTable)
            .set({ balanceCents: sql`${accountsTable.balanceCents} - ${feeCents}` })
            .where(eq(accountsTable.userId, user.id));
        }

        // Set card to active
        await tx
          .update(cardsTable)
          .set({ status: "active" })
          .where(and(eq(cardsTable.id, cardId), eq(cardsTable.userId, user.id)));

        // Record transaction
        await tx.insert(transactionsTable).values({
          id: randomUUID(),
          userId: user.id,
          type: "card_order",
          description: "Activation & émission carte Visa Débit CBG (-6,99 €)",
          amountCents: feeCents,
          currency: account.currency,
          status: "completed",
          createdAt,
        });

        await tx.insert(notificationsTable).values({
          id: randomUUID(),
          userId: user.id,
          type: "card",
          title: "Carte Visa activée",
          message: "Votre carte physique C23 Visa est activée. Expédition sous 5 à 7 jours ouvrés.",
          createdAt,
        });
      });

      return NextResponse.json({
        success: true,
        message: "Carte Visa activée avec succès ! Vos coordonnées bancaires de carte sont désormais opérationnelles.",
      });
    }

    // ACTION: Order a brand new card (starts as active if ordered directly for 6,99 € or pending)
    const id = randomUUID();
    const reference = `CBG-${randomBytes(5).toString("hex").toUpperCase()}`;
    const cardNumber = generateCardNumber();
    const expiry = generateExpiry();
    const cvv = generateCVV();
    const pin = generatePIN();
    const createdAt = new Date().toISOString();

    const feeCents = 699; // 6,99 €

    await db.transaction(async (tx) => {
      // Debit 6.99 € if balance allows
      if (account.balanceCents >= feeCents) {
        await tx
          .update(accountsTable)
          .set({ balanceCents: sql`${accountsTable.balanceCents} - ${feeCents}` })
          .where(eq(accountsTable.userId, user.id));
      }

      await tx.insert(cardsTable).values({
        id,
        userId: user.id,
        name: "Carte Visa CBG",
        type: "physical_debit",
        reference,
        status: "active",
        cardNumber,
        expiry,
        cvv,
        pin,
        cardHolder,
        cardTier: "Classic",
        createdAt,
      });

      await tx.insert(transactionsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: "card_order",
        description: "Commande carte physique Visa CBG (-6,99 €)",
        amountCents: feeCents,
        currency: account.currency,
        status: "completed",
        createdAt,
      });

      await tx.insert(notificationsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: "card",
        title: "Carte Visa commandée",
        message: "Votre carte Visa a été émise et activée avec succès.",
        createdAt,
      });
    });

    return NextResponse.json({
      success: true,
      card: { id, cardNumber, expiry, cvv, pin, cardHolder, status: "active" },
      message: "Votre carte Visa a été créée et activée avec succès !",
    }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la gestion de la carte :", error);
    return NextResponse.json({ success: false, message: "Impossible de créer ou activer la carte." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getApprovedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });

    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || !("cardId" in body) || !("action" in body)) {
      return NextResponse.json({ success: false, message: "Données de modification invalides." }, { status: 400 });
    }

    const { cardId, action } = body as { cardId: string; action: string; newPin?: string };

    const [card] = await db
      .select()
      .from(cardsTable)
      .where(and(eq(cardsTable.id, cardId), eq(cardsTable.userId, user.id)))
      .limit(1);

    if (!card) {
      return NextResponse.json({ success: false, message: "Carte introuvable." }, { status: 404 });
    }

    if (action === "toggle_freeze") {
      const nextStatus = card.status === "frozen" ? "active" : "frozen";
      await db
        .update(cardsTable)
        .set({ status: nextStatus })
        .where(and(eq(cardsTable.id, cardId), eq(cardsTable.userId, user.id)));

      return NextResponse.json({
        success: true,
        status: nextStatus,
        message: nextStatus === "frozen" ? "Votre carte a été temporairement gelée." : "Votre carte a été dégelée avec succès.",
      });
    }

    if (action === "change_pin") {
      const newPin = (body as { newPin?: string }).newPin;
      if (!newPin || !/^\d{4}$/.test(newPin)) {
        return NextResponse.json({ success: false, message: "Le code PIN doit comporter 4 chiffres." }, { status: 400 });
      }
      await db
        .update(cardsTable)
        .set({ pin: newPin })
        .where(and(eq(cardsTable.id, cardId), eq(cardsTable.userId, user.id)));

      return NextResponse.json({ success: true, message: "Code PIN modifié avec succès." });
    }

    return NextResponse.json({ success: false, message: "Action non reconnue." }, { status: 400 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la carte :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getApprovedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });

    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || !("cardId" in body) || typeof body.cardId !== "string") {
      return NextResponse.json({ success: false, message: "Référence invalide." }, { status: 400 });
    }
    const cardId = body.cardId;

    await db.delete(cardsTable).where(and(eq(cardsTable.id, cardId), eq(cardsTable.userId, user.id)));

    return NextResponse.json({
      success: true,
      message: "Carte supprimée avec succès.",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de la carte :", error);
    return NextResponse.json({ success: false, message: "Impossible de supprimer la carte." }, { status: 500 });
  }
}
