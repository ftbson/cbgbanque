import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getApprovedUser, hashPassword, verifyPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { notificationsTable, usersTable } from "@/lib/schema";
import { randomUUID } from "node:crypto";

export async function GET() {
  try {
    const sessionUser = await getApprovedUser();
    if (!sessionUser) {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
    }

    const [user] = await db
      .select({
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
        address: usersTable.address,
        city: usersTable.city,
        postalCode: usersTable.postalCode,
        profession: usersTable.profession,
        monthlyIncome: usersTable.monthlyIncome,
        currency: usersTable.currency,
        status: usersTable.status,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, sessionUser.id))
      .limit(1);

    if (!user) return NextResponse.json({ success: false, message: "Utilisateur introuvable" }, { status: 404 });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Erreur profil :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const sessionUser = await getApprovedUser();
    if (!sessionUser) {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const updateData: Record<string, any> = {};

    if (typeof body.phone === "string" && body.phone.trim()) {
      updateData.phone = body.phone.trim();
    }
    if (typeof body.address === "string" && body.address.trim()) {
      updateData.address = body.address.trim();
    }
    if (typeof body.city === "string" && body.city.trim()) {
      updateData.city = body.city.trim();
    }
    if (typeof body.postalCode === "string" && body.postalCode.trim()) {
      updateData.postalCode = body.postalCode.trim();
    }
    if (typeof body.profession === "string" && body.profession.trim()) {
      updateData.profession = body.profession.trim();
    }
    if (typeof body.monthlyIncome === "string") {
      updateData.monthlyIncome = body.monthlyIncome.trim();
    }

    // Changement de mot de passe si demandé
    if (body.newPassword) {
      if (typeof body.newPassword !== "string" || body.newPassword.length < 8) {
        return NextResponse.json({ success: false, message: "Le nouveau mot de passe doit faire au moins 8 caractères." }, { status: 400 });
      }
      if (!body.currentPassword) {
        return NextResponse.json({ success: false, message: "Veuillez renseigner votre mot de passe actuel." }, { status: 400 });
      }

      const [existingUser] = await db
        .select({ passwordHash: usersTable.passwordHash })
        .from(usersTable)
        .where(eq(usersTable.id, sessionUser.id))
        .limit(1);

      if (!existingUser || !(await verifyPassword(body.currentPassword, existingUser.passwordHash))) {
        return NextResponse.json({ success: false, message: "Mot de passe actuel incorrect." }, { status: 400 });
      }

      updateData.passwordHash = await hashPassword(body.newPassword);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: false, message: "Aucune modification fournie." }, { status: 400 });
    }

    await db.update(usersTable).set(updateData).where(eq(usersTable.id, sessionUser.id));

    // Notification
    await db.insert(notificationsTable).values({
      id: randomUUID(),
      userId: sessionUser.id,
      type: "account",
      title: "Profil mis à jour",
      message: "Vos informations de compte ont été modifiées avec succès.",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: "Profil mis à jour avec succès !" });
  } catch (error) {
    console.error("Erreur mise à jour profil :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur lors de la mise à jour." }, { status: 500 });
  }
}
