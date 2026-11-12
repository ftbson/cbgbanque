import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getApprovedUser } from "@/lib/auth";
import { getDeterministicIban, getOrCreateAccount } from "@/lib/dashboard-data";
import { db } from "@/lib/db";
import { usersTable } from "@/lib/schema";

export async function GET() {
  try {
    const user = await getApprovedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });

    const [account, [userData]] = await Promise.all([
      getOrCreateAccount(user.id),
      db.select({
        civility: usersTable.civility,
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
        address: usersTable.address,
        city: usersTable.city,
        postalCode: usersTable.postalCode,
        residenceCountry: usersTable.residenceCountry,
        email: usersTable.email,
        phone: usersTable.phone,
      }).from(usersTable).where(eq(usersTable.id, user.id)).limit(1),
    ]);

    const bankCoords = getDeterministicIban(user.id);

    return NextResponse.json({
      success: true,
      bank: {
        name: "CBG BANQUE FINANCE",
        legalName: "CBG Banque Internationale & Finance S.A.",
        address: "12 Place Vendôme, 75001 Paris, France",
        capital: "50 000 000 €",
        rcs: "RCS Paris B 892 104 382",
        acpr: "Agrément ACPR n° 14890",
        domiciliation: "CBG BANQUE PARIS VENDÔME",
        bic: bankCoords.bic,
      },
      holder: {
        name: userData ? `${userData.firstName} ${userData.lastName}`.toUpperCase() : "CLIENT CBG",
        civility: userData?.civility || "M.",
        address: userData?.address || "14 Rue de la Paix",
        postalCode: userData?.postalCode || "75002",
        city: userData?.city || "Paris",
        country: userData?.residenceCountry || "France",
      },
      rib: {
        iban: bankCoords.iban,
        rawIban: bankCoords.rawIban,
        bic: bankCoords.bic,
        codeBanque: bankCoords.codeBanque,
        codeGuichet: bankCoords.codeGuichet,
        numeroCompte: bankCoords.numeroCompte,
        cleRib: bankCoords.cleRib,
        devise: account.currency || "EUR",
      },
    });
  } catch (error) {
    console.error("Erreur lors de la génération du RIB :", error);
    return NextResponse.json({ success: false, message: "Impossible de générer le RIB." }, { status: 500 });
  }
}
