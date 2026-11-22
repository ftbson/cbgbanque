"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TransferTrackingModal from "@/components/TransferTrackingModal";

interface AccountData {
  availableBalanceCents: number;
  currency: string;
  message?: string;
  transfersBlocked?: boolean;
  isAccountBlocked?: boolean;
  recentTransfers: TransferRequest[];
}

interface TransferRequest {
  id: string;
  recipientName: string;
  iban: string;
  bic: string;
  amountCents: number;
  description: string | null;
  status: string;
  createdAt: string;
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
  const [expandedTransferId, setExpandedTransferId] = useState<string | null>(null);
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
  const [trackingTransferId, setTrackingTransferId] = useState<string | null>(null);
  const hasPendingTransfers = account?.recentTransfers.some((transfer) =>
    transfer.status === "pending_review" || transfer.status === "pending_admin_otp" || transfer.status === "pending_otp"
  ) ?? false;

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

  useEffect(() => {
    if (!hasPendingTransfers) return;

    let active = true;
    const refreshTransfers = async () => {
      try {
        const res = await fetch("/api/dashboard/transactions");
        const data: AccountData = await res.json();
        if (!res.ok) throw new Error(data.message ?? "Erreur de mise Ã  jour des virements.");
        if (active) setAccount(data);
      } catch (refreshError) {
        console.error("Erreur dâ€™actualisation des demandes de virement :", refreshError);
      }
    };

    const intervalId = window.setInterval(refreshTransfers, 10000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [hasPendingTransfers]);

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
      if (!res.ok) throw new Error(data.message ?? "Erreur lors de la prÃ©paration du virement.");

      setRequestId(data.requestId);
      setTrackingTransferId(data.requestId);
      setRecipientName("");
      setIban("");
      setBic("");
      setAmount("");
      setDescription("");
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
          href="/FR/dashboard"
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
            {account ? formatMoney(account.availableBalanceCents, account.currency) : "â€¦"}
          </div>
        </div>
        <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(59, 130, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa", fontSize: "1.2rem" }}>
          <i className="fa-solid fa-arrow-up-right-from-square"></i>
        </div>
      </div>

      {/* Transfer Blocked Warning */}
      {(account?.transfersBlocked || account?.isAccountBlocked) && (
        <div style={{ background: "rgba(234, 179, 8, 0.15)", border: "1px solid rgba(234, 179, 8, 0.4)", color: "#fef08a", padding: "1rem 1.25rem", borderRadius: "14px", marginBottom: "1.5rem", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: "1.25rem", color: "#eab308" }}></i>
          <div>
            <strong>Virements suspendus :</strong>
            <p style={{ margin: "0.2rem 0 0", color: "#fef9c3", fontSize: "0.85rem" }}>
              Les opÃ©rations de virement sont actuellement restreintes sur votre compte par l&apos;administration. Veuillez contacter votre conseiller CBG Finance.
            </p>
          </div>
        </div>
      )}

      {account && account.recentTransfers.length > 0 && (
        <section
          aria-labelledby="recent-transfers-title"
          style={{
            marginBottom: "1.5rem",
            padding: "1rem",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
          }}
        >
          <h2 id="recent-transfers-title" style={{ fontSize: "1rem", margin: "0 0 0.75rem" }}>
            Demandes de virement rÃ©centes
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {account.recentTransfers.map((transfer) => {
              const isPending = transfer.status === "pending_review" || transfer.status === "pending_admin_otp" || transfer.status === "pending_otp";
              const isBlocked = transfer.status === "blocked_by_admin" || transfer.status === "blocked_at_routing" || transfer.status === "failed_verification";
              const isExpanded = expandedTransferId === transfer.id;

              return (
                <div key={transfer.id} style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "0.5rem" }}>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.4rem 0",
                    }}
                  >
                    <span style={{ minWidth: 0 }}>
                      <strong style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {transfer.recipientName}
                      </strong>
                      <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                        {new Date(transfer.createdAt).toLocaleString("fr-FR")}
                      </span>
                    </span>
                    <div style={{ textAlign: "right", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.3rem" }}>
                      <strong>{formatMoney(transfer.amountCents, account.currency)}</strong>
                      {isPending ? (
                        <button
                          type="button"
                          onClick={() => setTrackingTransferId(transfer.id)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            padding: "0.25rem 0.65rem",
                            borderRadius: "14px",
                            border: "1px solid rgba(251,191,36,0.6)",
                            background: "rgba(251,191,36,0.18)",
                            color: "#fbbf24",
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            cursor: "pointer",
                            boxShadow: "0 0 10px rgba(251,191,36,0.25)",
                          }}
                        >
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fbbf24" }}></span>
                          En attente (Suivre)
                        </button>
                      ) : (
                        <span style={{ color: isBlocked ? "#f87171" : "#34d399", fontSize: "0.8rem", fontWeight: 700 }}>
                          {isBlocked ? "BloquÃ©" : "TraitÃ©"}
                        </span>
                      )}
                    </div>
                  </div>
                  {isExpanded && (
                    <div style={{ padding: "0.5rem 0 0.25rem", color: "rgba(255,255,255,0.75)", fontSize: "0.85rem", lineHeight: 1.6 }}>
                      <div><strong>BÃ©nÃ©ficiaire :</strong> {transfer.recipientName}</div>
                      <div><strong>IBAN :</strong> {transfer.iban}</div>
                      {transfer.bic && <div><strong>BIC :</strong> {transfer.bic}</div>}
                      {transfer.description && <div><strong>Motif :</strong> {transfer.description}</div>}
                      <div><strong>RÃ©fÃ©rence :</strong> {transfer.id}</div>
                      {isPending && (
                        <div
                          role="status"
                          aria-live="polite"
                          style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "0.75rem", color: "#fbbf24" }}
                        >
                          <i className="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i>
                          <span>En attente dâ€™examen par lâ€™administration. Aucun virement nâ€™a encore Ã©tÃ© exÃ©cutÃ©.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

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
              Nom et prÃ©nom du bÃ©nÃ©ficiaire
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
                Montant (â‚¬)
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
              {loading ? "Enregistrement en coursâ€¦" : "Envoyer la demande"}
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
            {errorDetails || "Votre demande a Ã©tÃ© enregistrÃ©e. Aucun virement n'a encore Ã©tÃ© exÃ©cutÃ©."}
          </p>
          <div style={{ textAlign: "left", margin: "0 auto 1.5rem", maxWidth: "360px", fontSize: "0.9rem" }}>
            <div style={{ marginBottom: "0.5rem" }}><strong>BÃ©nÃ©ficiaire :</strong> {recipientName}</div>
            <div style={{ marginBottom: "0.5rem" }}><strong>Montant :</strong> {amount} â‚¬</div>
            <div><strong>RÃ©fÃ©rence :</strong> {requestId}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link
              href="/FR/dashboard"
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

      {trackingTransferId && (
        <TransferTrackingModal
          transferId={trackingTransferId}
          onClose={() => {
            setTrackingTransferId(null);
            loadAccount();
          }}
          onSuccessOrHalted={() => loadAccount()}
        />
      )}
    </div>
  );
}

