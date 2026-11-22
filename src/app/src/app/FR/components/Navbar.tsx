"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

function getLocalizedPath(pathname: string, targetLocale: string): string {
  // Remove current locale prefix if present
  const localePrefixes = ["/FR", "/DE", "/ES"];
  let pathWithoutLocale = pathname;
  for (const prefix of localePrefixes) {
    if (pathname.startsWith(prefix)) {
      pathWithoutLocale = pathname.slice(prefix.length);
      break;
    }
  }
  // If path is empty or just "/", use "/"
  if (!pathWithoutLocale || pathWithoutLocale === "/") {
    return `/${targetLocale}`;
  }
  // Ensure path starts with /
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
        {/* Brand / Logo */}
        <Link href="/FR" className="nav-brand">
          <span className="brand-name">CBG Banque</span>
        </Link>

        {/* Center navigation links (Desktop + Animated Mobile Drawer) */}
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
            <i className="fa-solid fa-download"></i> Télécharger l'app
          </Link>
          {/* Bouton visible uniquement dans le menu mobile ouvert */}
          <Link href="/FR/register" className="btn-primary mobile-only-cta" onClick={() => setIsOpen(false)}>
            Ouvrir un compte
          </Link>
        </div>

        {/* Action buttons (Right) */}
        <div className="nav-actions">
          {/* Language Selector */}
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
                  <span className="lang-native-name">Deutsch</span>
                </button>
                <button
                  className="lang-option"
                  onClick={() => (window.location.href = getLocalizedPath(pathname, "ES"))}
                  role="menuitem"
                  aria-selected={false}
                >
                  <span className="lang-flag" aria-hidden="true">🇪🇸</span>
                  <span className="lang-native-name">Español</span>
                </button>
              </div>
            )}
          </div>

          {/* Desktop primary CTA (Unique sur PC) */}
          <Link href="/FR/register" className="btn-primary desktop-cta">
            Ouvrir un compte
          </Link>

          {/* Mobile Hamburger Toggle */}
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