import Link from "next/link";

export default function CguPage() {
  return (
    <div className="legal-page-wrapper">
      <div className="legal-hero-banner">
        <div className="legal-hero-glow" />
        <span className="legal-pill-badge">
          <i className="fa-solid fa-file-contract"></i> Vertraglicher Rahmen
        </span>
        <h1 className="legal-main-heading">Allgemeine Geschäftsbedingungen (AGB)</h1>
        <p className="legal-lead-text">
          Anwendbare Modalitäten für die Kontoeröffnung, die Nutzung des Online-Kontos, die Ausstellung von Bankkarten und die Kreditdienstleistungen der CBG Bank.
        </p>
      </div>

      <div className="legal-page-container">
        <div className="legal-content-card">

          <section className="legal-block">
            <h3>Artikel 1: Gegenstand und Anwendungsbereich</h3>
            <p>
              Die vorliegenden Allgemeinen Geschäftsbedingungen (die „AGB“) definieren die Regeln und vertraglichen Verpflichtungen, die jede volljährige natürliche Person (der „Kunde“ oder „Nutzer“) und die Gesellschaft <strong>CBG Bank Finance AG</strong> im Rahmen der Eröffnung und Verwaltung ihrer Konten, Zahlungsinstrumente und Finanzprodukte binden.
            </p>
          </section>

          <section className="legal-block">
            <h3>Artikel 2: Zulassungsvoraussetzungen und Kontoeröffnung</h3>
            <p>
              Um Kunde der CBG Bank zu werden, muss der Antragsteller die folgenden Bedingungen kumulativ erfüllen:
            </p>
            <ul>
              <li>Eine volljährige natürliche Person sein und ihre volle Rechtsfähigkeit genießen.</li>
              <li>Rechtmäßig in einem Mitgliedstaat der Europäischen Union, in der Schweiz, im Vereinigten Königreich oder in Kanada wohnen.</li>
              <li>Eine gültige E-Mail-Adresse, eine funktionierende Mobiltelefonnummer angeben und das KYC-Identitätsprüfungsprotokoll absolvieren, indem Vorder- und Rückseite eines gültigen offiziellen Ausweisdokuments hochgeladen werden.</li>
              <li>Seine berufliche Situation und sein monatliches Einkommen wahrheitsgemäß angeben.</li>
            </ul>
            <p>
              Die endgültige Kontoeröffnung unterliegt der ausdrücklichen Validierung durch den Administrator und die Compliance-Teams der CBG Bank. Eine Bestätigungs-E-Mail bestätigt die Validierung des Kontos.
            </p>
          </section>

          <section className="legal-block">
            <h3>Artikel 3: Funktionieren des Kontos und der Karten</h3>
            <p>
              Das Online-Konto ermöglicht Einzahlungen, SEPA-Überweisungen, Echtzeit-Kontostandsabfrage und die Verwaltung von Spartresoren.
            </p>
            <p>
              <strong>Virtuelle und physische Karten:</strong> Der Kunde kann eine oder mehrere virtuelle Karten aktivieren, um seine Online-Zahlungen abzusichern, oder eine physische Visa-Karte bestellen. Der Kunde kann jederzeit den Status seiner Karte ändern (Sperrung / vorübergehende Entsperrung), seine Nummern ein- oder ausblenden oder seine virtuelle Karte direkt aus seinem sicheren Kundenbereich kündigen.
            </p>
          </section>

          <section className="legal-block">
            <h3>Artikel 4: Beantragung und Gewährung von Krediten</h3>
            <p>
              Der berechtigte Kunde kann eine Anfrage für einen Privatkredit oder eine Finanzierung aus seinem Dashboard stellen. Ein dynamischer Simulator zeigt den Darlehensbetrag, die Laufzeit in Monaten, den Effektiven Jahreszins (EJZ), den Betrag der monatlichen Raten und die anfallenden Bearbeitungsgebühren an.
            </p>
            <p>
              Die Einreichung einer Kreditanfrage stellt keine automatische Annahme dar: Das Dossier wird von unserem Kreditausschuss geprüft. Die Genehmigung oder Ablehnung der Anfrage wird im Dashboard des Kunden und per E-Mail-Benachrichtigung mitgeteilt. Ein Kredit bindet Sie und muss zurückgezahlt werden: Prüfen Sie Ihre Rückzahlungsfähigkeiten, bevor Sie sich verpflichten.
            </p>
          </section>

          <section className="legal-block">
            <h3>Artikel 5: Sicherheit und Pflichten des Kunden</h3>
            <p>
              Der Kunde ist streng für die Vertraulichkeit seiner persönlichen Zugangsdaten, seines Passworts und seiner temporären Validierungscodes (OTP) verantwortlich. Jegliche Weitergabe vertraulicher Codes ist formell untersagt. Im Verdachtsfall von Betrug oder betrügerischem Zugriff muss der Kunde seine Karten sofort sperren und den Notfallsupport kontaktieren.
            </p>
          </section>

          <section className="legal-block">
            <h3>Artikel 6: Kontoschließung und Kündigung</h3>
            <p>
              Der Kunde kann jederzeit ohne Kündigungsfrist und ohne Strafe die Schließung seines Kontos beantragen, vorbehaltlich der vorherigen Begleichung eines etwaigen Sollsaldo oder einer laufenden Kreditrate. Die CBG Bank behält sich das Recht vor, ein Konto im Falle falscher Angaben, längerer Inaktivität oder Verletzung gesetzlicher Verpflichtungen zu sperren oder zu schließen.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}