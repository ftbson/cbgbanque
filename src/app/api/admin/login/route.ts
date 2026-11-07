import { NextResponse } from "next/server";
import { createAdminSession, secureCompare } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (
      !body ||
      typeof body !== "object" ||
      !("username" in body) ||
      !("password" in body) ||
      typeof body.username !== "string" ||
      typeof body.password !== "string"
    ) {
      return NextResponse.json({ success: false, message: "Identifiants invalides." }, { status: 400 });
    }

    const adminUser = process.env.Admin;
    const adminPass = process.env.PasswordAdmin;
    if (!adminUser || !adminPass) {
      console.error("Les variables Admin et PasswordAdmin doivent être configurées.");
      return NextResponse.json({ success: false, message: "Configuration administrateur manquante." }, { status: 500 });
    }

    if (secureCompare(body.username, adminUser) && secureCompare(body.password, adminPass)) {
      await createAdminSession();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "Identifiants incorrects" }, { status: 401 });
  } catch (error) {
    console.error("Erreur lors de la connexion administrateur :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}