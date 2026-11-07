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
  documentType: string;
  status: string;
  createdAt: string;
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Pour la modale de détails

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
        }
      })
      .catch((error: unknown) => console.error("Erreur chargement utilisateurs", error))
      .finally(() => {
        if (active) setLoadingAuth(false);
      });

    return () => {
      active = false;
    };
  }, []);

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
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
        );
        setSelectedUser(null); // Fermer la modale si ouverte
      } else {
        await fetchUsers();
        alert(data.message ?? "Erreur lors de la mise à jour du statut.");
      }
    } catch {
      alert("Erreur réseau.");
    }
  };

  if (loadingAuth) return null;

  // ================= 1. ÉCRAN DE CONNEXION ADMIN =================
  if (!isAuthenticated) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-logo-badge">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h1>Administration</h1>
            <p>Accès sécurisé CBGBanque</p>
          </div>

          {errorMsg && (
            <div className="admin-error-banner">
              <i className="fa-solid fa-triangle-exclamation"></i> {errorMsg}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="admin-form">
            <div className="form-field">
              <label className="field-label">Nom d&apos;utilisateur</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Admin"
                required
                className="modal-input"
              />
            </div>

            <div className="form-field">
              <label className="field-label">Mot de passe</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                required
                className="modal-input"
              />
            </div>

            <button type="submit" className="btn-modal-action margin-top-1">
              Se connecter au panneau
            </button>
          </form>
        </div>
      </div>
    );
  }

  const pendingUsers = users.filter((u) => u.status === "pending");

  // ================= 2. TABLEAU DE BORD ADMINISTRATIF =================
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
            <span className="stat-card-trend positive">Base de données Turso</span>
          </div>

          <div className="admin-stat-card">
            <span className="stat-card-label">Inscriptions en attente</span>
            <div className="stat-card-value highlight-amber">{pendingUsers.length}</div>
            <span className="stat-card-trend">KYC à valider</span>
          </div>

          <div className="admin-stat-card">
            <span className="stat-card-label">Comptes Approuvés</span>
            <div className="stat-card-value">{users.filter(u => u.status === "approved").length}</div>
            <span className="stat-card-trend positive">Actifs</span>
          </div>

          <div className="admin-stat-card">
            <span className="stat-card-label">Comptes Rejetés</span>
            <div className="stat-card-value">{users.filter(u => u.status === "rejected").length}</div>
            <span className="stat-card-trend">Clôturés</span>
          </div>
        </div>

        {/* Section : Inscriptions en attente de validation */}
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
                  <th>Document</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
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
                      <td><span className="doc-badge-table">{user.documentType}</span></td>
                      <td>
                        <div className="table-actions-row">
                          <button
                            className="btn-table-details"
                            onClick={() => setSelectedUser(user)}
                            style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "0.4rem 0.75rem", borderRadius: "8px", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}
                          >
                            <i className="fa-solid fa-eye"></i> Voir infos
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

      </div>

      {/* ================= MODALE "VOIR TOUTES LES INFOS" ================= */}
      {selectedUser && (
        <div className="modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div className="modal-content" style={{ background: "#0b1120", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", width: "100%", maxWidth: "600px", padding: "2rem", color: "#fff", display: "flex", flexDirection: "column", gap: "1.5rem", maxHeight: "90vh", overflowY: "auto" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Détails complets du profil</h2>
              <button onClick={() => setSelectedUser(null)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "1.25rem", cursor: "pointer" }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.9rem" }}>
              <div><strong>Nom complet :</strong> {selectedUser.civility} {selectedUser.firstName} {selectedUser.lastName}</div>
              <div><strong>Email :</strong> {selectedUser.email}</div>
              <div><strong>Téléphone :</strong> {selectedUser.phone}</div>
              <div><strong>Date de naissance :</strong> {selectedUser.birthDate}</div>
              <div><strong>Lieu de naissance :</strong> {selectedUser.birthPlace}</div>
              <div><strong>Nationalité :</strong> {selectedUser.nationality}</div>
              <div><strong>Pays de résidence :</strong> {selectedUser.residenceCountry}</div>
              <div><strong>Ville & Code postal :</strong> {selectedUser.city} ({selectedUser.postalCode})</div>
              <div style={{ gridColumn: "span 2" }}><strong>Adresse :</strong> {selectedUser.address}</div>
              <div><strong>Profession :</strong> {selectedUser.profession}</div>
              <div><strong>Devise :</strong> {selectedUser.currency}</div>
              <div><strong>Type de document :</strong> {selectedUser.documentType}</div>
              <div><strong>Statut actuel :</strong> <span style={{ color: selectedUser.status === "approved" ? "#22c55e" : selectedUser.status === "rejected" ? "#ef4444" : "#f59e0b" }}>{selectedUser.status}</span></div>
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