"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

interface Loan {
  id: string;
  amount: number;
  durationMonths: number;
  interestRate: number;
  monthlyPayment: number;
  totalPayment: number;
  dossierFees: number;
  purpose: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function PretPage() {
  const [amount, setAmount] = useState<number>(5000);
  const [durationMonths, setDurationMonths] = useState<number>(24);
  const [purpose, setPurpose] = useState<string>("Projet personnel");
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const annualRate = 0.0349; // 3.49% TAEG fixe

  // Calcul dynamique en temps réel
  const calculation = useMemo(() => {
    const monthlyRate = annualRate / 12;
    const monthlyPayment =
      (amount * (monthlyRate * Math.pow(1 + monthlyRate, durationMonths))) /
      (Math.pow(1 + monthlyRate, durationMonths) - 1);
    const totalPayment = monthlyPayment * durationMonths;
    const totalInterest = totalPayment - amount;
    const dossierFees = Math.min(250, Math.max(50, Math.round(amount * 0.01)));

    return {
      monthly: Math.round(monthlyPayment * 100) / 100,
      total: Math.round(totalPayment * 100) / 100,
      interest: Math.round(totalInterest * 100) / 100,
      fees: dossierFees,
    };
  }, [amount, durationMonths]);

  const fetchLoans = async () => {
    try {
      const res = await fetch("/api/dashboard/loans");
      const data = await res.json();
      if (data.success && data.loans) {
        setLoans(data.loans);
      }
    } catch {
      console.error("Erreur chargement prêts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/dashboard/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          durationMonths,
          purpose,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de la soumission du prêt");
      }

      setSuccessMsg("Votre demande de prêt a été transmise à l'administrateur avec succès ! Vous recevrez une notification dès sa validation.");
      await fetchLoans();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatEuro = (val: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(val);
  };

  return (
    <div className="pret-page-container">
      {/* Header */}
      <div className="carte-screen-header">
        <Link href="/dashboard" className="btn-back-circle" aria-label="Retour au dashboard">
          <i className="fa-solid fa-chevron-left"></i>
        </Link>
        <h1 className="screen-title-center">Simulateur & Prêt Express</h1>
        <div style={{ width: "38px" }}></div>
      </div>

      {errorMsg && <div className="admin-error-banner" style={{ margin: "1rem 0" }}>{errorMsg}</div>}
      {successMsg && (
        <div className="admin-success-banner" style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", padding: "1rem", borderRadius: "12px", margin: "1rem 0", fontSize: "0.92rem" }}>
          <i className="fa-solid fa-circle-check"></i> {successMsg}
        </div>
      )}

      {/* Simulator Form Card */}
      <div className="pret-form-card">
        <div className="pret-badge-tag">
          <i className="fa-solid fa-bolt"></i> Réponse rapide sous 24h
        </div>
        <h2 className="pret-card-title">Simulez votre crédit en direct</h2>
        <p className="pret-card-sub">
          Ajustez le montant et la durée pour calculer automatiquement vos mensualités et le coût du crédit.
        </p>

        <form onSubmit={handleSubmit} className="pret-simulator-form">
          {/* Montant souhaité */}
          <div className="form-range-block">
            <div className="range-label-row">
              <label htmlFor="loan-amount">Montant souhaité</label>
              <div className="range-val-input-wrap">
                <input
                  id="loan-amount"
                  type="number"
                  min="500"
                  max="75000"
                  step="100"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 500)}
                  className="range-number-box"
                />
                <span className="unit-tag">€</span>
              </div>
            </div>
            <input
              type="range"
              min="500"
              max="75000"
              step="500"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="cbg-range-slider"
            />
            <div className="quick-amount-chips">
              {[1500, 3000, 5000, 10000, 20000, 35000].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAmount(v)}
                  className={`chip-btn ${amount === v ? "active" : ""}`}
                >
                  {v.toLocaleString("fr-FR")} €
                </button>
              ))}
            </div>
          </div>

          {/* Durée de remboursement */}
          <div className="form-range-block" style={{ marginTop: "1.75rem" }}>
            <div className="range-label-row">
              <label>Durée de remboursement</label>
              <span className="duration-highlight">
                {durationMonths} mois ({Math.floor(durationMonths / 12)} an{durationMonths >= 24 ? "s" : ""}{durationMonths % 12 ? ` et ${durationMonths % 12} mois` : ""})
              </span>
            </div>
            <input
              type="range"
              min="6"
              max="84"
              step="6"
              value={durationMonths}
              onChange={(e) => setDurationMonths(Number(e.target.value))}
              className="cbg-range-slider purple"
            />
            <div className="quick-duration-grid">
              {[
                { m: 6, l: "6 mois" },
                { m: 12, l: "1 an" },
                { m: 24, l: "2 ans" },
                { m: 36, l: "3 ans" },
                { m: 48, l: "4 ans" },
                { m: 60, l: "5 ans" },
                { m: 84, l: "7 ans" },
              ].map((item) => (
                <button
                  key={item.m}
                  type="button"
                  onClick={() => setDurationMonths(item.m)}
                  className={`chip-btn ${durationMonths === item.m ? "active" : ""}`}
                >
                  {item.l}
                </button>
              ))}
            </div>
          </div>

          {/* Motif du prêt */}
          <div style={{ marginTop: "1.75rem" }}>
            <label className="select-label" style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#e2e8f0" }}>
              Motif du financement
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="step-select"
            >
              <option value="Projet personnel">Projet personnel / Trésorerie</option>
              <option value="Achat véhicule">Achat véhicule (Auto / Moto / Vélo électrique)</option>
              <option value="Travaux & Rénovation">Travaux & Décoration maison</option>
              <option value="Équipement & Informatique">Équipement maison / Multimédia</option>
              <option value="Voyage & Événement">Voyage ou Événement familial</option>
              <option value="Rachat de crédits">Regroupement de crédits</option>
            </select>
          </div>

          {/* Live Calculation Display Box */}
          <div className="loan-calculation-box">
            <div className="calc-main-monthly">
              <span className="monthly-label">Votre mensualité estimée :</span>
              <strong className="monthly-amount">{formatEuro(calculation.monthly)} <span className="per-month">/ mois</span></strong>
            </div>

            <div className="calc-details-grid">
              <div className="calc-detail-item">
                <span className="cd-title">Montant emprunté</span>
                <span className="cd-value">{formatEuro(amount)}</span>
              </div>
              <div className="calc-detail-item">
                <span className="cd-title">Taux débiteur fixe (TAEG)</span>
                <span className="cd-value text-green">3.49 %</span>
              </div>
              <div className="calc-detail-item">
                <span className="cd-title">Frais de dossier</span>
                <span className="cd-value">{formatEuro(calculation.fees)}</span>
              </div>
              <div className="calc-detail-item">
                <span className="cd-title">Total des intérêts</span>
                <span className="cd-value">{formatEuro(calculation.interest)}</span>
              </div>
              <div className="calc-detail-item total-row">
                <span className="cd-title">Montant total dû (hors assurance)</span>
                <span className="cd-value highlight-blue">{formatEuro(calculation.total)}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-submit-loan"
          >
            {submitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Transmission du dossier...
              </>
            ) : (
              <>
                <i className="fa-solid fa-paper-plane"></i> Demander ce prêt maintenant
              </>
            )}
          </button>
        </form>
      </div>

      {/* ================= LOANS HISTORY LIST ================= */}
      <div className="loans-history-section">
        <h3 className="section-title">Mes demandes de prêt</h3>
        {loading ? (
          <p style={{ color: "#94a3b8" }}>Chargement de vos demandes…</p>
        ) : loans.length === 0 ? (
          <div className="empty-transaction-card">
            <span className="empty-title">Aucun prêt en cours</span>
            <span className="empty-sub">Vos demandes de crédit et leur statut apparaîtront ici.</span>
          </div>
        ) : (
          <div className="loans-list-wrapper">
            {loans.map((loan) => (
              <div key={loan.id} className="loan-item-card">
                <div className="loan-item-top">
                  <div>
                    <strong className="loan-item-purpose">{loan.purpose}</strong>
                    <div className="loan-item-date">
                      Demandé le {new Date(loan.createdAt).toLocaleDateString("fr-FR")} · {loan.durationMonths} mois
                    </div>
                  </div>
                  <span
                    className={`badge-loan-status ${
                      loan.status === "approved"
                        ? "approved"
                        : loan.status === "rejected"
                        ? "rejected"
                        : "pending"
                    }`}
                  >
                    {loan.status === "approved"
                      ? "✓ Accordé"
                      : loan.status === "rejected"
                      ? "✕ Rejeté"
                      : "⏳ En attente validation"}
                  </span>
                </div>

                <div className="loan-item-grid">
                  <div>
                    <span className="loan-meta-key">Montant</span>
                    <span className="loan-meta-val">{formatEuro(loan.amount)}</span>
                  </div>
                  <div>
                    <span className="loan-meta-key">Mensualité</span>
                    <span className="loan-meta-val">{formatEuro(loan.monthlyPayment)} / mois</span>
                  </div>
                  <div>
                    <span className="loan-meta-key">Frais de dossier</span>
                    <span className="loan-meta-val">{formatEuro(loan.dossierFees)}</span>
                  </div>
                  <div>
                    <span className="loan-meta-key">Coût total</span>
                    <span className="loan-meta-val highlight-blue">{formatEuro(loan.totalPayment)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
