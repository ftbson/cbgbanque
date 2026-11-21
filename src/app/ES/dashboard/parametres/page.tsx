"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface UserProfile {
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
  address: string;
  city: string;
  postalCode: string;
  profession: string;
  monthlyIncome?: string | null;
  currency: string;
  status: string;
  createdAt: string;
}

export default function ParametresPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Form states
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [profession, setProfession] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/profile")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success || !data.user) {
          throw new Error(data.message || "No se pudieron cargar los parámetros.");
        }
        setProfile(data.user);
        setPhone(data.user.phone || "");
        setAddress(data.user.address || "");
        setCity(data.user.city || "");
        setPostalCode(data.user.postalCode || "");
        setProfession(data.user.profession || "");
        setMonthlyIncome(data.user.monthlyIncome || "");
      })
      .catch((cause: unknown) => setErrorMsg(cause instanceof Error ? cause.message : "No se pudieron cargar los parámetros."))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (showPasswordSection && newPassword) {
      if (newPassword !== confirmPassword) {
        setErrorMsg("El nuevo password y su confirmación no coinciden.");
        setSaving(false);
        return;
      }
      if (newPassword.length < 8) {
        setErrorMsg("El nuevo password debe tener al menos 8 caracteres.");
        setSaving(false);
        return;
      }
      if (!currentPassword) {
        setErrorMsg("Introduzca su password actual para cambiarlo.");
        setSaving(false);
        return;
      }
    }

    try {
      const payload: {
        phone: string;
        address: string;
        city: string;
        postalCode: string;
        profession: string;
        monthlyIncome: string;
        currentPassword?: string;
        newPassword?: string;
      } = {
        phone,
        address,
        city,
        postalCode,
        profession,
        monthlyIncome,
      };

      if (showPasswordSection && newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await fetch("/api/dashboard/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error de actualización");
      }

      setSuccessMsg("¡Su información se ha guardado correctamente en la base de datos!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordSection(false);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="pret-page-container"><p style={{ color: "#94a3b8", textAlign: "center", marginTop: "2rem" }}>Cargando sus parámetros…</p></div>;
  }

  if (!profile) {
    return (
      <div className="pret-page-container">
        <div className="carte-screen-header">
          <Link href="/ES/dashboard" className="btn-back-circle" aria-label="Volver al panel">
            <i className="fa-solid fa-chevron-left"></i>
          </Link>
          <h1 className="screen-title-center">Ajustes de la cuenta</h1>
          <div style={{ width: "38px" }}></div>
        </div>
        <p role="alert">{errorMsg || "No se pudieron cargar los parámetros."}</p>
      </div>
    );
  }

  return (
    <div className="pret-page-container">
      {/* Header */}
      <div className="carte-screen-header">
        <Link href="/ES/dashboard" className="btn-back-circle" aria-label="Volver al panel">
          <i className="fa-solid fa-chevron-left"></i>
        </Link>
        <h1 className="screen-title-center">Ajustes de la cuenta</h1>
        <div style={{ width: "38px" }}></div>
      </div>

      {errorMsg && <div className="admin-error-banner" style={{ margin: "1rem 0" }}>{errorMsg}</div>}
      {successMsg && (
        <div className="admin-success-banner" style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", padding: "1rem", borderRadius: "12px", margin: "1rem 0", fontSize: "0.92rem" }}>
          <i className="fa-solid fa-circle-check"></i> {successMsg}
        </div>
      )}

      {/* Account Verification & Status Banner */}
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "1.25rem", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>ESTADO DE LA CUENTA</span>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#ffffff", marginTop: "0.2rem" }}>
            {profile?.civility} {profile?.firstName} {profile?.lastName}
          </div>
          <span style={{ fontSize: "0.8rem", color: "#60a5fa" }}>{profile?.email}</span>
        </div>
        <span style={{ background: profile?.status === "approved" ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)", color: profile?.status === "approved" ? "#22c55e" : "#f59e0b", border: `1px solid ${profile?.status === "approved" ? "rgba(34,197,94,0.3)" : "rgba(245,158,11,0.3)"}`, padding: "0.35rem 0.75rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 700 }}>
          {profile?.status === "approved" ? "✓ Cuenta verificada" : "⏳ En validación"}
        </span>
      </div>

      <form onSubmit={handleSaveProfile} className="pret-form-card">
        <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#ffffff", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <i className="fa-solid fa-user-pen" style={{ color: "#3b82f6" }}></i> Mis datos de contacto
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label className="sheet-input-label">Número de teléfono</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="sheet-text-input"
              required
            />
          </div>

          <div>
            <label className="sheet-input-label">Dirección postal</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="sheet-text-input"
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
            <div>
              <label className="sheet-input-label">Ciudad</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="sheet-text-input"
                required
              />
            </div>
            <div>
              <label className="sheet-input-label">Código postal</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="sheet-text-input"
                required
              />
            </div>
          </div>

          <div>
            <label className="sheet-input-label">Situación profesional</label>
            <input
              type="text"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="sheet-text-input"
              required
            />
          </div>

          <div>
            <label className="sheet-input-label">Ingreso mensual neto declarado (€)</label>
            <div style={{ position: "relative" }}>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="sheet-text-input"
                style={{ paddingRight: "3rem" }}
              />
              <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>
                € / mes
              </span>
            </div>
          </div>

          {/* Toggle Password Section */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1rem", marginTop: "0.5rem" }}>
            <button
              type="button"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              style={{ background: "none", border: "none", color: "#60a5fa", cursor: "pointer", fontSize: "0.9rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <i className={`fa-solid ${showPasswordSection ? "fa-chevron-up" : "fa-lock"}`}></i>
              {showPasswordSection ? "Cancelar cambio de contraseña" : "Cambiar mi contraseña"}
            </button>
          </div>

          {showPasswordSection && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", background: "rgba(255,255,255,0.02)", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div>
                <label className="sheet-input-label">Contraseña actual</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="sheet-text-input"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="sheet-input-label">Nueva contraseña (mín. 8 car.)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="sheet-text-input"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="sheet-input-label">Confirmar nueva contraseña</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="sheet-text-input"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="btn-sheet-primary-blue"
            style={{ marginTop: "1rem" }}
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </form>

      {/* Protected legal identification info */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "1.25rem", color: "#94a3b8", fontSize: "0.82rem", lineHeight: "1.6" }}>
        <strong style={{ color: "#ffffff", display: "block", marginBottom: "0.35rem" }}>
          <i className="fa-solid fa-shield-halved"></i> Datos de identidad seguros
        </strong>
        Según las normas bancarias europeas, su nombre, apellidos, nacionalidad y fecha de nacimiento solo pueden modificarse contactando con el soporte de cumplimiento con un justificante oficial en <a href="mailto:conformite@cbgbanque.com" style={{ color: "#60a5fa" }}>conformite@cbgbanque.com</a>.
      </div>
    </div>
  );
}