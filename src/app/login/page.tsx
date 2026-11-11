"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data: { message?: string } = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message ?? "Impossible de vous connecter.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorMessage("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-section">
      <div className="auth-container">
        
        {/* Top navigation actions */}
        <div className="auth-top-action" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", maxWidth: "460px", margin: "0 auto 1.5rem auto" }}>
          <Link href="/" className="btn-auth-switch">
            <i className="fa-solid fa-arrow-left" style={{ marginRight: "0.5rem" }}></i> Accueil
          </Link>
          <Link href="/register" className="btn-auth-switch">
            S&apos;inscrire
          </Link>
        </div>

        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Bon retour sur CBG Banque</h1>
            <p className="auth-subtitle">Connectez-vous à votre espace sécurisé</p>
          </div>

          {errorMessage && (
            <div className="admin-error-banner" role="alert">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Votre e-mail</label>
              <div className="input-wrapper">
                <i className="fa-regular fa-envelope input-icon"></i>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Mot de passe</label>
              <div className="input-wrapper">
                <i className="fa-lock input-icon"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Afficher le mot de passe"
                >
                  <i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked />
                <span>Se souvenir de moi</span>
              </label>
              <Link href="/forgot-password" className="forgot-link">
                Mot de passe oublié ?
              </Link>
            </div>

            <button type="submit" className="btn-auth-submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="auth-footer-link">
            <span>Vous n&apos;avez pas de compte ?</span>{" "}
            <Link href="/register" className="auth-link-bold">
              S&apos;inscrire
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}