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
          <i className="fa-solid fa-mobile-screen-button"></i> Offizielle PWA App
        </span>
        <h1 className="download-hero-title">
          Ihre ganze Bank, <span className="gradient-text">in Ihrer Hand</span>
        </h1>
        <p className="download-hero-sub">
          Installieren Sie die CBG Bank App sofort ohne App-Stores. Genießen Sie schnellen, flüssigen und hochsicheren Zugriff direkt von Ihrem Startbildschirm.
        </p>

        <div className="download-hero-actions">
          <button onClick={handleInstall} className="btn-hero-install">
            <i className="fa-solid fa-download"></i>
            <span>{isInstalled ? "App bereits installiert" : "App installieren"}</span>
          </button>
          <Link href="/DE/register" className="btn-hero-account">
            Kostenloses Konto eröffnen
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
            <p>1. Klicken Sie oben auf „App installieren“.</p>
            <p>2. Bestätigen Sie die Installation in der Browser-Benachrichtigung.</p>
            <p>3. Das CBG Bank Symbol erscheint direkt auf Ihrem Startbildschirm.</p>
          </div>

          <div className="guide-card">
            <div className="guide-icon-header">
              <i className="fa-brands fa-apple"></i>
              <h3>iPhone & iPad (Safari)</h3>
            </div>
            <p>1. Öffnen Sie diese Seite im Safari-Browser.</p>
            <p>2. Tippen Sie auf das Teilen-Symbol <i className="fa-solid fa-arrow-up-from-bracket"></i> unten am Bildschirm.</p>
            <p>3. Scrollen Sie nach unten und wählen Sie <strong>„Zum Home-Bildschirm“</strong> <i className="fa-regular fa-square-plus"></i>.</p>
          </div>

          <div className="guide-card">
            <div className="guide-icon-header">
              <i className="fa-solid fa-laptop"></i>
              <h3>Computer (PC & Mac)</h3>
            </div>
            <p>1. Öffnen Sie die Seite unter Chrome, Edge oder Brave.</p>
            <p>2. Klicken Sie auf das Installations-Symbol in der Adressleiste rechts.</p>
            <p>3. CBG Bank öffnet sich in einem eigenen, unabhängigen und ultraschnellen Fenster.</p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="download-features-grid">
          <div className="d-feat-box">
            <div className="d-feat-icon"><i className="fa-solid fa-bolt"></i></div>
            <h4>Ultra leicht</h4>
            <p>Weniger als 2 MB, keine schweren Updates erforderlich, startet sofort.</p>
          </div>
          <div className="d-feat-box">
            <div className="d-feat-icon"><i className="fa-solid fa-shield-halved"></i></div>
            <h4>Biometrische Sicherheit</h4>
            <p>Kompatibel mit Face ID, Touch ID und Fingerabdruck für Ihre Anmeldungen und Überweisungen.</p>
          </div>
          <div className="d-feat-box">
            <div className="d-feat-icon"><i className="fa-solid fa-credit-card"></i></div>
            <h4>Virtuelle Karten</h4>
            <p>Erstellen, sperren und verwalten Sie Ihre Visa Karten mit einem Wisch.</p>
          </div>
          <div className="d-feat-box">
            <div className="d-feat-icon"><i className="fa-solid fa-hand-holding-dollar"></i></div>
            <h4>Kredite & Finanzierung</h4>
            <p>Simulieren und verfolgen Sie Ihre Kreditanfragen live von Ihrem Handy.</p>
          </div>
        </div>

      </div>

      <PwaInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}