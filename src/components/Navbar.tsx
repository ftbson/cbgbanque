"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { t, locale, setLocale, availableLocales } = useTranslation();

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLangChange = (newLocale: "fr" | "es" | "de") => {
    setLocale(newLocale);
    setShowLangMenu(false);
  };

  return (
    <header className="navbar-container">
      <nav className="navbar">
        {/* Brand / Logo */}
        <Link href="/" className="nav-brand">
          {/* <div className="logo-icon">
            <svg viewBox="0 0 100 100" className="brand-svg">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#blue-gradient)"
                strokeWidth="12"
              />
              <defs>
                <linearGradient
                  id="blue-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <text
                x="50"
                y="57"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="22"
                fontWeight="bold"
              >
                CBG
              </text>
            </svg>
          </div> */}
          <span className="brand-name">{t("common.appName")}</span>
        </Link>

        {/* Center navigation links (Desktop + Animated Mobile Drawer) */}
        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link
            href="/fonctionnalites"
            className="nav-link"
            onClick={() => setIsOpen(false)}
          >
            {t("nav.features")}
          </Link>
          <Link
            href="/engagements"
            className="nav-link"
            onClick={() => setIsOpen(false)}
          >
            {t("nav.commitments")}
          </Link>
          <Link
            href="/aide"
            className="nav-link"
            onClick={() => setIsOpen(false)}
          >
            {t("nav.help")}
          </Link>
          <Link
            href="/download"
            className="nav-link mobile-only-download"
            onClick={() => setIsOpen(false)}
          >
            <i className="fa-solid fa-download"></i> {t("nav.downloadApp")}
          </Link>
          {/* Bouton visible uniquement dans le menu mobile ouvert */}
          <Link
            href="/register"
            className="btn-primary mobile-only-cta"
            onClick={() => setIsOpen(false)}
          >
            {t("nav.register")}
          </Link>
        </div>

        {/* Action buttons (Right) */}
        <div className="nav-actions">
          {/* Language Selector */}
          <div className="lang-selector">
            <button
              className="lang-btn"
              onClick={() => setShowLangMenu(!showLangMenu)}
              aria-label={t("nav.language")}
              aria-expanded={showLangMenu}
              aria-haspopup="true"
            >
              <i className="fa-solid fa-globe"></i>
              <span className="lang-code">{locale.toUpperCase()}</span>
              <i className={`fa-solid fa-chevron-down ${showLangMenu ? "rotate" : ""}`}></i>
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
                    <span className="lang-native-name">{lang.nativeName}</span>
                    {locale === lang.code && <i className="fa-solid fa-check"></i>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Connexion */}
          <Link href="/login" className="btn-outline btn-login">
            {t("nav.login")}
          </Link>

          {/* Desktop primary CTA (Unique sur PC) */}
          <Link href="/register" className="btn-primary desktop-cta">
            {t("nav.register")}
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            className={`hamburger ${isOpen ? "active" : ""}`}
            onClick={toggleMenu}
            aria-label={t("common.search")} // Using search as generic toggle label
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