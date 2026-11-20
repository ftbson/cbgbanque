"use client";

import { useState } from "react";
import Link from "next/link";
import PwaInstallModal, { usePwa } from "./PwaInstallModal";

type Locale = "fr" | "de" | "es";

interface FooterTranslations {
  bannerTitle: string;
  bannerSubtitle: string;
  bannerCTA: string;
  brandTitle: string;
  legalText: string;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
  mediator: string;
  links: {
    help: string;
    privacy: string;
    legal: string;
    terms: string;
    rgpd: string;
    cookies: string;
  };
  copyright: string;
  watermark: string;
}

const translations: Record<Locale, FooterTranslations> = {
  fr: {
    bannerTitle: "L'application CBG Banque",
    bannerSubtitle: "Gratuite · s'installe en 1 geste · raccourci direct sur votre écran",
    bannerCTA: "Télécharger l'application",
    brandTitle: "CBG Banque Finance SA",
    legalText: "Établissement bancaire et financier de référence européenne.\nCapital social libéré : 50 000 000 €\nSiège social : Avenue Louise 542, 1050 Ixelles, Bruxelles\nBCE : 0789.456.123 - TVA : BE 0789.456.123 - LEI : 549300C23BQ2026B7\nBIC / SWIFT : C23QBEBB",
    contactTitle: "Contact & Médiation",
    contactEmail: "serviceclient@cbgbanque.com",
    contactPhone: "+33 (0) 1 89 71 42 00 (Lun - Sam : 8h - 20h)",
    mediator: "Médiateur agréé : Ombudsfin (ombudsfin.be)",
    links: {
      help: "Aide & FAQ",
      privacy: "Confidentialité",
      legal: "Mentions légales",
      terms: "CGU",
      rgpd: "RGPD",
      cookies: "Cookies",
    },
    copyright: `© ${new Date().getFullYear()} CBG Banque Finance SA. Tous droits réservés.`,
    watermark: "CBG BANQUE",
  },
  de: {
    bannerTitle: "Die CBG Bank App",
    bannerSubtitle: "Kostenlos · Installation in 1 Schritt · direkter Shortcut auf Ihrem Bildschirm",
    bannerCTA: "App herunterladen",
    brandTitle: "CBG Bank Finance AG",
    legalText: "Europäisches Referenz-Kreditinstitut.\nFreigesetztes Grundkapital: 50.000.000 €\nSitz: Avenue Louise 542, 1050 Ixelles, Brüssel\nBCE: 0789.456.123 - USt-IdNr.: BE 0789.456.123 - LEI: 549300C23BQ2026B7\nBIC / SWIFT: C23QBEBB",
    contactTitle: "Kontakt & Schlichtung",
    contactEmail: "kundenservice@cbgbank.com",
    contactPhone: "+33 (0) 1 89 71 42 00 (Mo - Sa: 8 - 20 Uhr)",
    mediator: "Anerkannter Schlichter: Ombudsfin (ombudsfin.be)",
    links: {
      help: "Hilfe & FAQ",
      privacy: "Datenschutz",
      legal: "Impressum",
      terms: "AGB",
      rgpd: "DSGVO",
      cookies: "Cookies",
    },
    copyright: `© ${new Date().getFullYear()} CBG Bank Finance AG. Alle Rechte vorbehalten.`,
    watermark: "CBG BANK",
  },
  es: {
    bannerTitle: "La aplicación CBG Banco",
    bannerSubtitle: "Gratuita · se instala en 1 gesto · acceso directo en tu pantalla",
    bannerCTA: "Descargar la aplicación",
    brandTitle: "CBG Banco Finance SA",
    legalText: "Establecimiento bancario y financiero de referencia europea.\nCapital social liberado: 50.000.000 €\nSede social: Avenue Louise 542, 1050 Ixelles, Bruselas\nBCE: 0789.456.123 - IVA: BE 0789.456.123 - LEI: 549300C23BQ2026B7\nBIC / SWIFT: C23QBEBB",
    contactTitle: "Contacto y Mediación",
    contactEmail: "serviciocliente@cbgbanco.com",
    contactPhone: "+33 (0) 1 89 71 42 00 (Lun - Sáb: 8h - 20h)",
    mediator: "Mediador acreditado: Ombudsfin (ombudsfin.be)",
    links: {
      help: "Ayuda y FAQ",
      privacy: "Privacidad",
      legal: "Avisos legales",
      terms: "CGU",
      rgpd: "RGPD",
      cookies: "Cookies",
    },
    copyright: `© ${new Date().getFullYear()} CBG Banco Finance SA. Todos los derechos reservados.`,
    watermark: "CBG BANCO",
  },
};

const routes: Record<Locale, Record<string, string>> = {
  fr: {
    aide: "/FR/aide",
    confidentialite: "/FR/confidentialite",
    mentionsLegales: "/FR/mentions-legales",
    cgu: "/FR/cgu",
    rgpd: "/FR/rgpd",
    cookies: "/FR/cookies",
  },
  de: {
    aide: "/DE/hilfe",
    confidentialite: "/DE/datenschutz",
    mentionsLegales: "/DE/impressum",
    cgu: "/DE/agb",
    rgpd: "/DE/dsgvo",
    cookies: "/DE/cookies",
  },
  es: {
    aide: "/ES/ayuda",
    confidentialite: "/ES/privacidad",
    mentionsLegales: "/ES/avisos-legales",
    cgu: "/ES/cgu",
    rgpd: "/ES/rgpd",
    cookies: "/ES/cookies",
  },
};

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  const [showPwaModal, setShowPwaModal] = useState(false);
  const { triggerInstall } = usePwa();
  const t = translations[locale];
  const currentRoutes = routes[locale];

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
                <h4 className="banner-title">{t.bannerTitle}</h4>
                <p className="banner-subtitle">
                  {t.bannerSubtitle}
                </p>
              </div>
            </div>
            <button onClick={handleDownloadClick} className="btn-banner-download">
              <i className="fa-solid fa-download"></i> {t.bannerCTA}
            </button>
          </div>

          {/* Middle Legal & Info Grid */}
          <div className="footer-main-grid">
            <div className="footer-col brand-info">
              <div className="footer-brand-header">
                <span className="footer-mini-logo">CBG</span>
                <span className="footer-brand-title">{t.brandTitle}</span>
              </div>
              <p className="footer-legal-text">
                {t.legalText}
              </p>
            </div>

            <div className="footer-col contact-info">
              <h5 className="footer-subtitle-heading">{t.contactTitle}</h5>
              <p className="footer-legal-text">
                <strong>Email :</strong>{" "}
                <a href={`mailto:${t.contactEmail}`} className="footer-link-inline">
                  {t.contactEmail}
                </a>
                <br />
                <strong>Support téléphonique :</strong> {t.contactPhone}
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
              <Link href={currentRoutes.aide}>{t.links.help}</Link>
              <Link href={currentRoutes.confidentialite}>{t.links.privacy}</Link>
              <Link href={currentRoutes.mentionsLegales}>{t.links.legal}</Link>
              <Link href={currentRoutes.cgu}>{t.links.terms}</Link>
              <Link href={currentRoutes.rgpd}>{t.links.rgpd}</Link>
              <Link href={currentRoutes.cookies}>{t.links.cookies}</Link>
            </div>
            <div className="footer-copyright">
              {t.copyright}
            </div>
          </div>

          {/* Grand Nom Animé de la Banque en Pied de Page */}
          <div className="footer-giant-watermark" aria-hidden="true">
            <span className="giant-watermark-text">{t.watermark}</span>
          </div>

        </div>
      </footer>

      <PwaInstallModal isOpen={showPwaModal} onClose={() => setShowPwaModal(false)} />
    </>
  );
}