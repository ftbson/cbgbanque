"use client";

import { useState } from "react";

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "Welche Brennholzsorten kann ich finden?",
      answer:
        "Unser Katalog umfasst vor allem Harthölzer mit einem hohen Heizwert wie Eiche, Buche, Hainbuche und Esche. Ihre gleichmäßige und langanhaltende Verbrennung eignet sich ideal für Öfen, Kamine und geschlossene Feuerstätten.",
    },
    {
      question: "Kann das Brennholz sofort nach Erhalt verwendet werden?",
      answer:
        "Ja. Das Brennholz ist kammergetrocknet und hat eine Restfeuchte von unter 20 %, sodass es sofort einsatzbereit ist und eine effiziente Verbrennung mit weniger Rauch gewährleistet.",
    },
    {
      question: "In welchen Längen werden die Holzscheite verkauft?",
      answer:
        "Wir bieten Scheite in 25 cm und 33 cm an, gängige Maße, die sich perfekt für viele moderne Öfen und Kamine eignen.",
    },
    {
      question: "Wie erfolgt die Anlieferung der Paletten?",
      answer:
        "Wir liefern die Paletten direkt zu Ihnen nach Hause und stellen sie mithilfe eines Hubwagens so nah wie möglich an Ihren Lagerort ab.",
    },
    {
      question: "Wie viel Brennholz benötige ich für die Heizsaison?",
      answer:
        "Wenn Sie Ihren Kamin nur gelegentlich anzünden, reicht meist eine halbe Palette aus. Ist Holz Ihre Hauptwärmequelle im Winter, benötigen je nach Wohnungsgröße zwei bis drei Paletten.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        <div className="contact-grid">
          {/* COLUMNA IZQUIERDA: preguntas frecuentes */}
          <div className="faq-column">
            <span className="section-subtitle">WIR HELFEN IHNEN</span>
            <h2 className="section-title">Häufige Fragen zu Brennholz und Bestellungen</h2>

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

          {/* SEPARADOR VERTICAL */}
          <div className="vertical-divider"></div>

          {/* COLUMNA DERECHA: FORMULARIO */}
          <div className="form-column">
            <span className="section-subtitle">BRAUCHEN SIE HILFE?</span>
            <h2 className="section-title">
              Wir sind hier, um Ihre Fragen zu Produkten, Lieferungen oder Bestellungen zu beantworten.
            </h2>

            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              {/* Campo de texto oculto / anti-spam */}
              <input
                type="text"
                className="input-full-bordered"
                placeholder=""
              />

              {/* Campos del formulario */}
              <div className="input-grid">
                <input
                  type="text"
                  className="input-underline"
                  placeholder="Ihr Name"
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
                  placeholder="Ihre Telefonnummer"
                />
                <input
                  type="text"
                  className="input-underline"
                  placeholder="Betreff der Anfrage"
                />
              </div>

              {/* Mensaje */}
              <textarea
                className="input-underline textarea"
                placeholder="Teilen Sie uns mit, wie wir Ihnen helfen können"
                rows={3}
                required
              ></textarea>

              <button type="submit" className="btn-submit-contact">
                ANFRAGE SENDEN
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}