"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookiesPage() {
  const [consentStatus, setConsentStatus] = useState<string>("Non défini");

  useEffect(() => {
    const consent = localStorage.getItem("cbg_cookie_consent");
    if (consent) {
      try {
        const parsed = JSON.parse(consent);
        setConsentStatus(
          parsed.marketing
            ? "Tous les cookies acceptés"
            : parsed.analytics
            ? "Essentiels et Analytiques acceptés"
            : "Uniquement les cookies essentiels"
        );
      } catch {
        setConsentStatus("Enregistré");
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
          Comprenez comment CBG Banque utilise les témoins de connexion (cookies) et traceurs pour garantir la sécurité et la qualité de vos services bancaires.
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
              <i className="fa-solid fa-rotate-right"></i> Modifier mes préférences
            </button>
          </div>

          <section className="legal-block">
            <h3>1. Qu&apos;est-ce qu&apos;un cookie ?</h3>
            <p>
              Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette ou smartphone) lors de la consultation d&apos;un site internet ou de l&apos;utilisation d&apos;une application web. Il permet au site de mémoriser vos actions, vos préférences de connexion et d&apos;assurer la sécurité de votre session bancaire pendant une période donnée.
            </p>
          </section>

          <section className="legal-block">
            <h3>2. Les catégories de cookies utilisées sur CBG Banque</h3>
            
            <div className="cookie-category-block">
              <div className="cat-badge-title">
                <span className="cat-badge required">Indispensables</span>
                <h4>Cookies strictement nécessaires au fonctionnement et à la sécurité</h4>
              </div>
              <p>
                Ces cookies sont indispensables au fonctionnement de la plateforme en ligne. Ils vous permettent de naviguer de manière sécurisée, de vous authentifier à votre Dashboard, de valider des opérations financières (KYC, virements, demandes de prêt) et de prévenir les attaques par falsification de requêtes (CSRF). Conformément aux directives de la CNIL et du RGPD, ces traceurs ne requièrent pas de consentement préalable.
              </p>
            </div>

            <div className="cookie-category-block">
              <div className="cat-badge-title">
                <span className="cat-badge optional">Optionnels</span>
                <h4>Cookies de mesure d&apos;audience et d&apos;analyse de performance</h4>
              </div>
              <p>
                Ces traceurs nous permettent de mesurer le volume de visites, les pages les plus consultées et d&apos;identifier d&apos;éventuels dysfonctionnements techniques afin d&apos;améliorer continuellement l&apos;ergonomie de votre espace bancaire. Toutes les adresses IP sont anonymisées avant tout traitement statistique.
              </p>
            </div>

            <div className="cookie-category-block">
              <div className="cat-badge-title">
                <span className="cat-badge optional">Optionnels</span>
                <h4>Cookies de préférences et personnalisation</h4>
              </div>
              <p>
                Ces témoins permettent de mémoriser votre langue préférée, votre devise de référence (EUR, CHF, USD) ainsi que vos choix d&apos;affichage de solde dans le Dashboard.
              </p>
            </div>
          </section>

          <section className="legal-block">
            <h3>3. Tableau détaillé des principaux cookies</h3>
            <div className="legal-info-table">
              <div className="info-row">
                <span className="info-key">cbg_session</span>
                <span className="info-val">Gestion de la session bancaire chiffrée (Durée : Session)</span>
              </div>
              <div className="info-row">
                <span className="info-key">cbg_cookie_consent</span>
                <span className="info-val">Mémorisation de vos choix de cookies (Durée : 12 mois)</span>
              </div>
              <div className="info-row">
                <span className="info-key">cbg_csrf_token</span>
                <span className="info-val">Sécurité anti-falsification de formulaires (Durée : Session)</span>
              </div>
            </div>
          </section>

          <section className="legal-block">
            <h3>4. Comment gérer ou désactiver les cookies dans votre navigateur ?</h3>
            <p>
              Vous pouvez à tout moment configurer votre logiciel de navigation pour autoriser ou refuser l&apos;enregistrement de cookies sur votre terminal :
            </p>
            <ul>
              <li><strong>Google Chrome :</strong> Paramètres &gt; Confidentialité et sécurité &gt; Cookies et autres données des sites.</li>
              <li><strong>Mozilla Firefox :</strong> Paramètres &gt; Vie privée et sécurité &gt; Cookies et données de sites.</li>
              <li><strong>Apple Safari :</strong> Préférences &gt; Confidentialité &gt; Bloquer tous les cookies.</li>
              <li><strong>Microsoft Edge :</strong> Paramètres &gt; Confidentialité, recherche et services &gt; Cookies.</li>
            </ul>
            <p>
              <em>Attention : Le blocage intégral des cookies essentiels peut rendre impossible l&apos;accès à votre espace client sécurisé.</em>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
