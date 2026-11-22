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
        "L'ouverture d'un compte s'effectue intégralement en ligne en moins de 5 minutes. Remplissez le formulaire, téléversez votre pièce d'identité (recto et verso), et notre équipe validera votre compte sous 24h ouvrées.",
    },
    {
      question: "Quels sont les délais d'obtention d'un prêt ?",
      answer:
        "Après avoir simulé et validé votre demande de prêt depuis votre espace client, nos analystes étudient votre dossier sous 24 à 48 heures. Dès approbation par l'administrateur, les fonds sont crédités directement sur votre compte.",
    },
    {
      question: "Comment activer une carte bancaire virtuelle ?",
      answer:
        "Depuis votre Dashboard, rendez-vous dans la section « Cartes ». Vous pouvez créer instantanément une carte virtuelle avec numéro chiffré, date d'expiration et cryptogramme CVV.",
    },
    {
      question: "Mes dépôts et données personnelles sont-ils protégés ?",
      answer:
        "Absolument. CBG Banque applique les normes de sécurité bancaire les plus strictes (chiffrement TLS 1.3 / AES-256) et se conforme rigoureusement à la réglementation européenne RGPD.",
    },
    {
      question: "Que faire en cas d'urgence ou de carte perdue ?",
      answer:
        "Vous pouvez verrouiller ou geler instantanément votre carte en un clic depuis votre Dashboard. Notre centre d'urgence est joignable 24h/24 et 7j/7.",
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
          {/* COLONNE GAUCHE : QUESTIONS FRÉQUENTES */}
          <div className="faq-column">
            <span className="section-subtitle">ASSISTANCE & CONSEILS</span>
            <h2 className="section-title">Questions fréquentes sur nos services</h2>

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

          {/* SÉPARATEUR VERTICAL */}
          <div className="vertical-divider"></div>

          {/* COLONNE DROITE : FORMULAIRE */}
          <div className="form-column">
            <span className="section-subtitle">BESOIN D&apos;AIDE ?</span>
            <h2 className="section-title">
              Notre équipe d&apos;experts bancaires est à votre écoute pour vous accompagner.
            </h2>

            {submitted ? (
              <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", padding: "1.5rem", borderRadius: "14px", marginTop: "1.5rem", textAlign: "center" }}>
                <i className="fa-solid fa-circle-check" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}></i>
                <h4 style={{ margin: "0.5rem 0", color: "#ffffff" }}>Message envoyé avec succès</h4>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#cbd5e1" }}>
                  Un conseiller CBG Banque vous recontactera sous 24h ouvrées.
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
                    placeholder="Numéro de téléphone"
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
                  placeholder="Décrivez votre projet ou votre demande en quelques lignes..."
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
