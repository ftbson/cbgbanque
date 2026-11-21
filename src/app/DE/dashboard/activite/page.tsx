"use client";

import { useEffect, useMemo, useState } from "react";
import TransferTrackingModal from "@/components/TransferTrackingModal";

interface Activity {
  id: string;
  type: string;
  relatedId?: string;
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
  const [trackingTransferId, setTrackingTransferId] = useState<string | null>(null);

  const loadTransactions = async (offset = 0, append = false) => {
    const response = await fetch(`/api/dashboard/transactions?offset=${offset}`);
    const data: ActivityResponse = await response.json();
    if (!response.ok) throw new Error(data.message ?? "Verlauf konnte nicht geladen werden.");
    setTransactions((current) => append ? [...current, ...(data.transactions ?? [])] : data.transactions ?? []);
    setHasMore(data.hasMore ?? false);
  };

  useEffect(() => {
    let active = true;
    fetch("/api/dashboard/transactions?offset=0")
      .then(async (response) => {
        const data: ActivityResponse = await response.json();
        if (!response.ok) throw new Error(data.message ?? "Verlauf konnte nicht geladen werden.");
        if (active) {
          setTransactions(data.transactions ?? []);
          setHasMore(data.hasMore ?? false);
        }
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Ladefehler.");
      });
    return () => { active = false; };
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      await loadTransactions(transactions.length, true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Ladefehler.");
    } finally {
      setLoadingMore(false);
    }
  };

  const cancelWithdrawal = async (id: string) => {
    setError("");
    try {
      const response = await fetch(`/api/dashboard/transactions/${id}`, { method: "DELETE" });
      const data: { message?: string } = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Anfrage konnte nicht storniert werden.");
      setTransactions((current) => current.map((item) =>
        item.id === id ? { ...item, status: "cancelled" } : item,
      ));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Fehler beim Stornieren.");
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
            <h1 className="history-main-title">Verlauf</h1>
            <span className="history-count-badge">{filtered.length} Vorgang/Vorgänge</span>
          </div>
        </div>
        <div className="history-search-box">
          <label className="sr-only" htmlFor="activity-search">Vorgang suchen</label>
          <input
            id="activity-search"
            type="search"
            placeholder="Vorgang suchen"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="history-search-input"
          />
        </div>
        <div className="history-pills-row">
          {(["all", "pending", "completed"] as const).map((value) => (
            <button key={value} className={`pill-filter ${filter === value ? "active" : ""}`} onClick={() => setFilter(value)}>
              {value === "all" ? "Alle" : value === "pending" ? "Ausstehend" : "Abgeschlossen"}
            </button>
          ))}
        </div>

        {error ? <p role="alert">{error}</p> : filtered.length === 0 ? (
          <div className="history-empty-card">
            <div className="empty-icon-circle"><i className="fa-solid fa-bars-staggered"></i></div>
            <p className="empty-state-text">Keine Vorgänge erfasst.</p>
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
                        {new Date(item.createdAt).toLocaleString("de-DE")} · {item.status === "pending" ? "Ausstehend" : "Erfasst"}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.35rem" }}>
                    <span className="history-item-amount">
                      {item.amountCents === 0
                        ? "—"
                        : new Intl.NumberFormat("de-DE", { style: "currency", currency: item.currency }).format(signedCents / 100)}
                    </span>
                    {isWithdrawal && item.status === "pending" && (
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button
                          type="button"
                          onClick={() => setTrackingTransferId(item.relatedId || item.id)}
                          style={{
                            background: "linear-gradient(135deg, rgba(234, 179, 8, 0.25), rgba(245, 158, 11, 0.35))",
                            color: "#fbbf24",
                            border: "1px solid rgba(234, 179, 8, 0.6)",
                            borderRadius: "16px",
                            padding: "0.2rem 0.6rem",
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            boxShadow: "0 0 10px rgba(234, 179, 8, 0.25)",
                          }}
                          title="Klicken, um den Überweisungsstatus zu verfolgen"
                        >
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fbbf24" }}></span>
                          Ausstehend
                        </button>
                        <button type="button" className="btn-table-details" onClick={() => void cancelWithdrawal(item.id)}>
                          Stornieren
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
        {hasMore && (
          <button type="button" className="btn-table-details" onClick={() => void loadMore()} disabled={loadingMore}>
            {loadingMore ? "Wird geladen…" : "Mehr Vorgänge laden"}
          </button>
        )}
      </div>

      {trackingTransferId && (
        <TransferTrackingModal
          transferId={trackingTransferId}
          onClose={() => setTrackingTransferId(null)}
          onSuccessOrHalted={() => {
            loadTransactions(0, false).catch(() => {});
          }}
        />
      )}
    </div>
  );
}