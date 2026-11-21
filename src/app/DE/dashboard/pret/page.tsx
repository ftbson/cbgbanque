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
  return new Intl.NumberFormat("de-DE", { style: "currency", currency }).format(amount);
}

function statusLabel(status: LoanRequest["status"]) {
  if (status === "approved") return "Anfrage genehmigt";
  if (status === "rejected") return "Anfrage abgelehnt";
  return "Ausstehend";
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
    const response = await fetch("/DE/api/dashboard/loans");
    const data: LoanResponse = await response.json();
    if (!response.ok) throw new Error(data.message ?? "Anfragen konnten nicht geladen werden.");
    setLoans(data.loans ?? []);
    if (data.currency) setCurrency(data.currency);
  };

  useEffect(() => {
    let active = true;
    fetch("/DE/api/dashboard/loans")
      .then(async (response) => {
        const data: LoanResponse = await response.json();
        if (!response.ok) throw new Error(data.message ?? "Anfragen konnten nicht geladen werden.");
        if (active) {
          setLoans(data.loans ?? []);
          if (data.currency) setCurrency(data.currency);
        }
      })
      .catch((cause: unknown) => {
        if (active) setErrorMessage(cause instanceof Error ? cause.message : "Ladefehler.");
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
      if (!response.ok) throw new Error(data.message ?? "Anfrage konnte nicht aufgezeichnet werden.");
      setAmount("");
      setDurationMonths("");
      setPurpose("");
      setSuccessMessage(data.message ?? "Anfrage aufgezeichnet.");
      await loadLoans();
    } catch (cause) {
      setErrorMessage(cause instanceof Error ? cause.message : "Fehler bei der Aufzeichnung.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pret-page-container">
      <div className="carte-screen-header">
        <Link href="/DE/dashboard" className="btn-back-circle" aria-label="Zurück zum Dashboard">
          <i className="fa-solid fa-chevron-left"></i>
        </Link>
        <h1 className="screen-title-center">Finanzierungsanfrage</h1>
        <div style={{ width: "38px" }}></div>
      </div>

      <section className="pret-form-card">
        <h2 className="pret-card-title">Anfrage aufzeichnen</h2>
        <p className="pret-card-sub">
          Bedingungen, Zinsen und Gebühren sind nicht konfiguriert. Diese Anfrage stellt kein Kreditangebot dar und keine Gelder werden automatisch gutgeschrieben.
        </p>
        {errorMessage && <p role="alert">{errorMessage}</p>}
        {successMessage && <p role="status">{successMessage}</p>}

        <form onSubmit={submitRequest} className="pret-simulator-form">
          <label className="field-label" htmlFor="loan-amount">
            Gewünschter Betrag{currency ? ` (${currency})` : ""}
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

          <label className="field-label" htmlFor="loan-duration">Gewünschte Laufzeit (Monate)</label>
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

          <label className="field-label" htmlFor="loan-purpose">Grund der Anfrage</label>
          <textarea
            id="loan-purpose"
            required
            maxLength={120}
            value={purpose}
            onChange={(event) => setPurpose(event.target.value)}
            className="step-input"
          />

          <button type="submit" disabled={submitting || !currency} className="btn-submit-loan">
            {submitting ? "Wird aufgezeichnet…" : "Anfrage aufzeichnen"}
          </button>
        </form>
      </section>

      {!loading && loans.length > 0 && (
        <section className="loans-history-section">
          <h2 className="section-title">Meine Anfragen</h2>
          <div className="loans-list-wrapper">
            {loans.map((loan) => (
              <article key={loan.id} className="loan-item-card">
                <div className="loan-item-top">
                  <div>
                    <strong className="loan-item-purpose">{loan.purpose}</strong>
                    <div className="loan-item-date">
                      {new Date(loan.createdAt).toLocaleDateString("de-DE")} · {loan.durationMonths} Monate
                    </div>
                  </div>
                  <span className={`badge-loan-status ${loan.status}`}>
                    {statusLabel(loan.status)}
                  </span>
                </div>
                <div className="loan-item-grid">
                  <div>
                    <span className="loan-meta-key">Gewünschter Betrag</span>
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