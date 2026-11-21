"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

interface CardReference {
  id: string;
  name: string;
  reference: string;
  status?: string;
}

interface Vault {
  id: string;
  name: string;
  targetCents: number;
  currentCents: number;
}

interface LoanRequest {
  id: string;
  amount: number;
  durationMonths: number;
  purpose: string;
  status: string;
}

interface DashboardData {
  user: { firstName: string; lastName?: string; currency: string };
  account: { currency: string; balanceCents: number; iban?: string };
  availableBalanceCents: number;
  transactions: Activity[];
  cards: CardReference[];
  vaults: Vault[];
  loans: LoanRequest[];
  unreadNotifications: number;
}

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency }).format(cents / 100);
}

function statusLabel(status: string) {
  if (status === "pending") return "Ausstehend";
  if (status === "cancelled") return "Storniert";
  return "Erfasst";
}

export default function DashboardHomePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [trackingTransferId, setTrackingTransferId] = useState<string | null>(null);

  const loadDashboard = () => {
    fetch("/DE/api/dashboard")
      .then(async (response) => {
        const result: DashboardData & { message?: string } = await response.json();
        if (response.ok) {
          setData(result);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    let active = true;
    fetch("/DE/api/dashboard")
      .then(async (response) => {
        const result: DashboardData & { message?: string } = await response.json();
        if (!response.ok) throw new Error(result.message ?? "Konto konnte nicht geladen werden.");
        if (active) setData(result);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Ladefehler.");
      });
    return () => { active = false; };
  }, []);

  if (error) return <p className="dashboard-home" role="alert">{error}</p>;
  if (!data) return <p className="dashboard-home" aria-live="polite">Laden…</p>;

  return (
    <div className="dashboard-home-redesign">
      <header className="dashboard-welcome">
        <p>Ihr persönlicher Bereich</p>
        <h1>Hallo, {data.user.firstName}</h1>
      </header>

      <section className="cbg-balance-card">
        <span className="balance-account-type">Persönliches Konto · {data.account.currency}</span>
        <div className="balance-huge-row">
          <p className="balance-huge-value">
            {isBalanceHidden ? "••••••" : formatMoney(data.availableBalanceCents, data.account.currency)}
          </p>
          <button
            type="button"
            onClick={() => setIsBalanceHidden((hidden) => !hidden)}
            className="balance-eye-btn"
            aria-label={isBalanceHidden ? "Saldo anzeigen" : "Saldo ausblenden"}
          >
            <i className={`fa-regular ${isBalanceHidden ? "fa-eye-slash" : "fa-eye"}`}></i>
          </button>
        </div>

        {/* Clickable IBAN badge leading to official RIB */}
        <div style={{ marginTop: "0.6rem" }}>
          <Link
            href="/DE/dashboard/rib"
            title="Mein RIB & Bankverbindung anzeigen"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.85)",
              textDecoration: "none",
              background: "rgba(255,255,255,0.06)",
              padding: "0.4rem 0.9rem",
              borderRadius: "100px",
              border: "1px solid rgba(255,255,255,0.12)",
              transition: "all 0.2s ease",
            }}
          >
            <i className="fa-solid fa-house" style={{ fontSize: "0.75rem", color: "#60a5fa" }}></i>
            <span style={{ fontFamily: "monospace", letterSpacing: "0.5px" }}>{data.account.iban}</span>
            <i className="fa-solid fa-chevron-right" style={{ fontSize: "0.65rem", opacity: 0.6 }}></i>
          </Link>
        </div>
      </section>

      <nav className="cbg-circle-actions-row" aria-label="Kontoaktionen">
        <Link href="/DE/dashboard/rib" className="circle-action-item">
          <div className="action-circle-bg"><i className="fa-solid fa-plus"></i></div>
          <span>Geld hinzufügen</span>
        </Link>
        <Link href="/DE/dashboard/envoyer" className="circle-action-item">
          <div className="action-circle-bg"><i className="fa-solid fa-arrow-right-arrow-left"></i></div>
          <span>Überweisung & Abhebung</span>
        </Link>
        <Link href="/DE/dashboard/rib" className="circle-action-item">
          <div className="action-circle-bg"><i className="fa-solid fa-building-columns"></i></div>
          <span>Mein RIB</span>
        </Link>
        <Link href="/DE/dashboard/pret" className="circle-action-item">
          <div className="action-circle-bg"><i className="fa-solid fa-hand-holding-dollar"></i></div>
          <span>Kredit beantragen</span>
        </Link>
      </nav>

      {data.unreadNotifications > 0 && (
        <section className="cbg-transactions-section">
          <Link href="/DE/dashboard/notifications" className="cbg-sublink">
            {data.unreadNotifications} ungelesene Benachrichtigung(en)
          </Link>
        </section>
      )}

      <section className="cbg-transactions-section">
        {data.transactions.length > 0 ? (
          <>
            <div className="section-head-title-row">
              <h2 className="cbg-title-bold">Letzte Aktivitäten</h2>
              <Link href="/DE/dashboard/activite" className="cbg-sublink">Vollständiger Verlauf</Link>
            </div>
            <div className="history-list-wrapper">
              {data.transactions.map((transaction) => {
                const isOutgoing = transaction.type === "withdrawal_request" || transaction.type === "vault_deposit";
                const isPendingWithdrawal = transaction.type === "withdrawal_request" && transaction.status === "pending";

                return (
                  <article
                    key={transaction.id}
                    className="history-item-row"
                    onClick={isPendingWithdrawal ? () => setTrackingTransferId(transaction.relatedId || transaction.id) : undefined}
                    style={isPendingWithdrawal ? { cursor: "pointer" } : undefined}
                  >
                    <div className="history-item-texts">
                      <span className="history-item-title">{transaction.description}</span>
                      <span className="history-item-sub">
                        {new Date(transaction.createdAt).toLocaleString("de-DE")} · {statusLabel(transaction.status)}
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.35rem" }}>
                      <span className="history-item-amount">
                        {transaction.amountCents === 0
                          ? "—"
                          : `${isOutgoing ? "−" : "+"}${formatMoney(transaction.amountCents, transaction.currency)}`}
                      </span>

                      {isPendingWithdrawal && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTrackingTransferId(transaction.relatedId || transaction.id);
                          }}
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
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          <div className="dashboard-empty-state">
            <h2 className="cbg-title-bold">Noch keine Aktivitäten</h2>
            <p>Ihre Transaktionen erscheinen hier nach der Registrierung.</p>
            <Link href="/DE/dashboard/activite" className="cbg-sublink">Verlauf öffnen</Link>
          </div>
        )}
      </section>

      <section className="cbg-transactions-section">
        {data.cards.length > 0 ? (
          <>
            <div className="section-head-title-row">
              <h2 className="cbg-title-bold">Meine Visa-Debitkarte</h2>
              <Link href="/DE/dashboard/carte" className="cbg-sublink">Karte verwalten</Link>
            </div>
            {data.cards.map((card) => (
              <Link key={card.id} href="/DE/dashboard/carte" className="discover-tile dashboard-card-reference">
                <div>
                  <strong>{card.name}</strong>
                  <span>{card.status === "frozen" ? "Karte vorübergehend gesperrt" : "Visa Debit Karte aktiv"}</span>
                </div>
                <span style={{ fontSize: "0.85rem", color: "#60a5fa" }}>Verwalten</span>
              </Link>
            ))}
          </>
        ) : (
          <div className="dashboard-empty-state">
            <h2 className="cbg-title-bold">Keine aktive Karte</h2>
            <p>Bestellen und aktivieren Sie Ihre physische Visa-Karte für tägliche Zahlungen und Abhebungen.</p>
            <Link href="/DE/dashboard/carte" className="cbg-sublink">Meine Visa-Karte bestellen</Link>
          </div>
        )}
      </section>

      <section className="cbg-transactions-section">
        {data.loans.length > 0 ? (
          <>
            <div className="section-head-title-row">
              <h2 className="cbg-title-bold">Meine Finanzierungsanfragen</h2>
              <Link href="/DE/dashboard/pret" className="cbg-sublink">Anfragen anzeigen</Link>
            </div>
            {data.loans.map((loan) => (
              <article key={loan.id} className="discover-tile dashboard-data-tile">
                <div>
                  <strong>{loan.purpose}</strong>
                  <span>{formatMoney(Math.round(loan.amount * 100), data.user.currency)} · {loan.durationMonths} Monate</span>
                </div>
                <span>
                  {loan.status === "approved" ? "Genehmigt" : loan.status === "rejected" ? "Abgelehnt" : "Ausstehend"}
                </span>
              </article>
            ))}
          </>
        ) : (
          <div className="dashboard-empty-state">
            <h2 className="cbg-title-bold">Keine Finanzierungsanfragen</h2>
            <p>Ihre registrierten Anfragen werden hier aufgeführt.</p>
            <Link href="/DE/dashboard/pret" className="cbg-sublink">Anfrage registrieren</Link>
          </div>
        )}
      </section>

      <section className="cbg-budgets-section">
        {data.vaults.length > 0 ? (
          <>
            <div className="section-head-title-row">
              <h2 className="cbg-title-bold">Meine Sparziele</h2>
              <Link href="/DE/dashboard/epargne" className="cbg-sublink">Verwalten</Link>
            </div>
            <div className="budget-gauges-grid">
              {data.vaults.map((vault) => {
                const progress = vault.targetCents > 0
                  ? Math.min(100, Math.round(vault.currentCents / vault.targetCents * 100))
                  : 0;
                return (
                  <article key={vault.id} className="gauge-card">
                    <strong className="gauge-name">{vault.name}</strong>
                    <span className="gauge-ratio">
                      {formatMoney(vault.currentCents, data.account.currency)} / {formatMoney(vault.targetCents, data.account.currency)}
                    </span>
                    <span className="gauge-percent">{progress}%</span>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          <div className="dashboard-empty-state">
            <h2 className="cbg-title-bold">Keine Sparziele</h2>
            <p>Erstellen Sie ein Ziel-Tresor, um Ihre Ersparnisse zu verfolgen.</p>
            <Link href="/DE/dashboard/epargne" className="cbg-sublink">Tresor erstellen</Link>
          </div>
        )}
      </section>

      {trackingTransferId && (
        <TransferTrackingModal
          transferId={trackingTransferId}
          onClose={() => setTrackingTransferId(null)}
          onSuccessOrHalted={() => loadDashboard()}
        />
      )}
    </div>
  );
}