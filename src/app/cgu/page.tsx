import Link from "next/link";

export default function CguPage() {
  return (
    <div className="legal-page-wrapper">
      <div className="legal-hero-banner">
        <div className="legal-hero-glow" />
        <span className="legal-pill-badge">
          <i className="fa-solid fa-file-contract"></i> Cadre Contractuel
        </span>
        <h1 className="legal-main-heading">Conditions Générales d&apos;Utilisation (CGU)</h1>
        <p className="legal-lead-text">
          Modalités applicables à l&apos;ouverture, l&apos;utilisation du compte en ligne, l&apos;émission de cartes bancaires et les services de crédit CBG Banque.
        </p>
      </div>

      <div className="legal-page-container">
        <div className="legal-content-card">
          
          <section className="legal-block">
            <h3>Article 1 : Objet et Champ d&apos;application</h3>
            <p>
              Les présentes Conditions Générales d&apos;Utilisation (les « CGU ») définissent les règles et obligations contractuelles liant toute personne physique majeure (le « Client » ou « Utilisateur ») et la société <strong>CBG Banque Finance SA</strong> dans le cadre de l&apos;ouverture et de la gestion de ses comptes, instruments de paiement et produits financiers.
            </p>
          </section>

          <section className="legal-block">
            <h3>Article 2 : Conditions d&apos;éligibilité et Ouverture de compte</h3>
            <p>
              Pour devenir client chez CBG Banque, le demandeur doit remplir cumulativement les conditions suivantes :
            </p>
            <ul>
              <li>Être une personne physique âgée d&apos;au moins 18 ans et jouir de sa pleine capacité juridique.</li>
              <li>Résider légalement dans un État membre de l&apos;Union Européenne, en Suisse, au Royaume-Uni ou au Canada.</li>
              <li>Fournir une adresse e-mail valide, un numéro de téléphone mobile opérationnel et compléter le protocole de vérification d&apos;identité KYC en téléversant le recto et le verso d&apos;une pièce d&apos;identité officielle en cours de validité.</li>
              <li>Mentionner sa situation professionnelle et ses revenus mensuels avec exactitude.</li>
            </ul>
            <p>
              L&apos;ouverture définitive du compte est soumise à la validation expresse par l&apos;administrateur et les équipes de conformité CBG Banque. Un e-mail d&apos;approbation confirme la validation du compte.
            </p>
          </section>

          <section className="legal-block">
            <h3>Article 3 : Fonctionnement du compte et des Cartes</h3>
            <p>
              Le compte en ligne permet d&apos;effectuer des opérations de dépôt, de virement SEPA, de consultation du solde en temps réel et de gestion de coffres d&apos;épargne.
            </p>
            <p>
              <strong>Cartes virtuelles et physiques :</strong> Le Client a la faculté d&apos;activer une ou plusieurs cartes virtuelles pour sécuriser ses règlements sur internet, ou de commander une carte physique Visa. Le Client peut à tout moment modifier le statut de sa carte (verrouillage / déverrouillage temporaire), masquer ou afficher ses numéros, ou résilier sa carte virtuelle directement depuis son espace client sécurisé.
            </p>
          </section>

          <section className="legal-block">
            <h3>Article 4 : Souscription et Octroi de Prêts</h3>
            <p>
              Le Client éligible peut déposer une demande de prêt personnel ou de financement depuis son Dashboard. Un simulateur dynamique affiche le montant emprunté, la durée en mois, le Taux Annuel Effectif Global (TAEG), le montant des mensualités et les frais de dossier afférents.
            </p>
            <p>
              La soumission d&apos;une demande de prêt ne vaut pas acceptation automatique : le dossier est examiné par notre comité de crédit. L&apos;approbation ou le rejet de la demande est notifié sur le Dashboard du client et par notification e-mail. Un crédit vous engage et doit être remboursé : vérifiez vos capacités de remboursement avant de vous engager.
            </p>
          </section>

          <section className="legal-block">
            <h3>Article 5 : Sécurité et Obligations du Client</h3>
            <p>
              Le Client est strictement responsable de la confidentialité de ses identifiants personnels, de son mot de passe et de ses codes de validation temporaires (OTP). Tout partage de codes confidentiels est formellement prohibé. En cas de suspicion de fraude ou d&apos;accès frauduleux, le Client doit immédiatement verrouiller ses cartes et contacter le support d&apos;urgence.
            </p>
          </section>

          <section className="legal-block">
            <h3>Article 6 : Clôture de compte et Résiliation</h3>
            <p>
              Le Client peut demander la clôture de son compte à tout moment sans préavis ni pénalité, sous réserve du règlement préalable de tout solde débiteur ou échéance de prêt en cours. CBG Banque se réserve le droit de suspendre ou clôturer un compte en cas de fausse déclaration, d&apos;inactivité prolongée ou de manquement aux obligations légales.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
