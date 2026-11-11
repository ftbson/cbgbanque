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

    const cards = await db.select({
      id: cardsTable.id,
      name: cardsTable.name,
      reference: cardsTable.reference,
      createdAt: cardsTable.createdAt,
    })
      .from(cardsTable)
      .where(eq(cardsTable.userId, user.id))
      .orderBy(desc(cardsTable.createdAt));
    return NextResponse.json({ success: true, cards });
  } catch (error) {
    console.error("Erreur lors du chargement des références de carte :", error);
    return NextResponse.json({ success: false, message: "Impossible de charger les références." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getApprovedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });

    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || !("name" in body) || typeof body.name !== "string") {
      return NextResponse.json({ success: false, message: "Libellé invalide." }, { status: 400 });
    }

    const name = body.name.trim();
    if (!name || name.length > 40) {
      return NextResponse.json({ success: false, message: "Le libellé doit contenir de 1 à 40 caractères." }, { status: 400 });
    }

    const account = await getOrCreateAccount(user.id);
    const id = randomUUID();
    const reference = `REF-${randomBytes(6).toString("hex").toUpperCase()}`;
    const createdAt = new Date().toISOString();

    await db.transaction(async (tx) => {
      await tx.insert(cardsTable).values({
        id,
        userId: user.id,
        name,
        type: "internal_reference",
        reference,
        createdAt,
      });
      await tx.insert(transactionsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: "card_reference_added",
        description: `Référence interne « ${name} » ajoutée`,
        amountCents: 0,
        currency: account.currency,
        status: "completed",
        createdAt,
      });
      await tx.insert(notificationsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: "card",
        title: "Référence ajoutée",
        message: `La référence interne « ${name} » a été enregistrée.`,
        createdAt,
      });
    });

    return NextResponse.json({
      success: true,
      card: { id, name, reference, createdAt },
      message: "Référence interne enregistrée.",
    }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la référence :", error);
    return NextResponse.json({ success: false, message: "Impossible d'enregistrer la référence." }, { status: 500 });
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

    const account = await getOrCreateAccount(user.id);
    const createdAt = new Date().toISOString();
    const [deleted] = await db.transaction(async (tx) => {
      const [reference] = await tx.delete(cardsTable)
        .where(and(eq(cardsTable.id, cardId), eq(cardsTable.userId, user.id)))
        .returning({ id: cardsTable.id, name: cardsTable.name });
      if (!reference) return [null];

      await tx.insert(transactionsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: "card_reference_deleted",
        description: `Référence interne « ${reference.name} » supprimée`,
        amountCents: 0,
        currency: account.currency,
        status: "completed",
        createdAt,
      });
      await tx.insert(notificationsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: "card",
        title: "Référence supprimée",
        message: `La référence interne « ${reference.name} » a été supprimée.`,
        createdAt,
      });
      return [reference];
    });

    if (!deleted) return NextResponse.json({ success: false, message: "Référence introuvable." }, { status: 404 });
    return NextResponse.json({ success: true, message: "Référence supprimée." });
  } catch (error) {
    console.error("Erreur lors de la suppression d'une référence :", error);
    return NextResponse.json({ success: false, message: "Impossible de supprimer la référence." }, { status: 500 });
  }
}
