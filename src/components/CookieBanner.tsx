"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getMessages, type Locale } from "@/lib/messages";

export default function CookieBanner({ locale }: { locale: Locale }) {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false,
  });
  const t = getMessages(locale).cookieBanner;
  const localePrefix = `/${locale.toUpperCase()}`;

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const consent = localStorage.getItem("cbg_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveChoice = (choice: typeof preferences) => {
    localStorage.setItem(
      "cbg_cookie_consent",
      JSON.stringify({ ...choice, timestamp: Date.now() }),
    );
    setIsVisible(false);
    setShowPreferences(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner-backdrop">
      <div className="cookie-banner-card" role="dialog" aria-modal="true" aria-label={t.dialogLabel}>
        <div className="cookie-banner-glow" />

        {!showPreferences ? (
          <div className="cookie-main-content">
            <div className="cookie-header">
              <div className="cookie-icon-badge"><i className="fa-solid fa-cookie-bite"></i></div>
              <div className="cookie-title-group">
                <h4 className="cookie-title">{t.title}</h4>
                <span className="cookie-badge">{t.complianceBadge}</span>
              </div>
            </div>
            <p className="cookie-description">{t.description}</p>
            <div className="cookie-actions">
              <button onClick={() => saveChoice({ essential: true, analytics: true, marketing: true })} className="btn-cookie-accept">
                <i className="fa-solid fa-check"></i> {t.acceptAll}
              </button>
              <button onClick={() => saveChoice({ essential: true, analytics: false, marketing: false })} className="btn-cookie-refuse">
                {t.refuseAll}
              </button>
              <button onClick={() => setShowPreferences(true)} className="btn-cookie-custom">{t.customize}</button>
            </div>
            <div className="cookie-footer-link">
              {t.learnMore}{" "}
              <Link href={`${localePrefix}/cookies`} className="cookie-link">{t.cookiePolicy}</Link>{" "}
              {t.and}{" "}
              <Link href={`${localePrefix}/confidentialite`} className="cookie-link">{t.privacyPolicy}</Link>.
            </div>
          </div>
        ) : (
          <div className="cookie-preferences-content">
            <div className="cookie-header">
              <h4 className="cookie-title">{t.preferencesTitle}</h4>
              <button onClick={() => setShowPreferences(false)} className="btn-cookie-close" aria-label={t.close}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="cookie-preference-items">
              <div className="pref-item">
                <div className="pref-info"><strong>{t.essentialTitle}</strong><p>{t.essentialDescription}</p></div>
                <span className="pref-badge-fixed">{t.alwaysActive}</span>
              </div>
              <div className="pref-item">
                <div className="pref-info"><strong>{t.analyticsTitle}</strong><p>{t.analyticsDescription}</p></div>
                <label className="pref-switch">
                  <input type="checkbox" checked={preferences.analytics} onChange={(e) => setPreferences((p) => ({ ...p, analytics: e.target.checked }))} />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="pref-item">
                <div className="pref-info"><strong>{t.marketingTitle}</strong><p>{t.marketingDescription}</p></div>
                <label className="pref-switch">
                  <input type="checkbox" checked={preferences.marketing} onChange={(e) => setPreferences((p) => ({ ...p, marketing: e.target.checked }))} />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
            <div className="cookie-actions">
              <button onClick={() => saveChoice({ ...preferences, essential: true })} className="btn-cookie-accept">{t.save}</button>
              <button onClick={() => setShowPreferences(false)} className="btn-cookie-custom">{t.back}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
