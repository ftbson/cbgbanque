"use client";

import { useState } from "react";
import Link from "next/link";
import PwaInstallModal, { usePwa } from "@/components/PwaInstallModal";

export default function Footer() {
  const [showPwaModal, setShowPwaModal] = useState(false);
  const { triggerInstall } = usePwa();

  const handleDownloadClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const installed = await triggerInstall();
    if (!installed) {
      setShowPwaModal(true);
    }
  };

  return (
    <>
      <footer className="footer-section">
        <div className="footer-container">

          {/* Top Download Banner Card */}
          <div className="footer-banner">
            <div className="banner-left">
              <div className="banner-texts">
                <h4 className="banner-title">La aplicación CBG Banco</h4>
                <p className="banner-subtitle">
                  Gratuita · se instala en 1 gesto · acceso directo en tu pantalla
                </p>
              </div>
            </div>
            <button onClick={handleDownloadClick} className="btn-banner-download">
              <i className="fa-solid fa-download"></i> Descargar la aplicación
            </button>
          </div>

          {/* Middle Legal & Info Grid */}
          <div className="footer-main-grid">
            <div className="footer-col brand-info">
              <div className="footer-brand-header">
                <span className="footer-mini-logo">CBG</span>
                <span className="footer-brand-title">CBG Banco Finance SA</span>
              </div>
              <p className="footer-legal-text">
                Establecimiento bancario y financiero de referencia europea.<br />
                Capital social liberado: 50.000.000 €<br />
                Sede social: Avenue Louise 542, 1050 Ixelles, Bruselas<br />
                BCE: 0789.456.123 - IVA: BE 0789.456.123 - LEI: 549300C23BQ2026B7<br />
                BIC / SWIFT : C23QBEBB
              </p>
            </div>

            <div className="footer-col contact-info">
              <h5 className="footer-subtitle-heading">Contacto y Mediación</h5>
              <p className="footer-legal-text">
                <strong>Email :</strong>{" "}
                <a href="mailto:serviciocliente@cbgbanco.com" className="footer-link-inline">
                  serviciocliente@cbgbanco.com
                </a>
                <br />
                <strong>Soporte telefónico :</strong> +33 (0) 1 89 71 42 00 (Lun - Sáb: 8h - 20h)
                <br />
                <strong>Mediador acreditado :</strong> Ombudsfin (
                <a
                  href="https://ombudsfin.be"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link-inline"
                >
                  ombudsfin.be
                </a>
                )
              </p>
            </div>
          </div>

          {/* Bottom Bar: Links & Copyright */}
          <div className="footer-bottom-bar">
            <div className="footer-legal-links">
              <Link href="/ES/ayuda">Ayuda y FAQ</Link>
              <Link href="/ES/confidentialite">Privacidad</Link>
              <Link href="/ES/mentions-legales">Avisos legales</Link>
              <Link href="/ES/cgu">CGU</Link>
              <Link href="/ES/rgpd">RGPD</Link>
              <Link href="/ES/cookies">Cookies</Link>
            </div>
            <div className="footer-copyright">
              © {new Date().getFullYear()} CBG Banco Finance SA. Todos los derechos reservados.
            </div>
          </div>

          {/* Grand Nom Animé de la Banque en Pied de Page */}
          <div className="footer-giant-watermark" aria-hidden="true">
            <span className="giant-watermark-text">CBG BANCO</span>
          </div>

        </div>
      </footer>

      <PwaInstallModal isOpen={showPwaModal} onClose={() => setShowPwaModal(false)} />
    </>
  );
}