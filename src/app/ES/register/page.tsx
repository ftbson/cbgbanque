"use client";

import { useState } from "react";
import Link from "next/link";

const euCountries = [
  { code: "FR", name: "Francia" },
  { code: "BE", name: "Bélgica" },
  { code: "LU", name: "Luxemburgo" },
  { code: "DE", name: "Alemania" },
  { code: "ES", name: "España" },
  { code: "IT", name: "Italia" },
  { code: "NL", name: "Países Bajos" },
  { code: "PT", name: "Portugal" },
  { code: "AT", name: "Austria" },
  { code: "IE", name: "Irlanda" },
];

const otherCountries = [
  { code: "CH", name: "Suiza" },
  { code: "CA", name: "Canadá" },
  { code: "GB", name: "Reino Unido" },
  { code: "US", name: "EE. UU." },
];

export default function RegisterPage() {
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otpCode: ["", "", "", "", "", ""],
    civility: "Señor",
    firstName: "",
    lastName: "",
    phone: "",
    birthDate: "",
    birthPlace: "",
    nationality: "ES",
    residenceCountry: "BE",
    currency: "EUR",
    address: "",
    city: "",
    postalCode: "",
    profession: "",
    monthlyIncome: "",
    documentType: "id_card",
    docFront: null as File | null,
    docFrontBase64: "",
    docBack: null as File | null,
    docBackBase64: "",
  });

  const handleFileChange = (type: "front" | "back", file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string) || "";
      if (type === "front") {
        setFormData((prev) => ({ ...prev, docFront: file, docFrontBase64: base64 }));
      } else {
        setFormData((prev) => ({ ...prev, docBack: file, docBackBase64: base64 }));
      }
    };
    reader.readAsDataURL(file);
  };

  const totalSteps = 7;

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => Math.max(0, prev - 1));

  const updateForm = <K extends keyof typeof formData>(
    key: K,
    value: (typeof formData)[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const requestOtp = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("/ES/api/register/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data: { message?: string } = await response.json();
      if (!response.ok) {
        setErrorMessage(data.message ?? "No se pudo enviar el código de verificación.");
        return;
      }
      setStep(2);
    } catch {
      setErrorMessage("Error de conexión al servidor.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("/ES/api/register/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otpCode: formData.otpCode.join("") }),
      });
      const data: { message?: string } = await response.json();
      if (!response.ok) {
        setErrorMessage(data.message ?? "Código de verificación incorrecto.");
        return;
      }
      setStep(3);
    } catch {
      setErrorMessage("Error de conexión al servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...formData.otpCode];
    newOtp[index] = value;
    updateForm("otpCode", newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSubmitRegistration = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/ES/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          civility: formData.civility,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          birthDate: formData.birthDate,
          birthPlace: formData.birthPlace,
          nationality: formData.nationality,
          residenceCountry: formData.residenceCountry,
          currency: formData.currency,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          profession: formData.profession,
          monthlyIncome: formData.monthlyIncome,
          documentType: formData.documentType,
          idCardFront: formData.docFrontBase64,
          idCardBack: formData.docBackBase64,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRegistrationComplete(true);
      } else {
        setErrorMessage(data.message || "Se ha producido un error durante el registro.");
        setLoading(false);
      }
    } catch {
      setErrorMessage("Error de conexión al servidor.");
      setLoading(false);
    }
  };

  if (registrationComplete) {
    return (
      <div className="onboarding-container">
        <div className="onboarding-wrapper">
          <div className="step-card step-welcome">
            <h1 className="step-title-hero">Registro completado</h1>
            <p className="step-subtitle-hero">
              Su cuenta está pendiente de validación por el administrador. Podrá iniciar sesión una vez aprobada.
            </p>
            <Link href="/ES/iniciar-sesion" className="btn-step-primary">
              Ir a iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-container">
      <div className="onboarding-wrapper">

        {step > 0 && (
          <div className="onboarding-header">
            <button onClick={handleBack} className="btn-back-round" aria-label="Volver">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <div className="progress-bar-container">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <div
                  key={idx}
                  className={`progress-segment ${step > idx ? "active" : ""}`}
                ></div>
              ))}
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="admin-error-banner" style={{ marginBottom: "1rem" }}>
            <i className="fa-solid fa-triangle-exclamation"></i> {errorMessage}
          </div>
        )}

        {step === 0 && (
          <div className="step-card step-welcome">
            <div className="welcome-logo">
              <svg viewBox="0 0 100 100" className="brand-svg">
                <circle cx="50" cy="50" r="40" fill="none" stroke="url(#blue-grad)" strokeWidth="12" />
                <defs>
                  <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <text x="50" y="57" textAnchor="middle" fill="#ffffff" fontSize="22" fontWeight="bold">
                  CBG
                </text>
              </svg>
            </div>
            <h1 className="step-title-hero">Bienvenido a CBG Banco</h1>
            <p className="step-subtitle-hero">
              Abra su cuenta en pocos minutos, desde su teléfono o su ordenador.
            </p>
            <div className="welcome-actions">
              <button onClick={handleNext} className="btn-step-primary">
                Registrarse
              </button>
              <Link href="/ES/iniciar-sesion" className="btn-step-secondary">
                Iniciar sesión
              </Link>
              <Link href="/ES" className="btn-step-secondary">
                <i className="fa-solid fa-arrow-left"></i> Ir al inicio
              </Link>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="step-card">
            <h2 className="step-title">¿Cuál es su dirección de e-mail?</h2>
            <p className="step-subtitle">Le enviaremos un código para verificarlo.</p>

            <div className="form-group">
              <input
                type="email"
                placeholder="nombre@ejemplo.com"
                value={formData.email}
                onChange={(e) => updateForm("email", e.target.value)}
                className="step-input"
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="Contraseña (mínimo 8 caracteres)"
                value={formData.password}
                onChange={(e) => updateForm("password", e.target.value)}
                className="step-input"
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <button
              onClick={requestOtp}
              disabled={loading || !formData.email.includes("@") || formData.password.length < 8}
              className="btn-step-primary"
            >
              {loading ? "Enviando..." : "Enviar código"}
            </button>
            <p className="step-helper-text">
              Recibirá un código de 6 dígitos. Revise también la carpeta de spam.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="step-card">
            <h2 className="step-title">Introduzca el código</h2>
            <p className="step-subtitle">
              Enviado a <strong>{formData.email || "su dirección de e-mail"}</strong>
            </p>

            <div className="otp-inputs-grid">
              {formData.otpCode.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="otp-box"
                />
              ))}
            </div>

            <p className="step-helper-text">
              ¿No lo ha recibido? Revise la carpeta de spam. El código es válido durante 30 minutos.
            </p>
            <button type="button" onClick={requestOtp} disabled={loading} className="btn-step-secondary">
              {loading ? "Enviando..." : "Reenviar código"}
            </button>
            <button onClick={() => setStep(1)} className="btn-step-secondary">
              Cambiar dirección de e-mail
            </button>
            <button
              onClick={verifyOtp}
              disabled={loading || formData.otpCode.some((digit) => !digit)}
              className="btn-step-primary margin-top-1"
            >
              {loading ? "Verificando..." : "Validar código"}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="step-card">
            <h2 className="step-title">¿Cómo se llama?</h2>
            <p className="step-subtitle">Indique su nombre tal como aparece en su documento de identidad.</p>

            <div className="civility-selector">
              {["Señor", "Señora", "Mx"].map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`btn-pill ${formData.civility === c ? "active" : ""}`}
                  onClick={() => updateForm("civility", c)}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="form-group-stack">
              <input
                type="text"
                placeholder="Nombre"
                value={formData.firstName}
                onChange={(e) => updateForm("firstName", e.target.value)}
                className="step-input"
              />
              <input
                type="text"
                placeholder="Apellido"
                value={formData.lastName}
                onChange={(e) => updateForm("lastName", e.target.value)}
                className="step-input"
              />
              <input
                type="tel"
                placeholder="Número de teléfono (+34 / +32...)"
                value={formData.phone}
                onChange={(e) => updateForm("phone", e.target.value)}
                className="step-input"
              />
            </div>

            <button onClick={handleNext} className="btn-step-primary">
              Continuar
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="step-card">
            <h2 className="step-title">¿Cuándo nació?</h2>
            <p className="step-subtitle">Debe tener al menos 18 años para abrir una cuenta.</p>

            <div className="form-group-stack">
              <input
                type="text"
                placeholder="Fecha de nacimiento (DD/MM/AAAA)"
                value={formData.birthDate}
                onChange={(e) => updateForm("birthDate", e.target.value)}
                className="step-input"
              />
              <input
                type="text"
                placeholder="Lugar de nacimiento"
                value={formData.birthPlace}
                onChange={(e) => updateForm("birthPlace", e.target.value)}
                className="step-input"
              />

              <div className="select-wrapper">
                <label className="select-label">Nacionalidad</label>
                <select
                  value={formData.nationality}
                  onChange={(e) => updateForm("nationality", e.target.value)}
                  className="step-select"
                >
                  <optgroup label="Unión Europea">
                    {euCountries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Otros países">
                    {otherCountries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            <button onClick={handleNext} className="btn-step-primary">
              Continuar
            </button>
          </div>
        )}

        {step === 5 && (
          <div className="step-card">
            <h2 className="step-title">¿Dónde vive?</h2>
            <p className="step-subtitle">Su dirección de residencia principal.</p>

            <div className="form-group-stack">
              <div className="select-wrapper">
                <label className="select-label">País de residencia</label>
                <select
                  value={formData.residenceCountry}
                  onChange={(e) => updateForm("residenceCountry", e.target.value)}
                  className="step-select"
                >
                  <optgroup label="Unión Europea">
                    {euCountries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Otros países">
                    {otherCountries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="select-wrapper">
                <label className="select-label">Moneda de su cuenta</label>
                <select
                  value={formData.currency}
                  onChange={(e) => updateForm("currency", e.target.value)}
                  className="step-select"
                >
                  <option value="EUR">€ EUR — Euro</option>
                  <option value="CHF">CHF — Franco Suizo</option>
                  <option value="USD">$ USD — Dólar Americano</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Dirección postal"
                value={formData.address}
                onChange={(e) => updateForm("address", e.target.value)}
                className="step-input"
              />

              <div className="input-grid-2">
                <input
                  type="text"
                  placeholder="Ciudad"
                  value={formData.city}
                  onChange={(e) => updateForm("city", e.target.value)}
                  className="step-input"
                />
                <input
                  type="text"
                  placeholder="Código postal"
                  value={formData.postalCode}
                  onChange={(e) => updateForm("postalCode", e.target.value)}
                  className="step-input"
                />
              </div>
            </div>

            <button onClick={handleNext} className="btn-step-primary">
              Continuar
            </button>
          </div>
        )}

        {step === 6 && (
          <div className="step-card">
            <h2 className="step-title">¿Cuál es su situación profesional?</h2>
            <p className="step-subtitle">Indique su actividad y sus ingresos mensuales netos.</p>

            <div className="radio-options-list">
              {[
                "Asalariado/a",
                "Autónomo/a",
                "Empresario/a",
                "Funcionario/a",
                "Estudiante",
                "Jubilado/a",
                "Desempleado/a",
              ].map((job) => (
                <label
                  key={job}
                  className={`radio-card-item ${formData.profession === job ? "selected" : ""}`}
                >
                  <span>{job}</span>
                  <input
                    type="radio"
                    name="profession"
                    checked={formData.profession === job}
                    onChange={() => updateForm("profession", job)}
                  />
                  <span className="radio-circle"></span>
                </label>
              ))}
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <label className="select-label" style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#e2e8f0" }}>
                Ingreso mensual neto estimado (salario en €)
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  min="0"
                  placeholder="Ej: 2500"
                  value={formData.monthlyIncome}
                  onChange={(e) => updateForm("monthlyIncome", e.target.value)}
                  className="step-input"
                  style={{ paddingRight: "3rem" }}
                />
                <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontWeight: 600 }}>
                  € / mes
                </span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                {["1500", "2200", "3000", "4500", "6000"].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => updateForm("monthlyIncome", val)}
                    style={{
                      background: formData.monthlyIncome === val ? "#2563eb" : "rgba(255,255,255,0.06)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "6px",
                      padding: "0.3rem 0.65rem",
                      fontSize: "0.78rem",
                      cursor: "pointer",
                    }}
                  >
                    {val} €
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!formData.profession || !formData.monthlyIncome}
              className="btn-step-primary margin-top-1"
            >
              Continuar
            </button>
          </div>
        )}

        {step === 7 && (
          <div className="step-card">
            <h2 className="step-title">Fotografie su documento</h2>
            <p className="step-subtitle">Anverso y reverso, bien encuadrados, sin reflejos ni desenfoque.</p>

            <div className="document-type-selector">
              {[
                { id: "id_card", label: "DNI / Carné de identidad", sub: "Anverso y reverso", icon: "fa-id-card" },
                { id: "passport", label: "Pasaporte", sub: "Solo página con foto", icon: "fa-passport" },
                { id: "driver", label: "Carnet de conducir", sub: "Anverso y reverso", icon: "fa-id-badge" },
                { id: "residence", label: "Tarjeta de residencia", sub: "Anverso y reverso", icon: "fa-address-card" },
              ].map((doc) => (
                <div
                  key={doc.id}
                  className={`doc-type-item ${formData.documentType === doc.id ? "active" : ""}`}
                  onClick={() => updateForm("documentType", doc.id)}
                >
                  <div className="doc-icon">
                    <i className={`fa-solid ${doc.icon}`}></i>
                  </div>
                  <div className="doc-info">
                    <span className="doc-label">{doc.label}</span>
                    <span className="doc-sub">{doc.sub}</span>
                  </div>
                  <i className="fa-solid fa-chevron-right doc-arrow"></i>
                </div>
              ))}
            </div>

            <div className="upload-zones-wrapper">
              <div className="upload-box">
                <div className="upload-box-header">
                  <span>Anverso del documento</span>
                  <span className="badge-required" style={{ background: formData.docFrontBase64 ? "rgba(34,197,94,0.2)" : undefined, color: formData.docFrontBase64 ? "#22c55e" : undefined }}>
                    {formData.docFrontBase64 ? "✓ Cargado" : "Requerido"}
                  </span>
                </div>
                <div className="upload-frame">
                  {formData.docFrontBase64 ? (
                    <div style={{ position: "relative", width: "100%", maxHeight: "120px", overflow: "hidden", borderRadius: "8px", margin: "0.5rem 0" }}>
                      <img src={formData.docFrontBase64} alt="Anverso vista previa" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ) : (
                    <>
                      <i className="fa-solid fa-id-card frame-icon"></i>
                      <span className="frame-text">Tomar foto o cargar archivo</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("front", e.target.files?.[0] || null)}
                    className="file-input-hidden"
                    id="doc-front"
                  />
                  <label htmlFor="doc-front" className="btn-upload-trigger">
                    <i className="fa-solid fa-upload"></i> {formData.docFront ? formData.docFront.name : "Cargar anverso"}
                  </label>
                </div>
              </div>

              {formData.documentType !== "passport" && (
                <div className="upload-box">
                  <div className="upload-box-header">
                    <span>Reverso del documento</span>
                    <span className="badge-required" style={{ background: formData.docBackBase64 ? "rgba(34,197,94,0.2)" : undefined, color: formData.docBackBase64 ? "#22c55e" : undefined }}>
                      {formData.docBackBase64 ? "✓ Cargado" : "Requerido"}
                    </span>
                  </div>
                  <div className="upload-frame">
                    {formData.docBackBase64 ? (
                      <div style={{ position: "relative", width: "100%", maxHeight: "120px", overflow: "hidden", borderRadius: "8px", margin: "0.5rem 0" }}>
                        <img src={formData.docBackBase64} alt="Reverso vista previa" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ) : (
                      <>
                        <i className="fa-solid fa-id-card frame-icon"></i>
                        <span className="frame-text">Tomar foto o cargar archivo</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange("back", e.target.files?.[0] || null)}
                      className="file-input-hidden"
                      id="doc-back"
                    />
                    <label htmlFor="doc-back" className="btn-upload-trigger">
                      <i className="fa-solid fa-upload"></i> {formData.docBack ? formData.docBack.name : "Cargar reverso"}
                    </label>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSubmitRegistration}
              disabled={loading}
              className="btn-step-primary margin-top-1"
            >
              {loading ? "Creando cuenta..." : "Finalizar mi registro"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}