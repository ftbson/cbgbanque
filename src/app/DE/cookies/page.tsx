"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookiesPage() {
  const [consentStatus, setConsentStatus] = useState<string>("Nicht festgelegt");

  useEffect(() => {
    const consent = localStorage.getItem("cbg_cookie_consent");
    if (consent) {
      try {
        const parsed = JSON.parse(consent);
        setConsentStatus(
          parsed.marketing
            ? "Alle Cookies akzeptiert"
            : parsed.analytics
            ? "Nur essenzielle und analytische Cookies"
            : "Nur essenzielle Cookies"
        );
      } catch {
        setConsentStatus("Gespeichert");
      }
    }
  }, []);

  const resetCookies = () => {
    localStorage.removeItem("cbg_cookie_consent");
    window.location.reload();
  };

  return (
    <div className="legal-page-wrapper">
      <div className="legal-hero-banner">
        <div className="legal-hero-glow" />
        <span className="legal-pill-badge">
          <i className="fa-solid fa-cookie-bite"></i> Transparenz & Tracker
        </span>
        <h1 className="legal-main-heading">Cookie-Richtlinie</h1>
        <p className="legal-lead-text">
          Verstehen Sie, wie die CBG Bank Verbindungs-Cookies und Tracker verwendet, um die Sicherheit und Qualit&auml;t Ihrer Bankdienstleistungen zu gew&auml;hrleisten.
        </p>
      </div>

      <div className="legal-page-container">
        <div className="legal-content-card">

          <div className="cookie-status-box">
            <div className="status-info">
              <span className="status-tag">IHR AKTUELLER ZUSTIMMUNGSSTATUS</span>
              <strong className="status-current">{consentStatus}</strong>
            </div>
            <button onClick={resetCookies} className="btn-table-details">
              <i className="fa-solid fa-rotate-right"></i> Meine Pr&auml;ferenzen &auml;ndern
            </button>
          </div>

          <section className="legal-block">
            <h3>1. Was ist ein Cookie?</h3>
            <p>
              Ein Cookie ist eine kleine Textdatei, die auf Ihrem Endger&auml;t (Computer, Tablet oder Smartphone) beim Besuch einer Website oder Nutzung einer Webanwendung abgelegt wird. Sie erm&ouml;glicht es der Website, sich Ihre Aktionen, Ihre Verbindungseinstellungen zu merken und die Sicherheit Ihrer Bank-Sitzung f&uuml;r einen bestimmten Zeitraum zu gew&auml;hrleisten.
            </p>
          </section>

          <section className="legal-block">
            <h3>2. Die auf der CBG Bank verwendeten Cookie-Kategorien</h3>

            <div className="cookie-category-block">
              <div className="cat-badge-title">
                <span className="cat-badge required">Unverzichtbar</span>
                <h4>F&uuml;r den Betrieb und die Sicherheit unbedingt erforderliche Cookies</h4>
              </div>
              <p>
                Diese Cookies sind f&uuml;r den Betrieb der Online-Plattform unverzichtbar. Sie erm&ouml;glichen Ihnen eine sichere Navigation, die Authentifizierung in Ihrem Dashboard, die Validierung finanzieller Transaktionen (KYC, &Uuml;berweisungen, Kreditanfragen) und den Schutz vor Cross-Site-Request-Forgery-Angriffen (CSRF). Gem&auml;&szlig; den Richtlinien der CNIL und der DSGVO erfordern diese Tracker keine vorherige Einwilligung.
              </p>
            </div>

            <div className="cookie-category-block">
              <div className="cat-badge-title">
                <span className="cat-badge optional">Optional</span>
                <h4>Cookies zur Zielgruppenmessung und Leistungsanalyse</h4>
              </div>
              <p>
                Diese Tracker erm&ouml;glichen es uns, das Besuchervolumen, die meistbesuchten Seiten zu messen und eventuelle technische St&ouml;rungen zu identifizieren, um die Ergonomie Ihres Bankbereichs kontinuierlich zu verbessern. Alle IP-Adressen werden vor jeglicher statistischen Verarbeitung anonymisiert.
              </p>
            </div>

            <div className="cookie-category-block">
              <div className="cat-badge-title">
                <span className="cat-badge optional">Optional</span>
                <h4>Pr&auml;ferenz- und Personalisierungs-Cookies</h4>
              </div>
              <p>
                Diese Cookies erm&ouml;glichen es, Ihre bevorzugte Sprache, Ihre Referenzw&auml;hrung (EUR, CHF, USD) sowie Ihre Anzeigeeinstellungen f&uuml;r den Kontostand im Dashboard zu speichern.
              </p>
            </div>
          </section>

          <section className="legal-block">
            <h3>3. Detaillierte Tabelle der wichtigsten Cookies</h3>
            <div className="legal-info-table">
              <div className="info-row">
                <span className="info-key">cbg_session</span>
                <span className="info-val">Verwaltung der verschl&uuml;sselten Bank-Sitzung (Dauer: Sitzung)</span>
              </div>
              <div className="info-row">
                <span className="info-key">cbg_cookie_consent</span>
                <span className="info-val">Speicherung Ihrer Cookie-Wahl (Dauer: 12 Monate)</span>
              </div>
              <div className="info-row">
                <span className="info-key">cbg_csrf_token</span>
                <span className="info-val">Sicherheit gegen Formularf&auml;lschung (Dauer: Sitzung)</span>
              </div>
            </div>
          </section>

          <section className="legal-block">
            <h3>4. Wie verwalten oder deaktivieren Sie Cookies in Ihrem Browser?</h3>
            <p>
              Sie k&ouml;nnen Ihre Browsersoftware jederzeit so konfigurieren, dass die Ablage von Cookies auf Ihrem Endger&auml;t erlaubt oder verweigert wird:
            </p>
            <ul>
              <li><strong>Google Chrome:</strong> Einstellungen &gt; Datenschutz und Sicherheit &gt; Cookies und andere Websitedaten.</li>
              <li><strong>Mozilla Firefox:</strong> Einstellungen &gt; Datenschutz &amp; Sicherheit &gt; Cookies und Websitedaten.</li>
              <li><strong>Apple Safari:</strong> Einstellungen &gt; Datenschutz &gt; Alle Cookies blockieren.</li>
              <li><strong>Microsoft Edge:</strong> Einstellungen &gt; Datenschutz, Suche und Dienste &gt; Cookies.</li>
            </ul>
            <p>
              <em>Achtung: Die vollst&auml;ndige Blockierung essenzieller Cookies kann den Zugriff auf Ihren sicheren Kundenbereich unm&ouml;glich machen.</em>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
