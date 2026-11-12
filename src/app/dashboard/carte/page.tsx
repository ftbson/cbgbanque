"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CardItem {
  id: string;
  name: string;
  type: string;
  reference: string;
  status: "active" | "frozen" | "pending_activation";
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  pin?: string;
  cardHolder?: string;
  cardTier?: string;
  createdAt: string;
}

export default function CartePage() {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [fullName, setFullName] = useState("TITULAIRE DU COMPTE");
  const [balanceCents, setBalanceCents] = useState(0);
  const [currency, setCurrency] = useState("EUR");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const loadData = async () => {
    try {
      const res = await fetch("/api/dashboard/cards");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Erreur de chargement");
      setCards(data.cards ?? []);
      if (data.fullName) setFullName(data.fullName);
      if (typeof data.balanceCents === "number") setBalanceCents(data.balanceCents);
      if (data.currency) setCurrency(data.currency);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeCard = cards[0];

  const handleOrderCard = async () => {
    setActionLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/dashboard/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Impossible de commander la carte.");
      setMessage("Votre carte Visa C23 a été émise et activée avec succès !");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de commande de carte.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleFreeze = async () => {
    if (!activeCard) return;
    setActionLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/dashboard/cards", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: activeCard.id, action: "toggle_freeze" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Erreur lors du gel de la carte.");
      setMessage(data.message ?? "Statut mis à jour.");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action impossible.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCard) return;
    if (!/^\d{4}$/.test(newPin)) {
      setError("Le code PIN doit comporter exactement 4 chiffres.");
      return;
    }
    setActionLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/dashboard/cards", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: activeCard.id, action: "change_pin", newPin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Impossible de modifier le code PIN.");
      setMessage("Code PIN modifié avec succès !");
      setShowPinModal(false);
      setNewPin("");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCard = async () => {
    if (!activeCard) return;
    if (!confirm("Êtes-vous sûr de vouloir supprimer définitivement cette carte ?")) return;
    setActionLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/dashboard/cards", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: activeCard.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Impossible de supprimer la carte.");
      setMessage("Carte supprimée avec succès.");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setActionLoading(false);
    }
  };

  const copyCardNumber = () => {
    if (!activeCard?.cardNumber) return;
    navigator.clipboard.writeText(activeCard.cardNumber.replace(/\s+/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Format masked number
  const maskedCardNumber = activeCard?.cardNumber
    ? showNumbers
      ? activeCard.cardNumber
      : `•••• •••• •••• ${activeCard.cardNumber.slice(-4)}`
    : "•••• •••• •••• ••••";

  const maskedCvv = activeCard?.cvv
    ? showNumbers
      ? activeCard.cvv
    : "•••"
    : "•••";

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "1.5rem 1rem 6rem", color: "#fff" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}>
        <Link
          href="/dashboard"
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            textDecoration: "none",
            fontSize: "0.95rem",
          }}
        >
          <i className="fa-solid fa-chevron-left"></i>
        </Link>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Cartes</h1>
        <div style={{ width: "38px" }}></div>
      </div>

      {/* Alerts */}
      {error && (
        <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.4)", color: "#fca5a5", padding: "0.75rem 1rem", borderRadius: "12px", marginBottom: "1.25rem", fontSize: "0.9rem" }}>
          <i className="fa-solid fa-circle-exclamation"></i> {error}
        </div>
      )}
      {message && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.4)", color: "#6ee7b7", padding: "0.75rem 1rem", borderRadius: "12px", marginBottom: "1.25rem", fontSize: "0.9rem" }}>
          <i className="fa-solid fa-circle-check"></i> {message}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem 1rem", color: "rgba(255,255,255,0.5)" }}>
          <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: "1.5rem" }}></i>
          <p style={{ marginTop: "0.5rem" }}>Chargement de vos informations…</p>
        </div>
      ) : !activeCard ? (
        /* SCREEN 1: Commande de carte Visa (matching user's uploaded screenshot) */
        <div>
          {/* Card Visual Preview */}
          <div
            style={{
              width: "100%",
              aspectRatio: "1.586 / 1",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #2b3990 0%, #3b2d71 50%, #1e1b4b 100%)",
              boxShadow: "0 20px 45px rgba(43, 57, 144, 0.45)",
              padding: "1.5rem 1.75rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
              marginBottom: "1.75rem",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            {/* Gloss reflection overlay */}
            <div
              style={{
                position: "absolute",
                top: "-40%",
                right: "-20%",
                width: "120%",
                height: "120%",
                background: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 60%)",
                pointerEvents: "none",
              }}
            ></div>

            {/* Top row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
                <span style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "1px", color: "#fff" }}>C23</span>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "1.5px", color: "rgba(255,255,255,0.7)" }}>CLASSIC</span>
              </div>
              <i className="fa-solid fa-wifi" style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.85)", transform: "rotate(90deg)" }}></i>
            </div>

            {/* Chip */}
            <div
              style={{
                width: "44px",
                height: "34px",
                background: "linear-gradient(135deg, #e6c875 0%, #caa437 50%, #9e7a1b 100%)",
                borderRadius: "6px",
                border: "1px solid rgba(0,0,0,0.2)",
                boxShadow: "inset 0 1px 2px rgba(255,255,255,0.6)",
                position: "relative",
                zIndex: 1,
              }}
            ></div>

            {/* Bottom row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative", zIndex: 1 }}>
              <div>
                <span style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.65)", display: "block" }}>
                  NOUVELLE CARTE
                </span>
                <span style={{ fontSize: "0.95rem", fontWeight: 700, letterSpacing: "1px", color: "#fff" }}>
                  {fullName}
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "1px", color: "rgba(255,255,255,0.85)", display: "block" }}>
                  DEBIT
                </span>
                <span style={{ fontSize: "1.3rem", fontWeight: 900, fontStyle: "italic", letterSpacing: "1px", color: "#fff" }}>
                  VISA
                </span>
              </div>
            </div>
          </div>

          {/* Texts matching screenshot */}
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.4rem" }}>
              Commandez votre carte Visa
            </h2>
            <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.65)", margin: 0 }}>
              Votre carte physique C23, livrée chez vous en 5 à 7 jours ouvrés.
            </p>
          </div>

          {/* Feature items with green checkmarks */}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              borderRadius: "16px",
              padding: "1.25rem 1.25rem",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginBottom: "1.75rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981", fontSize: "0.75rem" }}>
                <i className="fa-solid fa-check"></i>
              </div>
              <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>
                Paiements sans contact, en ligne et à l&apos;étranger
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981", fontSize: "0.75rem" }}>
                <i className="fa-solid fa-check"></i>
              </div>
              <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>
                Retraits aux distributeurs dans toute la zone euro
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981", fontSize: "0.75rem" }}>
                <i className="fa-solid fa-check"></i>
              </div>
              <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>
                Gel, plafonds et code PIN gérés depuis l&apos;app
              </span>
            </div>
          </div>

          {/* Big Blue CTA Button */}
          <button
            type="button"
            onClick={handleOrderCard}
            disabled={actionLoading}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #4361ee, #3a0ca3)",
              color: "#fff",
              border: "none",
              borderRadius: "100px",
              padding: "1rem",
              fontSize: "1.05rem",
              fontWeight: 700,
              cursor: actionLoading ? "wait" : "pointer",
              boxShadow: "0 8px 25px rgba(67, 97, 238, 0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            {actionLoading ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i> Activation en cours…
              </>
            ) : (
              "Commander ma carte · 6,99 €"
            )}
          </button>
        </div>
      ) : (
        /* SCREEN 2: Dedicated Interactive Card Management Page */
        <div>
          {/* Card Visual with Live Details */}
          <div
            style={{
              width: "100%",
              aspectRatio: "1.586 / 1",
              borderRadius: "22px",
              background: activeCard.status === "frozen"
                ? "linear-gradient(135deg, #374151 0%, #1f2937 100%)"
                : "linear-gradient(135deg, #2b3990 0%, #3b2d71 50%, #1e1b4b 100%)",
              boxShadow: activeCard.status === "frozen"
                ? "0 15px 35px rgba(0, 0, 0, 0.5)"
                : "0 20px 45px rgba(43, 57, 144, 0.45)",
              padding: "1.5rem 1.75rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
              marginBottom: "1.5rem",
              border: "1px solid rgba(255,255,255,0.15)",
              opacity: activeCard.status === "frozen" ? 0.75 : 1,
              transition: "all 0.3s ease",
            }}
          >
            {/* Top row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "1px", color: "#fff" }}>C23</span>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "1.5px", color: "rgba(255,255,255,0.7)" }}>
                  {activeCard.cardTier || "CLASSIC"}
                </span>
                {activeCard.status === "frozen" && (
                  <span style={{ background: "rgba(239, 68, 68, 0.3)", color: "#fca5a5", fontSize: "0.65rem", padding: "0.2rem 0.5rem", borderRadius: "100px", fontWeight: 700, border: "1px solid rgba(239, 68, 68, 0.5)" }}>
                    GELÉE
                  </span>
                )}
              </div>
              <i className="fa-solid fa-wifi" style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.85)", transform: "rotate(90deg)" }}></i>
            </div>

            {/* Chip & Contactless */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "44px",
                  height: "34px",
                  background: "linear-gradient(135deg, #e6c875 0%, #caa437 50%, #9e7a1b 100%)",
                  borderRadius: "6px",
                  border: "1px solid rgba(0,0,0,0.2)",
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.6)",
                }}
              ></div>
            </div>

            {/* Card Number & Expiry */}
            <div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "2.5px", fontFamily: "monospace", color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
                {maskedCardNumber}
              </div>
              <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.4rem" }}>
                <div>
                  <span style={{ fontSize: "0.55rem", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", display: "block" }}>EXPIRE FIN</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, fontFamily: "monospace" }}>{activeCard.expiry || "08/29"}</span>
                </div>
                <div>
                  <span style={{ fontSize: "0.55rem", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", display: "block" }}>CVV</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, fontFamily: "monospace" }}>{maskedCvv}</span>
                </div>
              </div>
            </div>

            {/* Bottom row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative", zIndex: 1 }}>
              <div>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, letterSpacing: "1px", color: "#fff" }}>
                  {activeCard.cardHolder || fullName}
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "1px", color: "rgba(255,255,255,0.85)", display: "block" }}>
                  DEBIT
                </span>
                <span style={{ fontSize: "1.3rem", fontWeight: 900, fontStyle: "italic", letterSpacing: "1px", color: "#fff" }}>
                  VISA
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.6rem", marginBottom: "1.75rem" }}>
            {/* Show/Hide details */}
            <button
              type="button"
              onClick={() => setShowNumbers(!showNumbers)}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "14px",
                padding: "0.85rem 0.5rem",
                color: "#fff",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <i className={`fa-solid ${showNumbers ? "fa-eye-slash" : "fa-eye"}`} style={{ fontSize: "1.1rem", color: "#60a5fa" }}></i>
              <span>{showNumbers ? "Masquer" : "Afficher"}</span>
            </button>

            {/* Freeze / Unfreeze */}
            <button
              type="button"
              onClick={handleToggleFreeze}
              disabled={actionLoading}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "14px",
                padding: "0.85rem 0.5rem",
                color: "#fff",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <i className={`fa-solid ${activeCard.status === "frozen" ? "fa-snowflake" : "fa-lock"}`} style={{ fontSize: "1.1rem", color: activeCard.status === "frozen" ? "#f87171" : "#fbbf24" }}></i>
              <span>{activeCard.status === "frozen" ? "Dégeler" : "Geler"}</span>
            </button>

            {/* PIN Code */}
            <button
              type="button"
              onClick={() => setShowPinModal(true)}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "14px",
                padding: "0.85rem 0.5rem",
                color: "#fff",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <i className="fa-solid fa-key" style={{ fontSize: "1.1rem", color: "#34d399" }}></i>
              <span>Code PIN</span>
            </button>
          </div>

          {/* Copy Number Action */}
          <div style={{ marginBottom: "1.5rem" }}>
            <button
              type="button"
              onClick={copyCardNumber}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                padding: "0.75rem 1rem",
                color: "#fff",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <i className="fa-solid fa-copy"></i>
              {copied ? "Numéro de carte copié !" : "Copier le numéro de carte"}
            </button>
          </div>

          {/* Card Features List (Matching capture 5) */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.85rem" }}>Options & Plafonds</h3>
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <strong style={{ fontSize: "0.95rem", display: "block" }}>Plafond de paiement</strong>
                  <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>Sur 30 jours glissants</span>
                </div>
                <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}>2 500,00 €</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <strong style={{ fontSize: "0.95rem", display: "block" }}>Plafond de retrait</strong>
                  <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>Sur 7 jours glissants</span>
                </div>
                <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}>500,00 €</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <strong style={{ fontSize: "0.95rem", display: "block" }}>Paiements sans contact</strong>
                  <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>Jusqu&apos;à 50 € sans code</span>
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#10b981" }}>Activé</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem" }}>
                <div>
                  <strong style={{ fontSize: "0.95rem", display: "block" }}>Paiements sur Internet</strong>
                  <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>Sécurisés par 3D Secure</span>
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#10b981" }}>Activé</span>
              </div>
            </div>
          </div>

          {/* Delete Card */}
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
              type="button"
              onClick={handleDeleteCard}
              disabled={actionLoading}
              style={{
                background: "transparent",
                border: "none",
                color: "#f87171",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                padding: "0.5rem 1rem",
              }}
            >
              <i className="fa-solid fa-trash" style={{ marginRight: "0.4rem" }}></i>
              Supprimer cette carte
            </button>
          </div>
        </div>
      )}

      {/* PIN Code Modal */}
      {showPinModal && activeCard && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#181d28",
              borderRadius: "20px",
              padding: "1.75rem",
              width: "100%",
              maxWidth: "380px",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
              textAlign: "center",
            }}
          >
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "rgba(52, 211, 153, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34d399", fontSize: "1.3rem", margin: "0 auto 1rem" }}>
              <i className="fa-solid fa-key"></i>
            </div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 0.5rem" }}>Votre code PIN confidentiel</h2>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", margin: "0 0 1.5rem" }}>
              Ne partagez jamais votre code confidentiel.
            </p>

            <div
              style={{
                background: "rgba(255,255,255,0.06)",
                borderRadius: "14px",
                padding: "1rem",
                fontSize: "2rem",
                fontWeight: 800,
                letterSpacing: "8px",
                fontFamily: "monospace",
                color: "#34d399",
                marginBottom: "1.5rem",
                border: "1px solid rgba(52, 211, 153, 0.3)",
              }}
            >
              {activeCard.pin || "4812"}
            </div>

            <form onSubmit={handleChangePin} style={{ textAlign: "left", marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", marginBottom: "0.4rem" }}>
                Modifier le code PIN (4 chiffres) :
              </label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="password"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="••••"
                  style={{
                    flex: 1,
                    padding: "0.6rem 0.85rem",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff",
                    fontSize: "1rem",
                    letterSpacing: "4px",
                    textAlign: "center",
                  }}
                />
                <button
                  type="submit"
                  disabled={newPin.length !== 4 || actionLoading}
                  style={{
                    padding: "0.6rem 1rem",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.1)",
                    border: "none",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: newPin.length === 4 ? "pointer" : "not-allowed",
                  }}
                >
                  Modifier
                </button>
              </div>
            </form>

            <button
              type="button"
              onClick={() => { setShowPinModal(false); setNewPin(""); }}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #4361ee, #3a0ca3)",
                border: "none",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
