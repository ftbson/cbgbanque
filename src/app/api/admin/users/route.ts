import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { notificationsTable, usersTable } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import { isAdminAuthenticated } from "@/lib/auth";
import { sendApprovalEmail } from "@/lib/mail";

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
    }

    const users = await db.select({
      id: usersTable.id,
      email: usersTable.email,
      civility: usersTable.civility,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      phone: usersTable.phone,
      birthDate: usersTable.birthDate,
      birthPlace: usersTable.birthPlace,
      nationality: usersTable.nationality,
      residenceCountry: usersTable.residenceCountry,
      currency: usersTable.currency,
      address: usersTable.address,
      city: usersTable.city,
      postalCode: usersTable.postalCode,
      profession: usersTable.profession,
      documentType: usersTable.documentType,
      status: usersTable.status,
      createdAt: usersTable.createdAt,
    }).from(usersTable);
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Erreur lors du chargement des utilisateurs :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
    }

    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || !("userId" in body) || !("status" in body)) {
      return NextResponse.json({ success: false, message: "Données invalides" }, { status: 400 });
    }
    const userId = body.userId;
    const status = body.status;
    if (typeof userId !== "string" || (status !== "approved" && status !== "rejected")) {
      return NextResponse.json({ success: false, message: "Données invalides" }, { status: 400 });
    }

    const [user] = await db
      .select({ email: usersTable.email, firstName: usersTable.firstName, status: usersTable.status })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);
    if (!user) {
      return NextResponse.json({ success: false, message: "Utilisateur introuvable." }, { status: 404 });
    }

    const changed = await db.transaction(async (tx) => {
      const [updatedUser] = await tx
        .update(usersTable)
        .set({ status })
        .where(and(eq(usersTable.id, userId), eq(usersTable.status, user.status)))
        .returning({ id: usersTable.id });
      if (!updatedUser || user.status === status) return false;

      await tx.insert(notificationsTable).values({
        id: randomUUID(),
        userId,
        type: "account",
        title: status === "approved" ? "Compte approuvé" : "Compte rejeté",
        message: status === "approved"
          ? "Votre compte a été approuvé. Vous pouvez désormais vous connecter."
          : "Votre demande d'ouverture de compte n'a pas été approuvée.",
        createdAt: new Date().toISOString(),
      });
      return true;
    });

    if (status === "approved" && changed) {
      try {
        await sendApprovalEmail(user.email, user.firstName);
      } catch (error) {
        console.error("Le statut est approuvé mais l'e-mail de confirmation n'a pas pu être envoyé :", error);
        return NextResponse.json(
          { success: false, message: "Compte validé, mais l'e-mail de confirmation n'a pas pu être envoyé." },
          { status: 502 },
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la mise à jour utilisateur :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}