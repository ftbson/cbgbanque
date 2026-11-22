import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { createRegistrationSession, verifyOtpHash } from "@/lib/auth";
import { db } from "@/lib/db";
import { registrationOtpsTable } from "@/lib/schema";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (
      !body ||
      typeof body !== "object" ||
      !("email" in body) ||
      !("otpCode" in body) ||
      typeof body.email !== "string" ||
      typeof body.otpCode !== "string" ||
      !/^\d{6}$/.test(body.otpCode)
    ) {
      return NextResponse.json({ success: false, message: "Code de vérification invalide." }, { status: 400 });
    }

    const email = body.email.trim().toLowerCase();
    const [challenge] = await db
      .select()
      .from(registrationOtpsTable)
      .where(eq(registrationOtpsTable.email, email))
      .limit(1);

    if (!challenge || challenge.expiresAt <= Date.now() || challenge.attempts >= 5) {
      return NextResponse.json({ success: false, message: "Ce code a expiré. Demandez-en un nouveau." }, { status: 400 });
    }

    if (!verifyOtpHash(email, body.otpCode, challenge.otpHash)) {
      await db
        .update(registrationOtpsTable)
        .set({ attempts: sql`${registrationOtpsTable.attempts} + 1` })
        .where(eq(registrationOtpsTable.email, email));
      return NextResponse.json({ success: false, message: "Code de vérification incorrect." }, { status: 400 });
    }

    await db
      .update(registrationOtpsTable)
      .set({ verifiedAt: Date.now() })
      .where(eq(registrationOtpsTable.email, email));
    await createRegistrationSession(email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la vérification OTP :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
