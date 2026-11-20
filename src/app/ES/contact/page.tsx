"use client";

import { useState } from "react";

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const faqs = [
    {
      question: "¿Cómo puedo abrir una cuenta en CBG Banco?",
      answer:
        "La apertura de una cuenta se realiza íntegramente en línea en menos de 5 minutos. Complete el formulario, suba su documento de identidad (anverso y reverso), y nuestro equipo validará su cuenta en 24 horas laborables.",
    },
    {
      question: "¿Cuáles son los plazos para obtener un préstamo?",
      answer:
        "Después de simular y validar su solicitud de préstamo desde su espacio de cliente, nuestros analistas estudian su expediente en 24 a 48 horas. Tras la aprobación del administrador, los fondos se acreditan directamente en su cuenta.",
    },
    {
      question: "¿Cómo activar una tarjeta bancaria virtual?",
      answer:
        "Desde su Dashboard, vaya a la sección «Tarjetas». Puede crear al instante una tarjeta virtual con número cifrado, fecha de caducidad y código CVV.",
    },
    {
      question: "¿Están protegidos mis depósitos y datos personales?",
      answer:
        "Absolutamente. CBG Banco aplica las normas de seguridad bancaria más estrictas (cifrado TLS 1.3 / AES-256) y se ajusta rigurosamente al reglamento europeo RGPD.",
    },
    {
      question: "¿Qué hacer en caso de urgencia o tarjeta perdida?",
      answer:
        "Puede bloquear o congelar instantáneamente su tarjeta con un clic desde su Dashboard. Nuestro centro de urgencias está disponible 24/7.",
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
          {/* COLUMNA IZQUIERDA: FAQ */}
          <div className="faq-column">
            <span className="section-subtitle">ASISTENCIA & CONSEJOS</span>
            <h2 className="section-title">Preguntas frecuentes sobre nuestros servicios</h2>

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
            <span className="section-subtitle">¿NECESITA AYUDA?</span>
            <h2 className="section-title">
              Nuestro equipo de expertos bancarios está a su escucha para acompañarle.
            </h2>

            {submitted ? (
              <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", padding: "1.5rem", borderRadius: "14px", marginTop: "1.5rem", textAlign: "center" }}>
                <i className="fa-solid fa-circle-check" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}></i>
                <h4 style={{ margin: "0.5rem 0", color: "#ffffff" }}>Mensaje enviado con éxito</h4>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#cbd5e1" }}>
                  Un asesor de CBG Banco le contactará en 24 horas laborables.
                </p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="input-grid">
                  <input
                    type="text"
                    className="input-underline"
                    placeholder="Su nombre completo"
                    required
                  />
                  <input
                    type="email"
                    className="input-underline"
                    placeholder="Su dirección de e-mail"
                    required
                  />
                  <input
                    type="tel"
                    className="input-underline"
                    placeholder="Número de teléfono"
                  />
                  <input
                    type="text"
                    className="input-underline"
                    placeholder="Asunto de la solicitud"
                    required
                  />
                </div>

                {/* Mensaje */}
                <textarea
                  className="input-underline textarea"
                  placeholder="Describa su proyecto o su solicitud en unas líneas..."
                  rows={4}
                  required
                ></textarea>

                <button type="submit" className="btn-submit-contact" disabled={loading}>
                  {loading ? "ENVIANDO..." : "ENVIAR MI MENSAJE"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}