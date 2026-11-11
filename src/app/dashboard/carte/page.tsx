"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Card {
  id: string;
  name: string;
  reference: string;
  cardNumber?: string | null;
  expiry?: string | null;
  cvv?: string | null;
  cardHolder?: string | null;
  cardTier?: string | null;
  status: "active" | "frozen";
  createdAt: string;
}

export default function CartePage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [userName, setUserName] = useState("TITULAIRE DU COMPTE");
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [showNumbers, setShowNumbers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [newCardName, setNewCardName] = useState("Carte Virtuelle Démo");
  const [orderSuccess, setOrderSuccess] = useState(false);

  const loadData = async () => {
    try {
      const [cardsRes, dashRes] = await Promise.all([
        fetch("/api/dashboard/cards"),
        fetch("/api/dashboard"),
      ]);

      const cardsData = await cardsRes.json();
      const dashData = await dashRes.json();

      if (cardsData.success && cardsData.cards) {
        setCards(cardsData.cards);
      }
      if (dashData.user) {
        setUserName(`${dashData.user.firstName || "UTILISATEUR"} ${dashData.user.lastName || ""}`.trim().toUpperCase());
      }
    } catch {
      setError("Erreur lors de la synchronisation des données de cartes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeCard = cards[selectedCardIndex] || null;

  const toggleFreeze = async () => {
    if (!activeCard) return;
    setError("");
    setMessage("");
    try {
      const nextStatus = activeCard.status === "active" ? "frozen" : "active";
      const res = await fetch("/api/dashboard/cards", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: activeCard.id, status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur de mise à jour");
      setMessage(nextStatus === "frozen" ? "Carte gelée avec succès." : "Carte débloquée avec succès.");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur.");
    }
  };

  const deleteActiveCard = async () => {
    if (!activeCard) return;
    if (!confirm(`Confirmez-vous la suppression et résiliation de la carte « ${activeCard.name} » ?`)) return;

    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/dashboard/cards", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: activeCard.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Impossible de supprimer cette carte");
      setMessage("Carte supprimée avec succès.");
      setSelectedCardIndex(0);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur.");
    }
  };

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/dashboard/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCardName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de la création");
      setMessage("Votre nouvelle carte virtuelle est activée !");
      setShowCreateModal(false);
      setNewCardName("Carte Virtuelle Achat");
      await loadData();
      setSelectedCardIndex(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setSaving(false);
    }
  };

  const formatCardNumDisplay = (num?: string | null) => {
    const raw = num || "4532 9012 8841 3698";
    if (showNumbers) return raw;
    const parts = raw.split(" ");
    return `${parts[0] || "4532"} •••• •••• ${parts[3] || "3698"}`;
  };

  return (
    <div className="carte-mobile-view">
      {/* Top Header */}
      <div className="carte-screen-header">
        <Link href="/dashboard" className="btn-back-circle" aria-label="Retour au dashboard">
          <i className="fa-solid fa-chevron-left"></i>
        </Link>
        <h1 className="screen-title-center">Cartes</h1>
        <div style={{ width: "38px" }}></div>
      </div>

      {error && <div className="admin-error-banner" style={{ margin: "1rem 0" }}>{error}</div>}
      {message && (
        <div className="admin-success-banner" style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", padding: "0.75rem", borderRadius: "10px", margin: "1rem 0", fontSize: "0.9rem" }}>
          <i className="fa-solid fa-circle-check"></i> {message}
        </div>
      )}

      {/* Selector pills if user has multiple cards */}
      {cards.length > 1 && (
        <div className="cards-tab-selector">
          {cards.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setSelectedCardIndex(i)}
              className={`card-selector-pill ${selectedCardIndex === i ? "active" : ""}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* ================= REAL CARDS FROM DATABASE ================= */}
      {cards.length === 0 ? (
        <div className="empty-transaction-box-clean" style={{ padding: "2.5rem 1.5rem", margin: "1.5rem 0" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(59,130,246,0.15)", color: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", margin: "0 auto 1rem auto" }}>
            <i className="fa-regular fa-credit-card"></i>
          </div>
          <strong style={{ fontSize: "1.1rem" }}>Aucune carte enregistrée</strong>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", maxWidth: "340px", margin: "0.25rem auto 1.5rem auto" }}>
            Vous n&apos;avez aucune carte active dans la base de données. Créez une carte virtuelle instantanément ou commandez votre carte physique.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%", maxWidth: "320px", margin: "0 auto" }}>
            <button onClick={() => setShowCreateModal(true)} className="btn-order-card-primary">
              <i className="fa-solid fa-plus"></i> Créer une carte virtuelle (Gratuit)
            </button>
            <button onClick={() => setShowOrderModal(true)} className="btn-create-virtual-secondary">
              Commander une carte physique Visa
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Card Visual Container */}
          <div className={`cbg-premium-card ${activeCard?.status === "frozen" ? "card-frozen" : ""}`}>
            {/* Ambient Gradient Glow */}
            <div className="card-ambient-glow"></div>

            {/* Top Card Row */}
            <div className="cbg-card-top">
              <div className="cbg-card-brand">
                <span className="brand-logo-txt">CBG</span>
                <span className="brand-tier-txt">{activeCard?.cardTier?.toUpperCase() || "CLASSIC"}</span>
              </div>
              <div className="cbg-contactless-icon">
                <i className="fa-solid fa-wifi"></i>
              </div>
            </div>

            {/* EMV Chip */}
            <div className="cbg-card-chip">
              <div className="chip-track horizontal"></div>
              <div className="chip-track vertical"></div>
              <div className="chip-track center-box"></div>
            </div>

            {/* Card Number */}
            <div className="cbg-card-number">
              {formatCardNumDisplay(activeCard?.cardNumber)}
            </div>

            {/* Bottom Card Row */}
            <div className="cbg-card-bottom">
              <div className="card-holder-info">
                <span className="card-sub-label">
                  {activeCard?.status === "frozen" ? "CARTE GELÉE" : activeCard?.name.toUpperCase()}
                </span>
                <span className="card-holder-name-bold">
                  {activeCard?.cardHolder || userName}
                </span>
                <div className="card-exp-cvv-row">
                  <span>EXP : {showNumbers ? (activeCard?.expiry || "06/29") : "••/••"}</span>
                  <span>CVV : {showNumbers ? (activeCard?.cvv || "742") : "•••"}</span>
                </div>
              </div>

              <div className="visa-debit-badge">
                <span className="visa-debit-txt">DEBIT</span>
                <span className="visa-wordmark">VISA</span>
              </div>
            </div>
          </div>

          {/* Card Quick Control Buttons */}
          <div className="card-controls-toolbar">
            <button
              onClick={() => setShowNumbers(!showNumbers)}
              className="btn-card-ctrl"
              title="Afficher/Masquer les numéros"
            >
              <i className={`fa-regular ${showNumbers ? "fa-eye-slash" : "fa-eye"}`}></i>
              <span>{showNumbers ? "Masquer" : "Afficher codes"}</span>
            </button>

            <button
              onClick={toggleFreeze}
              className={`btn-card-ctrl ${activeCard?.status === "frozen" ? "warning" : ""}`}
              title="Geler temporairement"
            >
              <i className={`fa-solid ${activeCard?.status === "frozen" ? "fa-unlock" : "fa-snowflake"}`}></i>
              <span>{activeCard?.status === "frozen" ? "Débloquer" : "Geler la carte"}</span>
            </button>

            <button
              onClick={deleteActiveCard}
              className="btn-card-ctrl danger"
              title="Supprimer la carte de la base de données"
            >
              <i className="fa-regular fa-trash-can"></i>
              <span>Supprimer</span>
            </button>
          </div>
        </>
      )}

      {/* ================= ORDER PHYSICAL VISA CARD SECTION (SCREENSHOT 4) ================= */}
      <div className="card-promo-section">
        <h2 className="promo-title">Commandez votre carte Visa</h2>
        <p className="promo-subtitle">
          Votre carte physique CBG, livrée chez vous en 5 à 7 jours ouvrés.
        </p>

        <div className="promo-benefits-list">
          <div className="promo-benefit-item">
            <div className="check-circle-green"><i className="fa-solid fa-check"></i></div>
            <span>Paiements sans contact, en ligne et à l&apos;étranger</span>
          </div>

          <div className="promo-benefit-item">
            <div className="check-circle-green"><i className="fa-solid fa-check"></i></div>
            <span>Retraits aux distributeurs dans toute la zone euro</span>
          </div>

          <div className="promo-benefit-item">
            <div className="check-circle-green"><i className="fa-solid fa-check"></i></div>
            <span>Gel, plafonds et code PIN gérés depuis l&apos;app</span>
          </div>
        </div>

        <div className="promo-buttons-stack">
          <button onClick={() => setShowOrderModal(true)} className="btn-order-card-primary">
            Commander ma carte · 6,99 €
          </button>

          <button onClick={() => setShowCreateModal(true)} className="btn-create-virtual-secondary">
            <i className="fa-solid fa-plus"></i> Créer une carte virtuelle instantanée (Gratuit)
          </button>
        </div>
      </div>

      {/* ================= MODAL CRÉER CARTE VIRTUELLE ================= */}
      {showCreateModal && (
        <div className="pwa-modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="pwa-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="pwa-modal-close" onClick={() => setShowCreateModal(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <h3 className="pwa-modal-title">Nouvelle carte virtuelle</h3>
            <p className="pwa-modal-subtitle">
              Une carte de paiement sécurisée pour vos achats en ligne avec numéros chiffrés.
            </p>
            <form onSubmit={handleCreateCard}>
              <div style={{ textAlign: "left", marginBottom: "1.25rem" }}>
                <label className="select-label" style={{ display: "block", marginBottom: "0.5rem", color: "#cbd5e1" }}>
                  Libellé ou usage de la carte
                </label>
                <input
                  type="text"
                  required
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value)}
                  placeholder="Ex : Achats Amazon, Abonnements..."
                  className="step-input"
                />
              </div>
              <button type="submit" disabled={saving} className="btn-pwa-primary" style={{ width: "100%" }}>
                {saving ? "Génération en cours..." : "Activer la carte virtuelle"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL COMMANDER CARTE PHYSIQUE ================= */}
      {showOrderModal && (
        <div className="pwa-modal-backdrop" onClick={() => { setShowOrderModal(false); setOrderSuccess(false); }}>
          <div className="pwa-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="pwa-modal-close" onClick={() => { setShowOrderModal(false); setOrderSuccess(false); }}>
              <i className="fa-solid fa-xmark"></i>
            </button>

            {!orderSuccess ? (
              <>
                <div className="pwa-app-icon" style={{ background: "linear-gradient(135deg, #1e3a8a, #7c3aed)" }}>
                  <i className="fa-regular fa-credit-card"></i>
                </div>
                <h3 className="pwa-modal-title">Confirmation de commande</h3>
                <p className="pwa-modal-subtitle">
                  Votre carte physique CBG Visa Classic sera imprimée avec puce sans contact et expédiée à votre adresse de résidence sous pli discret et sécurisé.
                </p>
                <div style={{ background: "rgba(255,255,255,0.04)", padding: "1rem", borderRadius: "12px", marginBottom: "1.5rem", textAlign: "left", fontSize: "0.85rem" }}>
                  <div><strong>Destinataire :</strong> {userName}</div>
                  <div style={{ marginTop: "0.25rem" }}><strong>Frais d&apos;émission & livraison :</strong> 6,99 €</div>
                  <div style={{ marginTop: "0.25rem" }}><strong>Délai estimé :</strong> 5 à 7 jours ouvrés</div>
                </div>
                <button
                  onClick={() => setOrderSuccess(true)}
                  className="btn-pwa-primary"
                  style={{ width: "100%" }}
                >
                  Confirmer et commander ma carte
                </button>
              </>
            ) : (
              <>
                <div className="pwa-app-icon" style={{ background: "rgba(34,197,94,0.2)", color: "#22c55e" }}>
                  <i className="fa-solid fa-check"></i>
                </div>
                <h3 className="pwa-modal-title">Commande validée !</h3>
                <p className="pwa-modal-subtitle">
                  Votre carte bancaire CBG Visa Classic est en cours de fabrication. Vous recevrez un numéro de suivi postal dès son expédition.
                </p>
                <button
                  onClick={() => { setShowOrderModal(false); setOrderSuccess(false); }}
                  className="btn-pwa-primary"
                  style={{ width: "100%" }}
                >
                  Terminer
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
