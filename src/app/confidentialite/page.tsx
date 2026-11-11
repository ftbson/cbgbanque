import Link from "next/link";

export default function ConfidentialitePage() {
  return (
    <div className="legal-page-wrapper">
      <div className="legal-hero-banner">
        <div className="legal-hero-glow" />
        <span className="legal-pill-badge">
          <i className="fa-solid fa-lock"></i> Confidentialité & Protection des données
        </span>
        <h1 className="legal-main-heading">Politique de Confidentialité</h1>
        <p className="legal-lead-text">
          Dernière mise à jour : Février 2026. Découvrez les engagements stricts de CBG Banque Finance SA quant à la collecte, le traitement et la sécurité de vos données financières et personnelles.
        </p>
      </div>

      <div className="legal-page-container">
        <div className="legal-content-card">
          
          <section className="legal-block">
            <h3>1. Introduction et Responsable de Traitement</h3>
            <p>
              La présente Politique de Confidentialité s&apos;applique à l&apos;ensemble des services fournis par <strong>CBG Banque Finance SA</strong> (société anonyme de droit européen, sise Avenue Louise 542, 1050 Bruxelles, Belgique). En qualité d&apos;établissement financier et responsable de traitement au sens du Règlement Général sur la Protection des Données (RGPD 2016/679), nous accordons une importance primordiale à la confidentialité de vos informations privées.
            </p>
          </section>

          <section className="legal-block">
            <h3>2. Quelles données personnelles collectons-nous ?</h3>
            <p>Dans le cadre de l&apos;ouverture et de la tenue de compte bancaire, nous collectons les informations suivantes :</p>
            <ul>
              <li><strong>Données d&apos;identification (KYC) :</strong> Civilité, nom, prénom, date et lieu de naissance, nationalité, adresse postale, numéro de téléphone et adresse e-mail.</li>
              <li><strong>Pièces justificatives d&apos;identité :</strong> Copie recto et verso de votre carte nationale d&apos;identité, passeport ou titre de séjour, conservées dans un espace de stockage chiffré haute sécurité.</li>
              <li><strong>Situation professionnelle et financière :</strong> Profession déclarée, tranche de salaire / revenus nets mensuels, informations nécessaires à l&apos;instruction des demandes de prêt.</li>
              <li><strong>Données de transactions & cartes :</strong> Numéro de compte IBAN, virements, création et utilisation de cartes virtuelles ou physiques, historique des mouvements.</li>
              <li><strong>Données techniques de connexion :</strong> Horodatage de connexion sécurisée, adresse IP masquée, logs d&apos;audit pour la prévention contre la fraude bancaire.</li>
            </ul>
          </section>

          <section className="legal-block">
            <h3>3. Finalités et bases légales du traitement</h3>
            <p>Vos données sont traitées pour des objectifs précis et licites :</p>
            <ul>
              <li><strong>Exécution contractuelle :</strong> Création de votre compte, délivrance de cartes de paiement, traitement des virements, simulation et octroi de crédits.</li>
              <li><strong>Obligations légales et réglementaires bancaires :</strong> Lutte contre le blanchiment d&apos;argent et le financement du terrorisme (LCB-FT), vérification d&apos;identité KYC (Know Your Customer) obligatoire avant toute activation de compte par nos administrateurs.</li>
              <li><strong>Sécurité et prévention de la fraude :</strong> Protection de votre espace client contre les accès non autorisés et alertes de sécurité en temps réel.</li>
              <li><strong>Consentement :</strong> Pour l&apos;envoi d&apos;e-mails d&apos;information ou l&apos;activation des cookies analytiques optionnels.</li>
            </ul>
          </section>

          <section className="legal-block">
            <h3>4. Durée de conservation des données</h3>
            <p>
              Conformément à la réglementation monétaire et financière européenne, les documents relatifs à votre identité et l&apos;historique de vos opérations sont archivés pendant une durée de 5 ans après la clôture de la relation bancaire, après quoi ils font l&apos;objet d&apos;une purge sécurisée irréversible.
            </p>
          </section>

          <section className="legal-block">
            <h3>5. Sécurité et Chiffrement des informations</h3>
            <p>
              Toutes les données en transit sont protégées par le protocole TLS 1.3 avec chiffrement 256 bits. Vos mots de passe sont hachés cryptographiquement via des algorithmes à clé forte (Argon2 / Scrypt) et ne sont jamais stockés en clair. Les copies de pièces d&apos;identité sont uniquement accessibles par le personnel habilité du service Conformité pour vérification réglementaire.
            </p>
          </section>

          <section className="legal-block">
            <h3>6. Vos droits selon le RGPD</h3>
            <p>
              Vous disposez à tout moment du droit d&apos;accès, de rectification, de portabilité, de limitation et d&apos;effacement de vos données personnelles (sous réserve de nos obligations légales bancaires de conservation). Pour exercer vos droits, contactez notre Délégué à la Protection des Données (DPO) :
            </p>
            <div className="legal-contact-highlight">
              <i className="fa-solid fa-shield-halved"></i>
              <div>
                <strong>Délégué à la Protection des Données (DPO)</strong>
                <p>Email : <a href="mailto:dpo@cbgbanque.com">dpo@cbgbanque.com</a> · Adresse : CBG Banque Finance SA, DPO Office, Avenue Louise 542, 1050 Bruxelles</p>
              </div>
            </div>
            <p style={{ marginTop: "1rem" }}>
              Pour plus de détails, consultez également notre page dédiée au <Link href="/rgpd" className="text-link">Règlement Général sur la Protection des Données (RGPD)</Link>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
