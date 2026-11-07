import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { createUserSession, verifyPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { usersTable } from "@/lib/schema";

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
      return NextResponse.json({ success: false, message: "Veuillez saisir un e-mail et un mot de passe valides." }, { status: 400 });
    }

    const email = body.email.trim().toLowerCase();
    const [user] = await db
      .select({
        id: usersTable.id,
        passwordHash: usersTable.passwordHash,
        status: usersTable.status,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      return NextResponse.json({ success: false, message: "E-mail ou mot de passe incorrect." }, { status: 401 });
    }
    if (user.status === "pending") {
      return NextResponse.json(
        { success: false, message: "Votre compte est en cours de validation par l'administrateur" },
        { status: 403 },
      );
    }
    if (user.status !== "approved") {
      return NextResponse.json({ success: false, message: "Ce compte ne peut pas se connecter." }, { status: 403 });
    }

    await createUserSession(user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
