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
          Installez l&apos;application CBG Banque instantanément sans passer par les magasins d&apos;applications. Profitez d&apos;un accès rapide, fluide et hautement sécurisé depuis votre écran d&apos;accueil.
        </p>

        <div className="download-hero-actions">
          <button onClick={handleInstall} className="btn-hero-install">
            <i className="fa-solid fa-download"></i>
            <span>{isInstalled ? "Application déjà installée" : "Installer l'application"}</span>
          </button>
          <Link href="/register" className="btn-hero-account">
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
            <p>1. Cliquez sur « Installer l&apos;application » ci-dessus.</p>
            <p>2. Confirmez l&apos;installation dans la notification du navigateur.</p>
            <p>3. L&apos;icône CBG Banque apparaît directement sur votre écran d&apos;accueil.</p>
          </div>

          <div className="guide-card">
            <div className="guide-icon-header">
              <i className="fa-brands fa-apple"></i>
              <h3>iPhone & iPad (Safari)</h3>
            </div>
            <p>1. Ouvrez ce site dans le navigateur Safari.</p>
            <p>2. Touchez l&apos;icône de partage <i className="fa-solid fa-arrow-up-from-bracket"></i> en bas de l&apos;écran.</p>
            <p>3. Faites défiler vers le bas et sélectionnez <strong>« Sur l&apos;écran d&apos;accueil »</strong> <i className="fa-regular fa-square-plus"></i>.</p>
          </div>

          <div className="guide-card">
            <div className="guide-icon-header">
              <i className="fa-solid fa-laptop"></i>
              <h3>Ordinateur (PC & Mac)</h3>
            </div>
            <p>1. Ouvrez le site sous Chrome, Edge ou Brave.</p>
            <p>2. Cliquez sur l&apos;icône d&apos;installation dans la barre d&apos;adresse à droite.</p>
            <p>3. CBG Banque s&apos;ouvre dans sa propre fenêtre indépendante et ultra rapide.</p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="download-features-grid">
          <div className="d-feat-box">
            <div className="d-feat-icon"><i className="fa-solid fa-bolt"></i></div>
            <h4>Ultra légère</h4>
            <p>Moins de 2 Mo, aucune mise à jour lourde requise, se lance instantanément.</p>
          </div>
          <div className="d-feat-box">
            <div className="d-feat-icon"><i className="fa-solid fa-shield-halved"></i></div>
            <h4>Sécurité biométrique</h4>
            <p>Compatible Face ID, Touch ID et empreinte digitale pour vos connexions et virements.</p>
          </div>
          <div className="d-feat-box">
            <div className="d-feat-icon"><i className="fa-solid fa-credit-card"></i></div>
            <h4>Cartes virtuelles</h4>
            <p>Créez, gelez et gérez vos cartes Visa en un glissement de doigt.</p>
          </div>
          <div className="d-feat-box">
            <div className="d-feat-icon"><i className="fa-solid fa-hand-holding-dollar"></i></div>
            <h4>Prêts & Crédits</h4>
            <p>Simulez et suivez vos demandes de prêt en direct depuis votre téléphone.</p>
          </div>
        </div>

      </div>

      <PwaInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
