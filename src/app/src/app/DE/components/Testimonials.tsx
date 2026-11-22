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
      quote: "Ich habe mein Konto in wenigen Minuten eröffnet. Keine Gebühren für Überweisungen und eine flüssige Oberfläche – einfach perfekt für die tägliche Budgetverwaltung.",
      author: "Éric K.",
      initial: "É",
      avatarBg: "avatar-blue",
    },
    {
      id: "2",
      quote: "Der Sparbooster-Service ist ein echtes Juwel. Die täglich gutgeschriebenen Zinsen bieten eine optimale Rendite, ohne mein Kapital zu binden. Ich empfehle es zu 100 %!",
      author: "Aïcha M.",
      initial: "A",
      avatarBg: "avatar-green",
    },
    {
      id: "3",
      quote: "Einen Privatkredit zu erhalten war noch nie so einfach. Schnelle Antwort in unter 24h und ultra-wettbewerbsfähige Zinssätze. Eine moderne Bank, die ihre Versprechen hält.",
      author: "Stéphane B.",
      initial: "S",
      avatarBg: "avatar-purple",
    },
    {
      id: "4",
      quote: "Die Erstellung von virtuellen Einwegkarten hat meine Online-Einkäufe vollständig abgesichert. Keine Betrugsangst mehr, ein echtes Wohlbefinden.",
      author: "Chantal R.",
      initial: "C",
      avatarBg: "avatar-amber",
    },
    {
      id: "5",
      quote: "Da ich oft außerhalb des Euroraums reise, hat mir der Mehrwährungswechsel ohne versteckte Provisionen ein Vermögen gespart. Bravo an das ganze Team!",
      author: "Julien P.",
      initial: "J",
      avatarBg: "avatar-cyan",
    },
    {
      id: "6",
      quote: "Der Kundenservice ist reaktiv, professionell und zuhörend. Die beste Neobank, die ich bisher nutzen durfte.",
      author: "Nathalie D.",
      initial: "N",
      avatarBg: "avatar-pink",
    },
  ];

  const duplicatedTestimonials = [...testimonialsData, ...testimonialsData];

  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <span className="testimonials-tag">KUNDENMEINUNGEN</span>
        <h2 className="testimonials-title">Was unsere Kunden sagen</h2>
        <p className="testimonials-subtitle">
          Erfahren Sie, warum Tausende von Nutzern CBGBank täglich vertrauen.
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