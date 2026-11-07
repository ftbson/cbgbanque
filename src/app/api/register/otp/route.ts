import { randomInt } from "node:crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { clearRegistrationSession, hashOtp } from "@/lib/auth";
import { db } from "@/lib/db";
import { registrationOtpsTable, usersTable } from "@/lib/schema";
import { sendOtpEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || !("email" in body) || typeof body.email !== "string") {
      return NextResponse.json({ success: false, message: "Adresse e-mail invalide." }, { status: 400 });
    }

    const email = body.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: "Adresse e-mail invalide." }, { status: 400 });
    }

    const [existingUser] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Un compte utilise déjà cette adresse e-mail." }, { status: 409 });
    }

    await clearRegistrationSession();
    const otp = randomInt(100000, 1000000).toString();
    const now = Date.now();
    await db
      .insert(registrationOtpsTable)
      .values({ email, otpHash: hashOtp(email, otp), expiresAt: now + 30 * 60 * 1000, attempts: 0 })
      .onConflictDoUpdate({
        target: registrationOtpsTable.email,
        set: { otpHash: hashOtp(email, otp), expiresAt: now + 30 * 60 * 1000, verifiedAt: null, attempts: 0 },
      });

    await sendOtpEmail(email, otp);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de l'envoi du code OTP :", error);
    return NextResponse.json({ success: false, message: "Impossible d'envoyer le code de vérification." }, { status: 500 });
  }
}
