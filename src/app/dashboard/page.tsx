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

interface DashboardData {
  user: { firstName: string; currency: string };
  availableBalanceCents: number;
  transactions: Activity[];
  cards: { id: string; name: string; reference: string; status: string }[];
  unreadNotifications: number;
}

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(cents / 100);
}

export default function DashboardHomePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message ?? "Impossible de charger le compte.");
        setData(result);
      })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Erreur de chargement."));
  }, []);

  if (error) return <p className="dashboard-home" role="alert">{error}</p>;
  if (!data) return <p className="dashboard-home" aria-live="polite">Chargement du compte…</p>;

  return (
    <div className="dashboard-home">
      <section className="balance-section">
        <span className="account-type-label">Compte personnel · {data.user.currency}</span>
        <p>Bonjour {data.user.firstName}</p>
        <div className="main-balance-display">
          <h1 className="balance-value">
            {isBalanceHidden ? "••••••" : formatMoney(data.availableBalanceCents, data.user.currency)}
          </h1>
          <button
            onClick={() => setIsBalanceHidden((hidden) => !hidden)}
            className="toggle-visibility-btn"
            aria-label={isBalanceHidden ? "Afficher le solde" : "Masquer le solde"}
          >
            <i className={`fa-regular ${isBalanceHidden ? "fa-eye-slash" : "fa-eye"}`}></i>
          </button>
        </div>
        <span className="account-type-label">Solde disponible (hors demandes en attente)</span>
      </section>

      <section className="quick-actions-grid" aria-label="Actions du compte">
        <Link href="/dashboard/envoyer" className="quick-action-item">
          <div className="qa-icon-circle"><i className="fa-solid fa-arrow-up-right-from-square"></i></div>
          <span>Demander un retrait</span>
        </Link>
        <Link href="/dashboard/carte" className="quick-action-item">
          <div className="qa-icon-circle"><i className="fa-regular fa-credit-card"></i></div>
          <span>Mes cartes</span>
        </Link>
        <Link href="/dashboard/epargne" className="quick-action-item">
          <div className="qa-icon-circle"><i className="fa-solid fa-piggy-bank"></i></div>
          <span>Mes coffres</span>
        </Link>
      </section>

      <section className="dashboard-section">
        <div className="section-header-row">
          <h3 className="section-title">Activité récente</h3>
          <Link href="/dashboard/activite" className="section-link-action">Tout voir</Link>
        </div>
        {data.transactions.length === 0 ? (
          <div className="empty-transaction-card">
            <span className="empty-title">Aucune activité</span>
            <span className="empty-sub">Les opérations de votre compte apparaîtront ici.</span>
          </div>
        ) : (
          <div className="history-list-wrapper">
            {data.transactions.map((activity) => (
              <div key={activity.id} className="history-item-row">
                <div className="history-item-texts">
                  <span className="history-item-title">{activity.description}</span>
                  <span className="history-item-sub">
                    {new Date(activity.createdAt).toLocaleString("fr-FR")} · {activity.status}
                  </span>
                </div>
                <span className="history-item-amount">
                  {activity.amountCents
                    ? formatMoney(activity.type === "vault_withdrawal" ? activity.amountCents : -activity.amountCents, activity.currency)
                    : "—"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <div className="section-header-row">
          <h3 className="section-title">Cartes de démonstration</h3>
          <Link href="/dashboard/carte" className="section-link-action">Gérer</Link>
        </div>
        {data.cards.length === 0 ? (
          <div className="empty-transaction-card">
            <span className="empty-title">Aucune carte</span>
            <span className="empty-sub">Aucune carte de démonstration n&apos;a été créée.</span>
          </div>
        ) : data.cards.map((card) => (
          <div key={card.id} className="virtual-card-item">
            <div className="vc-texts">
              <span className="vc-name">{card.name}</span>
              <span className="vc-num">{card.reference}</span>
            </div>
            <span className="vc-tag">{card.status === "frozen" ? "Gelée" : "Démo"}</span>
          </div>
        ))}
      </section>

      <Link href="/dashboard/notifications" className="section-link-action">
        Notifications ({data.unreadNotifications} non lue{data.unreadNotifications === 1 ? "" : "s"})
      </Link>
    </div>
  );
}
