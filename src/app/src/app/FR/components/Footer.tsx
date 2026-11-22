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
                <h4 className="banner-title">L'application CBG Banque</h4>
                <p className="banner-subtitle">
                  Gratuite · s'installe en 1 geste · raccourci direct sur votre écran
                </p>
              </div>
            </div>
            <button onClick={handleDownloadClick} className="btn-banner-download">
              <i className="fa-solid fa-download"></i> Télécharger l'application
            </button>
          </div>

          {/* Middle Legal & Info Grid */}
          <div className="footer-main-grid">
            <div className="footer-col brand-info">
              <div className="footer-brand-header">
                <span className="footer-mini-logo">CBG</span>
                <span className="footer-brand-title">CBG Banque Finance SA</span>
              </div>
              <p className="footer-legal-text">
                Établissement bancaire et financier de référence européenne.<br />
                Capital social libéré : 50 000 000 €<br />
                Siège social : Avenue Louise 542, 1050 Ixelles, Bruxelles<br />
                BCE : 0789.456.123 - TVA : BE 0789.456.123 - LEI : 549300C23BQ2026B7<br />
                BIC / SWIFT : C23QBEBB
              </p>
            </div>

            <div className="footer-col contact-info">
              <h5 className="footer-subtitle-heading">Contact & Médiation</h5>
              <p className="footer-legal-text">
                <strong>Email :</strong>{" "}
                <a href="mailto:serviceclient@cbgbanque.com" className="footer-link-inline">
                  serviceclient@cbgbanque.com
                </a>
                <br />
                <strong>Support téléphonique :</strong> +33 (0) 1 89 71 42 00 (Lun - Sam : 8h - 20h)
                <br />
                <strong>Médiateur agréé :</strong> Ombudsfin (
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
              <Link href="/FR/aide">Aide & FAQ</Link>
              <Link href="/FR/confidentialite">Confidentialité</Link>
              <Link href="/FR/mentions-legales">Mentions légales</Link>
              <Link href="/FR/cgu">CGU</Link>
              <Link href="/FR/rgpd">RGPD</Link>
              <Link href="/FR/cookies">Cookies</Link>
            </div>
            <div className="footer-copyright">
              © {new Date().getFullYear()} CBG Banque Finance SA. Tous droits réservés.
            </div>
          </div>

          {/* Grand Nom Animé de la Banque en Pied de Page */}
          <div className="footer-giant-watermark" aria-hidden="true">
            <span className="giant-watermark-text">CBG BANQUE</span>
          </div>

        </div>
      </footer>

      <PwaInstallModal isOpen={showPwaModal} onClose={() => setShowPwaModal(false)} />
    </>
  );
}