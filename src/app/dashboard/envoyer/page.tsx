"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface AccountData {
  availableBalanceCents: number;
  currency: string;
  message?: string;
}

function formatMoney(cents: number, currency: string = "EUR") {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency || "EUR",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export default function EnvoyerPage() {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [recipientName, setRecipientName] = useState("");
  const [iban, setIban] = useState("");
  const [bic, setBic] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const [step, setStep] = useState<1 | 2>(1);
  const [requestId, setRequestId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorDetails, setErrorDetails] = useState("");

  const loadAccount = async () => {
    try {
      const res = await fetch("/api/dashboard/transactions");
      const data: AccountData = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Erreur de solde");
      setAccount(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/dashboard/transactions")
      .then(async (res) => {
        const data: AccountData = await res.json();
        if (!res.ok) throw new Error(data.message ?? "Erreur de solde");
        if (active) setAccount(data);
      })
      .catch(() => {
        if (active) setAccount(null);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleInitiateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/dashboard/transactions/withdraw-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName,
          iban,
          bic,
          amount,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Erreur lors de la préparation du virement.");

      setRequestId(data.requestId);
      setErrorDetails(data.message);
      setStep(2);
      await loadAccount();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "520px", margin: "0 auto", padding: "1.5rem 1rem 6rem", color: "#fff" }}>
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}>
        <Link
          href="/dashboard"
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            textDecoration: "none",
            fontSize: "0.95rem",
          }}
        >
          <i className="fa-solid fa-chevron-left"></i>
        </Link>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
          {step === 1 ? "Virement & Retrait" : "Statut du virement"}
        </h1>
        <div style={{ width: "38px" }}></div>
      </div>

      {/* Available Balance Box */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))",
          borderRadius: "18px",
          padding: "1.25rem 1.5rem",
          border: "1px solid rgba(255,255,255,0.08)",
          marginBottom: "1.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.5)", fontWeight: 700, display: "block" }}>
            SOLDE DISPONIBLE
          </span>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff" }}>
            {account ? formatMoney(account.availableBalanceCents, account.currency) : "…"}
          </div>
        </div>
        <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(59, 130, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa", fontSize: "1.2rem" }}>
          <i className="fa-solid fa-arrow-up-right-from-square"></i>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.4)", color: "#fca5a5", padding: "0.85rem 1rem", borderRadius: "12px", marginBottom: "1.25rem", fontSize: "0.9rem" }}>
          <i className="fa-solid fa-triangle-exclamation"></i> {error}
        </div>
      )}

      {/* STEP 1: FORM */}
      {step === 1 && (
        <form onSubmit={handleInitiateTransfer} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.75)", marginBottom: "0.35rem", fontWeight: 600 }}>
              Nom et prénom du bénéficiaire
            </label>
            <input
              type="text"
              required
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Ex: Jean Dupont"
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.75)", marginBottom: "0.35rem", fontWeight: 600 }}>
              IBAN de destination
            </label>
            <input
              type="text"
              required
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              placeholder="FR76 3000 4000 5000 6000 7000 890"
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
                fontSize: "0.95rem",
                fontFamily: "monospace",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.75)", marginBottom: "0.35rem", fontWeight: 600 }}>
                Code BIC / SWIFT
              </label>
              <input
                type="text"
                value={bic}
                onChange={(e) => setBic(e.target.value)}
                placeholder="BNPAFR22"
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  fontSize: "0.95rem",
                  fontFamily: "monospace",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.75)", marginBottom: "0.35rem", fontWeight: 600 }}>
                Montant (€)
              </label>
              <input
                type="number"
                min="1"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.75)", marginBottom: "0.35rem", fontWeight: 600 }}>
              Motif du virement (optionnel)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Facture, Retrait, Remboursement..."
              maxLength={120}
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginTop: "1rem" }}>
            <button
              type="submit"
              disabled={loading || !recipientName.trim() || !iban.trim() || !amount}
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "100px",
                background: "linear-gradient(135deg, #4361ee, #3a0ca3)",
                color: "#fff",
                fontSize: "1rem",
                fontWeight: 700,
                border: "none",
                cursor: loading ? "wait" : "pointer",
                boxShadow: "0 8px 25px rgba(67, 97, 238, 0.4)",
              }}
            >
              {loading ? "Enregistrement en cours…" : "Envoyer la demande"}
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: PENDING REVIEW */}
      {step === 2 && (
        <div
          role="status"
          style={{
            textAlign: "center",
            padding: "2rem 1.25rem",
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "16px",
          }}
        >
          <i className="fa-solid fa-hourglass-half" style={{ fontSize: "2rem", color: "#60a5fa", marginBottom: "1rem" }}></i>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 0.75rem" }}>
            Demande en attente de validation
          </h2>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.6, margin: "0 0 1.25rem" }}>
            {errorDetails || "Votre demande a été enregistrée. Aucun virement n'a encore été exécuté."}
          </p>
          <div style={{ textAlign: "left", margin: "0 auto 1.5rem", maxWidth: "360px", fontSize: "0.9rem" }}>
            <div style={{ marginBottom: "0.5rem" }}><strong>Bénéficiaire :</strong> {recipientName}</div>
            <div style={{ marginBottom: "0.5rem" }}><strong>Montant :</strong> {amount} €</div>
            <div><strong>Référence :</strong> {requestId}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link
              href="/dashboard"
              style={{
                display: "inline-block",
                padding: "0.85rem 1.25rem",
                borderRadius: "100px",
                background: "linear-gradient(135deg, #4361ee, #3a0ca3)",
                color: "#fff",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Retour au tableau de bord
            </Link>
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setRequestId("");
                setErrorDetails("");
                setRecipientName("");
                setIban("");
                setBic("");
                setAmount("");
                setDescription("");
              }}
              style={{
                padding: "0.85rem 1.25rem",
                borderRadius: "100px",
                background: "rgba(255,255,255,0.08)",
                border: "none",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Nouvelle demande
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
