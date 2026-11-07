import { randomBytes, randomUUID } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getApprovedUser } from "@/lib/auth";
import { getOrCreateAccount } from "@/lib/dashboard-data";
import { db } from "@/lib/db";
import { cardsTable, notificationsTable, transactionsTable } from "@/lib/schema";

export async function GET() {
  try {
    const user = await getApprovedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });

    const cards = await db.select().from(cardsTable)
      .where(eq(cardsTable.userId, user.id))
      .orderBy(desc(cardsTable.createdAt));
    return NextResponse.json({ success: true, cards });
  } catch (error) {
    console.error("Erreur lors du chargement des cartes :", error);
    return NextResponse.json({ success: false, message: "Impossible de charger les cartes." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getApprovedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });

    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || !("name" in body) || typeof body.name !== "string") {
      return NextResponse.json({ success: false, message: "Nom de carte invalide." }, { status: 400 });
    }
    const name = body.name.trim();
    if (!name || name.length > 40) {
      return NextResponse.json({ success: false, message: "Le nom doit contenir de 1 à 40 caractères." }, { status: 400 });
    }

    const account = await getOrCreateAccount(user.id);
    const id = randomUUID();
    const reference = `SIM-${randomBytes(6).toString("hex").toUpperCase()}`;
    const createdAt = new Date().toISOString();
    await db.transaction(async (tx) => {
      await tx.insert(cardsTable).values({
        id,
        userId: user.id,
        name,
        type: "virtual_demo",
        reference,
        status: "active",
        createdAt,
      });
      await tx.insert(transactionsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: "card_created",
        description: `Carte de démonstration « ${name} » créée`,
        amountCents: 0,
        currency: account.currency,
        status: "completed",
        createdAt,
      });
      await tx.insert(notificationsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: "card",
        title: "Carte créée",
        message: `La carte de démonstration « ${name} » est disponible.`,
        createdAt,
      });
    });

    return NextResponse.json({
      success: true,
      card: { id, name, type: "virtual_demo", reference, status: "active", createdAt },
      note: "Carte de démonstration non payable; aucun numéro de carte ni CVV n'a été créé.",
    }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de carte :", error);
    return NextResponse.json({ success: false, message: "Impossible de créer la carte." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getApprovedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });

    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || !("cardId" in body) || !("status" in body)) {
      return NextResponse.json({ success: false, message: "Données invalides." }, { status: 400 });
    }
    const cardId = body.cardId;
    const status = body.status;
    if (typeof cardId !== "string" || (status !== "active" && status !== "frozen")) {
      return NextResponse.json({ success: false, message: "Statut de carte invalide." }, { status: 400 });
    }

    const account = await getOrCreateAccount(user.id);
    const createdAt = new Date().toISOString();
    const [card] = await db.transaction(async (tx) => {
      const [updatedCard] = await tx.update(cardsTable)
        .set({ status })
        .where(and(eq(cardsTable.id, cardId), eq(cardsTable.userId, user.id)))
        .returning({ id: cardsTable.id });
      if (!updatedCard) return [];
      await tx.insert(transactionsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: "card_status",
        description: status === "frozen" ? "Carte gelée" : "Carte dégelée",
        amountCents: 0,
        currency: account.currency,
        status: "completed",
        createdAt,
      });
      await tx.insert(notificationsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: "card",
        title: status === "frozen" ? "Carte gelée" : "Carte dégelée",
        message: "Le statut de votre carte de démonstration a été modifié.",
        createdAt,
      });
      return [updatedCard];
    });
    if (!card) {
      return NextResponse.json({ success: false, message: "Carte introuvable." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de carte :", error);
    return NextResponse.json({ success: false, message: "Impossible de modifier la carte." }, { status: 500 });
  }
}
