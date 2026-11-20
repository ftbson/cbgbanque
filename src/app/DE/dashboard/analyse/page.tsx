"use client";

import { useEffect, useState } from "react";

type Period = "7days" | "month" | "year";

interface AnalyticsData {
  currency: string;
  vaultDepositsCents: number;
  vaultWithdrawalsCents: number;
  pendingWithdrawalsCents: number;
  message?: string;
}

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency }).format(cents / 100);
}

export default function AnalysePage() {
  const [period, setPeriod] = useState<Period>("month");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`/api/dashboard/analytics?period=${period}`)
      .then(async (response) => {
        const result: AnalyticsData = await response.json();
        if (!response.ok) throw new Error(result.message ?? "Analysen konnten nicht geladen werden.");
        if (active) setData(result);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Ladefehler.");
      });
    return () => { active = false; };
  }, [period]);

  return (
    <div className="analyse-page">
      <div className="analyse-container">
        <div className="analyse-header">
          <div className="analyse-title-group">
            <h1 className="analyse-main-title">Tresor-Aktivität</h1>
            <span className="analyse-top-sub">Bewegungen von Ihrem Konto</span>
          </div>
        </div>

        <div className="analyse-pills-row">
          {(["7days", "month", "year"] as const).map((value) => (
            <button key={value} className={`pill-period ${period === value ? "active" : ""}`} onClick={() => setPeriod(value)}>
              {value === "7days" ? "7 Tage" : value === "month" ? "Diesen Monat" : "Dieses Jahr"}
            </button>
          ))}
        </div>

        {error && <p role="alert">{error}</p>}
        {!data ? <p>Wird geladen…</p> : (
          <>
            <div className="analyse-stats-grid">
              <div className="stat-box-card">
                <span className="stat-label-out">Einzahlungen in Tresore</span>
                <span className="stat-val">{formatMoney(data.vaultDepositsCents, data.currency)}</span>
              </div>
              <div className="stat-box-card">
                <span className="stat-label-in">Abhebungen aus Tresoren</span>
                <span className="stat-val">{formatMoney(data.vaultWithdrawalsCents, data.currency)}</span>
              </div>
            </div>
            <section className="analyse-card-block">
              <h2 className="block-inner-title">Ausstehende Abhebungsanträge</h2>
              <p>{formatMoney(data.pendingWithdrawalsCents, data.currency)}</p>
              <p role="note">Ausstehende Anträge sind keine ausgeführten Überweisungen.</p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}