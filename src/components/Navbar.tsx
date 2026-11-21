"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Locale = "fr" | "de" | "es";

interface NavTranslations {
  appName: string;
  features: string;
  commitments: string;
  help: string;
  downloadApp: string;
  login: string;
  register: string;
  language: string;
}

const translations: Record<Locale, NavTranslations> = {
  fr: {
    appName: "CBG Banque",
    features: "Fonctionnalités",
    commitments: "Engagements",
    help: "Aide",
    downloadApp: "Télécharger l'app",
    login: "Connexion",
    register: "Ouvrir un compte",
    language: "Langue",
  },
  de: {
    appName: "CBG Bank",
    features: "Funktionen",
    commitments: "Versprechen",
    help: "Hilfe",
    downloadApp: "App herunterladen",
    login: "login",
    register: "Konto eröffnen",
    language: "Sprache",
  },
  es: {
    appName: "CBG Banco",
    features: "Funciones",
    commitments: "Compromisos",
    help: "Ayuda",
    downloadApp: "Descargar la app",
    login: "Iniciar sesión",
    register: "Abrir una cuenta",
    language: "Idioma",
  },
};

const flags: Record<Locale, string> = {
  fr: "🇫🇷",
  de: "🇩🇪",
  es: "🇪🇸",
};

const availableLocales: { code: Locale; name: string }[] = [
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "es", name: "Español" },
];

const routes: Record<Locale, Record<string, string>> = {
  fr: {
    home: "/FR",
    features: "/FR/fonctionnalites",
    commitments: "/FR/engagements",
    help: "/FR/aide",
    download: "/FR/download",
    login: "/FR/login",
    register: "/FR/register",
  },
  de: {
    home: "/DE",
    features: "/DE/funktionen",
    commitments: "/DE/versprechen",
    help: "/DE/hilfe",
    download: "/DE/download",
    login: "/DE/login",
    register: "/DE/register",
  },
  es: {
    home: "/ES",
    features: "/ES/funciones",
    commitments: "/ES/compromisos",
    help: "/ES/ayuda",
    download: "/ES/descargar",
    login: "/ES/login",
    register: "/ES/abrir-cuenta",
  },
};

export default function Navbar({ locale }: { locale: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const pathname = usePathname();

  const t = translations[locale];
  const currentFlag = flags[locale];
  const currentRoutes = routes[locale];

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLangChange = (newLocale: Locale) => {
    // Map current path to equivalent path in new locale
    const pathMap: Record<string, string> = {
      "/FR": "/DE",
      "/FR/fonctionnalites": "/DE/funktionen",
      "/FR/engagements": "/DE/versprechen",
      "/FR/aide": "/DE/hilfe",
      "/FR/download": "/DE/download",
      "/FR/login": "/DE/login",
      "/FR/register": "/DE/register",
      "/DE": "/FR",
      "/DE/funktionen": "/FR/fonctionnalites",
      "/DE/versprechen": "/FR/engagements",
      "/DE/hilfe": "/FR/aide",
      "/DE/download": "/FR/download",
      "/DE/login": "/FR/login",
      "/DE/register": "/FR/register",
      "/ES": "/FR",
      "/ES/funciones": "/FR/fonctionnalites",
      "/ES/compromisos": "/FR/engagements",
      "/ES/ayuda": "/FR/aide",
      "/ES/descargar": "/FR/download",
      "/ES/login": "/FR/login",
      "/ES/abrir-cuenta": "/FR/register",
    };

    const targetPath = pathMap[pathname] || routes[newLocale].home;
    window.location.href = targetPath;
  };

  return (
    <header className="navbar-container">
      <nav className="navbar">
        {/* Brand / Logo */}
        <Link href={currentRoutes.home} className="nav-brand">
          <span className="brand-name">{t.appName}</span>
        </Link>

        {/* Center navigation links (Desktop + Animated Mobile Drawer) */}
        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link
            href={currentRoutes.features}
            className="nav-link"
            onClick={() => setIsOpen(false)}
          >
            {t.features}
          </Link>
          <Link
            href={currentRoutes.commitments}
            className="nav-link"
            onClick={() => setIsOpen(false)}
          >
            {t.commitments}
          </Link>
          <Link
            href={currentRoutes.help}
            className="nav-link"
            onClick={() => setIsOpen(false)}
          >
            {t.help}
          </Link>
          <Link
            href={currentRoutes.download}
            className="nav-link mobile-only-download"
            onClick={() => setIsOpen(false)}
          >
            <i className="fa-solid fa-download"></i> {t.downloadApp}
          </Link>
          {/* Bouton visible uniquement dans le menu mobile ouvert */}
          <Link
            href={currentRoutes.register}
            className="btn-primary mobile-only-cta"
            onClick={() => setIsOpen(false)}
          >
            {t.register}
          </Link>
        </div>

        {/* Action buttons (Right) */}
        <div className="nav-actions">
          {/* Language Selector */}
          <div className="lang-selector">
            <button
              className="lang-btn"
              onClick={() => setShowLangMenu(!showLangMenu)}
              aria-label={t.language}
              aria-expanded={showLangMenu}
              aria-haspopup="true"
            >
              <i className="fa-solid fa-globe"></i>
              <span className="lang-flag" aria-hidden="true">
                {currentFlag}
              </span>
              <span className="lang-code">{locale.toUpperCase()}</span>
              <i
                className={`fa-solid fa-chevron-down ${showLangMenu ? "rotate" : ""}`}
              ></i>
            </button>
            {showLangMenu && (
              <div className="lang-dropdown" role="menu">
                {availableLocales.map((lang) => (
                  <button
                    key={lang.code}
                    className={`lang-option ${locale === lang.code ? "active" : ""}`}
                    onClick={() => handleLangChange(lang.code)}
                    role="menuitem"
                    aria-selected={locale === lang.code}
                  >
                    <span className="lang-flag" aria-hidden="true">
                      {flags[lang.code]}
                    </span>
                    <span className="lang-native-name">{lang.name}</span>
                    {locale === lang.code && (
                      <i className="fa-solid fa-check"></i>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop primary CTA (Unique sur PC) */}
          <Link
            href={currentRoutes.register}
            className="btn-primary desktop-cta"
          >
            {t.register}
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            className={`hamburger ${isOpen ? "active" : ""}`}
            onClick={toggleMenu}
            aria-label={t.language}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </nav>
    </header>
  );
}
