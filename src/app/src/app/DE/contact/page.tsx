"use client";

import { useState } from "react";

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const faqs = [
    {
      question: "Wie kann ich ein Konto bei der CBG Bank eröffnen?",
      answer:
        "Die Kontoeröffnung erfolgt vollständig online in weniger als 5 Minuten. Füllen Sie das Formular aus, laden Sie Ihren Ausweis (Vorder- und Rückseite) hoch, und unser Team validiert Ihr Konto innerhalb von 24 Werktstunden.",
    },
    {
      question: "Wie lange dauert es, einen Kredit zu erhalten?",
      answer:
        "Nachdem Sie Ihren Kreditantrag in Ihrem Kundenbereich simuliert und bestätigt haben, prüfen unsere Analysten Ihr Dossier innerhalb von 24 bis 48 Stunden. Nach Genehmigung durch den Administrator werden die Gelder direkt auf Ihr Konto gutgeschrieben.",
    },
    {
      question: "Wie aktiviere ich eine virtuelle Bankkarte?",
      answer:
        "Gehen Sie in Ihrem Dashboard in den Bereich „Karten“. Sie können sofort eine virtuelle Karte mit verschlüsselter Nummer, Ablaufdatum und CVV-Code erstellen.",
    },
    {
      question: "Sind meine Einlagen und persönlichen Daten geschützt?",
      answer:
        "Absolut. Die CBG Bank wendet die strengsten Bank-Sicherheitsstandards an (Verschlüsselung TLS 1.3 / AES-256) und entspricht voll der europäischen DSGVO-Verordnung.",
    },
    {
      question: "Was tun im Notfall oder bei Kartenverlust?",
      answer:
        "Sie können Ihre Karte sofort per Klick in Ihrem Dashboard sperren oder einfrieren. Unsere Notfallzentrale ist 24/7 erreichbar.",
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
          {/* LEFT COLUMN: FAQ */}
          <div className="faq-column">
            <span className="section-subtitle">UNTERSTÜTZUNG & BERATUNG</span>
            <h2 className="section-title">Häufige Fragen zu unseren Dienstleistungen</h2>

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

          {/* VERTICAL DIVIDER */}
          <div className="vertical-divider"></div>

          {/* RIGHT COLUMN: FORM */}
          <div className="form-column">
            <span className="section-subtitle">BRAUCHEN SIE HILFE?</span>
            <h2 className="section-title">
              Unser Team aus Bankexperten hört Ihnen zu, um Sie zu begleiten.
            </h2>

            {submitted ? (
              <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", padding: "1.5rem", borderRadius: "14px", marginTop: "1.5rem", textAlign: "center" }}>
                <i className="fa-solid fa-circle-check" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}></i>
                <h4 style={{ margin: "0.5rem 0", color: "#ffffff" }}>Nachricht erfolgreich gesendet</h4>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#cbd5e1" }}>
                  Ein CBG Bank-Berater wird Sie innerhalb von 24 Werktstunden zurückrufen.
                </p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="input-grid">
                  <input
                    type="text"
                    className="input-underline"
                    placeholder="Ihr vollständiger Name"
                    required
                  />
                  <input
                    type="email"
                    className="input-underline"
                    placeholder="Ihre E-Mail-Adresse"
                    required
                  />
                  <input
                    type="tel"
                    className="input-underline"
                    placeholder="Telefonnummer"
                  />
                  <input
                    type="text"
                    className="input-underline"
                    placeholder="Betreff der Anfrage"
                    required
                  />
                </div>

                {/* Message */}
                <textarea
                  className="input-underline textarea"
                  placeholder="Beschreiben Sie Ihr Projekt oder Ihre Anfrage in wenigen Zeilen..."
                  rows={4}
                  required
                ></textarea>

                <button type="submit" className="btn-submit-contact" disabled={loading}>
                  {loading ? "WIRD GESCHICKT..." : "NACHRICHT SENDEN"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}