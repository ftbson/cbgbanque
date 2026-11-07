import { randomUUID } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getApprovedUser } from "@/lib/auth";
import { getOrCreateAccount } from "@/lib/dashboard-data";
import { db } from "@/lib/db";
import { notificationsTable, transactionsTable, vaultsTable } from "@/lib/schema";

function amountToCents(value: unknown) {
  if (typeof value !== "string" || !/^\d{1,7}(?:[.,]\d{1,2})?$/.test(value.trim())) return null;
  const [whole, fraction = ""] = value.trim().replace(",", ".").split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(cents) && cents >= 0 ? cents : null;
}

export async function GET() {
  try {
    const user = await getApprovedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });
    const [account, vaults] = await Promise.all([
      getOrCreateAccount(user.id),
      db.select().from(vaultsTable)
        .where(eq(vaultsTable.userId, user.id))
        .orderBy(desc(vaultsTable.createdAt)),
    ]);
    return NextResponse.json({
      success: true,
      currency: account.currency,
      availableBalanceCents: account.balanceCents - account.reservedCents,
      vaults,
    });
  } catch (error) {
    console.error("Erreur lors du chargement des coffres :", error);
    return NextResponse.json({ success: false, message: "Impossible de charger les coffres." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getApprovedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });
    const body: unknown = await request.json();
    if (
      !body ||
      typeof body !== "object" ||
      !("name" in body) ||
      !("target" in body) ||
      typeof body.name !== "string"
    ) {
      return NextResponse.json({ success: false, message: "Données de coffre invalides." }, { status: 400 });
    }
    const name = body.name.trim();
    const targetCents = amountToCents(body.target);
    if (!name || name.length > 50 || targetCents === null || targetCents <= 0) {
      return NextResponse.json({ success: false, message: "Nom ou objectif invalide." }, { status: 400 });
    }

    const account = await getOrCreateAccount(user.id);
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    await db.transaction(async (tx) => {
      await tx.insert(vaultsTable).values({
        id,
        userId: user.id,
        name,
        targetCents,
        currentCents: 0,
        createdAt,
      });
      await tx.insert(transactionsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: "vault_created",
        description: `Coffre « ${name} » créé`,
        amountCents: 0,
        currency: account.currency,
        status: "completed",
        createdAt,
      });
      await tx.insert(notificationsTable).values({
        id: randomUUID(),
        userId: user.id,
        type: "savings",
        title: "Coffre créé",
        message: `Le coffre « ${name} » a été créé.`,
        createdAt,
      });
    });
    return NextResponse.json({ success: true, message: "Coffre créé." }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du coffre :", error);
    return NextResponse.json({ success: false, message: "Impossible de créer le coffre." }, { status: 500 });
  }
}
