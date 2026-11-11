import Link from "next/link";

export default function RgpdPage() {
  return (
    <div className="legal-page-wrapper">
      <div className="legal-hero-banner">
        <div className="legal-hero-glow" />
        <span className="legal-pill-badge">
          <i className="fa-solid fa-user-shield"></i> Règlement Européen
        </span>
        <h1 className="legal-main-heading">Conformité RGPD & Vos Droits</h1>
        <p className="legal-lead-text">
          CBG Banque applique les standards les plus exigeants de l&apos;Union Européenne en matière de respect de la vie privée et de protection des données financières (Règlement UE 2016/679).
        </p>
      </div>

      <div className="legal-page-container">
        <div className="legal-content-card">
          
          <section className="legal-block">
            <h3>Nos Engagements Fondamentaux RGPD</h3>
            <div className="rgpd-grid-highlights">
              <div className="rgpd-card-item">
                <div className="rgpd-item-icon blue">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <h4>Minimisation des données</h4>
                <p>Nous ne collectons que les informations strictement nécessaires à la prestation de nos services bancaires et à nos obligations légales.</p>
              </div>

              <div className="rgpd-card-item">
                <div className="rgpd-item-icon green">
                  <i className="fa-solid fa-key"></i>
                </div>
                <h4>Chiffrement de bout en bout</h4>
                <p>Vos documents d&apos;identité et coordonnées bancaires sont chiffrés au repos et en transit selon les protocoles de pointe AES-256 / TLS 1.3.</p>
              </div>

              <div className="rgpd-card-item">
                <div className="rgpd-item-icon purple">
                  <i className="fa-solid fa-ban"></i>
                </div>
                <h4>Zéro revente de données</h4>
                <p>Vos données personnelles ou financières ne sont jamais vendues, louées ou commercialisées à des régies publicitaires tierces.</p>
              </div>

              <div className="rgpd-card-item">
                <div className="rgpd-item-icon amber">
                  <i className="fa-solid fa-server"></i>
                </div>
                <h4>Hébergement 100% Européen</h4>
                <p>Vos informations sont hébergées au sein de l&apos;Espace Économique Européen, sous le contrôle exclusif des lois européennes.</p>
              </div>
            </div>
          </section>

          <section className="legal-block">
            <h3>Vos Droits Individuels et Comment les Exercer</h3>
            <p>Le Règlement Général sur la Protection des Données vous confère un ensemble de prérogatives :</p>
            <ul>
              <li><strong>Droit d&apos;accès (Article 15 RGPD) :</strong> Vous pouvez obtenir la confirmation que des données vous concernant sont traitées et en recevoir une copie complète.</li>
              <li><strong>Droit de rectification (Article 16 RGPD) :</strong> Vous pouvez corriger ou actualiser vos données inexactes ou incomplètes depuis votre profil ou par demande écrite.</li>
              <li><strong>Droit à l&apos;effacement (Article 17 RGPD) :</strong> Vous pouvez demander la suppression de vos données, dans les limites des obligations légales bancaires de conservation des archives monétaires (durée légale de 5 ans).</li>
              <li><strong>Droit à la limitation du traitement (Article 18 RGPD) :</strong> Vous pouvez demander le gel temporaire du traitement de vos données dans certaines circonstances.</li>
              <li><strong>Droit à la portabilité (Article 20 RGPD) :</strong> Vous avez le droit de récupérer vos données financières dans un format structuré, couramment utilisé et lisible par machine.</li>
              <li><strong>Droit d&apos;opposition (Article 21 RGPD) :</strong> Vous pouvez vous opposer à tout moment à l&apos;utilisation de vos données à des fins de prospection commerciale.</li>
            </ul>
          </section>

          <section className="legal-block">
            <h3>Formulaire d&apos;exercice des droits RGPD</h3>
            <p>
              Pour toute demande relative à vos données personnelles, vous pouvez adresser votre requête accompagnée d&apos;une référence de votre compte à notre Délégué à la Protection des Données :
            </p>
            <div className="legal-contact-highlight">
              <i className="fa-solid fa-envelope-circle-check"></i>
              <div>
                <strong>Bureau du Délégué à la Protection des Données (DPO)</strong>
                <p>Courriel dédié : <a href="mailto:rgpd@cbgbanque.com">rgpd@cbgbanque.com</a></p>
                <p>Adresse postale : CBG Banque Finance SA, DPO Service, Avenue Louise 542, 1050 Bruxelles</p>
                <p style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#94a3b8" }}>
                  Délai de réponse : sous un mois maximum conformément à l&apos;article 12.3 du RGPD.
                </p>
              </div>
            </div>
          </section>

          <section className="legal-block">
            <h3>Autorité de Contrôle compétente</h3>
            <p>
              Si vous estimez après nous avoir contactés que vos droits ne sont pas respectés, vous avez le droit d&apos;introduire une réclamation auprès de l&apos;Autorité de Protection des Données (APD en Belgique : <a href="https://www.autoriteprotectiondonnees.be" target="_blank" rel="noopener noreferrer">www.autoriteprotectiondonnees.be</a>) ou de la CNIL en France (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>).
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
