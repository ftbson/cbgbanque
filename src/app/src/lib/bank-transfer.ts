export interface BankTransferSettings {
  enabled: boolean;
  accountName: string | null;
  iban: string | null;
  bic: string | null;
}

export async function getBankTransferSettings(): Promise<BankTransferSettings> {
  const accountName = process.env.BANK_TRANSFER_ACCOUNT_NAME?.trim() || null;
  const iban = process.env.BANK_TRANSFER_IBAN?.replace(/\s/g, "").toUpperCase() || null;
  const bic = process.env.BANK_TRANSFER_BIC?.replace(/\s/g, "").toUpperCase() || null;

  return {
    enabled: process.env.BANK_TRANSFER_ENABLED === "true" && Boolean(accountName && iban),
    accountName,
    iban,
    bic,
  };
}
