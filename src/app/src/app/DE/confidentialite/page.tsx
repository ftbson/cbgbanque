import Link from "next/link";

export default function ConfidentialitePage() {
  return (
    <div className="legal-page-wrapper">
      <div className="legal-hero-banner">
        <div className="legal-hero-glow" />
        <span className="legal-pill-badge">
          <i className="fa-solid fa-lock"></i> Datenschutz & Datensicherheit
        </span>
        <h1 className="legal-main-heading">Datenschutzerklärung</h1>
        <p className="legal-lead-text">
          Letzte Aktualisierung: Februar 2026. Erfahren Sie die strengen Verpflichtungen der CBG Bank Finance AG bezüglich der Erhebung, Verarbeitung und Sicherheit Ihrer finanziellen und persönlichen Daten.
        </p>
      </div>

      <div className="legal-page-container">
        <div className="legal-content-card">

          <section className="legal-block">
            <h3>1. Einführung und Verantwortlicher</h3>
            <p>
              Diese Datenschutzerklärung gilt für alle von der <strong>CBG Bank Finance AG</strong> (eine europäische Aktiengesellschaft mit Sitz in Avenue Louise 542, 1050 Brüssel, Belgien) bereitgestellten Dienstleistungen. Als Kreditinstitut und Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO 2016/679) legen wir größten Wert auf die Vertraulichkeit Ihrer privaten Informationen.
            </p>
          </section>

          <section className="legal-block">
            <h3>2. Welche personenbezogenen Daten erheben wir?</h3>
            <p>Im Rahmen der Kontoeröffnung und -führung erheben wir folgende Informationen:</p>
            <ul>
              <li><strong>Identifikationsdaten (KYC):</strong> Anrede, Name, Vorname, Geburtsdatum und -ort, Nationalität, Postanschrift, Telefonnummer und E-Mail-Adresse.</li>
              <li><strong>Identitätsnachweise:</strong> Kopie der Vorder- und Rückseite Ihres Personalausweises, Reisepasses oder Aufenthaltstitels, gespeichert in einem hochsicheren, verschlüsselten Speicherbereich.</li>
              <li><strong>Berufliche und finanzielle Situation:</strong> Angegebener Beruf, Gehaltsstufe / Nettomonatseinkommen, für die Kreditprüfung notwendige Informationen.</li>
              <li><strong>Transaktions- und Kartendaten:</strong> IBAN-Kontonummer, Überweisungen, Erstellung und Nutzung virtueller oder physischer Karten, Bewegungsverlauf.</li>
              <li><strong>Technische Verbindungsdaten:</strong> Zeitstempel sicherer Verbindungen, maskierte IP-Adresse, Audit-Logs zur Bankbetrugsprävention.</li>
            </ul>
          </section>

          <section className="legal-block">
            <h3>3. Zwecke und Rechtsgrundlagen der Verarbeitung</h3>
            <p>Ihre Daten werden für präzise und rechtmäßige Zwecke verarbeitet:</p>
            <ul>
              <li><strong>Vertragserfüllung:</strong> Kontoeröffnung, Ausgabe von Zahlungskarten, Abwicklung von Überweisungen, Simulation und Gewährung von Krediten.</li>
              <li><strong>Gesetzliche und regulatorische Bankpflichten:</strong> Geldwäsche- und Terrorismusfinanzierungsbekämpfung (GWG/FT), obligatorische KYC-Identitätsprüfung (Know Your Customer) vor jeder Kontoaktivierung durch unsere Administratoren.</li>
              <li><strong>Sicherheit und Betrugsprävention:</strong> Schutz Ihres Kundenbereichs vor unbefugtem Zugriff und Echtzeit-Sicherheitswarnungen.</li>
              <li><strong>Einwilligung:</strong> Für den Versand von Informations-E-Mails oder die Aktivierung optionaler Analyse-Cookies.</li>
            </ul>
          </section>

          <section className="legal-block">
            <h3>4. Aufbewahrungsdauer der Daten</h3>
            <p>
              Gemäß der europäischen Geld- und Finanzvorschrift werden Ihre Identitätsdokumente und der Verlauf Ihrer Transaktionen für eine Dauer von 5 Jahren nach Beendigung der Bankbeziehung archiviert, wonach sie einer unwiderruflichen, sicheren Löschung unterzogen werden.
            </p>
          </section>

          <section className="legal-block">
            <h3>5. Sicherheit und Verschlüsselung der Informationen</h3>
            <p>
              Alle Daten im Transit sind durch das TLS 1.3-Protokoll mit 256-Bit-Verschlüsselung geschützt. Ihre Passwörter werden kryptografisch mit starken Algorithmen (Argon2 / Scrypt) gehasht und niemals im Klartext gespeichert. Ausweiskopien sind nur für das autorisierte Compliance-Personal zur regulatorischen Prüfung zugänglich.
            </p>
          </section>

          <section className="legal-block">
            <h3>6. Ihre Rechte gemäß DSGVO</h3>
            <p>
              Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Übertragbarkeit, Einschränkung und Löschung Ihrer personenbezogenen Daten (vorbehaltlich unserer gesetzlichen Bankarchivierungspflichten). Um Ihre Rechte geltend zu machen, kontaktieren Sie unseren Datenschutzbeauftragten (DSB):
            </p>
            <div className="legal-contact-highlight">
              <i className="fa-solid fa-shield-halved"></i>
              <div>
                <strong>Datenschutzbeauftragter (DSB)</strong>
                <p>E-Mail: <a href="mailto:dpo@cbgbanque.com">dpo@cbgbanque.com</a> · Adresse: CBG Bank Finance AG, DSB-Büro, Avenue Louise 542, 1050 Brüssel</p>
              </div>
            </div>
            <p style={{ marginTop: "1rem" }}>
              Für weitere Details konsultieren Sie auch unsere Seite zur <Link href="/DE/rgpd" className="text-link">Datenschutz-Grundverordnung (DSGVO)</Link>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}