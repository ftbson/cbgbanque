"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

function formatMoney(cents: number, currency: string = "EUR") {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency || "EUR",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export default function EpargnePage() {
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [currency, setCurrency] = useState("EUR");
  const [availableBalanceCents, setAvailableBalanceCents] = useState(0);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
  const [actionType, setActionType] = useState<"deposit" | "withdraw">("deposit");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadVaults = async () => {
    try {
      const response = await fetch("/api/dashboard/vaults");
      const data: VaultData = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Impossible de charger les coffres.");
      setVaults(data.vaults ?? []);
      setCurrency(data.currency || "EUR");
      setAvailableBalanceCents(data.availableBalanceCents ?? 0);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVaults();
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
      setShowCreateModal(false);
      setMessage(data.message ?? "Coffre créé avec succès.");
      await loadVaults();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Erreur lors de la création.");
    } finally {
      setSaving(false);
    }
  };

  const moveFunds = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedVault) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/dashboard/vaults/${selectedVault.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction: actionType, amount }),
      });
      const data: { message?: string } = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Mouvement impossible.");
      setAmount("");
      setSelectedVault(null);
      setMessage(actionType === "deposit" ? "Versement effectué avec succès." : "Retrait du coffre effectué avec succès.");
      await loadVaults();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Erreur lors du mouvement.");
    } finally {
      setSaving(false);
    }
  };

  const totalSavedCents = vaults.reduce((sum, vault) => sum + vault.currentCents, 0);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1.5rem 1rem", color: "#fff" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link
            href="/dashboard"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </Link>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Coffres d&apos;Épargne</h1>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", margin: 0 }}>
              Mettez de l&apos;argent de côté pour vos projets
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          style={{
            background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
            color: "#fff",
            border: "none",
            borderRadius: "100px",
            padding: "0.6rem 1.25rem",
            fontSize: "0.9rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            boxShadow: "0 4px 15px rgba(59, 130, 246, 0.35)",
          }}
        >
          <i className="fa-solid fa-plus"></i> Nouveau coffre
        </button>
      </div>

      {/* Total Card */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))",
          borderRadius: "20px",
          padding: "1.75rem",
          border: "1px solid rgba(255,255,255,0.08)",
          marginBottom: "1.75rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>
            TOTAL ÉPARGNÉ
          </span>
          <div style={{ fontSize: "2.2rem", fontWeight: 800, margin: "0.4rem 0", color: "#fff" }}>
            {formatMoney(totalSavedCents, currency)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.65)" }}>
            <i className="fa-solid fa-wallet" style={{ color: "#3b82f6" }}></i>
            <span>Solde disponible du compte : <strong>{formatMoney(availableBalanceCents, currency)}</strong></span>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.4)", color: "#fca5a5", padding: "0.75rem 1rem", borderRadius: "12px", marginBottom: "1rem" }}>
          <i className="fa-solid fa-circle-exclamation"></i> {error}
        </div>
      )}
      {message && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.4)", color: "#6ee7b7", padding: "0.75rem 1rem", borderRadius: "12px", marginBottom: "1rem" }}>
          <i className="fa-solid fa-circle-check"></i> {message}
        </div>
      )}

      {/* Vaults List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.5)" }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: "1.5rem" }}></i>
            <p style={{ marginTop: "0.5rem" }}>Chargement de vos coffres…</p>
          </div>
        ) : vaults.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3.5rem 1.5rem",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "20px",
              border: "1px dashed rgba(255,255,255,0.12)",
            }}
          >
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(59, 130, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
              <i className="fa-solid fa-piggy-bank" style={{ fontSize: "1.75rem", color: "#60a5fa" }}></i>
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>Aucun coffre créé</h3>
            <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", maxWidth: "380px", margin: "0 auto 1.5rem" }}>
              Créez un coffre pour mettre de l&apos;argent de côté automatiquement (vacances, sécurité, auto, etc.).
            </p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              style={{
                background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
                color: "#fff",
                border: "none",
                borderRadius: "100px",
                padding: "0.65rem 1.5rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Créer mon premier coffre
            </button>
          </div>
        ) : (
          vaults.map((vault) => {
            const percent = vault.targetCents > 0
              ? Math.min(100, Math.round((vault.currentCents / vault.targetCents) * 100))
              : 0;

            return (
              <div
                key={vault.id}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                  padding: "1.25rem",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(99, 102, 241, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#818cf8" }}>
                      <i className="fa-solid fa-piggy-bank" style={{ fontSize: "1.1rem" }}></i>
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 600, margin: 0 }}>{vault.name}</h3>
                      <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>
                        Objectif : {formatMoney(vault.targetCents, currency)}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>{formatMoney(vault.currentCents, currency)}</div>
                    <span style={{ fontSize: "0.8rem", color: percent >= 100 ? "#10b981" : "#60a5fa", fontWeight: 600 }}>
                      {percent}% atteint
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "100px", overflow: "hidden", marginBottom: "1rem" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${percent}%`,
                      background: percent >= 100 ? "linear-gradient(90deg, #10b981, #34d399)" : "linear-gradient(90deg, #6366f1, #3b82f6)",
                      borderRadius: "100px",
                      transition: "width 0.4s ease",
                    }}
                  ></div>
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVault(vault);
                      setActionType("deposit");
                      setAmount("");
                    }}
                    style={{
                      flex: 1,
                      background: "rgba(255,255,255,0.08)",
                      border: "none",
                      borderRadius: "10px",
                      padding: "0.55rem 0.75rem",
                      color: "#fff",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <i className="fa-solid fa-arrow-down" style={{ color: "#10b981" }}></i> Verser
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVault(vault);
                      setActionType("withdraw");
                      setAmount("");
                    }}
                    disabled={vault.currentCents <= 0}
                    style={{
                      flex: 1,
                      background: vault.currentCents <= 0 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.08)",
                      border: "none",
                      borderRadius: "10px",
                      padding: "0.55rem 0.75rem",
                      color: vault.currentCents <= 0 ? "rgba(255,255,255,0.25)" : "#fff",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: vault.currentCents <= 0 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <i className="fa-solid fa-arrow-up" style={{ color: "#f59e0b" }}></i> Retirer
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Create Vault */}
      {showCreateModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
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
              maxWidth: "420px",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Créer un nouveau coffre</h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={createVault}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", marginBottom: "0.4rem" }}>
                  Nom du coffre (ex: Vacances d&apos;été, Urgences...)
                </label>
                <input
                  type="text"
                  required
                  maxLength={50}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Voyage au Japon"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff",
                    fontSize: "0.95rem",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", marginBottom: "0.4rem" }}>
                  Objectif à atteindre (€)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="Ex: 1500.00"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff",
                    fontSize: "0.95rem",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.08)",
                    border: "none",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving || !name.trim() || !target}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
                    border: "none",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: saving ? "wait" : "pointer",
                    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)",
                  }}
                >
                  {saving ? "Création…" : "Confirmer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Move Funds (Deposit / Withdraw) */}
      {selectedVault && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
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
              maxWidth: "420px",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <div>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>
                  {actionType === "deposit" ? "Verser vers" : "Retirer de"} {selectedVault.name}
                </h2>
                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", margin: "0.2rem 0 0" }}>
                  Solde du coffre : {formatMoney(selectedVault.currentCents, currency)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVault(null)}
                style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={moveFunds}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", marginBottom: "0.4rem" }}>
                  Montant à {actionType === "deposit" ? "verser" : "retirer"} ({currency})
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  max={
                    actionType === "deposit"
                      ? (availableBalanceCents / 100).toFixed(2)
                      : (selectedVault.currentCents / 100).toFixed(2)
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    boxSizing: "border-box",
                  }}
                />
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginTop: "0.3rem", display: "block" }}>
                  {actionType === "deposit"
                    ? `Maximum disponible : ${formatMoney(availableBalanceCents, currency)}`
                    : `Maximum retirable : ${formatMoney(selectedVault.currentCents, currency)}`}
                </span>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setSelectedVault(null)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.08)",
                    border: "none",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving || !amount || Number(amount) <= 0}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "12px",
                    background: actionType === "deposit"
                      ? "linear-gradient(135deg, #10b981, #059669)"
                      : "linear-gradient(135deg, #f59e0b, #d97706)",
                    border: "none",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: saving ? "wait" : "pointer",
                  }}
                >
                  {saving ? "Traitement…" : actionType === "deposit" ? "Confirmer le versement" : "Confirmer le retrait"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
