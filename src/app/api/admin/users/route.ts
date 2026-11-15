import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { notificationsTable, usersTable } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import { isAdminAuthenticated } from "@/lib/auth";
import { sendApprovalEmail, sendAccountStatusEmail, sendTransferAccessRestoredEmail } from "@/lib/mail";

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
      monthlyIncome: usersTable.monthlyIncome,
      documentType: usersTable.documentType,
      idCardFront: usersTable.idCardFront,
      idCardBack: usersTable.idCardBack,
      status: usersTable.status,
      transfersBlocked: usersTable.transfersBlocked,
      createdAt: usersTable.createdAt,
    }).from(usersTable);
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Erreur lors du chargement des utilisateurs :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

interface AdminUserUpdateBody {
  userId: string;
  status?: "approved" | "rejected" | "blocked";
  transfersBlocked?: number | boolean;
  reason?: string;
}

export async function PATCH(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
    }

    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || !("userId" in body)) {
      return NextResponse.json({ success: false, message: "Données invalides" }, { status: 400 });
    }

    const { userId, status, transfersBlocked, reason } = body as AdminUserUpdateBody;

    if (typeof userId !== "string" || !userId.trim() || (reason !== undefined && typeof reason !== "string")) {
      return NextResponse.json({ success: false, message: "Données utilisateur invalides." }, { status: 400 });
    }

    const [user] = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        firstName: usersTable.firstName,
        status: usersTable.status,
        transfersBlocked: usersTable.transfersBlocked,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ success: false, message: "Utilisateur introuvable." }, { status: 404 });
    }

    // 1. Mise à jour du blocage des virements (transfersBlocked)
    if (transfersBlocked !== undefined) {
      if (transfersBlocked !== 0 && transfersBlocked !== 1 && transfersBlocked !== false && transfersBlocked !== true) {
        return NextResponse.json({ success: false, message: "Valeur de blocage des virements invalide." }, { status: 400 });
      }

      const tbValue = transfersBlocked === true || transfersBlocked === 1 ? 1 : 0;
      if (user.transfersBlocked === tbValue) {
        return NextResponse.json({ success: false, message: "Aucun changement (même statut)." }, { status: 409 });
      }

      const changed = await db.transaction(async (tx) => {
        const [updatedUser] = await tx.update(usersTable)
          .set({ transfersBlocked: tbValue })
          .where(and(eq(usersTable.id, userId), eq(usersTable.transfersBlocked, user.transfersBlocked)))
          .returning({ id: usersTable.id });
        if (!updatedUser) return false;

        await tx.insert(notificationsTable).values({
          id: randomUUID(),
          userId,
          type: "account",
          title: tbValue === 1 ? "Virements restreints" : "Virements rétablis",
          message: tbValue === 1
            ? "Les opérations de virement ont été temporairement suspendues sur votre compte."
            : "Les opérations de virement sont à nouveau autorisées sur votre compte.",
          createdAt: new Date().toISOString(),
        });
        return true;
      });
      if (!changed) {
        return NextResponse.json({ success: false, message: "Le statut des virements a été modifié entre-temps." }, { status: 409 });
      }

      if (tbValue === 0) {
        try {
          await sendTransferAccessRestoredEmail(user.email, user.firstName);
        } catch (error) {
          console.error("Email de rétablissement des virements non envoyé :", error);
        }
      }

      return NextResponse.json({ success: true, transfersBlocked: tbValue });
    }

    // 2. Mise à jour du statut global du compte (approved / rejected / blocked)
    if (status) {
      if (!["approved", "rejected", "blocked"].includes(status)) {
        return NextResponse.json({ success: false, message: "Statut invalide" }, { status: 400 });
      }
      const statusReason = typeof reason === "string" ? reason.trim().slice(0, 500) : "";
      if (status === "blocked" && !statusReason) {
        return NextResponse.json({ success: false, message: "Le motif du blocage est obligatoire." }, { status: 400 });
      }

      const changed = await db.transaction(async (tx) => {
        const [updatedUser] = await tx
          .update(usersTable)
          .set({ status })
          .where(and(eq(usersTable.id, userId), eq(usersTable.status, user.status)))
          .returning({ id: usersTable.id });
        if (!updatedUser || user.status === status) return false;

        const titleMap: Record<string, string> = {
          approved: "Compte approuvé",
          rejected: "Compte rejeté",
          blocked: "Compte bloqué",
        };
        const messageMap: Record<string, string> = {
          approved: "Votre compte a été approuvé. Vous pouvez désormais vous connecter.",
          rejected: "Votre demande d'ouverture de compte n'a pas été approuvée.",
          blocked: `Votre compte a été suspendu par mesure de sécurité administrative. Motif : ${statusReason}`,
        };

        await tx.insert(notificationsTable).values({
          id: randomUUID(),
          userId,
          type: "account",
          title: titleMap[status],
          message: messageMap[status],
          createdAt: new Date().toISOString(),
        });
        return true;
      });

      if (!changed) {
        return NextResponse.json({ success: false, message: "Aucun changement (même statut)." }, { status: 409 });
      }

      // Envoi d'e-mail SEULEMENT pour approbation ou rejet — SAUF pour le blocage !
      if (status === "approved") {
        try {
          await sendApprovalEmail(user.email, user.firstName);
        } catch (error) {
          console.error("Email d'approbation non envoyé :", error);
        }
      } else if (status === "rejected") {
        try {
          await sendAccountStatusEmail(user.email, user.firstName, "rejected", reason);
        } catch (error) {
          console.error("Email de rejet non envoyé :", error);
        }
      }
      // Note : si status === "blocked", aucun e-mail n'est envoyé, conformément à :
      // "À chaque fois que l'admin fait quelque chose envers les usagers, sauf le blocage, il doit recevoir un message dans leur mail."

      return NextResponse.json({ success: true, status });
    }

    return NextResponse.json({ success: false, message: "Aucune modification demandée." }, { status: 400 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour utilisateur :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
