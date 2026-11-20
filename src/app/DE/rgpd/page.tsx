import Link from "next/link";

export default function RgpdPage() {
  return (
    <div className="legal-page-wrapper">
      <div className="legal-hero-banner">
        <div className="legal-hero-glow" />
        <span className="legal-pill-badge">
          <i className="fa-solid fa-user-shield"></i> Europäische Verordnung
        </span>
        <h1 className="legal-main-heading">DSGVO-Konformität & Ihre Rechte</h1>
        <p className="legal-lead-text">
          Die CBG Bank wendet die anspruchsvollsten Standards der Europäischen Union in Bezug auf den Schutz der Privatsphäre und den Schutz finanzieller Daten an (Verordnung EU 2016/679).
        </p>
      </div>

      <div className="legal-page-container">
        <div className="legal-content-card">

          <section className="legal-block">
            <h3>Unsere Grundlegenden DSGVO-Verpflichtungen</h3>
            <div className="rgpd-grid-highlights">
              <div className="rgpd-card-item">
                <div className="rgpd-item-icon blue">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <h4>Datensparsamkeit</h4>
                <p>Wir erheben nur die Informationen, die für die Erbringung unserer Bankdienstleistungen und unsere gesetzlichen Verpflichtungen unbedingt erforderlich sind.</p>
              </div>

              <div className="rgpd-card-item">
                <div className="rgpd-item-icon green">
                  <i className="fa-solid fa-key"></i>
                </div>
                <h4>Ende-zu-Ende-Verschlüsselung</h4>
                <p>Ihre Identitätsdokumente und Bankdaten sind im Ruhezustand und bei der Übertragung nach modernsten Protokollen AES-256 / TLS 1.3 verschlüsselt.</p>
              </div>

              <div className="rgpd-card-item">
                <div className="rgpd-item-icon purple">
                  <i className="fa-solid fa-ban"></i>
                </div>
                <h4>Kein Datenverkauf</h4>
                <p>Ihre persönlichen oder finanziellen Daten werden niemals an Dritte, Werbenetzwerke oder Datenhändler verkauft, vermietet oder vermarktet.</p>
              </div>

              <div className="rgpd-card-item">
                <div className="rgpd-item-icon amber">
                  <i className="fa-solid fa-server"></i>
                </div>
                <h4>100% Europäisches Hosting</h4>
                <p>Ihre Informationen werden innerhalb des Europäischen Wirtschaftsraums gehostet, unter der ausschließlichen Kontrolle europäischer Gesetze.</p>
              </div>
            </div>
          </section>

          <section className="legal-block">
            <h3>Ihre Individuellen Rechte und Wie Sie Diese Ausüben</h3>
            <p>Die Datenschutz-Grundverordnung gewährt Ihnen eine Reihe von Rechten:</p>
            <ul>
              <li><strong>Recht auf Auskunft (Artikel 15 DSGVO):</strong> Sie können die Bestätigung erhalten, dass Sie betreffende Daten verarbeitet werden, und eine vollständige Kopie erhalten.</li>
              <li><strong>Recht auf Berichtigung (Artikel 16 DSGVO):</strong> Sie können unrichtige oder unvollständige Daten über Ihr Profil oder per schriftlicher Anfrage korrigieren oder aktualisieren.</li>
              <li><strong>Recht auf Löschung (Artikel 17 DSGVO):</strong> Sie können die Löschung Ihrer Daten verlangen, innerhalb der Grenzen der gesetzlichen Bankarchivierungspflichten für Geldgeschäfte (gesetzliche Dauer von 5 Jahren).</li>
              <li><strong>Recht auf Einschränkung der Verarbeitung (Artikel 18 DSGVO):</strong> Sie können in bestimmten Fällen die vorübergehende Einstellung der Verarbeitung Ihrer Daten verlangen.</li>
              <li><strong>Recht auf Datenübertragbarkeit (Artikel 20 DSGVO):</strong> Sie haben das Recht, Ihre Finanzdaten in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten.</li>
              <li><strong>Widerspruchsrecht (Artikel 21 DSGVO):</strong> Sie können jederzeit der Verwendung Ihrer Daten zu Zwecken der kommerziellen Werbung widersprechen.</li>
            </ul>
          </section>

          <section className="legal-block">
            <h3>Formular zur Ausübung der DSGVO-Rechte</h3>
            <p>
              Für jede Anfrage bezüglich Ihrer persönlichen Daten können Sie Ihr Anliegen zusammen mit einer Referenz Ihres Kontos an unseren Datenschutzbeauftragten richten:
            </p>
            <div className="legal-contact-highlight">
              <i className="fa-solid fa-envelope-circle-check"></i>
              <div>
                <strong>Büro des Datenschutzbeauftragten (DSB)</strong>
                <p>Dedizierte E-Mail: <a href="mailto:rgpd@cbgbanque.com">rgpd@cbgbanque.com</a></p>
                <p>Postadresse: CBG Bank Finance AG, DSB-Service, Avenue Louise 542, 1050 Brüssel</p>
                <p style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#94a3b8" }}>
                  Antwortfrist: innerhalb eines Monats gemäß Artikel 12.3 der DSGVO.
                </p>
              </div>
            </div>
          </section>

          <section className="legal-block">
            <h3>Zuständige Aufsichtsbehörde</h3>
            <p>
              Sollten Sie nach Kontaktaufnahme mit uns der Ansicht sein, dass Ihre Rechte nicht gewahrt werden, haben Sie das Recht, Beschwerde bei der Datenschutzbehörde einzureichen (in Belgien: <a href="https://www.autoriteprotectiondonnees.be" target="_blank" rel="noopener noreferrer">www.autoriteprotectiondonnees.be</a>) oder der CNIL in Frankreich (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>).
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}