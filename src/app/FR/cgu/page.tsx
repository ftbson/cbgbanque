import Link from "next/link";

export default function CguPage() {
  return (
    <div className="legal-page-wrapper">
      <div className="legal-hero-banner">
        <div className="legal-hero-glow" />
        <span className="legal-pill-badge">
          <i className="fa-solid fa-file-contract"></i> Cadre Contractuel
        </span>
        <h1 className="legal-main-heading">Conditions GÃ©nÃ©rales d&apos;Utilisation (CGU)</h1>
        <p className="legal-lead-text">
          ModalitÃ©s applicables Ã  l&apos;ouverture, l&apos;utilisation du compte en ligne, l&apos;Ã©mission de cartes bancaires et les services de crÃ©dit CBG Banque.
        </p>
      </div>

      <div className="legal-page-container">
        <div className="legal-content-card">
          
          <section className="legal-block">
            <h3>Article 1 : Objet et Champ d&apos;application</h3>
            <p>
              Les prÃ©sentes Conditions GÃ©nÃ©rales d&apos;Utilisation (les Â« CGU Â») dÃ©finissent les rÃ¨gles et obligations contractuelles liant toute personne physique majeure (le Â« Client Â» ou Â« Utilisateur Â») et la sociÃ©tÃ© <strong>CBG Banque Finance SA</strong> dans le cadre de l&apos;ouverture et de la gestion de ses comptes, instruments de paiement et produits financiers.
            </p>
          </section>

          <section className="legal-block">
            <h3>Article 2 : Conditions d&apos;Ã©ligibilitÃ© et Ouverture de compte</h3>
            <p>
              Pour devenir client chez CBG Banque, le demandeur doit remplir cumulativement les conditions suivantes :
            </p>
            <ul>
              <li>ÃŠtre une personne physique Ã¢gÃ©e d&apos;au moins 18 ans et jouir de sa pleine capacitÃ© juridique.</li>
              <li>RÃ©sider lÃ©galement dans un Ã‰tat membre de l&apos;Union EuropÃ©enne, en Suisse, au Royaume-Uni ou au Canada.</li>
              <li>Fournir une adresse e-mail valide, un numÃ©ro de tÃ©lÃ©phone mobile opÃ©rationnel et complÃ©ter le protocole de vÃ©rification d&apos;identitÃ© KYC en tÃ©lÃ©versant le recto et le verso d&apos;une piÃ¨ce d&apos;identitÃ© officielle en cours de validitÃ©.</li>
              <li>Mentionner sa situation professionnelle et ses revenus mensuels avec exactitude.</li>
            </ul>
            <p>
              L&apos;ouverture dÃ©finitive du compte est soumise Ã  la validation expresse par l&apos;administrateur et les Ã©quipes de conformitÃ© CBG Banque. Un e-mail d&apos;approbation confirme la validation du compte.
            </p>
          </section>

          <section className="legal-block">
            <h3>Article 3 : Fonctionnement du compte et des Cartes</h3>
            <p>
              Le compte en ligne permet d&apos;effectuer des opÃ©rations de dÃ©pÃ´t, de virement SEPA, de consultation du solde en temps rÃ©el et de gestion de coffres d&apos;Ã©pargne.
            </p>
            <p>
              <strong>Cartes virtuelles et physiques :</strong> Le Client a la facultÃ© d&apos;activer une ou plusieurs cartes virtuelles pour sÃ©curiser ses rÃ¨glements sur internet, ou de commander une carte physique Visa. Le Client peut Ã  tout moment modifier le statut de sa carte (verrouillage / dÃ©verrouillage temporaire), masquer ou afficher ses numÃ©ros, ou rÃ©silier sa carte virtuelle directement depuis son espace client sÃ©curisÃ©.
            </p>
          </section>

          <section className="legal-block">
            <h3>Article 4 : Souscription et Octroi de PrÃªts</h3>
            <p>
              Le Client Ã©ligible peut dÃ©poser une demande de prÃªt personnel ou de financement depuis son Dashboard. Un simulateur dynamique affiche le montant empruntÃ©, la durÃ©e en mois, le Taux Annuel Effectif Global (TAEG), le montant des mensualitÃ©s et les frais de dossier affÃ©rents.
            </p>
            <p>
              La soumission d&apos;une demande de prÃªt ne vaut pas acceptation automatique : le dossier est examinÃ© par notre comitÃ© de crÃ©dit. L&apos;approbation ou le rejet de la demande est notifiÃ© sur le Dashboard du client et par notification e-mail. Un crÃ©dit vous engage et doit Ãªtre remboursÃ© : vÃ©rifiez vos capacitÃ©s de remboursement avant de vous engager.
            </p>
          </section>

          <section className="legal-block">
            <h3>Article 5 : SÃ©curitÃ© et Obligations du Client</h3>
            <p>
              Le Client est strictement responsable de la confidentialitÃ© de ses identifiants personnels, de son mot de passe et de ses codes de validation temporaires (OTP). Tout partage de codes confidentiels est formellement prohibÃ©. En cas de suspicion de fraude ou d&apos;accÃ¨s frauduleux, le Client doit immÃ©diatement verrouiller ses cartes et contacter le support d&apos;urgence.
            </p>
          </section>

          <section className="legal-block">
            <h3>Article 6 : ClÃ´ture de compte et RÃ©siliation</h3>
            <p>
              Le Client peut demander la clÃ´ture de son compte Ã  tout moment sans prÃ©avis ni pÃ©nalitÃ©, sous rÃ©serve du rÃ¨glement prÃ©alable de tout solde dÃ©biteur ou Ã©chÃ©ance de prÃªt en cours. CBG Banque se rÃ©serve le droit de suspendre ou clÃ´turer un compte en cas de fausse dÃ©claration, d&apos;inactivitÃ© prolongÃ©e ou de manquement aux obligations lÃ©gales.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

