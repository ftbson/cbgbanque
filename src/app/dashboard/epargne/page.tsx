"use client";

import { useEffect, useState } from "react";

interface Vault {
  id: string;
  name: string;
  targetCents: number;
  currentCents: number;
  createdAt: string;
}

interface VaultData {
  vaults: Vault[];
  currency: string;
  availableBalanceCents: number;
  message?: string;
}

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(cents / 100);
}

export default function EpargnePage() {
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [currency, setCurrency] = useState("");
  const [availableBalanceCents, setAvailableBalanceCents] = useState(0);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadVaults = async () => {
    const response = await fetch("/api/dashboard/vaults");
    const data: VaultData = await response.json();
    if (!response.ok) throw new Error(data.message ?? "Impossible de charger les coffres.");
    setVaults(data.vaults ?? []);
    setCurrency(data.currency);
    setAvailableBalanceCents(data.availableBalanceCents);
  };

  useEffect(() => {
    let active = true;
    fetch("/api/dashboard/vaults")
      .then(async (response) => {
        const data: VaultData = await response.json();
        if (!response.ok) throw new Error(data.message ?? "Impossible de charger les coffres.");
        if (!active) return;
        setVaults(data.vaults ?? []);
        setCurrency(data.currency);
        setAvailableBalanceCents(data.availableBalanceCents);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Erreur de chargement.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const createVault = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/dashboard/vaults", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, target }),
      });
      const data: { message?: string } = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Impossible de créer le coffre.");
      setName("");
      setTarget("");
      setMessage(data.message ?? "Coffre créé.");
      await loadVaults();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Erreur lors de la création.");
    } finally {
      setSaving(false);
    }
  };

  const moveFunds = async (direction: "deposit" | "withdraw") => {
    if (!selectedId) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/dashboard/vaults/${selectedId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction, amount }),
      });
      const data: { message?: string } = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Mouvement impossible.");
      setAmount("");
      setMessage(direction === "deposit" ? "Versement effectué." : "Retrait du coffre effectué.");
      await loadVaults();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Erreur lors du mouvement.");
    } finally {
      setSaving(false);
    }
  };

  const totalSavedCents = vaults.reduce((sum, vault) => sum + vault.currentCents, 0);

  return (
    <div className="epargne-page">
      <div className="epargne-header-top">
        <div className="epargne-title-group">
          <h1 className="epargne-main-title">Coffres</h1>
        </div>
      </div>

      {vaults.length > 0 && (
        <section className="epargne-total-card">
          <span className="total-label-top">TOTAL ÉPARGNÉ</span>
          <div className="total-amount-display">{formatMoney(totalSavedCents, currency)}</div>
          <span className="interest-generated-text">
            Solde disponible du compte : {formatMoney(availableBalanceCents, currency)}
          </span>
        </section>
      )}

      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}

      <section className="section-my-vaults">
        <h2 className="section-heading-title">Créer un coffre</h2>
        <form onSubmit={createVault} className="modal-form">
          <label className="field-label" htmlFor="vault-name">Nom</label>
          <input id="vault-name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={50} className="modal-input" />
          <label className="field-label" htmlFor="vault-target">Objectif ({currency})</label>
          <input id="vault-target" type="number" min="0.01" step="0.01" value={target} onChange={(event) => setTarget(event.target.value)} required className="modal-input" />
          <button type="submit" className="btn-modal-action" disabled={saving || loading || !currency}>
            {saving ? "Enregistrement…" : "Créer le coffre"}
          </button>
        </form>
      </section>

      {!loading && vaults.length > 0 && <section className="section-my-vaults">
        <h2 className="section-heading-title">Mes coffres</h2>
        <div className="vaults-list">
          {vaults.map((vault) => {
            const progress = vault.targetCents > 0
              ? Math.min(100, Math.round(vault.currentCents / vault.targetCents * 100))
              : 0;
            return (
              <article key={vault.id} className="vault-item-card">
                <div className="vault-item-left">
                  <div className="vault-icon-badge"><i className="fa-solid fa-piggy-bank"></i></div>
                  <div className="vault-texts">
                    <h3 className="vault-name">{vault.name}</h3>
                    <span className="vault-progress-sub">
                      {formatMoney(vault.currentCents, currency)} / {formatMoney(vault.targetCents, currency)}
                    </span>
                  </div>
                </div>
                <span className="vault-percent-badge">{progress}%</span>
                <div className="form-field">
                  <label className="field-label" htmlFor={`vault-amount-${vault.id}`}>Montant ({currency})</label>
                  <input
                    id={`vault-amount-${vault.id}`}
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={selectedId === vault.id ? amount : ""}
                    onFocus={() => setSelectedId(vault.id)}
                    onChange={(event) => { setSelectedId(vault.id); setAmount(event.target.value); }}
                    className="modal-input"
                  />
                  <div className="table-actions-row">
                    <button type="button" className="btn-table-details" disabled={saving || selectedId !== vault.id || !amount} onClick={() => void moveFunds("deposit")}>
                      Verser
                    </button>
                    <button type="button" className="btn-table-details" disabled={saving || selectedId !== vault.id || !amount} onClick={() => void moveFunds("withdraw")}>
                      Retirer
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>}
    </div>
  );
}
