"use client";

import { useState } from "react";
import Link from "next/link";

const euCountries = [
  { code: "FR", name: "Frankreich" },
  { code: "BE", name: "Belgien" },
  { code: "LU", name: "Luxemburg" },
  { code: "DE", name: "Deutschland" },
  { code: "ES", name: "Spanien" },
  { code: "IT", name: "Italien" },
  { code: "NL", name: "Niederlande" },
  { code: "PT", name: "Portugal" },
  { code: "AT", name: "Österreich" },
  { code: "IE", name: "Irland" },
];

const otherCountries = [
  { code: "CH", name: "Schweiz" },
  { code: "CA", name: "Kanada" },
  { code: "GB", name: "Vereinigtes Königreich" },
  { code: "US", name: "USA" },
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
    civility: "Herr",
    firstName: "",
    lastName: "",
    phone: "",
    birthDate: "",
    birthPlace: "",
    nationality: "DE",
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
      const response = await fetch("/DE/api/register/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data: { message?: string } = await response.json();
      if (!response.ok) {
        setErrorMessage(data.message ?? "Verifizierungscode konnte nicht gesendet werden.");
        return;
      }
      setStep(2);
    } catch {
      setErrorMessage("Fehler bei der Verbindung zum Server.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("/DE/api/register/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otpCode: formData.otpCode.join("") }),
      });
      const data: { message?: string } = await response.json();
      if (!response.ok) {
        setErrorMessage(data.message ?? "Verifizierungscode ist falsch.");
        return;
      }
      setStep(3);
    } catch {
      setErrorMessage("Fehler bei der Verbindung zum Server.");
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
      const response = await fetch("/DE/api/register", {
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
        setErrorMessage(data.message || "Ein Fehler ist bei der Registrierung aufgetreten.");
        setLoading(false);
      }
    } catch {
      setErrorMessage("Fehler bei der Verbindung zum Server.");
      setLoading(false);
    }
  };

  if (registrationComplete) {
    return (
      <div className="onboarding-container">
        <div className="onboarding-wrapper">
          <div className="step-card step-welcome">
            <h1 className="step-title-hero">Registrierung erfasst</h1>
            <p className="step-subtitle-hero">
              Ihr Konto wartet auf die Validierung durch den Administrator. Sie können sich anmelden, sobald es genehmigt wurde.
            </p>
            <Link href="/DE/login" className="btn-step-primary">
              Zur Anmeldung
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
            <button onClick={handleBack} className="btn-back-round" aria-label="Zurück">
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
            <h1 className="step-title-hero">Willkommen bei CBG Bank</h1>
            <p className="step-subtitle-hero">
              Eröffnen Sie Ihr Konto in wenigen Minuten, von Ihrem Telefon oder Computer aus.
            </p>
            <div className="welcome-actions">
              <button onClick={handleNext} className="btn-step-primary">
                Registrieren
              </button>
              <Link href="/DE/login" className="btn-step-secondary">
                Anmelden
              </Link>
              <Link href="/DE" className="btn-step-secondary">
                <i className="fa-solid fa-arrow-left"></i> Zur Startseite
              </Link>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="step-card">
            <h2 className="step-title">Wie lautet Ihre E-Mail-Adresse?</h2>
            <p className="step-subtitle">Wir senden Ihnen einen Code zur Verifizierung.</p>

            <div className="form-group">
              <input
                type="email"
                placeholder="name@beispiel.de"
                value={formData.email}
                onChange={(e) => updateForm("email", e.target.value)}
                className="step-input"
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="Passwort (mindestens 8 Zeichen)"
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
              {loading ? "Wird gesendet..." : "Code senden"}
            </button>
            <p className="step-helper-text">
              Sie erhalten einen 6-stelligen Code. Bitte auch im Spam-Ordner nachsehen.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="step-card">
            <h2 className="step-title">Code eingeben</h2>
            <p className="step-subtitle">
              Gesendet an <strong>{formData.email || "Ihre E-Mail-Adresse"}</strong>
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
              Nicht erhalten? Bitte im Spam-Ordner nachsehen. Der Code ist 30 Minuten gültig.
            </p>
            <button type="button" onClick={requestOtp} disabled={loading} className="btn-step-secondary">
              {loading ? "Wird gesendet..." : "Code erneut senden"}
            </button>
            <button onClick={() => setStep(1)} className="btn-step-secondary">
              E-Mail-Adresse ändern
            </button>
            <button
              onClick={verifyOtp}
              disabled={loading || formData.otpCode.some((digit) => !digit)}
              className="btn-step-primary margin-top-1"
            >
              {loading ? "Wird verifiziert..." : "Code bestätigen"}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="step-card">
            <h2 className="step-title">Wie heißen Sie?</h2>
            <p className="step-subtitle">Geben Sie Ihren Namen so an, wie er auf Ihrem Ausweis steht.</p>

            <div className="civility-selector">
              {["Herr", "Frau", "Mx"].map((c) => (
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
                placeholder="Vorname"
                value={formData.firstName}
                onChange={(e) => updateForm("firstName", e.target.value)}
                className="step-input"
              />
              <input
                type="text"
                placeholder="Nachname"
                value={formData.lastName}
                onChange={(e) => updateForm("lastName", e.target.value)}
                className="step-input"
              />
              <input
                type="tel"
                placeholder="Telefonnummer (+49 / +32...)"
                value={formData.phone}
                onChange={(e) => updateForm("phone", e.target.value)}
                className="step-input"
              />
            </div>

            <button onClick={handleNext} className="btn-step-primary">
              Weiter
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="step-card">
            <h2 className="step-title">Wann sind Sie geboren?</h2>
            <p className="step-subtitle">Sie müssen mindestens 18 Jahre alt sein, um ein Konto zu eröffnen.</p>

            <div className="form-group-stack">
              <input
                type="text"
                placeholder="Geburtsdatum (TT.MM.JJJJ)"
                value={formData.birthDate}
                onChange={(e) => updateForm("birthDate", e.target.value)}
                className="step-input"
              />
              <input
                type="text"
                placeholder="Geburtsort"
                value={formData.birthPlace}
                onChange={(e) => updateForm("birthPlace", e.target.value)}
                className="step-input"
              />

              <div className="select-wrapper">
                <label className="select-label">Staatsangehörigkeit</label>
                <select
                  value={formData.nationality}
                  onChange={(e) => updateForm("nationality", e.target.value)}
                  className="step-select"
                >
                  <optgroup label="Europäische Union">
                    {euCountries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Andere Länder">
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
              Weiter
            </button>
          </div>
        )}

        {step === 5 && (
          <div className="step-card">
            <h2 className="step-title">Wo wohnen Sie?</h2>
            <p className="step-subtitle">Ihre Hauptwohnsitzadresse.</p>

            <div className="form-group-stack">
              <div className="select-wrapper">
                <label className="select-label">Wohnsitzland</label>
                <select
                  value={formData.residenceCountry}
                  onChange={(e) => updateForm("residenceCountry", e.target.value)}
                  className="step-select"
                >
                  <optgroup label="Europäische Union">
                    {euCountries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Andere Länder">
                    {otherCountries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="select-wrapper">
                <label className="select-label">Währung Ihres Kontos</label>
                <select
                  value={formData.currency}
                  onChange={(e) => updateForm("currency", e.target.value)}
                  className="step-select"
                >
                  <option value="EUR">€ EUR — Euro</option>
                  <option value="CHF">CHF — Schweizer Franken</option>
                  <option value="USD">$ USD — US-Dollar</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Postanschrift"
                value={formData.address}
                onChange={(e) => updateForm("address", e.target.value)}
                className="step-input"
              />

              <div className="input-grid-2">
                <input
                  type="text"
                  placeholder="Stadt"
                  value={formData.city}
                  onChange={(e) => updateForm("city", e.target.value)}
                  className="step-input"
                />
                <input
                  type="text"
                  placeholder="Postleitzahl"
                  value={formData.postalCode}
                  onChange={(e) => updateForm("postalCode", e.target.value)}
                  className="step-input"
                />
              </div>
            </div>

            <button onClick={handleNext} className="btn-step-primary">
              Weiter
            </button>
          </div>
        )}

        {step === 6 && (
          <div className="step-card">
            <h2 className="step-title">Wie ist Ihre berufliche Situation?</h2>
            <p className="step-subtitle">Geben Sie Ihre Tätigkeit und Ihr monatliches Nettoeinkommen an.</p>

            <div className="radio-options-list">
              {[
                "Angestellt",
                "Selbstständig",
                "Unternehmer",
                "Beamter",
                "Student",
                "Rentner",
                "Arbeitslos",
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
                Geschätztes monatliches Nettoeinkommen (Gehalt in €)
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  min="0"
                  placeholder="Z.B. 2500"
                  value={formData.monthlyIncome}
                  onChange={(e) => updateForm("monthlyIncome", e.target.value)}
                  className="step-input"
                  style={{ paddingRight: "3rem" }}
                />
                <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontWeight: 600 }}>
                  € / Monat
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
              Weiter
            </button>
          </div>
        )}

        {step === 7 && (
          <div className="step-card">
            <h2 className="step-title">Fotografieren Sie Ihren Ausweis</h2>
            <p className="step-subtitle">Vorder- und Rückseite, gut ausgeleuchtet, ohne Reflexionen oder Unschärfe.</p>

            <div className="document-type-selector">
              {[
                { id: "id_card", label: "Personalausweis", sub: "Vorder- und Rückseite", icon: "fa-id-card" },
                { id: "passport", label: "Reisepass", sub: "Nur Foto-Seite", icon: "fa-passport" },
                { id: "driver", label: "Führerschein", sub: "Vorder- und Rückseite", icon: "fa-id-badge" },
                { id: "residence", label: "Aufenthaltstitel", sub: "Vorder- und Rückseite", icon: "fa-address-card" },
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
                  <span>Vorderseite des Ausweises</span>
                  <span className="badge-required" style={{ background: formData.docFrontBase64 ? "rgba(34,197,94,0.2)" : undefined, color: formData.docFrontBase64 ? "#22c55e" : undefined }}>
                    {formData.docFrontBase64 ? "✓ Geladen" : "Erforderlich"}
                  </span>
                </div>
                <div className="upload-frame">
                  {formData.docFrontBase64 ? (
                    <div style={{ position: "relative", width: "100%", maxHeight: "120px", overflow: "hidden", borderRadius: "8px", margin: "0.5rem 0" }}>
                      <img src={formData.docFrontBase64} alt="Vorderseite Vorschau" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ) : (
                    <>
                      <i className="fa-solid fa-id-card frame-icon"></i>
                      <span className="frame-text">Aufnehmen oder hochladen</span>
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
                    <i className="fa-solid fa-upload"></i> {formData.docFront ? formData.docFront.name : "Vorderseite hochladen"}
                  </label>
                </div>
              </div>

              {formData.documentType !== "passport" && (
                <div className="upload-box">
                  <div className="upload-box-header">
                    <span>Rückseite des Ausweises</span>
                    <span className="badge-required" style={{ background: formData.docBackBase64 ? "rgba(34,197,94,0.2)" : undefined, color: formData.docBackBase64 ? "#22c55e" : undefined }}>
                      {formData.docBackBase64 ? "✓ Geladen" : "Erforderlich"}
                    </span>
                  </div>
                  <div className="upload-frame">
                    {formData.docBackBase64 ? (
                      <div style={{ position: "relative", width: "100%", maxHeight: "120px", overflow: "hidden", borderRadius: "8px", margin: "0.5rem 0" }}>
                        <img src={formData.docBackBase64} alt="Rückseite Vorschau" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ) : (
                      <>
                        <i className="fa-solid fa-id-card frame-icon"></i>
                        <span className="frame-text">Aufnehmen oder hochladen</span>
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
                      <i className="fa-solid fa-upload"></i> {formData.docBack ? formData.docBack.name : "Rückseite hochladen"}
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
              {loading ? "Konto wird erstellt..." : "Registrierung abschließen"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}