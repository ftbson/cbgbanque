"use client";

import { useState } from "react";
import Link from "next/link";

// Liste des pays de l'UE en priorité + Autres pays
const euCountries = [
  { code: "FR", name: "France" },
  { code: "BE", name: "Belgique" },
  { code: "LU", name: "Luxembourg" },
  { code: "DE", name: "Allemagne" },
  { code: "ES", name: "Espagne" },
  { code: "IT", name: "Italie" },
  { code: "NL", name: "Pays-Bas" },
  { code: "PT", name: "Portugal" },
  { code: "AT", name: "Autriche" },
  { code: "IE", name: "Irlande" },
];

const otherCountries = [
  { code: "CH", name: "Suisse" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "Royaume-Uni" },
  { code: "US", name: "États-Unis" },
];

export default function RegisterPage() {
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // État du formulaire
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otpCode: ["", "", "", "", "", ""],
    civility: "Monsieur",
    firstName: "",
    lastName: "",
    phone: "",
    birthDate: "",
    birthPlace: "",
    nationality: "FR",
    residenceCountry: "BE",
    currency: "EUR",
    address: "",
    city: "",
    postalCode: "",
    profession: "",
    monthlyIncome: "",
    documentType: "id_card", // id_card, passport, driver_license, residence_permit
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

  const totalSteps = 7; // Étapes actives (après l'écran 0 d'accueil)

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
      const response = await fetch("/api/register/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data: { message?: string } = await response.json();
      if (!response.ok) {
        setErrorMessage(data.message ?? "Impossible d'envoyer le code de vérification.");
        return;
      }
      setStep(2);
    } catch {
      setErrorMessage("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/register/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otpCode: formData.otpCode.join("") }),
      });
      const data: { message?: string } = await response.json();
      if (!response.ok) {
        setErrorMessage(data.message ?? "Code de vérification incorrect.");
        return;
      }
      setStep(3);
    } catch {
      setErrorMessage("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...formData.otpCode];
    newOtp[index] = value;
    updateForm("otpCode", newOtp);

    // Auto-focus vers le champ suivant
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Fonction de soumission finale vers la base de données
  const handleSubmitRegistration = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      // Envoyer les données textuelles à une API ou Server Action
      const response = await fetch("/api/register", {
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
        setErrorMessage(data.message || "Une erreur est survenue lors de l'inscription.");
        setLoading(false);
      }
    } catch {
      setErrorMessage("Erreur de connexion au serveur.");
      setLoading(false);
    }
  };

  if (registrationComplete) {
    return (
      <div className="onboarding-container">
        <div className="onboarding-wrapper">
          <div className="step-card step-welcome">
            <h1 className="step-title-hero">Inscription enregistrée</h1>
            <p className="step-subtitle-hero">
              Votre compte est en attente de validation par l&apos;administrateur. Vous pourrez vous connecter dès son approbation.
            </p>
            <Link href="/login" className="btn-step-primary">
              Aller à la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-container">
     

      <div className="onboarding-wrapper">
        
        {/* En-tête avec bouton Retour & Barre de progression */}
        {step > 0 && (
          <div className="onboarding-header">
            <button onClick={handleBack} className="btn-back-round" aria-label="Retour">
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

        {/* ================= ÉTAPE 0 : ACCUEIL ================= */}
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
            <h1 className="step-title-hero">Bienvenue chez CBG Banque</h1>
            <p className="step-subtitle-hero">
              Ouvrez votre compte en quelques minutes, depuis votre téléphone ou votre ordinateur.
            </p>
            <div className="welcome-actions">
              <button onClick={handleNext} className="btn-step-primary">
                S&apos;inscrire
              </button>
              <Link href="/login" className="btn-step-secondary">
                Se connecter
              </Link>
              <Link href="/" className="btn-step-secondary">
                <i className="fa-solid fa-arrow-left"></i> Aller à l&apos;accueil
              </Link>
              
            </div>
          </div>
        )}

        {/* ================= ÉTAPE 1 : ADRESSE EMAIL ================= */}
        {step === 1 && (
          <div className="step-card">
            <h2 className="step-title">Quelle est votre adresse e-mail ?</h2>
            <p className="step-subtitle">Nous vous enverrons un code pour la vérifier.</p>

            <div className="form-group">
              <input
                type="email"
                placeholder="nom@exemple.com"
                value={formData.email}
                onChange={(e) => updateForm("email", e.target.value)}
                className="step-input"
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="Mot de passe (8 caractères minimum)"
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
              {loading ? "Envoi..." : "Envoyer le code"}
            </button>
            <p className="step-helper-text">
              Vous recevrez un code à 6 chiffres. Pensez à regarder dans vos spams.
            </p>
          </div>
        )}

        {/* ================= ÉTAPE 2 : CODE DE VÉRIFICATION OTP ================= */}
        {step === 2 && (
          <div className="step-card">
            <h2 className="step-title">Saisissez le code</h2>
            <p className="step-subtitle">
              Envoyé à <strong>{formData.email || "votre adresse e-mail"}</strong>
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
              Pas reçu ? Regardez dans vos courriers indésirables (spams). Le code est valable 30 minutes.
            </p>
            <button type="button" onClick={requestOtp} disabled={loading} className="btn-step-secondary">
              {loading ? "Envoi..." : "Renvoyer le code"}
            </button>

            <button onClick={() => setStep(1)} className="btn-step-secondary">
              Modifier l&apos;adresse e-mail
            </button>
            <button
              onClick={verifyOtp}
              disabled={loading || formData.otpCode.some((digit) => !digit)}
              className="btn-step-primary margin-top-1"
            >
              {loading ? "Vérification..." : "Valider le code"}
            </button>
          </div>
        )}

        {/* ================= ÉTAPE 3 : NOM & NOM DE FAMILLE & TEL ================= */}
        {step === 3 && (
          <div className="step-card">
            <h2 className="step-title">Comment vous appelez-vous ?</h2>
            <p className="step-subtitle">Indiquez votre nom tel qu&apos;il figure sur votre pièce d&apos;identité.</p>

            <div className="civility-selector">
              {["Monsieur", "Madame", "Mx"].map((c) => (
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
                placeholder="Prénom"
                value={formData.firstName}
                onChange={(e) => updateForm("firstName", e.target.value)}
                className="step-input"
              />
              <input
                type="text"
                placeholder="Nom"
                value={formData.lastName}
                onChange={(e) => updateForm("lastName", e.target.value)}
                className="step-input"
              />
              <input
                type="tel"
                placeholder="Numéro de téléphone (+33 / +32...)"
                value={formData.phone}
                onChange={(e) => updateForm("phone", e.target.value)}
                className="step-input"
              />
            </div>

            <button onClick={handleNext} className="btn-step-primary">
              Continuer
            </button>
          </div>
        )}

        {/* ================= ÉTAPE 4 : NAISSANCE & NATIONALITÉ ================= */}
        {step === 4 && (
          <div className="step-card">
            <h2 className="step-title">Quand êtes-vous né(e) ?</h2>
            <p className="step-subtitle">Vous devez avoir au moins 18 ans pour ouvrir un compte.</p>

            <div className="form-group-stack">
              <input
                type="text"
                placeholder="Date de naissance (JJ/MM/AAAA)"
                value={formData.birthDate}
                onChange={(e) => updateForm("birthDate", e.target.value)}
                className="step-input"
              />
              <input
                type="text"
                placeholder="Lieu de naissance"
                value={formData.birthPlace}
                onChange={(e) => updateForm("birthPlace", e.target.value)}
                className="step-input"
              />

              <div className="select-wrapper">
                <label className="select-label">Nationalité</label>
                <select
                  value={formData.nationality}
                  onChange={(e) => updateForm("nationality", e.target.value)}
                  className="step-select"
                >
                  <optgroup label="Union Européenne">
                    {euCountries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Autres pays">
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
              Continuer
            </button>
          </div>
        )}

        {/* ================= ÉTAPE 5 : ADRESSE & DEVISE ================= */}
        {step === 5 && (
          <div className="step-card">
            <h2 className="step-title">Où habitez-vous ?</h2>
            <p className="step-subtitle">Votre adresse de résidence principale.</p>

            <div className="form-group-stack">
              <div className="select-wrapper">
                <label className="select-label">Pays de résidence</label>
                <select
                  value={formData.residenceCountry}
                  onChange={(e) => updateForm("residenceCountry", e.target.value)}
                  className="step-select"
                >
                  <optgroup label="Union Européenne">
                    {euCountries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Autres pays">
                    {otherCountries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="select-wrapper">
                <label className="select-label">Devise de votre compte</label>
                <select
                  value={formData.currency}
                  onChange={(e) => updateForm("currency", e.target.value)}
                  className="step-select"
                >
                  <option value="EUR">€ EUR — Euro</option>
                  <option value="CHF">CHF — Franc Suisse</option>
                  <option value="USD">$ USD — Dollar Américain</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Adresse postale"
                value={formData.address}
                onChange={(e) => updateForm("address", e.target.value)}
                className="step-input"
              />

              <div className="input-grid-2">
                <input
                  type="text"
                  placeholder="Ville"
                  value={formData.city}
                  onChange={(e) => updateForm("city", e.target.value)}
                  className="step-input"
                />
                <input
                  type="text"
                  placeholder="Code postal"
                  value={formData.postalCode}
                  onChange={(e) => updateForm("postalCode", e.target.value)}
                  className="step-input"
                />
              </div>
            </div>

            <button onClick={handleNext} className="btn-step-primary">
              Continuer
            </button>
          </div>
        )}

        {/* ================= ÉTAPE 6 : SITUATION PROFESSIONNELLE & SALAIRE ================= */}
        {step === 6 && (
          <div className="step-card">
            <h2 className="step-title">Quelle est votre situation professionnelle ?</h2>
            <p className="step-subtitle">Renseignez votre activité et vos revenus mensuels nets.</p>

            <div className="radio-options-list">
              {[
                "Salarié(e)",
                "Indépendant(e)",
                "Chef d'entreprise",
                "Fonctionnaire",
                "Étudiant(e)",
                "Retraité(e)",
                "Sans emploi",
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
                Revenu mensuel net estimé (salaire en €)
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  min="0"
                  placeholder="Ex : 2500"
                  value={formData.monthlyIncome}
                  onChange={(e) => updateForm("monthlyIncome", e.target.value)}
                  className="step-input"
                  style={{ paddingRight: "3rem" }}
                />
                <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontWeight: 600 }}>
                  € / mois
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
              Continuer
            </button>
          </div>
        )}

        {/* ================= ÉTAPE 7 : UPLOAD DE PIÈCE D'IDENTITÉ ================= */}
        {step === 7 && (
          <div className="step-card">
            <h2 className="step-title">Photographiez votre pièce</h2>
            <p className="step-subtitle">Recto et verso, bien cadrés, sans reflet ni flou.</p>

            {/* Choix du document */}
            <div className="document-type-selector">
              {[
                { id: "id_card", label: "Carte d'identité", sub: "Recto et verso", icon: "fa-id-card" },
                { id: "passport", label: "Passeport", sub: "Page photo uniquement", icon: "fa-passport" },
                { id: "driver", label: "Permis de conduire", sub: "Recto et verso", icon: "fa-id-badge" },
                { id: "residence", label: "Titre de séjour", sub: "Recto et verso", icon: "fa-address-card" },
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

            {/* Zones d'upload RECTO & VERSO */}
            <div className="upload-zones-wrapper">
              {/* RECTO */}
              <div className="upload-box">
                <div className="upload-box-header">
                  <span>Recto de la pièce d&apos;identité</span>
                  <span className="badge-required" style={{ background: formData.docFrontBase64 ? "rgba(34,197,94,0.2)" : undefined, color: formData.docFrontBase64 ? "#22c55e" : undefined }}>
                    {formData.docFrontBase64 ? "✓ Chargé" : "Requis"}
                  </span>
                </div>
                <div className="upload-frame">
                  {formData.docFrontBase64 ? (
                    <div style={{ position: "relative", width: "100%", maxHeight: "120px", overflow: "hidden", borderRadius: "8px", margin: "0.5rem 0" }}>
                      <img src={formData.docFrontBase64} alt="Recto aperçu" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ) : (
                    <>
                      <i className="fa-solid fa-id-card frame-icon"></i>
                      <span className="frame-text">Prise de vue ou téléversement</span>
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
                    <i className="fa-solid fa-upload"></i> {formData.docFront ? formData.docFront.name : "Importer le Recto"}
                  </label>
                </div>
              </div>

              {/* VERSO (Si pas passeport) */}
              {formData.documentType !== "passport" && (
                <div className="upload-box">
                  <div className="upload-box-header">
                    <span>Verso de la pièce d&apos;identité</span>
                    <span className="badge-required" style={{ background: formData.docBackBase64 ? "rgba(34,197,94,0.2)" : undefined, color: formData.docBackBase64 ? "#22c55e" : undefined }}>
                      {formData.docBackBase64 ? "✓ Chargé" : "Requis"}
                    </span>
                  </div>
                  <div className="upload-frame">
                    {formData.docBackBase64 ? (
                      <div style={{ position: "relative", width: "100%", maxHeight: "120px", overflow: "hidden", borderRadius: "8px", margin: "0.5rem 0" }}>
                        <img src={formData.docBackBase64} alt="Verso aperçu" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ) : (
                      <>
                        <i className="fa-solid fa-id-card frame-icon"></i>
                        <span className="frame-text">Prise de vue ou téléversement</span>
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
                      <i className="fa-solid fa-upload"></i> {formData.docBack ? formData.docBack.name : "Importer le Verso"}
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
              {loading ? "Création du compte en cours..." : "Terminer mon inscription"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}