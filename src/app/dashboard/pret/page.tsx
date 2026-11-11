"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface LoanRequest {
  id: string;
  amount: number;
  durationMonths: number;
  purpose: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface LoanResponse {
  loans?: LoanRequest[];
  currency?: string;
  message?: string;
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(amount);
}

function statusLabel(status: LoanRequest["status"]) {
  if (status === "approved") return "Demande acceptée";
  if (status === "rejected") return "Demande refusée";
  return "En attente";
}

export default function PretPage() {
  const [amount, setAmount] = useState("");
  const [durationMonths, setDurationMonths] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loans, setLoans] = useState<LoanRequest[]>([]);
  const [currency, setCurrency] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadLoans = async () => {
    const response = await fetch("/api/dashboard/loans");
    const data: LoanResponse = await response.json();
    if (!response.ok) throw new Error(data.message ?? "Impossible de charger les demandes.");
    setLoans(data.loans ?? []);
    if (data.currency) setCurrency(data.currency);
  };

  useEffect(() => {
    let active = true;
    fetch("/api/dashboard/loans")
      .then(async (response) => {
        const data: LoanResponse = await response.json();
        if (!response.ok) throw new Error(data.message ?? "Impossible de charger les demandes.");
        if (active) {
          setLoans(data.loans ?? []);
          if (data.currency) setCurrency(data.currency);
        }
      })
      .catch((cause: unknown) => {
        if (active) setErrorMessage(cause instanceof Error ? cause.message : "Erreur de chargement.");
      })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, []);

  const submitRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await fetch("/api/dashboard/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, durationMonths, purpose }),
      });
      const data: { message?: string } = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Impossible d'enregistrer la demande.");
      setAmount("");
      setDurationMonths("");
      setPurpose("");
      setSuccessMessage(data.message ?? "Demande enregistrée.");
      await loadLoans();
    } catch (cause) {
      setErrorMessage(cause instanceof Error ? cause.message : "Erreur lors de l'enregistrement.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pret-page-container">
      <div className="carte-screen-header">
        <Link href="/dashboard" className="btn-back-circle" aria-label="Retour au tableau de bord">
          <i className="fa-solid fa-chevron-left"></i>
        </Link>
        <h1 className="screen-title-center">Demande de financement</h1>
        <div style={{ width: "38px" }}></div>
      </div>

      <section className="pret-form-card">
        <h2 className="pret-card-title">Enregistrer une demande</h2>
        <p className="pret-card-sub">
          Les conditions, taux et frais ne sont pas configurés. Cette demande ne constitue pas une offre de crédit et aucun fonds ne sera crédité automatiquement.
        </p>
        {errorMessage && <p role="alert">{errorMessage}</p>}
        {successMessage && <p role="status">{successMessage}</p>}

        <form onSubmit={submitRequest} className="pret-simulator-form">
          <label className="field-label" htmlFor="loan-amount">
            Montant demandé{currency ? ` (${currency})` : ""}
          </label>
          <input
            id="loan-amount"
            type="number"
            min="500"
            max="100000"
            step="0.01"
            required
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="step-input"
          />

          <label className="field-label" htmlFor="loan-duration">Durée souhaitée (mois)</label>
          <input
            id="loan-duration"
            type="number"
            min="3"
            max="120"
            step="1"
            required
            value={durationMonths}
            onChange={(event) => setDurationMonths(event.target.value)}
            className="step-input"
          />

          <label className="field-label" htmlFor="loan-purpose">Motif de la demande</label>
          <textarea
            id="loan-purpose"
            required
            maxLength={120}
            value={purpose}
            onChange={(event) => setPurpose(event.target.value)}
            className="step-input"
          />

          <button type="submit" disabled={submitting || !currency} className="btn-submit-loan">
            {submitting ? "Enregistrement…" : "Enregistrer la demande"}
          </button>
        </form>
      </section>

      {!loading && loans.length > 0 && (
        <section className="loans-history-section">
          <h2 className="section-title">Mes demandes</h2>
          <div className="loans-list-wrapper">
            {loans.map((loan) => (
              <article key={loan.id} className="loan-item-card">
                <div className="loan-item-top">
                  <div>
                    <strong className="loan-item-purpose">{loan.purpose}</strong>
                    <div className="loan-item-date">
                      {new Date(loan.createdAt).toLocaleDateString("fr-FR")} · {loan.durationMonths} mois
                    </div>
                  </div>
                  <span className={`badge-loan-status ${loan.status}`}>
                    {statusLabel(loan.status)}
                  </span>
                </div>
                <div className="loan-item-grid">
                  <div>
                    <span className="loan-meta-key">Montant demandé</span>
                    <span className="loan-meta-val">{formatMoney(loan.amount, currency)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
