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
    category: "konto",
    q: "Wie eröffne ich ein Konto bei CBG Bank?",
    a: "Die Eröffnung erfolgt vollständig online in weniger als 5 Minuten. Füllen Sie das Formular aus, laden Sie Vorder- und Rückseite Ihres gültigen Ausweisdokuments hoch, und unser Compliance-Team prüft Ihren Antrag innerhalb von 24 Werktstunden. Sie erhalten eine Bestätigungs-E-Mail, sobald Ihr Konto aktiv ist.",
  },
  {
    category: "konto",
    q: "Welche Dokumente werden für die Registrierung akzeptiert?",
    a: "Wir akzeptieren den europäischen Personalausweis (Vorder- und Rückseite), den internationalen Reisepass, den Führerschein im Scheckkartenformat oder einen europäischen Aufenthaltstitel – alles in gültiger Form.",
  },
  {
    category: "karten",
    q: "Wie bestelle oder erstelle ich eine Bankkarte?",
    a: "Gehen Sie in Ihrem Dashboard zum Bereich „Meine Karten“. Sie können sofort eine sichere virtuelle Karte für Ihre Online-Einkäufe generieren oder eine physische Visa Classic Karte bestellen, die innerhalb von 5 bis 7 Werktagen bei Ihnen eintreffen wird.",
  },
  {
    category: "karten",
    q: "Kann ich meine Karte vorübergehend sperren oder meine Nummern ausblenden?",
    a: "Ja! Mit einem Klick in Ihrem Kartenbereich können Sie die 16-stellige Kartennummer und den CVV-Code ein- oder ausblenden oder Ihre Karte im Zweifel sofort sperren und wieder entsperren.",
  },
  {
    category: "kredite",
    q: "Wie funktioniert der Online-Kreditantrag?",
    a: "Gehen Sie in Ihrem Kundenbereich zum Bereich „Kreditanfrage“. Nutzen Sie den interaktiven Simulator, um den gewünschten Betrag und die Laufzeit zu wählen. Zinssatz, monatliche Raten und Bearbeitungsgebühren werden sofort und transparent berechnet, bevor Sie den Antrag absenden.",
  },
  {
    category: "kredite",
    q: "Wie lange dauert die Antwort auf eine Kreditanfrage?",
    a: "Nach Einreichung Ihrer Simulation prüft unser Analyseteam Ihr Profil innerhalb von 24 bis 48 Stunden. Die Entscheidung wird direkt in Ihrem Dashboard und per E-Mail mitgeteilt.",
  },
  {
    category: "sicherheit",
    q: "Sind meine Gelder und persönlichen Daten geschützt?",
    a: "Absolut. CBG Bank wendet die banküblichen Verschlüsselungsprotokolle TLS 1.3 / AES-256 an und hält die europäische DSGVO-Vorschrift strikt ein. Ihre Einlagen profitieren von den geltenden Einlagensicherungsmechanismen.",
  },
  {
    category: "app",
    q: "Wie installiere ich die CBG App auf meinem Handy?",
    a: "Unsere Anwendung ist eine Progressive Web App (PWA). Klicken Sie auf den Button „App herunterladen“ am Seitenende oder oben auf der Seite. Auf dem iPhone nutzen Sie das Teilen-Menü > „Zum Home-Bildschirm“. Auf Android und am Computer klicken Sie einfach auf „Installieren“.",
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
        <h1 className="legal-main-heading">Hilfezentrum & Support</h1>
        <p className="legal-lead-text">
          Finden Sie klare Antworten auf Ihre Fragen oder kontaktieren Sie unser Team aus engagierten Bankberatern.
        </p>

        {/* Search input */}
        <div className="help-search-box">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            placeholder="Frage suchen (z. B. Kredit, virtuelle Karte, Registrierung...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="help-search-input"
          />
          {search && (
            <button onClick={() => setSearch("")} className="search-clear-btn" aria-label="Löschen">
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
      </div>

      <div className="legal-page-container">
        {/* Category filters */}
        <div className="help-categories-bar">
          {[
            { id: "all", label: "Alle Fragen", icon: "fa-list" },
            { id: "konto", label: "Konto & Registrierung", icon: "fa-user" },
            { id: "karten", label: "Visa Karten", icon: "fa-credit-card" },
            { id: "kredite", label: "Kredite & Finanzierung", icon: "fa-hand-holding-dollar" },
            { id: "sicherheit", label: "Sicherheit & DSGVO", icon: "fa-shield-halved" },
            { id: "app", label: "App & PWA", icon: "fa-mobile-screen" },
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
              <p>Keine Antwort für Ihre Suche gefunden.</p>
              <button onClick={() => { setSearch(""); setActiveCategory("all"); }} className="btn-table-details">
                Suche zurücksetzen
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
            <h4>Per E-Mail</h4>
            <p>Unser Team antwortet auf Ihre Nachrichten innerhalb von 24 Werktstunden.</p>
            <a href="mailto:serviceclient@cbgbanque.com" className="contact-card-link">
              serviceclient@cbgbanque.com
            </a>
          </div>

          <div className="help-contact-card">
            <div className="contact-card-icon green">
              <i className="fa-solid fa-phone"></i>
            </div>
            <h4>Per Telefon</h4>
            <p>Berater erreichbar von Montag bis Samstag, 8 bis 20 Uhr.</p>
            <a href="tel:+33189714200" className="contact-card-link">
              +33 (0) 1 89 71 42 00
            </a>
          </div>

          <div className="help-contact-card">
            <div className="contact-card-icon purple">
              <i className="fa-solid fa-comments"></i>
            </div>
            <h4>Kundenbereich</h4>
            <p>Greifen Sie auf Ihre sichere Mailbox und Kreditanfragen zu.</p>
            <Link href="/DE/dashboard" className="contact-card-link">
              Dashboard öffnen <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}