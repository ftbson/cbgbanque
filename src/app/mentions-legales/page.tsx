import Link from "next/link";

export default function MentionsLegalesPage() {
  return (
    <div className="legal-page-wrapper">
      <div className="legal-hero-banner">
        <div className="legal-hero-glow" />
        <span className="legal-pill-badge">
          <i className="fa-solid fa-scale-balanced"></i> Informations lÃ©gales
        </span>
        <h1 className="legal-main-heading">Mentions LÃ©gales</h1>
        <p className="legal-lead-text">
          ConformÃ©ment aux dispositions des lois europÃ©ennes sur la confiance dans l&apos;Ã©conomie numÃ©rique et les services de paiement.
        </p>
      </div>

      <div className="legal-page-container">
        <div className="legal-content-card">
          
          <section className="legal-block">
            <h3>1. Ã‰diteur de la plateforme</h3>
            <p>Le site internet et l&apos;application bancaire <strong>CBG Banque</strong> sont Ã©ditÃ©s et exploitÃ©s par :</p>
            <div className="legal-info-table">
              <div className="info-row">
                <span className="info-key">DÃ©nomination sociale :</span>
                <span className="info-val">CBG Banque Finance SA</span>
              </div>
              <div className="info-row">
                <span className="info-key">Forme juridique :</span>
                <span className="info-val">SociÃ©tÃ© Anonyme de droit belge</span>
              </div>
              <div className="info-row">
                <span className="info-key">Capital social :</span>
                <span className="info-val">50 000 000 â‚¬ entiÃ¨rement libÃ©rÃ©</span>
              </div>
              <div className="info-row">
                <span className="info-key">SiÃ¨ge social :</span>
                <span className="info-val">Avenue Louise 542, 1050 Ixelles, Bruxelles, Belgique</span>
              </div>
              <div className="info-row">
                <span className="info-key">NumÃ©ro d&apos;entreprise (BCE) :</span>
                <span className="info-val">BE 0789.456.123</span>
              </div>
              <div className="info-row">
                <span className="info-key">Identifiant LEI :</span>
                <span className="info-val">549300C23BQ2026B7</span>
              </div>
              <div className="info-row">
                <span className="info-key">Code SWIFT / BIC :</span>
                <span className="info-val">C23QBEBB</span>
              </div>
              <div className="info-row">
                <span className="info-key">Courriel de contact :</span>
                <span className="info-val"><a href="mailto:contact@cbgbanque.com">contact@cbgbanque.com</a></span>
              </div>
              <div className="info-row">
                <span className="info-key">TÃ©lÃ©phone :</span>
                <span className="info-val">+33 (0) 1 89 71 42 00</span>
              </div>
            </div>
          </section>

          <section className="legal-block">
            <h3>2. AutoritÃ© de ContrÃ´le et AgrÃ©ment</h3>
            <p>
              CBG Banque Finance SA exerce ses activitÃ©s financiÃ¨res sous la supervision et le contrÃ´le prudentiel des autoritÃ©s monÃ©taires europÃ©ennes compÃ©tentes et de la Banque Nationale de Belgique (BNB). Les services de paiement et d&apos;Ã©mission de monnaie Ã©lectronique sont strictement rÃ©gis par la Directive EuropÃ©enne sur les Services de Paiement (DSP2).
            </p>
          </section>

          <section className="legal-block">
            <h3>3. HÃ©bergement du Service</h3>
            <p>
              L&apos;infrastructure d&apos;hÃ©bergement et les bases de donnÃ©es haute sÃ©curitÃ© de CBG Banque sont rÃ©parties sur des centres de donnÃ©es europÃ©ens certifiÃ©s ISO/IEC 27001, SOC 2 Type II et PCI-DSS niveau 1, garantissant une disponibilitÃ© permanente de 99,99%.
            </p>
          </section>

          <section className="legal-block">
            <h3>4. PropriÃ©tÃ© intellectuelle</h3>
            <p>
              L&apos;ensemble des Ã©lÃ©ments composant le site et l&apos;application (marques CBG, logos, chartes graphiques, logiciels, codes sources, icÃ´nes et textes) est la propriÃ©tÃ© exclusive de CBG Banque Finance SA ou fait l&apos;objet d&apos;une licence lÃ©gale. Toute reproduction, copie ou diffusion intÃ©grale ou partielle sans consentement prÃ©alable Ã©crit est formellement interdite.
            </p>
          </section>

          <section className="legal-block">
            <h3>5. RÃ©clamation et MÃ©diation</h3>
            <p>
              En cas de rÃ©clamation, le client est invitÃ© Ã  contacter en prioritÃ© le service clientÃ¨le Ã  <a href="mailto:reclamation@cbgbanque.com">reclamation@cbgbanque.com</a>. Si aucun accord n&apos;est trouvÃ©, le consommateur peut faire appel gratuitement au mÃ©diateur indÃ©pendant du secteur financier : <strong>Ombudsfin</strong> (<a href="https://ombudsfin.be" target="_blank" rel="noopener noreferrer">www.ombudsfin.be</a>).
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

