"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookiesPage() {
  const [consentStatus, setConsentStatus] = useState<string>("Non dÃ©fini");

  useEffect(() => {
    const consent = localStorage.getItem("cbg_cookie_consent");
    if (consent) {
      try {
        const parsed = JSON.parse(consent);
        setConsentStatus(
          parsed.marketing
            ? "Tous les cookies acceptÃ©s"
            : parsed.analytics
            ? "Essentiels et Analytiques acceptÃ©s"
            : "Uniquement les cookies essentiels"
        );
      } catch {
        setConsentStatus("EnregistrÃ©");
      }
    }
  }, []);

  const resetCookies = () => {
    localStorage.removeItem("cbg_cookie_consent");
    window.location.reload();
  };

  return (
    <div className="legal-page-wrapper">
      <div className="legal-hero-banner">
        <div className="legal-hero-glow" />
        <span className="legal-pill-badge">
          <i className="fa-solid fa-cookie-bite"></i> Transparence & Traceurs
        </span>
        <h1 className="legal-main-heading">Politique relative aux Cookies</h1>
        <p className="legal-lead-text">
          Comprenez comment CBG Banque utilise les tÃ©moins de connexion (cookies) et traceurs pour garantir la sÃ©curitÃ© et la qualitÃ© de vos services bancaires.
        </p>
      </div>

      <div className="legal-page-container">
        <div className="legal-content-card">
          
          <div className="cookie-status-box">
            <div className="status-info">
              <span className="status-tag">VOTRE STATUT DE CONSENTEMENT ACTUEL</span>
              <strong className="status-current">{consentStatus}</strong>
            </div>
            <button onClick={resetCookies} className="btn-table-details">
              <i className="fa-solid fa-rotate-right"></i> Modifier mes prÃ©fÃ©rences
            </button>
          </div>

          <section className="legal-block">
            <h3>1. Qu&apos;est-ce qu&apos;un cookie ?</h3>
            <p>
              Un cookie est un petit fichier texte dÃ©posÃ© sur votre terminal (ordinateur, tablette ou smartphone) lors de la consultation d&apos;un site internet ou de l&apos;utilisation d&apos;une application web. Il permet au site de mÃ©moriser vos actions, vos prÃ©fÃ©rences de connexion et d&apos;assurer la sÃ©curitÃ© de votre session bancaire pendant une pÃ©riode donnÃ©e.
            </p>
          </section>

          <section className="legal-block">
            <h3>2. Les catÃ©gories de cookies utilisÃ©es sur CBG Banque</h3>
            
            <div className="cookie-category-block">
              <div className="cat-badge-title">
                <span className="cat-badge required">Indispensables</span>
                <h4>Cookies strictement nÃ©cessaires au fonctionnement et Ã  la sÃ©curitÃ©</h4>
              </div>
              <p>
                Ces cookies sont indispensables au fonctionnement de la plateforme en ligne. Ils vous permettent de naviguer de maniÃ¨re sÃ©curisÃ©e, de vous authentifier Ã  votre Dashboard, de valider des opÃ©rations financiÃ¨res (KYC, virements, demandes de prÃªt) et de prÃ©venir les attaques par falsification de requÃªtes (CSRF). ConformÃ©ment aux directives de la CNIL et du RGPD, ces traceurs ne requiÃ¨rent pas de consentement prÃ©alable.
              </p>
            </div>

            <div className="cookie-category-block">
              <div className="cat-badge-title">
                <span className="cat-badge optional">Optionnels</span>
                <h4>Cookies de mesure d&apos;audience et d&apos;analyse de performance</h4>
              </div>
              <p>
                Ces traceurs nous permettent de mesurer le volume de visites, les pages les plus consultÃ©es et d&apos;identifier d&apos;Ã©ventuels dysfonctionnements techniques afin d&apos;amÃ©liorer continuellement l&apos;ergonomie de votre espace bancaire. Toutes les adresses IP sont anonymisÃ©es avant tout traitement statistique.
              </p>
            </div>

            <div className="cookie-category-block">
              <div className="cat-badge-title">
                <span className="cat-badge optional">Optionnels</span>
                <h4>Cookies de prÃ©fÃ©rences et personnalisation</h4>
              </div>
              <p>
                Ces tÃ©moins permettent de mÃ©moriser votre langue prÃ©fÃ©rÃ©e, votre devise de rÃ©fÃ©rence (EUR, CHF, USD) ainsi que vos choix d&apos;affichage de solde dans le Dashboard.
              </p>
            </div>
          </section>

          <section className="legal-block">
            <h3>3. Tableau dÃ©taillÃ© des principaux cookies</h3>
            <div className="legal-info-table">
              <div className="info-row">
                <span className="info-key">cbg_session</span>
                <span className="info-val">Gestion de la session bancaire chiffrÃ©e (DurÃ©e : Session)</span>
              </div>
              <div className="info-row">
                <span className="info-key">cbg_cookie_consent</span>
                <span className="info-val">MÃ©morisation de vos choix de cookies (DurÃ©e : 12 mois)</span>
              </div>
              <div className="info-row">
                <span className="info-key">cbg_csrf_token</span>
                <span className="info-val">SÃ©curitÃ© anti-falsification de formulaires (DurÃ©e : Session)</span>
              </div>
            </div>
          </section>

          <section className="legal-block">
            <h3>4. Comment gÃ©rer ou dÃ©sactiver les cookies dans votre navigateur ?</h3>
            <p>
              Vous pouvez Ã  tout moment configurer votre logiciel de navigation pour autoriser ou refuser l&apos;enregistrement de cookies sur votre terminal :
            </p>
            <ul>
              <li><strong>Google Chrome :</strong> ParamÃ¨tres &gt; ConfidentialitÃ© et sÃ©curitÃ© &gt; Cookies et autres donnÃ©es des sites.</li>
              <li><strong>Mozilla Firefox :</strong> ParamÃ¨tres &gt; Vie privÃ©e et sÃ©curitÃ© &gt; Cookies et donnÃ©es de sites.</li>
              <li><strong>Apple Safari :</strong> PrÃ©fÃ©rences &gt; ConfidentialitÃ© &gt; Bloquer tous les cookies.</li>
              <li><strong>Microsoft Edge :</strong> ParamÃ¨tres &gt; ConfidentialitÃ©, recherche et services &gt; Cookies.</li>
            </ul>
            <p>
              <em>Attention : Le blocage intÃ©gral des cookies essentiels peut rendre impossible l&apos;accÃ¨s Ã  votre espace client sÃ©curisÃ©.</em>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

