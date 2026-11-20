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
      const response = await fetch("/ES/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data: { message?: string } = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message ?? "No se pudo iniciar sesión.");
        return;
      }

      router.push("/ES/dashboard");
      router.refresh();
    } catch {
      setErrorMessage("Error de conexión al servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-section">
      <div className="auth-container">

        {/* Top navigation actions */}
        <div className="auth-top-action" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", maxWidth: "460px", margin: "0 auto 1.5rem auto" }}>
          <Link href="/ES" className="btn-auth-switch">
            <i className="fa-solid fa-arrow-left" style={{ marginRight: "0.5rem" }}></i> Inicio
          </Link>
          <Link href="/ES/abrir-cuenta" className="btn-auth-switch">
            Registrarse
          </Link>
        </div>

        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Bienvenido de nuevo a CBG Banco</h1>
            <p className="auth-subtitle">Accede a tu espacio seguro</p>
          </div>

          {errorMessage && (
            <div className="admin-error-banner" role="alert">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Tu e-mail</label>
              <div className="input-wrapper">
                <i className="fa-regular fa-envelope input-icon"></i>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="nombre@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Contraseña</label>
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
                  aria-label="Mostrar contraseña"
                >
                  <i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked />
                <span>Recordarme</span>
              </label>
              <Link href="/ES/olvide-contrasena" className="forgot-link">
                ¿Contraseña olvidada?
              </Link>
            </div>

            <button type="submit" className="btn-auth-submit" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          <div className="auth-footer-link">
            <span>¿No tienes cuenta?</span>{" "}
            <Link href="/ES/abrir-cuenta" className="auth-link-bold">
              Registrarse
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}