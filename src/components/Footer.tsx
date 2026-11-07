"use client";

import Link from "next/link";

export default function Footer() {
  return (
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
                  23
                </text>
              </svg>
            </div>
            <div className="banner-texts">
              <h4 className="banner-title">L'application CBG Banque</h4>
              <p className="banner-subtitle">Gratuite · s'installe en 1 geste · sans magasin d'applications</p>
            </div>
          </div>
          <Link href="/download" className="btn-banner-download">
            <i className="fa-solid fa-download"></i> Télécharger
          </Link>
        </div>

        {/* Middle Legal & Info Grid */}
        <div className="footer-main-grid">
          <div className="footer-col brand-info">
            <div className="footer-brand-header">
              <span className="footer-mini-logo">CBG</span>
              <span className="footer-brand-title">CBG Banque Finance SA</span>
            </div>
            <p className="footer-legal-text">
              Société Anonyme de droit belge - Capital social libéré : 50 000 000 €<br />
              Siège social : Avenue Louise 542, 1050 Ixelles, Bruxelles<br />
              BCE : 0789.456.123 - TVA : BE 0789.456.123 - LEI : 549300C23BQ2026B7<br />
              BIC/SWIFT : SNNNFR22XXX
            </p>
          </div>

          <div className="footer-col contact-info">
            <h5 className="footer-subtitle-heading">Contact & Médiation</h5>
            <p className="footer-legal-text">
              <strong>Email :</strong> <a href="mailto:serviceclient@cbgbanque.com" className="footer-link-inline">serviceclient@cbgbanque.com</a><br />
              <strong>Médiateur :</strong> Ombudsfin (<a href="https://ombudsfin.be" target="_blank" rel="noopener noreferrer" className="footer-link-inline">ombudsfin.be</a>)
            </p>
          </div>
        </div>

        {/* Bottom Bar: Links & Copyright */}
        <div className="footer-bottom-bar">
          <div className="footer-legal-links">
            <Link href="/aide">Aide</Link>
            <Link href="/confidentialite">Confidentialité</Link>
            <Link href="/mentions-legales">Mentions légales</Link>
            <Link href="/cgu">CGU</Link>
            <Link href="/rgpd">RGPD</Link>
            <Link href="/cookies">Cookies</Link>
          </div>
          <div className="footer-copyright">
            © 2026 CBG Banque Finance SA. Tous droits réservés.
          </div>
        </div>

      </div>
    </footer>
  );
}