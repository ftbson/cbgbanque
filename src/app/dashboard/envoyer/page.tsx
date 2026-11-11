"use client";

import { useEffect, useState } from "react";

interface AccountData {
  availableBalanceCents: number;
  currency: string;
  message?: string;
}

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(cents / 100);
}

export default function EnvoyerPage() {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadAccount = async () => {
    const response = await fetch("/api/dashboard/transactions");
    const data: AccountData = await response.json();
    if (!response.ok) throw new Error(data.message ?? "Impossible de charger le solde.");
    setAccount(data);
  };

  useEffect(() => {
    let active = true;
    fetch("/api/dashboard/transactions")
      .then(async (response) => {
        const data: AccountData = await response.json();
        if (!response.ok) throw new Error(data.message ?? "Impossible de charger le solde.");
        if (active) setAccount(data);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Erreur de chargement.");
      });
    return () => { active = false; };
  }, []);

  const requestWithdrawal = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/dashboard/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, description }),
      });
      const data: { message?: string } = await response.json();
      if (!response.ok) throw new Error(data.message ?? "La demande de retrait a échoué.");
      setMessage(data.message ?? "Demande enregistrée en attente de traitement.");
      setAmount("");
      setDescription("");
      await loadAccount();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Erreur lors de la demande.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="retrait-page">
      <div className="retrait-container">
        <div className="retrait-header"><h1 className="retrait-title">Demande de retrait</h1></div>
        <section className="retrait-balance-box">
          <span className="retrait-sub-label">Solde disponible</span>
          <div className="retrait-solde-val">
            {account ? formatMoney(account.availableBalanceCents, account.currency) : "Chargement…"}
          </div>
          {account?.availableBalanceCents === 0 && (
            <p>Aucun fonds n&apos;est disponible sur ce compte. Les soldes ne sont pas crédités automatiquement.</p>
          )}
        </section>

        {error && <p role="alert">{error}</p>}
        {message && <p role="status">{message}</p>}
        <form onSubmit={requestWithdrawal} className="iban-form-container">
          <label className="field-label" htmlFor="withdrawal-amount">
            Montant{account ? ` (${account.currency})` : ""}
          </label>
          <input
            id="withdrawal-amount"
            type="number"
            min="0.01"
            step="0.01"
            max={account ? (account.availableBalanceCents / 100).toFixed(2) : undefined}
            required
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="step-input"
          />
          <label className="field-label" htmlFor="withdrawal-description">Motif de la demande</label>
          <input
            id="withdrawal-description"
            type="text"
            maxLength={120}
            required
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Décrivez le motif de votre demande"
            className="step-input"
          />
          <p role="note">
            Cette action enregistre une demande et réserve le montant sur votre solde disponible. Elle ne déclenche aucun virement bancaire : aucun prestataire de paiement n&apos;est configuré.
          </p>
          <button type="submit" className="btn-confirm-retrait" disabled={loading || !account || account.availableBalanceCents <= 0}>
            {loading ? "Enregistrement…" : "Envoyer la demande"}
          </button>
        </form>
      </div>
    </div>
  );
}
