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
          <i className="fa-solid fa-mobile-screen-button"></i> App PWA Oficial
        </span>
        <h1 className="download-hero-title">
          Todo su banco, <span className="gradient-text">en la palma de su mano</span>
        </h1>
        <p className="download-hero-sub">
          Instale la aplicación CBG Banco al instante sin pasar por las tiendas de aplicaciones. Disfrute de un acceso rápido, fluido y altamente seguro desde su pantalla de inicio.
        </p>

        <div className="download-hero-actions">
          <button onClick={handleInstall} className="btn-hero-install">
            <i className="fa-solid fa-download"></i>
            <span>{isInstalled ? "Aplicación ya instalada" : "Instalar la aplicación"}</span>
          </button>
          <Link href="/ES/register" className="btn-hero-account">
            Abrir cuenta gratis
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
            <p>1. Pulse en «Instalar la aplicación» arriba.</p>
            <p>2. Confirme la instalación en la notificación del navegador.</p>
            <p>3. El icono de CBG Banco aparece directamente en su pantalla de inicio.</p>
          </div>

          <div className="guide-card">
            <div className="guide-icon-header">
              <i className="fa-brands fa-apple"></i>
              <h3>iPhone & iPad (Safari)</h3>
            </div>
            <p>1. Abra este sitio en el navegador Safari.</p>
            <p>2. Toque el icono de compartir <i className="fa-solid fa-arrow-up-from-bracket"></i> en la parte inferior de la pantalla.</p>
            <p>3. Desplácese hacia abajo y seleccione <strong>«En la pantalla de inicio»</strong> <i className="fa-regular fa-square-plus"></i>.</p>
          </div>

          <div className="guide-card">
            <div className="guide-icon-header">
              <i className="fa-solid fa-laptop"></i>
              <h3>Ordenador (PC & Mac)</h3>
            </div>
            <p>1. Abra el sitio en Chrome, Edge o Brave.</p>
            <p>2. Haga clic en el icono de instalación en la barra de direcciones a la derecha.</p>
            <p>3. CBG Banco se abre en su propia ventana independiente y ultrarrápida.</p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="download-features-grid">
          <div className="d-feat-box">
            <div className="d-feat-icon"><i className="fa-solid fa-bolt"></i></div>
            <h4>Ultra ligera</h4>
            <p>Menos de 2 MB, ninguna actualización pesada requerida, se lanza al instante.</p>
          </div>
          <div className="d-feat-box">
            <div className="d-feat-icon"><i className="fa-solid fa-shield-halved"></i></div>
            <h4>Seguridad biométrica</h4>
            <p>Compatible con Face ID, Touch ID y huella digital para sus conexiones y transferencias.</p>
          </div>
          <div className="d-feat-box">
            <div className="d-feat-icon"><i className="fa-solid fa-credit-card"></i></div>
            <h4>Tarjetas virtuales</h4>
            <p>Cree, congele y gestione sus tarjetas Visa con un deslizamiento.</p>
          </div>
          <div className="d-feat-box">
            <div className="d-feat-icon"><i className="fa-solid fa-hand-holding-dollar"></i></div>
            <h4>Préstamos & Créditos</h4>
            <p>Simule y siga sus solicitudes de préstamo en directo desde su teléfono.</p>
          </div>
        </div>

      </div>

      <PwaInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}