import Link from "next/link";

export default function RgpdPage() {
  return (
    <div className="legal-page-wrapper">
      <div className="legal-hero-banner">
        <div className="legal-hero-glow" />
        <span className="legal-pill-badge">
          <i className="fa-solid fa-user-shield"></i> RÃ¨glement EuropÃ©en
        </span>
        <h1 className="legal-main-heading">ConformitÃ© RGPD & Vos Droits</h1>
        <p className="legal-lead-text">
          CBG Banque applique les standards les plus exigeants de l&apos;Union EuropÃ©enne en matiÃ¨re de respect de la vie privÃ©e et de protection des donnÃ©es financiÃ¨res (RÃ¨glement UE 2016/679).
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
                <h4>Minimisation des donnÃ©es</h4>
                <p>Nous ne collectons que les informations strictement nÃ©cessaires Ã  la prestation de nos services bancaires et Ã  nos obligations lÃ©gales.</p>
              </div>

              <div className="rgpd-card-item">
                <div className="rgpd-item-icon green">
                  <i className="fa-solid fa-key"></i>
                </div>
                <h4>Chiffrement de bout en bout</h4>
                <p>Vos documents d&apos;identitÃ© et coordonnÃ©es bancaires sont chiffrÃ©s au repos et en transit selon les protocoles de pointe AES-256 / TLS 1.3.</p>
              </div>

              <div className="rgpd-card-item">
                <div className="rgpd-item-icon purple">
                  <i className="fa-solid fa-ban"></i>
                </div>
                <h4>ZÃ©ro revente de donnÃ©es</h4>
                <p>Vos donnÃ©es personnelles ou financiÃ¨res ne sont jamais vendues, louÃ©es ou commercialisÃ©es Ã  des rÃ©gies publicitaires tierces.</p>
              </div>

              <div className="rgpd-card-item">
                <div className="rgpd-item-icon amber">
                  <i className="fa-solid fa-server"></i>
                </div>
                <h4>HÃ©bergement 100% EuropÃ©en</h4>
                <p>Vos informations sont hÃ©bergÃ©es au sein de l&apos;Espace Ã‰conomique EuropÃ©en, sous le contrÃ´le exclusif des lois europÃ©ennes.</p>
              </div>
            </div>
          </section>

          <section className="legal-block">
            <h3>Vos Droits Individuels et Comment les Exercer</h3>
            <p>Le RÃ¨glement GÃ©nÃ©ral sur la Protection des DonnÃ©es vous confÃ¨re un ensemble de prÃ©rogatives :</p>
            <ul>
              <li><strong>Droit d&apos;accÃ¨s (Article 15 RGPD) :</strong> Vous pouvez obtenir la confirmation que des donnÃ©es vous concernant sont traitÃ©es et en recevoir une copie complÃ¨te.</li>
              <li><strong>Droit de rectification (Article 16 RGPD) :</strong> Vous pouvez corriger ou actualiser vos donnÃ©es inexactes ou incomplÃ¨tes depuis votre profil ou par demande Ã©crite.</li>
              <li><strong>Droit Ã  l&apos;effacement (Article 17 RGPD) :</strong> Vous pouvez demander la suppression de vos donnÃ©es, dans les limites des obligations lÃ©gales bancaires de conservation des archives monÃ©taires (durÃ©e lÃ©gale de 5 ans).</li>
              <li><strong>Droit Ã  la limitation du traitement (Article 18 RGPD) :</strong> Vous pouvez demander le gel temporaire du traitement de vos donnÃ©es dans certaines circonstances.</li>
              <li><strong>Droit Ã  la portabilitÃ© (Article 20 RGPD) :</strong> Vous avez le droit de rÃ©cupÃ©rer vos donnÃ©es financiÃ¨res dans un format structurÃ©, couramment utilisÃ© et lisible par machine.</li>
              <li><strong>Droit d&apos;opposition (Article 21 RGPD) :</strong> Vous pouvez vous opposer Ã  tout moment Ã  l&apos;utilisation de vos donnÃ©es Ã  des fins de prospection commerciale.</li>
            </ul>
          </section>

          <section className="legal-block">
            <h3>Formulaire d&apos;exercice des droits RGPD</h3>
            <p>
              Pour toute demande relative Ã  vos donnÃ©es personnelles, vous pouvez adresser votre requÃªte accompagnÃ©e d&apos;une rÃ©fÃ©rence de votre compte Ã  notre DÃ©lÃ©guÃ© Ã  la Protection des DonnÃ©es :
            </p>
            <div className="legal-contact-highlight">
              <i className="fa-solid fa-envelope-circle-check"></i>
              <div>
                <strong>Bureau du DÃ©lÃ©guÃ© Ã  la Protection des DonnÃ©es (DPO)</strong>
                <p>Courriel dÃ©diÃ© : <a href="mailto:rgpd@cbgbanque.com">rgpd@cbgbanque.com</a></p>
                <p>Adresse postale : CBG Banque Finance SA, DPO Service, Avenue Louise 542, 1050 Bruxelles</p>
                <p style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#94a3b8" }}>
                  DÃ©lai de rÃ©ponse : sous un mois maximum conformÃ©ment Ã  l&apos;article 12.3 du RGPD.
                </p>
              </div>
            </div>
          </section>

          <section className="legal-block">
            <h3>AutoritÃ© de ContrÃ´le compÃ©tente</h3>
            <p>
              Si vous estimez aprÃ¨s nous avoir contactÃ©s que vos droits ne sont pas respectÃ©s, vous avez le droit d&apos;introduire une rÃ©clamation auprÃ¨s de l&apos;AutoritÃ© de Protection des DonnÃ©es (APD en Belgique : <a href="https://www.autoriteprotectiondonnees.be" target="_blank" rel="noopener noreferrer">www.autoriteprotectiondonnees.be</a>) ou de la CNIL en France (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>).
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

