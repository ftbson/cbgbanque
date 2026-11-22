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
        <Link href="/ES" className="nav-brand">
          <span className="brand-name">CBG Banco</span>
        </Link>

        {/* Center navigation links (Desktop + Animated Mobile Drawer) */}
        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link href="/ES" className="nav-link" onClick={() => setIsOpen(false)}>
            Funciones
          </Link>
          <Link href="/ES" className="nav-link" onClick={() => setIsOpen(false)}>
            Compromisos
          </Link>
          <Link href="/ES/aide" className="nav-link" onClick={() => setIsOpen(false)}>
            Ayuda
          </Link>
          <Link href="/ES/download" className="nav-link mobile-only-download" onClick={() => setIsOpen(false)}>
            <i className="fa-solid fa-download"></i> Descargar la app
          </Link>
          {/* Bouton visible uniquement dans le menu mobile ouvert */}
          <Link href="/ES/register" className="btn-primary mobile-only-cta" onClick={() => setIsOpen(false)}>
            Abrir una cuenta
          </Link>
        </div>

        {/* Action buttons (Right) */}
        <div className="nav-actions">
          {/* Language Selector */}
          <div className="lang-selector">
            <button
              className="lang-btn"
              onClick={() => setShowLangMenu(!showLangMenu)}
              aria-label="Idioma"
              aria-expanded={showLangMenu}
              aria-haspopup="true"
            >
              <i className="fa-solid fa-globe"></i>
              <span className="lang-flag" aria-hidden="true">🇪🇸</span>
              <span className="lang-code">ES</span>
              <i className={`fa-solid fa-chevron-down ${showLangMenu ? "rotate" : ""}`}></i>
            </button>
            {showLangMenu && (
              <div className="lang-dropdown" role="menu">
                <button
                  className="lang-option"
                  onClick={() => (window.location.href = getLocalizedPath(pathname, "FR"))}
                  role="menuitem"
                  aria-selected={false}
                >
                  <span className="lang-flag" aria-hidden="true">🇫🇷</span>
                  <span className="lang-native-name">Français</span>
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
                  className="lang-option active"
                  onClick={() => (window.location.href = getLocalizedPath(pathname, "ES"))}
                  role="menuitem"
                  aria-selected={true}
                >
                  <span className="lang-flag" aria-hidden="true">🇪🇸</span>
                  <span className="lang-native-name">Español</span>
                  <i className="fa-solid fa-check"></i>
                </button>
              </div>
            )}
          </div>

          {/* Desktop primary CTA (Unique sur PC) */}
          <Link href="/ES/register" className="btn-primary desktop-cta">
            Abrir una cuenta
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            className={`hamburger ${isOpen ? "active" : ""}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menú"
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