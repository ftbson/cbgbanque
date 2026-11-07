"use client";

import { useEffect, useState } from "react";

interface Card {
  id: string;
  name: string;
  reference: string;
  status: "active" | "frozen";
  createdAt: string;
}

export default function CartePage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadCards = async () => {
    const response = await fetch("/api/dashboard/cards");
    const data: { cards?: Card[]; message?: string } = await response.json();
    if (!response.ok) throw new Error(data.message ?? "Impossible de charger les cartes.");
    setCards(data.cards ?? []);
  };

  useEffect(() => {
    let active = true;
    fetch("/api/dashboard/cards")
      .then(async (response) => {
        const data: { cards?: Card[]; message?: string } = await response.json();
        if (!response.ok) throw new Error(data.message ?? "Impossible de charger les cartes.");
        if (active) setCards(data.cards ?? []);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Erreur de chargement.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const createCard = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/dashboard/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data: { message?: string; note?: string } = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Impossible de créer cette carte.");
      setName("");
      setMessage(data.note ?? "Carte créée.");
      await loadCards();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Erreur lors de la création.");
    } finally {
      setSaving(false);
    }
  };

  const setCardStatus = async (card: Card) => {
    setError("");
    try {
      const response = await fetch("/api/dashboard/cards", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: card.id, status: card.status === "active" ? "frozen" : "active" }),
      });
      const data: { message?: string } = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Impossible de modifier la carte.");
      await loadCards();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Erreur lors de la modification.");
    }
  };

  return (
    <div className="carte-page">
      <div className="carte-container">
        <div className="carte-header">
          <div className="carte-title-group">
            <h1 className="carte-main-title">Cartes</h1>
            <span className="carte-top-sub">Cartes de démonstration</span>
          </div>
        </div>

        <p role="note">
          Ces références sont uniquement destinées à l&apos;interface de démonstration. Elles ne sont pas des cartes de paiement et aucun numéro PAN ni CVV n&apos;est généré.
        </p>
        {error && <p role="alert">{error}</p>}
        {message && <p role="status">{message}</p>}

        <section className="carte-section-block">
          <h2 className="section-block-title">Créer une carte</h2>
          <form onSubmit={createCard} className="modal-form">
            <label className="field-label" htmlFor="card-name">Nom de la carte</label>
            <input
              id="card-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={40}
              required
              className="modal-input"
              placeholder="Ex. Carte quotidienne"
            />
            <button type="submit" className="btn-modal-action" disabled={saving}>
              {saving ? "Création..." : "Créer une carte de démonstration"}
            </button>
          </form>
        </section>

        <section className="carte-section-block">
          <h2 className="section-block-title">Mes cartes</h2>
          {loading ? <p>Chargement…</p> : cards.length === 0 ? (
            <p>Aucune carte n&apos;a été créée.</p>
          ) : (
            <div className="virtual-cards-list">
              {cards.map((card) => (
                <article key={card.id} className="virtual-card-item">
                  <div className="vc-left">
                    <div className="vc-color-badge bg-blue" aria-hidden="true" />
                    <div className="vc-texts">
                      <span className="vc-name">{card.name}</span>
                      <span className="vc-num">{card.reference}</span>
                      <span className="vc-tag">{card.status === "frozen" ? "Gelée" : "Active · Démo"}</span>
                      <span className="user-sub-td">
                        Créée le {new Date(card.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                  <button type="button" className="btn-table-details" onClick={() => void setCardStatus(card)}>
                    {card.status === "active" ? "Geler" : "Dégeler"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
