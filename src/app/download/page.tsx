"use client";

import { useState } from "react";
import Link from "next/link";
import PwaInstallModal, { usePwa } from "@/components/PwaInstallModal";

export default function DownloadPage() {
  const [showModal, setShowModal] = useState(false);
  const { triggerInstall, isInstalled } = usePwa();

  const handleInstall = async () => {
    const success = await triggerInstall();
    if (!success) {
      setShowModal(true);
    }
  };

  return (
    <div className="download-page-wrapper">
      <div className="download-hero-section">
        <div className="download-hero-glow"></div>
        <span className="legal-pill-badge">
          <i className="fa-solid fa-mobile-screen-button"></i> Application PWA Officielle
        </span>
        <h1 className="download-hero-title">
          Toute votre banque, <span className="gradient-text">au creux de votre main</span>
        </h1>
        <p className="download-hero-sub">
          Installez l&apos;application CBG Banque instantanÃ©ment sans passer par les magasins d&apos;applications. Profitez d&apos;un accÃ¨s rapide, fluide et hautement sÃ©curisÃ© depuis votre Ã©cran d&apos;accueil.
        </p>

        <div className="download-hero-actions">
          <button onClick={handleInstall} className="btn-hero-install">
            <i className="fa-solid fa-download"></i>
            <span>{isInstalled ? "Application dÃ©jÃ  installÃ©e" : "Installer l'application"}</span>
          </button>
          <Link href="/FR/register" className="btn-hero-account">
            Ouvrir un compte gratuit
          </Link>
        </div>
      </div>

      <div className="download-content-container">
        
        {/* Device Guides */}
        <div className="download-guides-grid">
          <div className="guide-card">
            <div className="guide-icon-header">
              <i className="fa-brands fa-android"></i>
              <h3>Android & Chrome</h3>
            </div>
            <p>1. Cliquez sur Â« Installer l&apos;application Â» ci-dessus.</p>
            <p>2. Confirmez l&apos;installation dans la notification du navigateur.</p>
            <p>3. L&apos;icÃ´ne CBG Banque apparaÃ®t directement sur votre Ã©cran d&apos;accueil.</p>
          </div>

          <div className="guide-card">
            <div className="guide-icon-header">
              <i className="fa-brands fa-apple"></i>
              <h3>iPhone & iPad (Safari)</h3>
            </div>
            <p>1. Ouvrez ce site dans le navigateur Safari.</p>
            <p>2. Touchez l&apos;icÃ´ne de partage <i className="fa-solid fa-arrow-up-from-bracket"></i> en bas de l&apos;Ã©cran.</p>
            <p>3. Faites dÃ©filer vers le bas et sÃ©lectionnez <strong>Â« Sur l&apos;Ã©cran d&apos;accueil Â»</strong> <i className="fa-regular fa-square-plus"></i>.</p>
          </div>

          <div className="guide-card">
            <div className="guide-icon-header">
              <i className="fa-solid fa-laptop"></i>
              <h3>Ordinateur (PC & Mac)</h3>
            </div>
            <p>1. Ouvrez le site sous Chrome, Edge ou Brave.</p>
            <p>2. Cliquez sur l&apos;icÃ´ne d&apos;installation dans la barre d&apos;adresse Ã  droite.</p>
            <p>3. CBG Banque s&apos;ouvre dans sa propre fenÃªtre indÃ©pendante et ultra rapide.</p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="download-features-grid">
          <div className="d-feat-box">
            <div className="d-feat-icon"><i className="fa-solid fa-bolt"></i></div>
            <h4>Ultra lÃ©gÃ¨re</h4>
            <p>Moins de 2 Mo, aucune mise Ã  jour lourde requise, se lance instantanÃ©ment.</p>
          </div>
          <div className="d-feat-box">
            <div className="d-feat-icon"><i className="fa-solid fa-shield-halved"></i></div>
            <h4>SÃ©curitÃ© biomÃ©trique</h4>
            <p>Compatible Face ID, Touch ID et empreinte digitale pour vos connexions et virements.</p>
          </div>
          <div className="d-feat-box">
            <div className="d-feat-icon"><i className="fa-solid fa-credit-card"></i></div>
            <h4>Cartes virtuelles</h4>
            <p>CrÃ©ez, gelez et gÃ©rez vos cartes Visa en un glissement de doigt.</p>
          </div>
          <div className="d-feat-box">
            <div className="d-feat-icon"><i className="fa-solid fa-hand-holding-dollar"></i></div>
            <h4>PrÃªts & CrÃ©dits</h4>
            <p>Simulez et suivez vos demandes de prÃªt en direct depuis votre tÃ©lÃ©phone.</p>
          </div>
        </div>

      </div>

      <PwaInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

