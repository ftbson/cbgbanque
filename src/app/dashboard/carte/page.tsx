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
        <h1 className="screen-title-center">Mes cartes</h1>
        <div style={{ width: "38px" }}></div>
      </div>

      <p role="note">
        Gérez vos références personnelles. Aucune carte bancaire, numéro de paiement ou carte physique n&apos;est émis depuis cet espace.
      </p>
      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}

      <section className="section-my-vaults">
        <h2 className="section-heading-title">Ajouter une référence de carte</h2>
        <form onSubmit={addReference} className="modal-form">
          <label className="field-label" htmlFor="card-reference-name">Nom de la référence</label>
          <input
            id="card-reference-name"
            type="text"
            required
            maxLength={40}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="modal-input"
            autoComplete="off"
          />
          <button type="submit" className="btn-modal-action" disabled={saving}>
            {saving ? "Enregistrement…" : "Ajouter ma référence"}
          </button>
        </form>
      </section>

      <section className="section-my-vaults">
        <h2 className="section-heading-title">Références enregistrées</h2>
        {loading ? (
          <p aria-live="polite">Chargement de vos références…</p>
        ) : error ? null : cards.length === 0 ? (
          <p className="dashboard-empty-state">Aucune référence enregistrée. Ajoutez-en une avec le formulaire ci-dessus.</p>
        ) : (
          <div className="card-reference-grid">
            {cards.map((card) => (
              <article key={card.id} className="card-reference-item">
                <div className="card-reference-visual">
                  <div className="card-reference-glow" aria-hidden="true"></div>
                  <div className="card-reference-top">
                    <div className="card-reference-brand">
                      <strong>CBG</strong>
                      <span>RÉFÉRENCE</span>
                    </div>
                    <i className="fa-solid fa-wifi card-reference-contactless" aria-hidden="true"></i>
                  </div>
                  <div className="card-reference-chip" aria-hidden="true">
                    <span></span><span></span><span></span><span></span>
                  </div>
                  <div className="card-reference-bottom">
                    <div>
                      <span>RÉFÉRENCE INTERNE · NON BANCAIRE</span>
                      <strong>{card.name}</strong>
                      <code>{card.reference}</code>
                    </div>
                    <span className="card-reference-mark">CBG</span>
                  </div>
                </div>
                <div className="card-reference-details">
                  <time dateTime={card.createdAt}>
                    Ajoutée le {new Date(card.createdAt).toLocaleDateString("fr-FR")}
                  </time>
                  <button type="button" className="btn-table-details" onClick={() => void deleteReference(card.id)}>
                    Supprimer
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
