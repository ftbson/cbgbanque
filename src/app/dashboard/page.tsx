"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Activity {
  id: string;
  type: string;
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
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(cents / 100);
}

function statusLabel(status: string) {
  if (status === "pending") return "En attente";
  if (status === "cancelled") return "Annulée";
  return "Enregistrée";
}

export default function DashboardHomePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/dashboard")
      .then(async (response) => {
        const result: DashboardData & { message?: string } = await response.json();
        if (!response.ok) throw new Error(result.message ?? "Impossible de charger le compte.");
        if (active) setData(result);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Erreur de chargement.");
      });
    return () => { active = false; };
  }, []);

  if (error) return <p className="dashboard-home" role="alert">{error}</p>;
  if (!data) return <p className="dashboard-home" aria-live="polite">Chargement…</p>;

  return (
    <div className="dashboard-home-redesign">
      <header className="dashboard-welcome">
        <p>Votre espace personnel</p>
        <h1>Bonjour, {data.user.firstName}</h1>
      </header>

      <section className="cbg-balance-card">
        <span className="balance-account-type">Compte Personnel · {data.account.currency}</span>
        <div className="balance-huge-row">
          <p className="balance-huge-value">
            {isBalanceHidden ? "••••••" : formatMoney(data.availableBalanceCents, data.account.currency)}
          </p>
          <button
            type="button"
            onClick={() => setIsBalanceHidden((hidden) => !hidden)}
            className="balance-eye-btn"
            aria-label={isBalanceHidden ? "Afficher le solde" : "Masquer le solde"}
          >
            <i className={`fa-regular ${isBalanceHidden ? "fa-eye-slash" : "fa-eye"}`}></i>
          </button>
        </div>

        {/* Clickable IBAN badge leading to official RIB */}
        <div style={{ marginTop: "0.6rem" }}>
          <Link
            href="/dashboard/rib"
            title="Consulter mon RIB & Coordonnées bancaires"
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

      <nav className="cbg-circle-actions-row" aria-label="Actions de compte">
        <Link href="/dashboard/rib" className="circle-action-item">
          <div className="action-circle-bg"><i className="fa-solid fa-plus"></i></div>
          <span>Ajouter de l&apos;argent</span>
        </Link>
        <Link href="/dashboard/envoyer" className="circle-action-item">
          <div className="action-circle-bg"><i className="fa-solid fa-arrow-right-arrow-left"></i></div>
          <span>Virement & Retrait</span>
        </Link>
        <Link href="/dashboard/rib" className="circle-action-item">
          <div className="action-circle-bg"><i className="fa-solid fa-building-columns"></i></div>
          <span>Mon RIB</span>
        </Link>
        <Link href="/dashboard/pret" className="circle-action-item">
          <div className="action-circle-bg"><i className="fa-solid fa-hand-holding-dollar"></i></div>
          <span>Demander un prêt</span>
        </Link>
      </nav>

      {data.unreadNotifications > 0 && (
        <section className="cbg-transactions-section">
          <Link href="/dashboard/notifications" className="cbg-sublink">
            {data.unreadNotifications} notification(s) non lue(s)
          </Link>
        </section>
      )}

      <section className="cbg-transactions-section">
        {data.transactions.length > 0 ? (
          <>
            <div className="section-head-title-row">
              <h2 className="cbg-title-bold">Activité récente</h2>
              <Link href="/dashboard/activite" className="cbg-sublink">Historique complet</Link>
            </div>
            <div className="history-list-wrapper">
              {data.transactions.map((transaction) => {
                const isOutgoing = transaction.type === "withdrawal_request" || transaction.type === "vault_deposit";
                return (
                  <article key={transaction.id} className="history-item-row">
                    <div className="history-item-texts">
                      <span className="history-item-title">{transaction.description}</span>
                      <span className="history-item-sub">
                        {new Date(transaction.createdAt).toLocaleString("fr-FR")} · {statusLabel(transaction.status)}
                      </span>
                    </div>
                    <span className="history-item-amount">
                      {transaction.amountCents === 0
                        ? "—"
                        : `${isOutgoing ? "−" : "+"}${formatMoney(transaction.amountCents, transaction.currency)}`}
                    </span>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          <div className="dashboard-empty-state">
            <h2 className="cbg-title-bold">Aucune activité pour le moment</h2>
            <p>Vos opérations apparaîtront ici après leur enregistrement.</p>
            <Link href="/dashboard/activite" className="cbg-sublink">Ouvrir l&apos;historique</Link>
          </div>
        )}
      </section>

      <section className="cbg-transactions-section">
        {data.cards.length > 0 ? (
          <>
            <div className="section-head-title-row">
              <h2 className="cbg-title-bold">Ma carte bancaire Visa</h2>
              <Link href="/dashboard/carte" className="cbg-sublink">Gérer ma carte</Link>
            </div>
            {data.cards.map((card) => (
              <Link key={card.id} href="/dashboard/carte" className="discover-tile dashboard-card-reference">
                <div>
                  <strong>{card.name}</strong>
                  <span>{card.status === "frozen" ? "Carte temporairement gelée" : "Carte Visa Débit active"}</span>
                </div>
                <span style={{ fontSize: "0.85rem", color: "#60a5fa" }}>Gérer</span>
              </Link>
            ))}
          </>
        ) : (
          <div className="dashboard-empty-state">
            <h2 className="cbg-title-bold">Aucune carte active</h2>
            <p>Commandez et activez votre carte physique Visa pour vos paiements et retraits au quotidien.</p>
            <Link href="/dashboard/carte" className="cbg-sublink">Commander ma carte Visa</Link>
          </div>
        )}
      </section>

      <section className="cbg-transactions-section">
        {data.loans.length > 0 ? (
          <>
            <div className="section-head-title-row">
              <h2 className="cbg-title-bold">Mes demandes de financement</h2>
              <Link href="/dashboard/pret" className="cbg-sublink">Voir les demandes</Link>
            </div>
            {data.loans.map((loan) => (
              <article key={loan.id} className="discover-tile dashboard-data-tile">
                <div>
                  <strong>{loan.purpose}</strong>
                  <span>{formatMoney(Math.round(loan.amount * 100), data.user.currency)} · {loan.durationMonths} mois</span>
                </div>
                <span>
                  {loan.status === "approved" ? "Acceptée" : loan.status === "rejected" ? "Refusée" : "En attente"}
                </span>
              </article>
            ))}
          </>
        ) : (
          <div className="dashboard-empty-state">
            <h2 className="cbg-title-bold">Aucune demande de financement</h2>
            <p>Les demandes que vous enregistrez seront listées ici.</p>
            <Link href="/dashboard/pret" className="cbg-sublink">Enregistrer une demande</Link>
          </div>
        )}
      </section>

      <section className="cbg-budgets-section">
        {data.vaults.length > 0 ? (
          <>
            <div className="section-head-title-row">
              <h2 className="cbg-title-bold">Mes coffres d&apos;épargne</h2>
              <Link href="/dashboard/epargne" className="cbg-sublink">Gérer</Link>
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
            <h2 className="cbg-title-bold">Aucun coffre d&apos;épargne</h2>
            <p>Créez un coffre avec votre objectif pour commencer à suivre votre épargne.</p>
            <Link href="/dashboard/epargne" className="cbg-sublink">Créer un coffre</Link>
          </div>
        )}
      </section>
    </div>
  );
}
