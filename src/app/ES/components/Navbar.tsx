"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
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
          <Link href="/ES/funciones" className="nav-link" onClick={() => setIsOpen(false)}>
            Funciones
          </Link>
          <Link href="/ES/compromisos" className="nav-link" onClick={() => setIsOpen(false)}>
            Compromisos
          </Link>
          <Link href="/ES/ayuda" className="nav-link" onClick={() => setIsOpen(false)}>
            Ayuda
          </Link>
          <Link href="/ES/descargar" className="nav-link mobile-only-download" onClick={() => setIsOpen(false)}>
            <i className="fa-solid fa-download"></i> Descargar la app
          </Link>
          {/* Bouton visible uniquement dans le menu mobile ouvert */}
          <Link href="/ES/abrir-cuenta" className="btn-primary mobile-only-cta" onClick={() => setIsOpen(false)}>
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
                  onClick={() => (window.location.href = "/FR")}
                  role="menuitem"
                  aria-selected={false}
                >
                  <span className="lang-flag" aria-hidden="true">🇫🇷</span>
                  <span className="lang-native-name">Français</span>
                </button>
                <button
                  className="lang-option"
                  onClick={() => (window.location.href = "/DE")}
                  role="menuitem"
                  aria-selected={false}
                >
                  <span className="lang-flag" aria-hidden="true">🇩🇪</span>
                  <span className="lang-native-name">Deutsch</span>
                </button>
                <button
                  className="lang-option active"
                  onClick={() => (window.location.href = "/ES")}
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
          <Link href="/ES/abrir-cuenta" className="btn-primary desktop-cta">
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