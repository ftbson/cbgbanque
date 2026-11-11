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
  interestRate: number;
  monthlyPayment: number;
  totalPayment: number;
  dossierFees: number;
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"users" | "loans">("users");

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
        }
      })
      .catch((error: unknown) => console.error("Erreur chargement utilisateurs", error))
      .finally(() => {
        if (active) setLoadingAuth(false);
      });

    return () => {
      active = false;
    };
  }, [fetchLoans]);

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
      if (!res.ok) {
        alert(data.message || "Erreur de validation");
        return;
      }
      await fetchUsers();
      if (selectedUser?.id === userId) {
        setSelectedUser((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      console.error("Erreur mise à jour utilisateur", err);
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
      if (!res.ok) {
        alert(data.message || "Erreur lors de la mise à jour du prêt");
        return;
      }
      await fetchLoans();
    } catch (err) {
      console.error("Erreur modification prêt admin", err);
    }
  };

  if (loadingAuth) {
    return (
      <div className="admin-loading-screen" style={{ color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <p>Vérification des autorisations...</p>
      </div>
    );
  }

  // ÉCRAN DE CONNEXION ADMIN
  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <div className="admin-brand-logo">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h2 className="admin-title">Espace d&apos;Administration</h2>
          <p className="admin-subtitle">CBG Banque Finance · Accès restreint</p>

          {errorMsg && (
            <div className="admin-error-banner" role="alert">
              <i className="fa-solid fa-circle-exclamation"></i> {errorMsg}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="admin-form">
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
                  placeholder="Admin"
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
            <span className="stat-card-trend positive">Base de données</span>
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
            <span className="stat-card-label">Comptes Approuvés</span>
            <div className="stat-card-value">{users.filter((u) => u.status === "approved").length}</div>
            <span className="stat-card-trend positive">Actifs</span>
          </div>
        </div>

        {/* Tab Switcher: Utilisateurs / Prêts */}
        <div style={{ display: "flex", gap: "1rem", margin: "2rem 0 1rem 0" }}>
          <button
            onClick={() => setActiveTab("users")}
            className={`btn-table-details ${activeTab === "users" ? "active-tab" : ""}`}
            style={{
              background: activeTab === "users" ? "#2563eb" : "rgba(255,255,255,0.06)",
              color: "#fff",
              padding: "0.75rem 1.5rem",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            <i className="fa-solid fa-users"></i> Inscriptions & KYC ({pendingUsers.length} en attente)
          </button>

          <button
            onClick={() => setActiveTab("loans")}
            className={`btn-table-details ${activeTab === "loans" ? "active-tab" : ""}`}
            style={{
              background: activeTab === "loans" ? "#2563eb" : "rgba(255,255,255,0.06)",
              color: "#fff",
              padding: "0.75rem 1.5rem",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            <i className="fa-solid fa-hand-holding-dollar"></i> Demandes de Prêt ({pendingLoans.length} en attente)
          </button>
        </div>

        {/* ================= ONGLET 1 : UTILISATEURS (KYC) ================= */}
        {activeTab === "users" && (
          <div className="admin-section">
            <div className="section-header-admin">
              <h3 className="admin-section-title">Validation des inscriptions (KYC)</h3>
              <span className="badge-count">{pendingUsers.length} en attente</span>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Pays</th>
                    <th>Salaire déclaré</th>
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
                            <button
                              className="btn-table-details"
                              onClick={() => setSelectedUser(user)}
                              style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "0.4rem 0.75rem", borderRadius: "8px", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}
                            >
                              <i className="fa-solid fa-eye"></i> Voir infos & pièces
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
              <h3 className="admin-section-title">Gestion des demandes de prêt & crédit</h3>
              <span className="badge-count">{loans.length} dossiers</span>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Demandeur</th>
                    <th>Montant demandé</th>
                    <th>Durée & Mensualité</th>
                    <th>Frais & Coût total</th>
                    <th>Motif</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
                        Aucune demande de prêt enregistrée.
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
                              <div style={{ fontSize: "0.75rem", color: "#60a5fa" }}>Salaire : {loan.monthlyIncome} €/mois</div>
                            )}
                          </div>
                        </td>
                        <td>
                          <strong style={{ fontSize: "1.05rem", color: "#60a5fa" }}>
                            {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(loan.amount)}
                          </strong>
                        </td>
                        <td>
                          <div>{loan.durationMonths} mois</div>
                          <div style={{ fontSize: "0.8rem", color: "#22c55e", fontWeight: 600 }}>
                            {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(loan.monthlyPayment)} / mois
                          </div>
                        </td>
                        <td>
                          <div>Frais : {loan.dossierFees} €</div>
                          <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Total : {loan.totalPayment} €</div>
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
                            {loan.status === "approved" ? "Approuvé" : loan.status === "rejected" ? "Rejeté" : "En attente"}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions-row">
                            {loan.status !== "approved" && (
                              <button
                                className="btn-table-approve"
                                onClick={() => updateLoanStatus(loan.id, "approved")}
                                title="Approuver et créditer les fonds"
                              >
                                <i className="fa-solid fa-check"></i> Valider prêt
                              </button>
                            )}
                            {loan.status !== "rejected" && (
                              <button
                                className="btn-table-reject"
                                onClick={() => updateLoanStatus(loan.id, "rejected")}
                                title="Refuser le prêt"
                              >
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

      </div>

      {/* ================= MODALE "VOIR TOUTES LES INFOS & PIÈCES D'IDENTITÉ" ================= */}
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
