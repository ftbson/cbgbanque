"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

function getLocalizedPath(pathname: string, targetLocale: string): string {
  // Supprime le préfixe de langue actuel s'il est présent
  const localePrefixes = ["/FR", "/DE", "/ES"];
  let pathWithoutLocale = pathname;
  for (const prefix of localePrefixes) {
    if (pathname.startsWith(prefix)) {
      pathWithoutLocale = pathname.slice(prefix.length);
      break;
    }
  }
  // Si le chemin est vide ou juste "/", utilise "/"
  if (!pathWithoutLocale || pathWithoutLocale === "/") {
    return `/${targetLocale}`;
  }
  // S'assure que le chemin commence par /
  if (!pathWithoutLocale.startsWith("/")) {
    pathWithoutLocale = "/" + pathWithoutLocale;
  }
  return `/${targetLocale}${pathWithoutLocale}`;
}

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  return (
    <header className="navbar-container">
      <nav className="navbar">
        {/* Marque / Logo */}
        <Link href="/FR" className="nav-brand">
          <span className="brand-name">CBG Banque</span>
        </Link>

        {/* Liens de navigation centraux (Bureau + Menu mobile animé) */}
        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link href="/FR" className="nav-link" onClick={() => setIsOpen(false)}>
            Fonctionnalités
          </Link>
          <Link href="/FR" className="nav-link" onClick={() => setIsOpen(false)}>
            Engagements
          </Link>
          <Link href="/FR/aide" className="nav-link" onClick={() => setIsOpen(false)}>
            Aide
          </Link>
          <Link href="/FR/download" className="nav-link mobile-only-download" onClick={() => setIsOpen(false)}>
            <i className="fa-solid fa-download"></i> Télécharger l&apos;application
          </Link>
          {/* Bouton visible uniquement dans le menu mobile ouvert */}
          <Link href="/FR/register" className="btn-primary mobile-only-cta" onClick={() => setIsOpen(false)}>
            Ouvrir un compte
          </Link>
        </div>

        {/* Boutons d'action (Droite) */}
        <div className="nav-actions">
          {/* Sélecteur de langue */}
          <div className="lang-selector">
            <button
              className="lang-btn"
              onClick={() => setShowLangMenu(!showLangMenu)}
              aria-label="Langue"
              aria-expanded={showLangMenu}
              aria-haspopup="true"
            >
              <i className="fa-solid fa-globe"></i>
              <span className="lang-flag" aria-hidden="true">🇫🇷</span>
              <span className="lang-code">FR</span>
              <i className={`fa-solid fa-chevron-down ${showLangMenu ? "rotate" : ""}`}></i>
            </button>
            {showLangMenu && (
              <div className="lang-dropdown" role="menu">
                <button
                  className="lang-option active"
                  onClick={() => (window.location.href = getLocalizedPath(pathname, "FR"))}
                  role="menuitem"
                  aria-selected={true}
                >
                  <span className="lang-flag" aria-hidden="true">🇫🇷</span>
                  <span className="lang-native-name">Français</span>
                  <i className="fa-solid fa-check"></i>
                </button>
                <button
                  className="lang-option"
                  onClick={() => (window.location.href = getLocalizedPath(pathname, "DE"))}
                  role="menuitem"
                  aria-selected={false}
                >
                  <span className="lang-flag" aria-hidden="true">🇩🇪</span>
                  <span className="lang-native-name">Allemand</span>
                </button>
                <button
                  className="lang-option"
                  onClick={() => (window.location.href = getLocalizedPath(pathname, "ES"))}
                  role="menuitem"
                  aria-selected={false}
                >
                  <span className="lang-flag" aria-hidden="true">🇪🇸</span>
                  <span className="lang-native-name">Espagnol</span>
                </button>
              </div>
            )}
          </div>

          {/* Bouton d'action principal sur ordinateur */}
          <Link href="/FR/register" className="btn-primary desktop-cta">
            Ouvrir un compte
          </Link>

          {/* Bouton menu hamburger mobile */}
          <button
            className={`hamburger ${isOpen ? "active" : ""}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
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