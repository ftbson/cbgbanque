import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getApprovedUser } from "@/lib/auth";
import { getOrCreateAccount } from "@/lib/dashboard-data";
import { db } from "@/lib/db";
import { accountsTable, usersTable } from "@/lib/schema";

interface ParsedIban {
  iban: string;
  rawIban: string;
  bic: string;
  codeBanque: string;
  codeGuichet: string;
  numeroCompte: string;
  cleRib: string;
}

function parseStoredIban(rawIban: string): ParsedIban {
  // IBAN format: CC + DD + BBAN
  // FR: FR76 + 5 + 5 + 11 + 2 = 27 chars
  // ES: ES91 + 4 + 4 + 2 + 10 = 24 chars
  // DE: DE89 + 8 + 10 = 22 chars

  const countryCode = rawIban.slice(0, 2);
  const checkDigits = rawIban.slice(2, 4);
  const bban = rawIban.slice(4);

  let codeBanque = "30092";
  let codeGuichet = "70002";
  let numeroCompte = "";
  let cleRib = "";

  if (countryCode === "FR") {
    // FR: 5 + 5 + 11 + 2
    codeBanque = bban.slice(0, 5);
    codeGuichet = bban.slice(5, 10);
    numeroCompte = bban.slice(10, 21);
    cleRib = bban.slice(21, 23);
  } else if (countryCode === "ES") {
    // ES: 4 + 4 + 2 + 10
    codeBanque = bban.slice(0, 4);
    codeGuichet = bban.slice(4, 8);
    cleRib = bban.slice(8, 10);
    numeroCompte = bban.slice(10, 20);
  } else if (countryCode === "DE") {
    // DE: 8 + 10
    codeBanque = bban.slice(0, 8);
    codeGuichet = ""; // Germany uses different structure
    numeroCompte = bban.slice(8, 18);
    cleRib = "00";
  }

  const formattedIban = rawIban.match(/.{1,4}/g)?.join(" ") || rawIban;

  return {
    iban: formattedIban,
    rawIban,
    bic: "C23QBEBB",
    codeBanque,
    codeGuichet,
    numeroCompte,
    cleRib,
  };
}

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
        signupLocale: usersTable.signupLocale,
        email: usersTable.email,
        phone: usersTable.phone,
      }).from(usersTable).where(eq(usersTable.id, user.id)).limit(1),
    ]);

    // Use stored IBAN from database, or fallback to deterministic generation for backwards compatibility
    let bankCoords: ParsedIban;
    if (account.iban) {
      bankCoords = parseStoredIban(account.iban);
    } else {
      // Fallback: generate deterministic IBAN (for existing users without stored IBAN)
      // Default to France for backwards compatibility
      const { generateIban } = await import("@/lib/iban");
      const countryCode = userData?.signupLocale ?? "FR";
      const generated = generateIban(user.id, countryCode);
      bankCoords = {
        iban: generated.formattedIban,
        rawIban: generated.rawIban,
        bic: generated.bic,
        codeBanque: generated.codeBanque,
        codeGuichet: generated.codeGuichet,
        numeroCompte: generated.numeroCompte,
        cleRib: generated.cleRib,
      };
    }

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