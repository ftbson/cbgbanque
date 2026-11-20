// src/lib/iban.ts
// IBAN generation utility for different countries (FR, ES, DE)

export type CountryCode = "FR" | "ES" | "DE";

interface IbanComponents {
  countryCode: string;
  checkDigits: string;
  bban: string; // Basic Bank Account Number (includes bank code, branch code, account number, check digit)
  formattedIban: string;
  rawIban: string;
  bic: string;
  codeBanque: string;
  codeGuichet: string;
  numeroCompte: string;
  cleRib: string;
}

/**
 * Generate a deterministic hash from userId for consistent IBAN generation
 */
function generateHash(userId: string): number {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Calculate IBAN check digits using MOD-97 algorithm
 * IBAN format: Country Code + Check Digits + BBAN
 */
function calculateIbanCheckDigits(countryCode: string, bban: string): string {
  // Move country code and check digits placeholder to the end
  // Convert letters to numbers (A=10, B=11, ..., Z=35)
  const rearranged = bban + countryCode + "00";
  let numericString = "";

  for (const char of rearranged) {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) { // A-Z
      numericString += (code - 55).toString(); // A=10, B=11, etc.
    } else {
      numericString += char;
    }
  }

  // Calculate MOD-97
  let remainder = 0;
  for (const char of numericString) {
    remainder = (remainder * 10 + parseInt(char, 10)) % 97;
  }

  const checkDigits = 98 - remainder;
  return checkDigits.toString().padStart(2, "0");
}

/**
 * Generate a country-specific IBAN based on user's residence country
 */
export function generateIban(userId: string, countryCode: CountryCode): IbanComponents {
  const hash = generateHash(userId);
  const cleanId = userId.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

  // Bank and branch codes (CBG Bank constants)
  const codeBanque = "30092";
  const codeGuichet = "70002";

  // Generate account number from userId (11 chars for FR, 10 for ES, 10 for DE)
  let numeroCompte: string;
  let cleRib: string;
  let bbanFormat: string;
  let bic: string;
  let countryPrefix: string;

  switch (countryCode) {
    case "FR":
      // France: FR76 + 23 chars BBAN (5 bank + 5 branch + 11 account + 2 check)
      numeroCompte = (cleanId.slice(0, 11) || "23C23069369").padEnd(11, "0");
      cleRib = (Math.abs(hash % 89) + 10).toString().padStart(2, "0");
      bbanFormat = `${codeBanque}${codeGuichet}${numeroCompte}${cleRib}`;
      bic = "C23QBEBB"; // CBG Bank BIC
      countryPrefix = "FR";
      break;

    case "ES":
      // Spain: ES91 + 20 chars BBAN (4 bank + 4 branch + 2 check + 10 account)
      numeroCompte = (cleanId.slice(0, 10) || "23C2306936").padEnd(10, "0");
      // Spanish check digits (DC) - 2 digits
      cleRib = (Math.abs(hash % 89) + 10).toString().padStart(2, "0");
      bbanFormat = `${codeBanque}${codeGuichet}${cleRib}${numeroCompte}`;
      bic = "C23QBEBB"; // Same BIC for demo
      countryPrefix = "ES";
      break;

    case "DE":
      // Germany: DE89 + 18 chars BBAN (8 bank + 10 account)
      numeroCompte = (cleanId.slice(0, 10) || "23C2306936").padEnd(10, "0");
      cleRib = ""; // Germany doesn't use separate RIB check digit in same way
      bbanFormat = `${codeBanque}${codeGuichet.slice(0, 3)}${numeroCompte}`; // 8 + 10 = 18
      bic = "C23QBEBB"; // Same BIC for demo
      countryPrefix = "DE";
      break;

    default:
      // Default to France
      numeroCompte = (cleanId.slice(0, 11) || "23C23069369").padEnd(11, "0");
      cleRib = (Math.abs(hash % 89) + 10).toString().padStart(2, "0");
      bbanFormat = `${codeBanque}${codeGuichet}${numeroCompte}${cleRib}`;
      bic = "C23QBEBB";
      countryPrefix = "FR";
  }

  // Calculate check digits for the IBAN
  const checkDigits = calculateIbanCheckDigits(countryPrefix, bbanFormat);
  const rawIban = `${countryPrefix}${checkDigits}${bbanFormat}`;

  // Format with spaces every 4 characters
  const formattedIban = rawIban.match(/.{1,4}/g)?.join(" ") || rawIban;

  return {
    countryCode: countryPrefix,
    checkDigits,
    bban: bbanFormat,
    formattedIban,
    rawIban,
    bic,
    codeBanque,
    codeGuichet,
    numeroCompte,
    cleRib: cleRib || "00",
  };
}

/**
 * Get the country code from residence country string
 */
export function getCountryCodeFromResidence(residenceCountry: string): CountryCode {
  const country = residenceCountry.toLowerCase();
  if (country.includes("france") || country === "fr" || country === "france") return "FR";
  if (country.includes("espagne") || country === "es" || country === "espana" || country === "españa") return "ES";
  if (country.includes("allemagne") || country === "de" || country === "deutschland") return "DE";
  // Default to France
  return "FR";
}