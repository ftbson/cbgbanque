"use client";

import { useState } from "react";
import Link from "next/link";

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

const faqs: FaqItem[] = [
  {
    category: "compte",
    q: "Comment ouvrir un compte chez CBG Banque ?",
    a: "L'ouverture se fait entiÃ¨rement en ligne en moins de 5 minutes. Remplissez le formulaire, tÃ©lÃ©versez le recto et le verso de votre piÃ¨ce d'identitÃ© en cours de validitÃ©, puis notre Ã©quipe de conformitÃ© valide votre dossier dans un dÃ©lai de 24h ouvrÃ©es. Vous recevez un e-mail de confirmation dÃ¨s que votre compte est actif.",
  },
  {
    category: "compte",
    q: "Quels sont les documents acceptÃ©s pour l'inscription ?",
    a: "Nous acceptons la Carte Nationale d'IdentitÃ© europÃ©enne (recto et verso), le Passeport international en cours de validitÃ©, le Permis de conduire au format carte bancaire ou le Titre de sÃ©jour europÃ©en.",
  },
  {
    category: "cartes",
    q: "Comment commander ou crÃ©er une carte bancaire ?",
    a: "Depuis votre Dashboard, accÃ©dez Ã  la section Â« Mes cartes Â». Vous pouvez instantanÃ©ment gÃ©nÃ©rer une carte virtuelle sÃ©curisÃ©e pour vos achats en ligne ou commander une carte physique Visa Classic livrÃ©e sous 5 Ã  7 jours ouvrÃ©s chez vous.",
  },
  {
    category: "cartes",
    q: "Puis-je geler temporairement ma carte ou masquer mes numÃ©ros ?",
    a: "Oui ! En un clic depuis votre espace Cartes, vous pouvez masquer/afficher le numÃ©ro Ã  16 chiffres et le cryptogramme CVV, ou verrouiller/dÃ©verrouiller instantanÃ©ment votre carte en cas de doute.",
  },
  {
    category: "prets",
    q: "Comment fonctionne la demande de prÃªt en ligne ?",
    a: "Rendez-vous dans votre espace client, rubrique Â« Demande de prÃªt Â». Utilisez le simulateur interactif pour choisir votre montant et la durÃ©e dÃ©sirÃ©e. Le taux d'intÃ©rÃªt, les mensualitÃ©s et les frais de dossier sont calculÃ©s instantanÃ©ment en toute transparence avant soumission.",
  },
  {
    category: "prets",
    q: "Quel est le dÃ©lai de rÃ©ponse pour une demande de crÃ©dit ?",
    a: "Une fois votre simulation soumise, l'Ã©quipe d'analyse examine votre profil sous 24 Ã  48 heures. La dÃ©cision est notifiÃ©e directement dans votre Dashboard et par e-mail.",
  },
  {
    category: "securite",
    q: "Mes fonds et donnÃ©es personnelles sont-ils protÃ©gÃ©s ?",
    a: "Absolument. CBG Banque applique les protocoles de chiffrement bancaire TLS 1.3 / AES-256 et respecte scrupuleusement la rÃ©glementation europÃ©enne RGPD. Vos dÃ©pÃ´ts bÃ©nÃ©ficient des mÃ©canismes de garantie des dÃ©pÃ´ts en vigueur.",
  },
  {
    category: "app",
    q: "Comment installer l'application CBG sur mon tÃ©lÃ©phone ?",
    a: "Notre application est une Progressive Web App (PWA). Cliquez sur le bouton Â« TÃ©lÃ©charger l'application Â» en bas de page ou en haut du site. Sur iPhone, utilisez le menu Partager > Â« Sur l'Ã©cran d'accueil Â». Sur Android et ordinateur, cliquez simplement sur Â« Installer Â».",
  },
];

export default function AidePage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCat = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      faq.q.toLowerCase().includes(search.toLowerCase()) ||
      faq.a.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="legal-page-wrapper">
      <div className="legal-hero-banner">
        <div className="legal-hero-glow" />
        <span className="legal-pill-badge">
          <i className="fa-solid fa-headset"></i> Support & FAQ
        </span>
        <h1 className="legal-main-heading">Centre d&apos;aide & Assistance</h1>
        <p className="legal-lead-text">
          Trouvez des rÃ©ponses claires Ã  vos questions ou contactez notre Ã©quipe de conseillers bancaires dÃ©diÃ©e.
        </p>

        {/* Search input */}
        <div className="help-search-box">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            placeholder="Rechercher une question (ex: prÃªt, carte virtuelle, inscription...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="help-search-input"
          />
          {search && (
            <button onClick={() => setSearch("")} className="search-clear-btn" aria-label="Effacer">
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
      </div>

      <div className="legal-page-container">
        {/* Category filters */}
        <div className="help-categories-bar">
          {[
            { id: "all", label: "Toutes les questions", icon: "fa-list" },
            { id: "compte", label: "Compte & Inscription", icon: "fa-user" },
            { id: "cartes", label: "Cartes Visa", icon: "fa-credit-card" },
            { id: "prets", label: "PrÃªts & CrÃ©dit", icon: "fa-hand-holding-dollar" },
            { id: "securite", label: "SÃ©curitÃ© & RGPD", icon: "fa-shield-halved" },
            { id: "app", label: "Application & PWA", icon: "fa-mobile-screen" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`help-cat-pill ${activeCategory === cat.id ? "active" : ""}`}
            >
              <i className={`fa-solid ${cat.icon}`}></i> {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="faq-list-card">
          {filteredFaqs.length === 0 ? (
            <div className="faq-empty-state">
              <i className="fa-solid fa-circle-question"></i>
              <p>Aucune rÃ©ponse trouvÃ©e pour votre recherche.</p>
              <button onClick={() => { setSearch(""); setActiveCategory("all"); }} className="btn-table-details">
                RÃ©initialiser la recherche
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className={`faq-accordion-item ${isOpen ? "open" : ""}`}>
                  <button
                    className="faq-question-btn"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <i className={`fa-solid ${isOpen ? "fa-minus" : "fa-plus"} toggle-icon`}></i>
                  </button>
                  {isOpen && (
                    <div className="faq-answer-pane">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Contact Support Blocks */}
        <div className="help-contact-grid">
          <div className="help-contact-card">
            <div className="contact-card-icon blue">
              <i className="fa-solid fa-envelope"></i>
            </div>
            <h4>Par e-mail</h4>
            <p>Notre Ã©quipe rÃ©pond Ã  vos messages sous 24h ouvrÃ©es.</p>
            <a href="mailto:serviceclient@cbgbanque.com" className="contact-card-link">
              serviceclient@cbgbanque.com
            </a>
          </div>

          <div className="help-contact-card">
            <div className="contact-card-icon green">
              <i className="fa-solid fa-phone"></i>
            </div>
            <h4>Par tÃ©lÃ©phone</h4>
            <p>Conseillers disponibles du lundi au samedi de 8h Ã  20h.</p>
            <a href="tel:+33189714200" className="contact-card-link">
              +33 (0) 1 89 71 42 00
            </a>
          </div>

          <div className="help-contact-card">
            <div className="contact-card-icon purple">
              <i className="fa-solid fa-comments"></i>
            </div>
            <h4>Espace Client</h4>
            <p>AccÃ©dez Ã  votre messagerie sÃ©curisÃ©e et Ã  vos demandes de prÃªt.</p>
            <Link href="/FR/dashboard" className="contact-card-link">
              Ouvrir mon dashboard <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}


