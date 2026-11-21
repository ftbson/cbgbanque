"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookiesPage() {
  const [consentStatus, setConsentStatus] = useState<string&gt;("Nicht festgelegt");

  useEffect(() =&gt; {
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

  const resetCookies = () =&gt; {
    localStorage.removeItem("cbg_cookie_consent");
    window.location.reload();
  };

  return (
    <div className="legal-page-wrapper"&gt;
      <div className="legal-hero-banner"&gt;
        <div className="legal-hero-glow" /&gt;
        <span className="legal-pill-badge"&gt;
          <i className="fa-solid fa-cookie-bite"&gt;</i&gt; Transparenz & Tracker
        </span&gt;
        <h1 className="legal-main-heading"&gt;Cookie-Richtlinie</h1&gt;
        <p className="legal-lead-text"&gt;
          Verstehen Sie, wie die CBG Bank Verbindungs-Cookies und Tracker verwendet, um die Sicherheit und Qualität Ihrer Bankdienstleistungen zu gewährleisten.
        </p&gt;
      </div&gt;

      <div className="legal-page-container"&gt;
        <div className="legal-content-card"&gt;

          <div className="cookie-status-box"&gt;
            <div className="status-info"&gt;
              <span className="status-tag"&gt;IHR AKTUELLER ZUSTIMMUNGSSTATUS</span&gt;
              <strong className="status-current"&gt;{consentStatus}</strong&gt;
            </div&gt;
            <button onClick={resetCookies} className="btn-table-details"&gt;
              <i className="fa-solid fa-rotate-right"&gt;</i&gt; Meine Präferenzen ändern
            </button&gt;
          </div&gt;

          <section className="legal-block"&gt;
            <h3&gt;1. Was ist ein Cookie?</h3&gt;
            <p&gt;
              Ein Cookie ist eine kleine Textdatei, die auf Ihrem Endgerät (Computer, Tablet oder Smartphone) beim Besuch einer Website oder Nutzung einer Webanwendung abgelegt wird. Sie ermöglicht es der Website, sich Ihre Aktionen, Ihre Verbindungseinstellungen zu merken und die Sicherheit Ihrer Bank-Sitzung für einen bestimmten Zeitraum zu gewährleisten.
            </p&gt;
          </section&gt;

          <section className="legal-block"&gt;
            <h3&gt;2. Die auf der CBG Bank verwendeten Cookie-Kategorien</h3&gt;

            <div className="cookie-category-block"&gt;
              <div className="cat-badge-title"&gt;
                <span className="cat-badge required"&gt;Unverzichtbar</span&gt;
                <h4&gt;Für den Betrieb und die Sicherheit unbedingt erforderliche Cookies</h4&gt;
              </div&gt;
              <p&gt;
                Diese Cookies sind für den Betrieb der Online-Plattform unverzichtbar. Sie ermöglichen Ihnen eine sichere Navigation, die Authentifizierung in Ihrem Dashboard, die Validierung finanzieller Transaktionen (KYC, Überweisungen, Kreditanfragen) und den Schutz vor Cross-Site-Request-Forgery-Angriffen (CSRF). Gemäß den Richtlinien der CNIL und der DSGVO erfordern diese Tracker keine vorherige Einwilligung.
              </p&gt;
            </div&gt;

            <div className="cookie-category-block"&gt;
              <div className="cat-badge-title"&gt;
                <span className="cat-badge optional"&gt;Optional</span&gt;
                <h4&gt;Cookies zur Zielgruppenmessung und Leistungsanalyse</h4&gt;
              </div&gt;
              <p&gt;
                Diese Tracker ermöglichen es uns, das Besuchervolumen, die meistbesuchten Seiten zu messen und eventuelle technische Störungen zu identifizieren, um die Ergonomie Ihres Bankbereichs kontinuierlich zu verbessern. Alle IP-Adressen werden vor jeglicher statistischen Verarbeitung anonymisiert.
              </p&gt;
            </div&gt;

            <div className="cookie-category-block"&gt;
              <div className="cat-badge-title"&gt;
                <span className="cat-badge optional"&gt;Optional</span&gt;
                <h4&gt;Präferenz- und Personalisierungs-Cookies</h4&gt;
              </div&gt;
              <p&gt;
                Diese Cookies ermöglichen es, Ihre bevorzugte Sprache, Ihre Referenzwährung (EUR, CHF, USD) sowie Ihre Anzeigeeinstellungen für den Kontostand im Dashboard zu speichern.
              </p&gt;
            </div&gt;
          </section&gt;

          <section className="legal-block"&gt;
            <h3&gt;3. Detaillierte Tabelle der wichtigsten Cookies</h3&gt;
            <div className="legal-info-table"&gt;
              <div className="info-row"&gt;
                <span className="info-key"&gt;cbg_session</span&gt;
                <span className="info-val"&gt;Verwaltung der verschlüsselten Bank-Sitzung (Dauer: Sitzung)</span&gt;
              </div&gt;
              <div className="info-row"&gt;
                <span className="info-key"&gt;cbg_cookie_consent</span&gt;
                <span className="info-val"&gt;Speicherung Ihrer Cookie-Wahl (Dauer: 12 Monate)</span&gt;
              </div&gt;
              <div className="info-row"&gt;
                <span className="info-key"&gt;cbg_csrf_token</span&gt;
                <span className="info-val"&gt;Sicherheit gegen Formularfälschung (Dauer: Sitzung)</span&gt;
              </div&gt;
            </div&gt;
          </section&gt;

          <section className="legal-block"&gt;
            <h3&gt;4. Wie verwalten oder deaktivieren Sie Cookies in Ihrem Browser?</h3&gt;
            <p&gt;
              Sie können Ihre Browsersoftware jederzeit so konfigurieren, dass die Ablage von Cookies auf Ihrem Endgerät erlaubt oder verweigert wird:
            </p&gt;
            <ul&gt;
              <li&gt;<strong&gt;Google Chrome:</strong&gt; Einstellungen &gt; Datenschutz und Sicherheit &gt; Cookies und andere Websitedaten.</li&gt;
              <li&gt;<strong&gt;Mozilla Firefox:</strong&gt; Einstellungen &gt; Datenschutz &amp; Sicherheit &gt; Cookies und Websitedaten.</li&gt;
              <li&gt;<strong&gt;Apple Safari:</strong&gt; Einstellungen &gt; Datenschutz &gt; Alle Cookies blockieren.</li&gt;
              <li&gt;<strong&gt;Microsoft Edge:</strong&gt; Einstellungen &gt; Datenschutz, Suche und Dienste &gt; Cookies.</li&gt;
            </ul&gt;
            <p&gt;
              <em&gt;Achtung: Die vollständige Blockierung essenzieller Cookies kann den Zugriff auf Ihren sicheren Kundenbereich unmöglich machen.</em&gt;
            </p&gt;
          </section&gt;

        </div&gt;
      </div&gt;
    </div&gt;
  );
}