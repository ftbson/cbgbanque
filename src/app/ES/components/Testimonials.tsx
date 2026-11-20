"use client";

import React from "react";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  initial: string;
  avatarBg: string;
}

export default function Testimonials() {
  const testimonialsData: Testimonial[] = [
    {
      id: "1",
      quote: "Abrí mi cuenta en solo unos minutos. Cero comisiones en mis transferencias y una interfaz fluida, es simplemente perfecta para gestionar mi presupuesto diario.",
      author: "Éric K.",
      initial: "É",
      avatarBg: "avatar-blue",
    },
    {
      id: "2",
      quote: "El servicio de ahorro potenciado es una verdadera joya. Los intereses abonados cada día me ofrecen un rendimiento óptimo sin bloquear mi capital. ¡Lo recomiendo al 100 %!",
      author: "Aïcha M.",
      initial: "A",
      avatarBg: "avatar-green",
    },
    {
      id: "3",
      quote: "Conseguir un préstamo personal nunca fue tan fácil. Respuesta rápida en menos de 24h y tasas ultra competitivas. Un banco moderno que cumple sus promesas.",
      author: "Stéphane B.",
      initial: "S",
      avatarBg: "avatar-purple",
    },
    {
      id: "4",
      quote: "La generación de tarjetas virtuales efímeras ha asegurado totalmente mis compras en Internet. Ya no tengo miedo al fraude, una verdadera tranquilidad.",
      author: "Chantal R.",
      initial: "C",
      avatarBg: "avatar-amber",
    },
    {
      id: "5",
      quote: "Viajando a menudo fuera de la zona euro, el cambio multidivisa sin comisiones ocultas me ha ahorrado una fortuna. ¡Enhorabuena a todo el equipo!",
      author: "Julien P.",
      initial: "J",
      avatarBg: "avatar-cyan",
    },
    {
      id: "6",
      quote: "El servicio de atención al cliente es reactivo, profesional y atento. El mejor neobanco que he tenido la oportunidad de usar hasta ahora.",
      author: "Nathalie D.",
      initial: "N",
      avatarBg: "avatar-pink",
    },
  ];

  const duplicatedTestimonials = [...testimonialsData, ...testimonialsData];

  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <span className="testimonials-tag">OPINIONES CLIENTES</span>
        <h2 className="testimonials-title">Lo que dicen nuestros clientes</h2>
        <p className="testimonials-subtitle">
          Descubre por qué miles de usuarios confían en CBGBanco a diario.
        </p>
      </div>

      <div className="marquee-container">
        <div className="marquee-track">
          {duplicatedTestimonials.map((item, index) => (
            <div key={`${item.id}-${index}`} className="testimonial-card">
              <div className="quote-icon">
                <i className="fa-solid fa-quote-left"></i>
              </div>
              <p className="testimonial-quote">"{item.quote}"</p>
              <div className="testimonial-author-box">
                <div className={`author-avatar ${item.avatarBg}`}>
                  {item.initial}
                </div>
                <span className="author-name">{item.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}