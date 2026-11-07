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
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(cents / 100);
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
        if (!response.ok) throw new Error(result.message ?? "Impossible de charger les analyses.");
        if (active) setData(result);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Erreur de chargement.");
      });
    return () => { active = false; };
  }, [period]);

  return (
    <div className="analyse-page">
      <div className="analyse-container">
        <div className="analyse-header">
          <div className="analyse-title-group">
            <h1 className="analyse-main-title">Activité des coffres</h1>
            <span className="analyse-top-sub">Mouvements issus de votre compte</span>
          </div>
        </div>

        <div className="analyse-pills-row">
          {(["7days", "month", "year"] as const).map((value) => (
            <button key={value} className={`pill-period ${period === value ? "active" : ""}`} onClick={() => setPeriod(value)}>
              {value === "7days" ? "7 jours" : value === "month" ? "Ce mois" : "Cette année"}
            </button>
          ))}
        </div>

        {error && <p role="alert">{error}</p>}
        {!data ? <p>Chargement…</p> : (
          <>
            <div className="analyse-stats-grid">
              <div className="stat-box-card">
                <span className="stat-label-out">Versements dans les coffres</span>
                <span className="stat-val">{formatMoney(data.vaultDepositsCents, data.currency)}</span>
              </div>
              <div className="stat-box-card">
                <span className="stat-label-in">Retraits des coffres</span>
                <span className="stat-val">{formatMoney(data.vaultWithdrawalsCents, data.currency)}</span>
              </div>
            </div>
            <section className="analyse-card-block">
              <h2 className="block-inner-title">Demandes de retrait en attente</h2>
              <p>{formatMoney(data.pendingWithdrawalsCents, data.currency)}</p>
              <p role="note">Les demandes en attente ne sont pas des virements exécutés.</p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
