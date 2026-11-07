"use client";

import { useEffect, useMemo, useState } from "react";

interface Activity {
  id: string;
  type: string;
  description: string;
  amountCents: number;
  currency: string;
  status: string;
  createdAt: string;
}

interface ActivityResponse {
  transactions: Activity[];
  hasMore?: boolean;
  message?: string;
}

export default function ActivitePage() {
  const [transactions, setTransactions] = useState<Activity[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const loadTransactions = async (offset = 0, append = false) => {
    const response = await fetch(`/api/dashboard/transactions?offset=${offset}`);
    const data: ActivityResponse = await response.json();
    if (!response.ok) throw new Error(data.message ?? "Impossible de charger l'historique.");
    setTransactions((current) => append ? [...current, ...(data.transactions ?? [])] : data.transactions ?? []);
    setHasMore(data.hasMore ?? false);
  };

  useEffect(() => {
    let active = true;
    fetch("/api/dashboard/transactions?offset=0")
      .then(async (response) => {
        const data: ActivityResponse = await response.json();
        if (!response.ok) throw new Error(data.message ?? "Impossible de charger l'historique.");
        if (active) {
          setTransactions(data.transactions ?? []);
          setHasMore(data.hasMore ?? false);
        }
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Erreur de chargement.");
      });
    return () => { active = false; };
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      await loadTransactions(transactions.length, true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Erreur de chargement.");
    } finally {
      setLoadingMore(false);
    }
  };

  const cancelWithdrawal = async (id: string) => {
    setError("");
    try {
      const response = await fetch(`/api/dashboard/transactions/${id}`, { method: "DELETE" });
      const data: { message?: string } = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Impossible d'annuler la demande.");
      setTransactions((current) => current.map((item) =>
        item.id === id ? { ...item, status: "cancelled" } : item,
      ));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Erreur lors de l'annulation.");
    }
  };

  const filtered = useMemo(() => transactions.filter((item) => {
    const matchesStatus = filter === "all" || item.status === filter;
    return matchesStatus && item.description.toLowerCase().includes(search.toLowerCase());
  }), [filter, search, transactions]);

  return (
    <div className="history-page">
      <div className="history-container">
        <div className="history-header">
          <div className="history-title-group">
            <h1 className="history-main-title">Historique</h1>
            <span className="history-count-badge">{filtered.length} opération(s)</span>
          </div>
        </div>
        <div className="history-search-box">
          <label className="sr-only" htmlFor="activity-search">Rechercher une opération</label>
          <input
            id="activity-search"
            type="search"
            placeholder="Rechercher une opération"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="history-search-input"
          />
        </div>
        <div className="history-pills-row">
          {(["all", "pending", "completed"] as const).map((value) => (
            <button key={value} className={`pill-filter ${filter === value ? "active" : ""}`} onClick={() => setFilter(value)}>
              {value === "all" ? "Tout" : value === "pending" ? "En attente" : "Terminées"}
            </button>
          ))}
        </div>

        {error ? <p role="alert">{error}</p> : filtered.length === 0 ? (
          <div className="history-empty-card">
            <div className="empty-icon-circle"><i className="fa-solid fa-bars-staggered"></i></div>
            <p className="empty-state-text">Aucune opération enregistrée.</p>
          </div>
        ) : (
          <div className="history-list-wrapper">
            {filtered.map((item) => {
              const isWithdrawal = item.type === "withdrawal_request";
              const isOutgoing = isWithdrawal || item.type === "vault_deposit";
              const signedCents = isOutgoing ? -item.amountCents : item.amountCents;
              return (
                <article key={item.id} className="history-item-row">
                  <div className="history-item-left">
                    <div className={`history-item-icon ${item.status === "pending" ? "icon-amber" : "icon-dark"}`}>
                      <i className={`fa-solid ${isWithdrawal ? "fa-arrow-up-right-from-square" : "fa-circle-check"}`}></i>
                    </div>
                    <div className="history-item-texts">
                      <span className="history-item-title">{item.description}</span>
                      <span className="history-item-sub">
                        {new Date(item.createdAt).toLocaleString("fr-FR")} · {item.status === "pending" ? "En attente" : "Enregistrée"}
                      </span>
                    </div>
                  </div>
                  <span className="history-item-amount">
                    {item.amountCents === 0
                      ? "—"
                      : new Intl.NumberFormat("fr-FR", { style: "currency", currency: item.currency }).format(signedCents / 100)}
                  </span>
                  {isWithdrawal && item.status === "pending" && (
                    <button type="button" className="btn-table-details" onClick={() => void cancelWithdrawal(item.id)}>
                      Annuler la demande
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}
        {hasMore && (
          <button type="button" className="btn-table-details" onClick={() => void loadMore()} disabled={loadingMore}>
            {loadingMore ? "Chargement…" : "Charger plus d'opérations"}
          </button>
        )}
      </div>
    </div>
  );
}
