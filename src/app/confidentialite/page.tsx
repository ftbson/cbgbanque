import Link from "next/link";

export default function ConfidentialitePage() {
  return (
    <div className="legal-page-wrapper">
      <div className="legal-hero-banner">
        <div className="legal-hero-glow" />
        <span className="legal-pill-badge">
          <i className="fa-solid fa-lock"></i> ConfidentialitÃ© & Protection des donnÃ©es
        </span>
        <h1 className="legal-main-heading">Politique de ConfidentialitÃ©</h1>
        <p className="legal-lead-text">
          DerniÃ¨re mise Ã  jour : FÃ©vrier 2026. DÃ©couvrez les engagements stricts de CBG Banque Finance SA quant Ã  la collecte, le traitement et la sÃ©curitÃ© de vos donnÃ©es financiÃ¨res et personnelles.
        </p>
      </div>

      <div className="legal-page-container">
        <div className="legal-content-card">
          
          <section className="legal-block">
            <h3>1. Introduction et Responsable de Traitement</h3>
            <p>
              La prÃ©sente Politique de ConfidentialitÃ© s&apos;applique Ã  l&apos;ensemble des services fournis par <strong>CBG Banque Finance SA</strong> (sociÃ©tÃ© anonyme de droit europÃ©en, sise Avenue Louise 542, 1050 Bruxelles, Belgique). En qualitÃ© d&apos;Ã©tablissement financier et responsable de traitement au sens du RÃ¨glement GÃ©nÃ©ral sur la Protection des DonnÃ©es (RGPD 2016/679), nous accordons une importance primordiale Ã  la confidentialitÃ© de vos informations privÃ©es.
            </p>
          </section>

          <section className="legal-block">
            <h3>2. Quelles donnÃ©es personnelles collectons-nous ?</h3>
            <p>Dans le cadre de l&apos;ouverture et de la tenue de compte bancaire, nous collectons les informations suivantes :</p>
            <ul>
              <li><strong>DonnÃ©es d&apos;identification (KYC) :</strong> CivilitÃ©, nom, prÃ©nom, date et lieu de naissance, nationalitÃ©, adresse postale, numÃ©ro de tÃ©lÃ©phone et adresse e-mail.</li>
              <li><strong>PiÃ¨ces justificatives d&apos;identitÃ© :</strong> Copie recto et verso de votre carte nationale d&apos;identitÃ©, passeport ou titre de sÃ©jour, conservÃ©es dans un espace de stockage chiffrÃ© haute sÃ©curitÃ©.</li>
              <li><strong>Situation professionnelle et financiÃ¨re :</strong> Profession dÃ©clarÃ©e, tranche de salaire / revenus nets mensuels, informations nÃ©cessaires Ã  l&apos;instruction des demandes de prÃªt.</li>
              <li><strong>DonnÃ©es de transactions & cartes :</strong> NumÃ©ro de compte IBAN, virements, crÃ©ation et utilisation de cartes virtuelles ou physiques, historique des mouvements.</li>
              <li><strong>DonnÃ©es techniques de connexion :</strong> Horodatage de connexion sÃ©curisÃ©e, adresse IP masquÃ©e, logs d&apos;audit pour la prÃ©vention contre la fraude bancaire.</li>
            </ul>
          </section>

          <section className="legal-block">
            <h3>3. FinalitÃ©s et bases lÃ©gales du traitement</h3>
            <p>Vos donnÃ©es sont traitÃ©es pour des objectifs prÃ©cis et licites :</p>
            <ul>
              <li><strong>ExÃ©cution contractuelle :</strong> CrÃ©ation de votre compte, dÃ©livrance de cartes de paiement, traitement des virements, simulation et octroi de crÃ©dits.</li>
              <li><strong>Obligations lÃ©gales et rÃ©glementaires bancaires :</strong> Lutte contre le blanchiment d&apos;argent et le financement du terrorisme (LCB-FT), vÃ©rification d&apos;identitÃ© KYC (Know Your Customer) obligatoire avant toute activation de compte par nos administrateurs.</li>
              <li><strong>SÃ©curitÃ© et prÃ©vention de la fraude :</strong> Protection de votre espace client contre les accÃ¨s non autorisÃ©s et alertes de sÃ©curitÃ© en temps rÃ©el.</li>
              <li><strong>Consentement :</strong> Pour l&apos;envoi d&apos;e-mails d&apos;information ou l&apos;activation des cookies analytiques optionnels.</li>
            </ul>
          </section>

          <section className="legal-block">
            <h3>4. DurÃ©e de conservation des donnÃ©es</h3>
            <p>
              ConformÃ©ment Ã  la rÃ©glementation monÃ©taire et financiÃ¨re europÃ©enne, les documents relatifs Ã  votre identitÃ© et l&apos;historique de vos opÃ©rations sont archivÃ©s pendant une durÃ©e de 5 ans aprÃ¨s la clÃ´ture de la relation bancaire, aprÃ¨s quoi ils font l&apos;objet d&apos;une purge sÃ©curisÃ©e irrÃ©versible.
            </p>
          </section>

          <section className="legal-block">
            <h3>5. SÃ©curitÃ© et Chiffrement des informations</h3>
            <p>
              Toutes les donnÃ©es en transit sont protÃ©gÃ©es par le protocole TLS 1.3 avec chiffrement 256 bits. Vos mots de passe sont hachÃ©s cryptographiquement via des algorithmes Ã  clÃ© forte (Argon2 / Scrypt) et ne sont jamais stockÃ©s en clair. Les copies de piÃ¨ces d&apos;identitÃ© sont uniquement accessibles par le personnel habilitÃ© du service ConformitÃ© pour vÃ©rification rÃ©glementaire.
            </p>
          </section>

          <section className="legal-block">
            <h3>6. Vos droits selon le RGPD</h3>
            <p>
              Vous disposez Ã  tout moment du droit d&apos;accÃ¨s, de rectification, de portabilitÃ©, de limitation et d&apos;effacement de vos donnÃ©es personnelles (sous rÃ©serve de nos obligations lÃ©gales bancaires de conservation). Pour exercer vos droits, contactez notre DÃ©lÃ©guÃ© Ã  la Protection des DonnÃ©es (DPO) :
            </p>
            <div className="legal-contact-highlight">
              <i className="fa-solid fa-shield-halved"></i>
              <div>
                <strong>DÃ©lÃ©guÃ© Ã  la Protection des DonnÃ©es (DPO)</strong>
                <p>Email : <a href="mailto:dpo@cbgbanque.com">dpo@cbgbanque.com</a> Â· Adresse : CBG Banque Finance SA, DPO Office, Avenue Louise 542, 1050 Bruxelles</p>
              </div>
            </div>
            <p style={{ marginTop: "1rem" }}>
              Pour plus de dÃ©tails, consultez Ã©galement notre page dÃ©diÃ©e au <Link href="/rgpd" className="text-link">RÃ¨glement GÃ©nÃ©ral sur la Protection des DonnÃ©es (RGPD)</Link>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

