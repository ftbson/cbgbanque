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
    a: "L'ouverture se fait entièrement en ligne en moins de 5 minutes. Remplissez le formulaire, téléversez le recto et le verso de votre pièce d'identité en cours de validité, puis notre équipe de conformité valide votre dossier dans un délai de 24h ouvrées. Vous recevez un e-mail de confirmation dès que votre compte est actif.",
  },
  {
    category: "compte",
    q: "Quels sont les documents acceptés pour l'inscription ?",
    a: "Nous acceptons la Carte Nationale d'Identité européenne (recto et verso), le Passeport international en cours de validité, le Permis de conduire au format carte bancaire ou le Titre de séjour européen.",
  },
  {
    category: "cartes",
    q: "Comment commander ou créer une carte bancaire ?",
    a: "Depuis votre Dashboard, accédez à la section « Mes cartes ». Vous pouvez instantanément générer une carte virtuelle sécurisée pour vos achats en ligne ou commander une carte physique Visa Classic livrée sous 5 à 7 jours ouvrés chez vous.",
  },
  {
    category: "cartes",
    q: "Puis-je geler temporairement ma carte ou masquer mes numéros ?",
    a: "Oui ! En un clic depuis votre espace Cartes, vous pouvez masquer/afficher le numéro à 16 chiffres et le cryptogramme CVV, ou verrouiller/déverrouiller instantanément votre carte en cas de doute.",
  },
  {
    category: "prets",
    q: "Comment fonctionne la demande de prêt en ligne ?",
    a: "Rendez-vous dans votre espace client, rubrique « Demande de prêt ». Utilisez le simulateur interactif pour choisir votre montant et la durée désirée. Le taux d'intérêt, les mensualités et les frais de dossier sont calculés instantanément en toute transparence avant soumission.",
  },
  {
    category: "prets",
    q: "Quel est le délai de réponse pour une demande de crédit ?",
    a: "Une fois votre simulation soumise, l'équipe d'analyse examine votre profil sous 24 à 48 heures. La décision est notifiée directement dans votre Dashboard et par e-mail.",
  },
  {
    category: "securite",
    q: "Mes fonds et données personnelles sont-ils protégés ?",
    a: "Absolument. CBG Banque applique les protocoles de chiffrement bancaire TLS 1.3 / AES-256 et respecte scrupuleusement la réglementation européenne RGPD. Vos dépôts bénéficient des mécanismes de garantie des dépôts en vigueur.",
  },
  {
    category: "app",
    q: "Comment installer l'application CBG sur mon téléphone ?",
    a: "Notre application est une Progressive Web App (PWA). Cliquez sur le bouton « Télécharger l'application » en bas de page ou en haut du site. Sur iPhone, utilisez le menu Partager > « Sur l'écran d'accueil ». Sur Android et ordinateur, cliquez simplement sur « Installer ».",
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
          Trouvez des réponses claires à vos questions ou contactez notre équipe de conseillers bancaires dédiée.
        </p>

        {/* Search input */}
        <div className="help-search-box">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            placeholder="Rechercher une question (ex: prêt, carte virtuelle, inscription...)"
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
            { id: "prets", label: "Prêts & Crédit", icon: "fa-hand-holding-dollar" },
            { id: "securite", label: "Sécurité & RGPD", icon: "fa-shield-halved" },
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
              <p>Aucune réponse trouvée pour votre recherche.</p>
              <button onClick={() => { setSearch(""); setActiveCategory("all"); }} className="btn-table-details">
                Réinitialiser la recherche
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
            <p>Notre équipe répond à vos messages sous 24h ouvrées.</p>
            <a href="mailto:serviceclient@cbgbanque.com" className="contact-card-link">
              serviceclient@cbgbanque.com
            </a>
          </div>

          <div className="help-contact-card">
            <div className="contact-card-icon green">
              <i className="fa-solid fa-phone"></i>
            </div>
            <h4>Par téléphone</h4>
            <p>Conseillers disponibles du lundi au samedi de 8h à 20h.</p>
            <a href="tel:+33189714200" className="contact-card-link">
              +33 (0) 1 89 71 42 00
            </a>
          </div>

          <div className="help-contact-card">
            <div className="contact-card-icon purple">
              <i className="fa-solid fa-comments"></i>
            </div>
            <h4>Espace Client</h4>
            <p>Accédez à votre messagerie sécurisée et à vos demandes de prêt.</p>
            <Link href="/dashboard" className="contact-card-link">
              Ouvrir mon dashboard <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
