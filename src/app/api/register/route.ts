import { randomUUID } from "node:crypto";
import { and, eq, gt, isNotNull, lt } from "drizzle-orm";
import { NextResponse } from "next/server";
import { clearRegistrationSession, getRegistrationSessionEmail, hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { registrationOtpsTable, usersTable } from "@/lib/schema";

const profileFields = [
  "civility",
  "firstName",
  "lastName",
  "phone",
  "birthDate",
  "birthPlace",
  "nationality",
  "residenceCountry",
  "currency",
  "address",
  "city",
  "postalCode",
  "profession",
  "documentType",
] as const;

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (
      !body ||
      typeof body !== "object" ||
      !("email" in body) ||
      !("password" in body) ||
      typeof body.email !== "string" ||
      typeof body.password !== "string"
    ) {
      return NextResponse.json({ success: false, message: "Données d'inscription invalides." }, { status: 400 });
    }

    const payload = body as Record<string, unknown>;
    const email = body.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || body.password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Adresse e-mail ou mot de passe invalide (8 caractères minimum)." },
        { status: 400 },
      );
    }
    if ((await getRegistrationSessionEmail()) !== email) {
      return NextResponse.json({ success: false, message: "Veuillez d'abord vérifier votre adresse e-mail." }, { status: 401 });
    }

    const profile: Record<(typeof profileFields)[number], string> = {} as Record<
      (typeof profileFields)[number],
      string
    >;
    for (const field of profileFields) {
      const value = payload[field];
      if (typeof value !== "string" || !value.trim()) {
        return NextResponse.json({ success: false, message: "Tous les champs du profil sont requis." }, { status: 400 });
      }
      profile[field] = value.trim();
    }
    if (!["EUR", "CHF", "USD"].includes(profile.currency)) {
      return NextResponse.json({ success: false, message: "Devise non prise en charge." }, { status: 400 });
    }

    const [existingUser] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Un compte utilise déjà cette adresse e-mail." }, { status: 409 });
    }

    const [challenge] = await db
      .select({
        email: registrationOtpsTable.email,
      })
      .from(registrationOtpsTable)
      .where(
        and(
          eq(registrationOtpsTable.email, email),
          isNotNull(registrationOtpsTable.verifiedAt),
          gt(registrationOtpsTable.expiresAt, Date.now()),
          lt(registrationOtpsTable.attempts, 5),
        ),
      )
      .limit(1);
    if (!challenge) {
      return NextResponse.json({ success: false, message: "Veuillez d'abord vérifier votre adresse e-mail." }, { status: 400 });
    }

    const monthlyIncome = typeof payload.monthlyIncome === "string" ? payload.monthlyIncome.trim() : null;
    const idCardFront = typeof payload.idCardFront === "string" ? payload.idCardFront.trim() : null;
    const idCardBack = typeof payload.idCardBack === "string" ? payload.idCardBack.trim() : null;

    await db.insert(usersTable).values({
      id: `usr_${randomUUID()}`,
      email,
      passwordHash: await hashPassword(body.password),
      ...profile,
      monthlyIncome,
      idCardFront,
      idCardBack,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    await db.delete(registrationOtpsTable).where(eq(registrationOtpsTable.email, email));
    await clearRegistrationSession();

    return NextResponse.json({
      success: true,
      message: "Votre inscription est enregistrée et en attente de validation par l'administrateur.",
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur lors de l'inscription." }, { status: 500 });
  }
}
