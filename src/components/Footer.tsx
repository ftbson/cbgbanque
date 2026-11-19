"use client";

import { useState } from "react";
import Link from "next/link";
import PwaInstallModal, { usePwa } from "./PwaInstallModal";
import { useTranslation } from "@/lib/i18n";

export default function Footer() {
  const { t } = useTranslation();
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
              <div className="banner-logo-icon">
                <svg viewBox="0 0 100 100" className="brand-svg">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#footer-blue-gradient)"
                    strokeWidth="12"
                  />
                  <defs>
                    <linearGradient id="footer-blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  <text
                    x="50"
                    y="58"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="24"
                    fontWeight="bold"
                  >
                    CBG
                  </text>
                </svg>
              </div>
              <div className="banner-texts">
                <h4 className="banner-title">{t("footer.bannerTitle")}</h4>
                <p className="banner-subtitle">
                  {t("footer.bannerSubtitle")}
                </p>
              </div>
            </div>
            <button onClick={handleDownloadClick} className="btn-banner-download">
              <i className="fa-solid fa-download"></i> {t("footer.bannerCTA")}
            </button>
          </div>

          {/* Middle Legal & Info Grid */}
          <div className="footer-main-grid">
            <div className="footer-col brand-info">
              <div className="footer-brand-header">
                <span className="footer-mini-logo">CBG</span>
                <span className="footer-brand-title">{t("footer.brandTitle")}</span>
              </div>
              <p className="footer-legal-text">
                {t("footer.legalText")}
              </p>
            </div>

            <div className="footer-col contact-info">
              <h5 className="footer-subtitle-heading">{t("footer.contactTitle")}</h5>
              <p className="footer-legal-text">
                <strong>Email :</strong>{" "}
                <a href="mailto:serviceclient@cbgbanque.com" className="footer-link-inline">
                  {t("footer.contactEmail")}
                </a>
                <br />
                <strong>Support téléphonique :</strong> {t("footer.contactPhone")}
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
              <Link href="/aide">{t("footer.links.help")}</Link>
              <Link href="/confidentialite">{t("footer.links.privacy")}</Link>
              <Link href="/mentions-legales">{t("footer.links.legal")}</Link>
              <Link href="/cgu">{t("footer.links.terms")}</Link>
              <Link href="/rgpd">{t("footer.links.rgpd")}</Link>
              <Link href="/cookies">{t("footer.links.cookies")}</Link>
            </div>
            <div className="footer-copyright">
              {t("footer.copyright", { year: new Date().getFullYear() })}
            </div>
          </div>

          {/* Grand Nom Animé de la Banque en Pied de Page */}
          <div className="footer-giant-watermark" aria-hidden="true">
            <span className="giant-watermark-text">{t("footer.watermark")}</span>
          </div>

        </div>
      </footer>

      <PwaInstallModal isOpen={showPwaModal} onClose={() => setShowPwaModal(false)} />
    </>
  );
}