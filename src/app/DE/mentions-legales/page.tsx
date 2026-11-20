import Link from "next/link";

export default function MentionsLegalesPage() {
  return (
    <div className="legal-page-wrapper">
      <div className="legal-hero-banner">
        <div className="legal-hero-glow" />
        <span className="legal-pill-badge">
          <i className="fa-solid fa-scale-balanced"></i> Rechtliche Hinweise
        </span>
        <h1 className="legal-main-heading">Impressum</h1>
        <p className="legal-lead-text">
          Gemäß den Bestimmungen der europäischen Gesetze über das Vertrauen in die digitale Wirtschaft und Zahlungsdienste.
        </p>
      </div>

      <div className="legal-page-container">
        <div className="legal-content-card">

          <section className="legal-block">
            <h3>1. Herausgeber der Plattform</h3>
            <p>Die Internetseite und die Bankanwendung <strong>CBG Bank</strong> werden herausgegeben und betrieben von:</p>
            <div className="legal-info-table">
              <div className="info-row">
                <span className="info-key">Firmenname:</span>
                <span className="info-val">CBG Bank Finance AG</span>
              </div>
              <div className="info-row">
                <span className="info-key">Rechtsform:</span>
                <span className="info-val">Aktiengesellschaft belgischen Rechts</span>
              </div>
              <div className="info-row">
                <span className="info-key">Stammkapital:</span>
                <span className="info-val">50 000 000 € voll eingezahlt</span>
              </div>
              <div className="info-row">
                <span className="info-key">Sitz:</span>
                <span className="info-val">Avenue Louise 542, 1050 Ixelles, Brüssel, Belgien</span>
              </div>
              <div className="info-row">
                <span className="info-key">Unternehmensnummer (BCE):</span>
                <span className="info-val">BE 0789.456.123</span>
              </div>
              <div className="info-row">
                <span className="info-key">LEI-Identifikator:</span>
                <span className="info-val">549300C23BQ2026B7</span>
              </div>
              <div className="info-row">
                <span className="info-key">SWIFT / BIC Code:</span>
                <span className="info-val">C23QBEBB</span>
              </div>
              <div className="info-row">
                <span className="info-key">Kontakt-E-Mail:</span>
                <span className="info-val"><a href="mailto:contact@cbgbanque.com">contact@cbgbanque.com</a></span>
              </div>
              <div className="info-row">
                <span className="info-key">Telefon:</span>
                <span className="info-val">+33 (0) 1 89 71 42 00</span>
              </div>
            </div>
          </section>

          <section className="legal-block">
            <h3>2. Aufsichtsbehörde und Zulassung</h3>
            <p>
              Die CBG Bank Finance AG übt ihre Finanzdienstleistungen unter der Aufsicht und dem prudentiellen Control der zuständigen europäischen Geldbehörden und der Belgischen Nationalbank (BNB) aus. Die Zahlungsdienste und die Ausgabe von E-Geld unterliegen streng der Europäischen Zahlungsdiensterichtlinie (PSD2).
            </p>
          </section>

          <section className="legal-block">
            <h3>3. Hosting des Dienstes</h3>
            <p>
              Die Hosting-Infrastruktur und die Hochsicherheitsdatenbanken der CBG Bank verteilen sich auf europäische Rechenzentren, die nach ISO/IEC 27001, SOC 2 Type II und PCI-DSS Level 1 zertifiziert sind und eine permanente Verfügbarkeit von 99,99 % garantieren.
            </p>
          </section>

          <section className="legal-block">
            <h3>4. Geistiges Eigentum</h3>
            <p>
              Die Gesamtheit der Elemente der Website und der Anwendung (Marken CBG, Logos, Grafikcharts, Software, Quellcodes, Icons und Texte) ist Eigentum der CBG Bank Finance AG oder Gegenstand einer rechtmäßigen Lizenz. Jede vollständige oder teilweise Vervielfältigung, Kopie oder Verbreitung ohne vorherige schriftliche Zustimmung ist formell untersagt.
            </p>
          </section>

          <section className="legal-block">
            <h3>5. Beschwerde und Mediation</h3>
            <p>
              Im Falle einer Beschwerde wird der Kunde aufgefordert, primär den Kundendienst unter <a href="mailto:reclamation@cbgbanque.com">reclamation@cbgbanque.com</a> zu kontaktieren. Wird keine Einigung erzielt, kann der Verbraucher kostenlos den unabhängigen Finanzmediator anrufen: <strong>Ombudsfin</strong> (<a href="https://ombudsfin.be" target="_blank" rel="noopener noreferrer">www.ombudsfin.be</a>).
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}