"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <header className="navbar-container">
      <nav className="navbar">
        {/* Brand / Logo */}
        <Link href="/" className="nav-brand">
          <div className="logo-icon">
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
          </div>
          <span className="brand-name">CBG Banque</span>
        </Link>

        {/* Center navigation links (Desktop + Animated Mobile Drawer) */}
        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link
            href="/fonctionnalites"
            className="nav-link"
            onClick={() => setIsOpen(false)}
          >
            Fonctionnalités
          </Link>
          <Link
            href="/engagements"
            className="nav-link"
            onClick={() => setIsOpen(false)}
          >
            Engagements
          </Link>
          <Link
            href="/aide"
            className="nav-link"
            onClick={() => setIsOpen(false)}
          >
            Aide
          </Link>
          <Link
            href="/download"
            className="nav-link mobile-only-download"
            onClick={() => setIsOpen(false)}
          >
            <i className="fa-solid fa-download"></i> Télécharger l'app
          </Link>
          {/* Bouton visible uniquement dans le menu mobile ouvert */}
          <Link
            href="/register"
            className="btn-primary mobile-only-cta"
            onClick={() => setIsOpen(false)}
          >
            Ouvrir un compte
          </Link>
        </div>

        {/* Action buttons (Right) */}
        <div className="nav-actions">
          {/* Connexion */}
          <Link href="/login" className="btn-outline btn-login">
            Connexion
          </Link>

          {/* Desktop primary CTA (Unique sur PC) */}
          <Link href="/register" className="btn-primary desktop-cta">
            Ouvrir un compte
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            className={`hamburger ${isOpen ? "active" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
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
