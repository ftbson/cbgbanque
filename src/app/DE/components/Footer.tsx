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
                <h4 className="banner-title">Die CBG Bank App</h4>
                <p className="banner-subtitle">
                  Kostenlos · Installation in 1 Schritt · direkter Shortcut auf Ihrem Bildschirm
                </p>
              </div>
            </div>
            <button onClick={handleDownloadClick} className="btn-banner-download">
              <i className="fa-solid fa-download"></i> App herunterladen
            </button>
          </div>

          {/* Middle Legal & Info Grid */}
          <div className="footer-main-grid">
            <div className="footer-col brand-info">
              <div className="footer-brand-header">
                <span className="footer-mini-logo">CBG</span>
                <span className="footer-brand-title">CBG Bank Finance AG</span>
              </div>
              <p className="footer-legal-text">
                Europäisches Referenz-Kreditinstitut.<br />
                Freigesetztes Grundkapital: 50.000.000 €<br />
                Sitz: Avenue Louise 542, 1050 Ixelles, Brüssel<br />
                BCE: 0789.456.123 - USt-IdNr.: BE 0789.456.123 - LEI: 549300C23BQ2026B7<br />
                BIC / SWIFT : C23QBEBB
              </p>
            </div>

            <div className="footer-col contact-info">
              <h5 className="footer-subtitle-heading">Kontakt & Schlichtung</h5>
              <p className="footer-legal-text">
                <strong>E-Mail :</strong>{" "}
                <a href="mailto:kundenservice@cbgbank.com" className="footer-link-inline">
                  kundenservice@cbgbank.com
                </a>
                <br />
                <strong>Telefonischer Support :</strong> +33 (0) 1 89 71 42 00 (Mo - Sa: 8 - 20 Uhr)
                <br />
                <strong>Anerkannter Schlichter :</strong> Ombudsfin (
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
              <Link href="/DE/hilfe">Hilfe & FAQ</Link>
              <Link href="/DE/datenschutz">Datenschutz</Link>
              <Link href="/DE/impressum">Impressum</Link>
              <Link href="/DE/agb">AGB</Link>
              <Link href="/DE/dsgvo">DSGVO</Link>
              <Link href="/DE/cookies">Cookies</Link>
            </div>
            <div className="footer-copyright">
              © {new Date().getFullYear()} CBG Bank Finance AG. Alle Rechte vorbehalten.
            </div>
          </div>

          {/* Grand Nom Animé de la Banque en Pied de Page */}
          <div className="footer-giant-watermark" aria-hidden="true">
            <span className="giant-watermark-text">CBG BANK</span>
          </div>

        </div>
      </footer>

      <PwaInstallModal isOpen={showPwaModal} onClose={() => setShowPwaModal(false)} />
    </>
  );
}