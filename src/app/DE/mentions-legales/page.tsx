import Link from "next/link";

export default function MentionsLegalesPage() {
  return (
    <div className="legal-page-wrapper">
      <div className="legal-hero-banner">
        <div className="legal-hero-glow" />
        <span className="legal-pill-badge">
          <i className="fa-solid fa-scale-balanced"></i> Informations légales
        </span>
        <h1 className="legal-main-heading">Mentions Légales</h1>
        <p className="legal-lead-text">
          Conformément aux dispositions des lois européennes sur la confiance dans l&apos;économie numérique et les services de paiement.
        </p>
      </div>

      <div className="legal-page-container">
        <div className="legal-content-card">
          
          <section className="legal-block">
            <h3>1. Éditeur de la plateforme</h3>
            <p>Le site internet et l&apos;application bancaire <strong>CBG Banque</strong> sont édités et exploités par :</p>
            <div className="legal-info-table">
              <div className="info-row">
                <span className="info-key">Dénomination sociale :</span>
                <span className="info-val">CBG Banque Finance SA</span>
              </div>
              <div className="info-row">
                <span className="info-key">Forme juridique :</span>
                <span className="info-val">Société Anonyme de droit belge</span>
              </div>
              <div className="info-row">
                <span className="info-key">Capital social :</span>
                <span className="info-val">50 000 000 € entièrement libéré</span>
              </div>
              <div className="info-row">
                <span className="info-key">Siège social :</span>
                <span className="info-val">Avenue Louise 542, 1050 Ixelles, Bruxelles, Belgique</span>
              </div>
              <div className="info-row">
                <span className="info-key">Numéro d&apos;entreprise (BCE) :</span>
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
                <span className="info-key">Téléphone :</span>
                <span className="info-val">+33 (0) 1 89 71 42 00</span>
              </div>
            </div>
          </section>

          <section className="legal-block">
            <h3>2. Autorité de Contrôle et Agrément</h3>
            <p>
              CBG Banque Finance SA exerce ses activités financières sous la supervision et le contrôle prudentiel des autorités monétaires européennes compétentes et de la Banque Nationale de Belgique (BNB). Les services de paiement et d&apos;émission de monnaie électronique sont strictement régis par la Directive Européenne sur les Services de Paiement (DSP2).
            </p>
          </section>

          <section className="legal-block">
            <h3>3. Hébergement du Service</h3>
            <p>
              L&apos;infrastructure d&apos;hébergement et les bases de données haute sécurité de CBG Banque sont réparties sur des centres de données européens certifiés ISO/IEC 27001, SOC 2 Type II et PCI-DSS niveau 1, garantissant une disponibilité permanente de 99,99%.
            </p>
          </section>

          <section className="legal-block">
            <h3>4. Propriété intellectuelle</h3>
            <p>
              L&apos;ensemble des éléments composant le site et l&apos;application (marques CBG, logos, chartes graphiques, logiciels, codes sources, icônes et textes) est la propriété exclusive de CBG Banque Finance SA ou fait l&apos;objet d&apos;une licence légale. Toute reproduction, copie ou diffusion intégrale ou partielle sans consentement préalable écrit est formellement interdite.
            </p>
          </section>

          <section className="legal-block">
            <h3>5. Réclamation et Médiation</h3>
            <p>
              En cas de réclamation, le client est invité à contacter en priorité le service clientèle à <a href="mailto:reclamation@cbgbanque.com">reclamation@cbgbanque.com</a>. Si aucun accord n&apos;est trouvé, le consommateur peut faire appel gratuitement au médiateur indépendant du secteur financier : <strong>Ombudsfin</strong> (<a href="https://ombudsfin.be" target="_blank" rel="noopener noreferrer">www.ombudsfin.be</a>).
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
