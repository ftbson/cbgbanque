"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    // Register Service Worker for PWA
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Silently ignore sw registration error if unsupported
      });
    }

    const consent = localStorage.getItem("cbg_cookie_consent");
    if (!consent) {
      // Delay showing slightly for smooth entry animation
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const choice = { essential: true, analytics: true, marketing: true, timestamp: Date.now() };
    localStorage.setItem("cbg_cookie_consent", JSON.stringify(choice));
    setIsVisible(false);
  };

  const handleRefuseAll = () => {
    const choice = { essential: true, analytics: false, marketing: false, timestamp: Date.now() };
    localStorage.setItem("cbg_cookie_consent", JSON.stringify(choice));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    const choice = { ...preferences, essential: true, timestamp: Date.now() };
    localStorage.setItem("cbg_cookie_consent", JSON.stringify(choice));
    setIsVisible(false);
    setShowPreferences(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner-backdrop">
      <div className="cookie-banner-card" role="dialog" aria-modal="true" aria-label="Gestion des cookies">
        <div className="cookie-banner-glow" />
        
        {!showPreferences ? (
          <div className="cookie-main-content">
            <div className="cookie-header">
              <div className="cookie-icon-badge">
                <i className="fa-solid fa-cookie-bite"></i>
              </div>
              <div className="cookie-title-group">
                <h4 className="cookie-title">Gestion de vos données & cookies</h4>
                <span className="cookie-badge">Conformité RGPD</span>
              </div>
            </div>

            <p className="cookie-description">
              Nous utilisons des cookies essentiels pour assurer le bon fonctionnement et la sécurité de vos services bancaires en ligne. Avec votre accord, nous utilisons également des cookies afin de mesurer l’audience et d’améliorer votre expérience.
            </p>

            <div className="cookie-actions">
              <button onClick={handleAcceptAll} className="btn-cookie-accept">
                <i className="fa-solid fa-check"></i> Tout accepter
              </button>
              <button onClick={handleRefuseAll} className="btn-cookie-refuse">
                Refuser
              </button>
              <button onClick={() => setShowPreferences(true)} className="btn-cookie-custom">
                Personnaliser
              </button>
            </div>

            <div className="cookie-footer-link">
              Pour en savoir plus, consultez notre{" "}
              <Link href="/cookies" className="cookie-link">
                Politique des cookies
              </Link>{" "}
              et notre{" "}
              <Link href="/confidentialite" className="cookie-link">
                Charte de confidentialité
              </Link>.
            </div>
          </div>
        ) : (
          <div className="cookie-preferences-content">
            <div className="cookie-header">
              <h4 className="cookie-title">Préférences des cookies</h4>
              <button
                onClick={() => setShowPreferences(false)}
                className="btn-cookie-close"
                aria-label="Fermer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="cookie-preference-items">
              <div className="pref-item">
                <div className="pref-info">
                  <strong>Cookies essentiels (Sécurité & Session)</strong>
                  <p>Indispensables à la navigation, l&apos;authentification et la sécurité bancaire.</p>
                </div>
                <span className="pref-badge-fixed">Toujours actif</span>
              </div>

              <div className="pref-item">
                <div className="pref-info">
                  <strong>Mesure d&apos;audience & Performances</strong>
                  <p>Permet d&apos;analyser anonymement l&apos;usage pour optimiser la plateforme.</p>
                </div>
                <label className="pref-switch">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) =>
                      setPreferences((p) => ({ ...p, analytics: e.target.checked }))
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="pref-item">
                <div className="pref-info">
                  <strong>Personnalisation & Alertes</strong>
                  <p>Affichage d&apos;actualités et d&apos;offres adaptées à vos besoins.</p>
                </div>
                <label className="pref-switch">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) =>
                      setPreferences((p) => ({ ...p, marketing: e.target.checked }))
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>

            <div className="cookie-actions">
              <button onClick={handleSavePreferences} className="btn-cookie-accept">
                Enregistrer mes choix
              </button>
              <button onClick={() => setShowPreferences(false)} className="btn-cookie-custom">
                Retour
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
