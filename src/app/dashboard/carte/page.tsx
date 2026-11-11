"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CardReference {
  id: string;
  name: string;
  reference: string;
  createdAt: string;
}

export default function CartePage() {
  const [cards, setCards] = useState<CardReference[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadCards = async () => {
    const response = await fetch("/api/dashboard/cards");
    const data: { cards?: CardReference[]; message?: string } = await response.json();
    if (!response.ok) throw new Error(data.message ?? "Impossible de charger les références.");
    setCards(data.cards ?? []);
  };

  useEffect(() => {
    let active = true;
    fetch("/api/dashboard/cards")
      .then(async (response) => {
        const data: { cards?: CardReference[]; message?: string } = await response.json();
        if (!response.ok) throw new Error(data.message ?? "Impossible de charger les références.");
        if (active) setCards(data.cards ?? []);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Erreur de chargement.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const addReference = async (event: React.FormEvent<HTMLFormElement>) => {
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
      const data: { message?: string } = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Impossible d'enregistrer la référence.");
      setName("");
      setMessage(data.message ?? "Référence enregistrée.");
      await loadCards();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Erreur d'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const deleteReference = async (cardId: string) => {
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/dashboard/cards", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId }),
      });
      const data: { message?: string } = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Impossible de supprimer la référence.");
      setMessage(data.message ?? "Référence supprimée.");
      await loadCards();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Erreur de suppression.");
    }
  };

  return (
    <div className="carte-mobile-view">
      <div className="carte-screen-header">
        <Link href="/dashboard" className="btn-back-circle" aria-label="Retour au tableau de bord">
          <i className="fa-solid fa-chevron-left"></i>
        </Link>
        <h1 className="screen-title-center">Références de carte</h1>
        <div style={{ width: "38px" }}></div>
      </div>

      <p role="note">
        Aucun émetteur de carte n&apos;est configuré. Ces références sont des repères internes; elles ne permettent pas de payer et aucun numéro de carte, CVV ou carte physique n&apos;est émis.
      </p>
      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}

      <section className="section-my-vaults">
        <h2 className="section-heading-title">Ajouter une référence</h2>
        <form onSubmit={addReference} className="modal-form">
          <label className="field-label" htmlFor="card-reference-name">Libellé choisi par vous</label>
          <input
            id="card-reference-name"
            type="text"
            required
            maxLength={40}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="modal-input"
          />
          <button type="submit" className="btn-modal-action" disabled={saving}>
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </form>
      </section>

      {!loading && cards.length > 0 && (
        <section className="section-my-vaults">
          <h2 className="section-heading-title">Mes références</h2>
          <div className="vaults-list">
            {cards.map((card) => (
              <article key={card.id} className="vault-item-card">
                <div className="vault-texts">
                  <h3 className="vault-name">{card.name}</h3>
                  <span className="vault-progress-sub">Référence interne : {card.reference}</span>
                  <time className="vault-progress-sub" dateTime={card.createdAt}>
                    {new Date(card.createdAt).toLocaleDateString("fr-FR")}
                  </time>
                </div>
                <button type="button" className="btn-table-details" onClick={() => void deleteReference(card.id)}>
                  Supprimer
                </button>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
