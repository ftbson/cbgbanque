import { randomBytes, randomInt, randomUUID } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getApprovedUser } from "@/lib/auth";
import { getOrCreateAccount } from "@/lib/dashboard-data";
import { db } from "@/lib/db";
import { cardsTable, notificationsTable, transactionsTable, usersTable } from "@/lib/schema";

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

function generateCardNumber() {
  const p1 = "4532";
  const p2 = `${randomInt(1000, 9999)}`;
  const p3 = `${randomInt(1000, 9999)}`;
  const p4 = `${randomInt(1000, 9999)}`;
  return `${p1} ${p2} ${p3} ${p4}`;
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
    const [userInfo] = await db
      .select({ firstName: usersTable.firstName, lastName: usersTable.lastName })
      .from(usersTable)
      .where(eq(usersTable.id, user.id))
      .limit(1);

    const id = `card_${randomUUID()}`;
    const reference = `CBG-${randomBytes(4).toString("hex").toUpperCase()}`;
    const cardNumber = generateCardNumber();
    const expiry = `06/${new Date().getFullYear() + 3}`;
    const cvv = `${randomInt(100, 999)}`;
    const cardHolder = userInfo
      ? `${userInfo.firstName.toUpperCase()} ${userInfo.lastName.toUpperCase()}`
      : "TITULAIRE CARTE";
    const createdAt = new Date().toISOString();

    await db.transaction(async (tx) => {
      await tx.insert(cardsTable).values({
        id,
        userId: user.id,
        name,
        type: "virtual_demo",
        reference,
        cardNumber,
        expiry,
        cvv,
        cardHolder,
        cardTier: "Classic",
        status: "active",
        createdAt,
      });
      await tx.insert(transactionsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: "card_created",
        description: `Carte virtuelle « ${name} » activée`,
        amountCents: 0,
        currency: account.currency,
        status: "completed",
        createdAt,
      });
      await tx.insert(notificationsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: "card",
        title: "Nouvelle carte créée",
        message: `Votre carte Visa CBG « ${name} » est prête à l'emploi.`,
        createdAt,
      });
    });

    return NextResponse.json({
      success: true,
      card: { id, name, type: "virtual_demo", reference, cardNumber, expiry, cvv, cardHolder, status: "active", createdAt },
      message: "Carte virtuelle créée avec succès.",
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
    const cardId = (body as any).cardId;
    const status = (body as any).status;
    if (typeof cardId !== "string" || (status !== "active" && status !== "frozen")) {
      return NextResponse.json({ success: false, message: "Statut de carte invalide." }, { status: 400 });
    }

    const account = await getOrCreateAccount(user.id);
    const createdAt = new Date().toISOString();
    const [card] = await db.transaction(async (tx) => {
      const updated = await tx.update(cardsTable)
        .set({ status })
        .where(and(eq(cardsTable.id, cardId), eq(cardsTable.userId, user.id)))
        .returning();
      if (!updated.length) return [null];

      await tx.insert(transactionsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: "card_status",
        description: status === "frozen" ? "Carte temporairement gelée" : "Carte débloquée",
        amountCents: 0,
        currency: account.currency,
        status: "completed",
        createdAt,
      });
      await tx.insert(notificationsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: "card",
        title: "Statut de carte modifié",
        message: status === "frozen" ? "Votre carte a été gelée par mesure de sécurité." : "Votre carte est à nouveau active.",
        createdAt,
      });
      return updated;
    });

    if (!card) return NextResponse.json({ success: false, message: "Carte introuvable." }, { status: 404 });
    return NextResponse.json({ success: true, card, message: status === "frozen" ? "Carte gelée" : "Carte active" });
  } catch (error) {
    console.error("Erreur lors de la modification de statut de carte :", error);
    return NextResponse.json({ success: false, message: "Impossible de modifier la carte." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getApprovedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });

    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || !("cardId" in body)) {
      return NextResponse.json({ success: false, message: "Données invalides." }, { status: 400 });
    }
    const cardId = (body as any).cardId;

    const [deleted] = await db.delete(cardsTable)
      .where(and(eq(cardsTable.id, cardId), eq(cardsTable.userId, user.id)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Carte introuvable." }, { status: 404 });
    }

    // Notification
    await db.insert(notificationsTable).values({
      id: randomUUID(),
      userId: user.id,
      type: "card",
      title: "Carte supprimée",
      message: `Votre carte « ${deleted.name} » a été résiliée et supprimée.`,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: "Carte supprimée avec succès." });
  } catch (error) {
    console.error("Erreur suppression carte :", error);
    return NextResponse.json({ success: false, message: "Impossible de supprimer la carte." }, { status: 500 });
  }
}
