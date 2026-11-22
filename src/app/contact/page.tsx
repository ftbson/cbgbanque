"use client";

import { useState } from "react";

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const faqs = [
    {
      question: "Comment puis-je ouvrir un compte chez CBG Banque ?",
      answer:
        "L'ouverture d'un compte s'effectue intÃ©gralement en ligne en moins de 5 minutes. Remplissez le formulaire, tÃ©lÃ©versez votre piÃ¨ce d'identitÃ© (recto et verso), et notre Ã©quipe validera votre compte sous 24h ouvrÃ©es.",
    },
    {
      question: "Quels sont les dÃ©lais d'obtention d'un prÃªt ?",
      answer:
        "AprÃ¨s avoir simulÃ© et validÃ© votre demande de prÃªt depuis votre espace client, nos analystes Ã©tudient votre dossier sous 24 Ã  48 heures. DÃ¨s approbation par l'administrateur, les fonds sont crÃ©ditÃ©s directement sur votre compte.",
    },
    {
      question: "Comment activer une carte bancaire virtuelle ?",
      answer:
        "Depuis votre Dashboard, rendez-vous dans la section Â« Cartes Â». Vous pouvez crÃ©er instantanÃ©ment une carte virtuelle avec numÃ©ro chiffrÃ©, date d'expiration et cryptogramme CVV.",
    },
    {
      question: "Mes dÃ©pÃ´ts et donnÃ©es personnelles sont-ils protÃ©gÃ©s ?",
      answer:
        "Absolument. CBG Banque applique les normes de sÃ©curitÃ© bancaire les plus strictes (chiffrement TLS 1.3 / AES-256) et se conforme rigoureusement Ã  la rÃ©glementation europÃ©enne RGPD.",
    },
    {
      question: "Que faire en cas d'urgence ou de carte perdue ?",
      answer:
        "Vous pouvez verrouiller ou geler instantanÃ©ment votre carte en un clic depuis votre Dashboard. Notre centre d'urgence est joignable 24h/24 et 7j/7.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        <div className="contact-grid">
          {/* COLONNE GAUCHE : QUESTIONS FRÃ‰QUENTES */}
          <div className="faq-column">
            <span className="section-subtitle">ASSISTANCE & CONSEILS</span>
            <h2 className="section-title">Questions frÃ©quentes sur nos services</h2>

            <div className="faq-accordion">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`faq-item ${openFaq === index ? "active" : ""}`}
                >
                  <button
                    className="faq-question"
                    onClick={() => toggleFaq(index)}
                  >
                    {faq.question}
                    <i
                      className={`fa-solid fa-chevron-${openFaq === index ? "up" : "down"}`}
                    ></i>
                  </button>
                  <div
                    className="faq-answer-wrapper"
                    style={{
                      maxHeight: openFaq === index ? "200px" : "0",
                      opacity: openFaq === index ? 1 : 0,
                    }}
                  >
                    <p className="faq-answer">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SÃ‰PARATEUR VERTICAL */}
          <div className="vertical-divider"></div>

          {/* COLONNE DROITE : FORMULAIRE */}
          <div className="form-column">
            <span className="section-subtitle">BESOIN D&apos;AIDE ?</span>
            <h2 className="section-title">
              Notre Ã©quipe d&apos;experts bancaires est Ã  votre Ã©coute pour vous accompagner.
            </h2>

            {submitted ? (
              <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", padding: "1.5rem", borderRadius: "14px", marginTop: "1.5rem", textAlign: "center" }}>
                <i className="fa-solid fa-circle-check" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}></i>
                <h4 style={{ margin: "0.5rem 0", color: "#ffffff" }}>Message envoyÃ© avec succÃ¨s</h4>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#cbd5e1" }}>
                  Un conseiller CBG Banque vous recontactera sous 24h ouvrÃ©es.
                </p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="input-grid">
                  <input
                    type="text"
                    className="input-underline"
                    placeholder="Votre nom complet"
                    required
                  />
                  <input
                    type="email"
                    className="input-underline"
                    placeholder="Votre adresse e-mail"
                    required
                  />
                  <input
                    type="tel"
                    className="input-underline"
                    placeholder="NumÃ©ro de tÃ©lÃ©phone"
                  />
                  <input
                    type="text"
                    className="input-underline"
                    placeholder="Objet de la demande"
                    required
                  />
                </div>

                {/* Message */}
                <textarea
                  className="input-underline textarea"
                  placeholder="DÃ©crivez votre projet ou votre demande en quelques lignes..."
                  rows={4}
                  required
                ></textarea>

                <button type="submit" className="btn-submit-contact" disabled={loading}>
                  {loading ? "ENVOI EN COURS..." : "ENVOYER MON MESSAGE"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

