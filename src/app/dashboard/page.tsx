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

interface Card {
  id: string;
  name: string;
  reference: string;
  status: string;
}

interface Vault {
  id: string;
  name: string;
  targetCents: number;
  currentCents: number;
}

interface Loan {
  id: string;
  amount: number;
  durationMonths: number;
  monthlyPayment: number;
  purpose: string;
  status: string;
  createdAt: string;
}

interface DashboardData {
  user: {
    id: string;
    firstName: string;
    lastName?: string;
    currency: string;
  };
  account: {
    currency: string;
    balanceCents: number;
    reservedCents: number;
    iban: string;
    bic: string;
  };
  availableBalanceCents: number;
  monthSpentCents: number;
  monthReceivedCents: number;
  transactions: Activity[];
  cards: Card[];
  vaults: Vault[];
  loans: Loan[];
  unreadNotifications: number;
}

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: currency || "EUR" }).format(cents / 100);
}

export default function DashboardHomePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [showRequestMoneyModal, setShowRequestMoneyModal] = useState(false);
  const [copiedIban, setCopiedIban] = useState(false);
  const [requestAmount, setRequestAmount] = useState("");
  const [requestReason, setRequestReason] = useState("");
  const [sharedToast, setSharedToast] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message ?? "Impossible de charger le compte.");
        setData(result);
      })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Erreur de chargement."));
  }, []);

  const copyIban = () => {
    if (!data?.account.iban) return;
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(data.account.iban.replace(/\s/g, ""));
      setCopiedIban(true);
      setTimeout(() => setCopiedIban(false), 2000);
    }
  };

  const handleShareCoordinates = async () => {
    if (!data) return;
    const textToShare = `Coordonnées bancaires CBG Banque Finance :
Titulaire : ${data.user.firstName} ${data.user.lastName || ""}
IBAN : ${data.account.iban}
BIC/SWIFT : ${data.account.bic}
Banque : CBG BANQUE FINANCE${requestAmount ? `\nMontant demandé : ${requestAmount} €` : ""}${requestReason ? `\nMotif : ${requestReason}` : ""}`;

    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Mes coordonnées bancaires CBG",
          text: textToShare,
        });
        return;
      } catch {
        // Fallback to copy
      }
    }

    navigator.clipboard.writeText(textToShare);
    setSharedToast(true);
    setTimeout(() => setSharedToast(false), 2500);
  };

  if (error) return <p className="dashboard-home" role="alert">{error}</p>;
  if (!data) return <p className="dashboard-home" aria-live="polite">Chargement de vos données réelles…</p>;

  const fullName = `${data.user.firstName} ${data.user.lastName || ""}`.trim().toUpperCase();
  const realIban = data.account.iban;
  const realBic = data.account.bic || "C23QBEBB";

  return (
    <div className="dashboard-home-redesign">
      
      {/* ================= SECTION 1: VRAI SOLDE & IBAN DE L'UTILISATEUR ================= */}
      <section className="cbg-balance-card">
        <span className="balance-account-type">Compte personnel · {data.account.currency}</span>

        <div className="balance-huge-row">
          <h1 className="balance-huge-value">
            {isBalanceHidden ? "••••••" : formatMoney(data.availableBalanceCents, data.account.currency)}
          </h1>
          <button
            onClick={() => setIsBalanceHidden((hidden) => !hidden)}
            className="balance-eye-btn"
            aria-label={isBalanceHidden ? "Afficher le solde" : "Masquer le solde"}
          >
            <i className={`fa-regular ${isBalanceHidden ? "fa-eye-slash" : "fa-eye"}`}></i>
          </button>
        </div>

        {/* Real IBAN stored in the DB */}
        <button onClick={copyIban} className="iban-clickable-pill" title="Cliquez pour copier votre IBAN">
          <i className="fa-solid fa-house-chimney"></i>
          <span>{realIban}</span>
          {copiedIban && <span className="copied-tag">Copié !</span>}
        </button>

        {/* Actions rapides compte */}
        <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
          <button className="pill-accounts-wallets" onClick={() => setShowRequestMoneyModal(true)}>
            <i className="fa-solid fa-qrcode" style={{ marginRight: "0.4rem" }}></i> Mon RIB & Coordonnées
          </button>
          <Link href="/dashboard/parametres" className="pill-accounts-wallets" style={{ textDecoration: "none" }}>
            <i className="fa-solid fa-gear" style={{ marginRight: "0.4rem" }}></i> Paramètres
          </Link>
        </div>
      </section>

      {/* ================= SECTION 2: 4 BOUTONS D'ACTIONS FONCTIONNELS ================= */}
      <section className="cbg-circle-actions-row">
        <button onClick={() => setShowRequestMoneyModal(true)} className="circle-action-item">
          <div className="action-circle-bg">
            <i className="fa-solid fa-plus"></i>
          </div>
          <span>Recharger</span>
        </button>

        <Link href="/dashboard/envoyer" className="circle-action-item">
          <div className="action-circle-bg">
            <i className="fa-solid fa-arrow-right-arrow-left"></i>
          </div>
          <span>Virement</span>
        </Link>

        <Link href="/dashboard/pret" className="circle-action-item">
          <div className="action-circle-bg">
            <i className="fa-solid fa-hand-holding-dollar"></i>
          </div>
          <span>Demander prêt</span>
        </Link>

        <Link href="/dashboard/parametres" className="circle-action-item">
          <div className="action-circle-bg">
            <i className="fa-solid fa-sliders"></i>
          </div>
          <span>Paramètres</span>
        </Link>
      </section>

      {/* ================= SECTION 3: VRAIS FLUX MENSUELS DE L'UTILISATEUR ================= */}
      <div className="cbg-metrics-stack">
        <div className="metric-box-card">
          <span className="mb-label">Activité financière réelle ce mois</span>
          <div className="mb-value-row">
            <div>
              <span style={{ fontSize: "0.75rem", color: "#94a3b8", display: "block" }}>Dépenses</span>
              <strong>{formatMoney(data.monthSpentCents, data.account.currency)}</strong>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "0.75rem", color: "#94a3b8", display: "block" }}>Entrées</span>
              <span className="mb-received">+{formatMoney(data.monthReceivedCents, data.account.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SECTION 4: VRAIES CARTES DE L'UTILISATEUR ================= */}
      <section className="cbg-transactions-section">
        <div className="section-head-title-row">
          <h3 className="cbg-title-bold">Mes Cartes ({data.cards.length})</h3>
          <Link href="/dashboard/carte" className="cbg-sublink">Gérer les cartes</Link>
        </div>

        {data.cards.length === 0 ? (
          <div className="empty-transaction-box-clean">
            <strong>Vous n&apos;avez pas encore créé de carte</strong>
            <span>Activez une carte virtuelle instantanément pour vos achats.</span>
            <div style={{ marginTop: "0.75rem" }}>
              <Link href="/dashboard/carte" className="btn-sheet-primary-blue" style={{ display: "inline-flex", padding: "0.6rem 1.25rem", textDecoration: "none", fontSize: "0.85rem" }}>
                <i className="fa-solid fa-plus"></i> Créer ma première carte
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {data.cards.map((card) => (
              <Link key={card.id} href="/dashboard/carte" className="discover-tile" style={{ justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <i className="fa-regular fa-credit-card" style={{ fontSize: "1.4rem" }}></i>
                  <div>
                    <strong style={{ display: "block", fontSize: "0.95rem" }}>{card.name}</strong>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Réf : {card.reference}</span>
                  </div>
                </div>
                <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem", borderRadius: "999px", background: card.status === "frozen" ? "rgba(245,158,11,0.2)" : "rgba(34,197,94,0.2)", color: card.status === "frozen" ? "#fbbf24" : "#22c55e", fontWeight: 700 }}>
                  {card.status === "frozen" ? "Gelée" : "Active"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ================= SECTION 5: VRAIS PRÊTS DE L'UTILISATEUR ================= */}
      <section className="cbg-transactions-section">
        <div className="section-head-title-row">
          <h3 className="cbg-title-bold">Mes Prêts & Financements ({data.loans.length})</h3>
          <Link href="/dashboard/pret" className="cbg-sublink">Faire une simulation</Link>
        </div>

        {data.loans.length === 0 ? (
          <div className="empty-transaction-box-clean">
            <strong>Aucun prêt en cours</strong>
            <span>Besoin d&apos;un financement pour votre projet ? Obtenez une réponse sous 24h.</span>
            <div style={{ marginTop: "0.75rem" }}>
              <Link href="/dashboard/pret" className="btn-sheet-primary-blue" style={{ display: "inline-flex", padding: "0.6rem 1.25rem", textDecoration: "none", fontSize: "0.85rem" }}>
                <i className="fa-solid fa-hand-holding-dollar"></i> Demander un prêt
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {data.loans.map((loan) => (
              <div key={loan.id} className="discover-tile" style={{ justifyContent: "space-between" }}>
                <div>
                  <strong style={{ display: "block", fontSize: "0.95rem" }}>{loan.purpose}</strong>
                  <span style={{ fontSize: "0.78rem", color: "#60a5fa" }}>
                    {formatMoney(loan.amount * 100, "EUR")} sur {loan.durationMonths} mois
                  </span>
                </div>
                <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem", borderRadius: "999px", background: loan.status === "approved" ? "rgba(34,197,94,0.2)" : loan.status === "rejected" ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.2)", color: loan.status === "approved" ? "#22c55e" : loan.status === "rejected" ? "#ef4444" : "#fbbf24", fontWeight: 700 }}>
                  {loan.status === "approved" ? "✓ Accordé" : loan.status === "rejected" ? "✕ Refusé" : "⏳ En étude"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= SECTION 6: VRAIS COFFRES D'ÉPARGNE DE L'UTILISATEUR ================= */}
      <section className="cbg-budgets-section">
        <div className="section-head-title-row">
          <h3 className="cbg-title-bold">Mes Coffres d&apos;épargne ({data.vaults.length})</h3>
          <Link href="/dashboard/epargne" className="cbg-sublink">Gérer</Link>
        </div>

        {data.vaults.length === 0 ? (
          <div className="empty-transaction-box-clean">
            <strong>Aucun coffre d&apos;épargne créé</strong>
            <span>Mettez de l&apos;argent de côté pour vos vacances, imprévus ou projets.</span>
            <div style={{ marginTop: "0.75rem" }}>
              <Link href="/dashboard/epargne" className="btn-sheet-secondary-gray" style={{ display: "inline-flex", padding: "0.6rem 1.25rem", textDecoration: "none", fontSize: "0.85rem" }}>
                <i className="fa-solid fa-piggy-bank"></i> Créer un coffre
              </Link>
            </div>
          </div>
        ) : (
          <div className="budget-gauges-grid">
            {data.vaults.map((vault) => {
              const pct = vault.targetCents > 0 ? Math.min(100, Math.round((vault.currentCents / vault.targetCents) * 100)) : 0;
              return (
                <div key={vault.id} className="gauge-card">
                  <div className="circular-progress-wrap blue">
                    <svg viewBox="0 0 36 36" className="circular-chart">
                      <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="circle blue" strokeDasharray={`${pct}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <span className="gauge-percent">{pct}%</span>
                  </div>
                  <strong className="gauge-name">{vault.name}</strong>
                  <span className="gauge-ratio">
                    {formatMoney(vault.currentCents, data.account.currency)} / {formatMoney(vault.targetCents, data.account.currency)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ================= SECTION 7: VRAIES TRANSACTIONS DE L'UTILISATEUR ================= */}
      <section className="cbg-transactions-section">
        <div className="section-head-title-row">
          <h3 className="cbg-title-bold">Historique des transactions ({data.transactions.length})</h3>
          <Link href="/dashboard/activite" className="cbg-sublink">Voir tout</Link>
        </div>

        {data.transactions.length === 0 ? (
          <div className="empty-transaction-box-clean">
            <strong>Aucune transaction enregistrée</strong>
            <span>Vos virements, paiements et opérations réelles apparaîtront ici.</span>
          </div>
        ) : (
          <div className="history-list-wrapper">
            {data.transactions.map((tx) => (
              <div key={tx.id} className="history-item-row">
                <div className="history-item-texts">
                  <span className="history-item-title">{tx.description}</span>
                  <span className="history-item-sub">
                    {new Date(tx.createdAt).toLocaleDateString("fr-FR")} à {new Date(tx.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} · {tx.status}
                  </span>
                </div>
                <span className="history-item-amount" style={{ color: tx.type === "withdrawal_request" ? "#ef4444" : "#22c55e", fontWeight: 700 }}>
                  {tx.amountCents
                    ? (tx.type === "withdrawal_request" ? "-" : "+") + formatMoney(tx.amountCents, tx.currency)
                    : "—"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= MODAL VRAI RIB / RECHARGE ================= */}
      {showRequestMoneyModal && (
        <div className="cbg-bottom-sheet-backdrop" onClick={() => setShowRequestMoneyModal(false)}>
          <div className="cbg-bottom-sheet-card" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle-bar"></div>
            
            <div className="sheet-header">
              <h3 className="sheet-title">Mes coordonnées bancaires (RIB)</h3>
              <button onClick={() => setShowRequestMoneyModal(false)} className="sheet-close-btn" aria-label="Fermer">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="sheet-center-icon">
              <div className="sheet-green-circle">
                <i className="fa-solid fa-arrow-down"></i>
              </div>
              <p className="sheet-sub">Partagez votre IBAN officiel pour recevoir des virements</p>
            </div>

            {/* Real Coordinates from Database */}
            <div className="sheet-details-card">
              <div className="sheet-detail-row">
                <span className="sheet-detail-key">IBAN</span>
                <span className="sheet-detail-val monospace">{realIban}</span>
              </div>

              <div className="sheet-detail-row">
                <span className="sheet-detail-key">BIC / SWIFT</span>
                <span className="sheet-detail-val monospace">{realBic}</span>
              </div>

              <div className="sheet-detail-row">
                <span className="sheet-detail-key">Établissement</span>
                <span className="sheet-detail-val">CBG BANQUE FINANCE SA</span>
              </div>

              <div className="sheet-detail-row">
                <span className="sheet-detail-key">Titulaire du compte</span>
                <span className="sheet-detail-val">{fullName}</span>
              </div>
            </div>

            {/* Optional Input Amount & Reason */}
            <div className="sheet-inputs-stack">
              <div className="form-group">
                <label className="sheet-input-label">Montant demandé (optionnel)</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={requestAmount}
                    onChange={(e) => setRequestAmount(e.target.value)}
                    className="sheet-text-input"
                  />
                  <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>
                    €
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="sheet-input-label">Motif du virement</label>
                <input
                  type="text"
                  placeholder="Remboursement, facture, cadeau..."
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  className="sheet-text-input"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="sheet-actions-stack">
              <button onClick={handleShareCoordinates} className="btn-sheet-primary-blue">
                <i className="fa-solid fa-share-nodes"></i> Partager mes coordonnées
              </button>

              <button onClick={copyIban} className="btn-sheet-secondary-gray">
                <i className="fa-regular fa-copy"></i> {copiedIban ? "IBAN copié dans le presse-papier !" : "Copier l'IBAN"}
              </button>
            </div>

            {sharedToast && (
              <div className="sheet-toast-notification">
                ✓ Coordonnées copiées dans le presse-papier !
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
