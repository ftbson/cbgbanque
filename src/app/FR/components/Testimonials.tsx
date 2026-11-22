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
      quote: "J'ai ouvert mon compte en quelques minutes seulement. ZÃ©ro frais sur mes virements et une interface fluide, c'est tout simplement parfait pour gÃ©rer mon budget au quotidien.",
      author: "Ã‰ric K.",
      initial: "Ã‰",
      avatarBg: "avatar-blue",
    },
    {
      id: "2",
      quote: "Le service d'Ã©pargne booster est une vraie pÃ©pite. Les intÃ©rÃªts versÃ©s chaque jour m'offrent un rendement optimal sans bloquer mon capital. Je recommande Ã  100 % !",
      author: "AÃ¯cha M.",
      initial: "A",
      avatarBg: "avatar-green",
    },
    {
      id: "3",
      quote: "Obtenir un prÃªt personnel n'a jamais Ã©tÃ© aussi simple. RÃ©ponse rapide en moins de 24h et des taux ultra compÃ©titifs. Une banque moderne qui tient ses promesses.",
      author: "StÃ©phane B.",
      initial: "S",
      avatarBg: "avatar-purple",
    },
    {
      id: "4",
      quote: "La gÃ©nÃ©ration de cartes virtuelles Ã©phÃ©mÃ¨res a totalement sÃ©curisÃ© mes achats sur Internet. Plus aucune crainte de fraude, un vrai confort d'esprit.",
      author: "Chantal R.",
      initial: "C",
      avatarBg: "avatar-amber",
    },
    {
      id: "5",
      quote: "Voyageant souvent en dehors de la zone euro, le change multi-devises sans commissions cachÃ©es m'a fait Ã©conomiser un montant fou. Bravo Ã  toute l'Ã©quipe !",
      author: "Julien P.",
      initial: "J",
      avatarBg: "avatar-cyan",
    },
    {
      id: "6",
      quote: "Le support client est rÃ©actif, professionnel et Ã  l'Ã©coute. La meilleure nÃ©o-banque que j'ai eu l'occasion d'utiliser jusqu'Ã  prÃ©sent.",
      author: "Nathalie D.",
      initial: "N",
      avatarBg: "avatar-pink",
    },
  ];

  const duplicatedTestimonials = [...testimonialsData, ...testimonialsData];

  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <span className="testimonials-tag">AVIS CLIENTS</span>
        <h2 className="testimonials-title">Ce que disent nos clients</h2>
        <p className="testimonials-subtitle">
          DÃ©couvrez pourquoi des milliers de utilisateurs font confiance Ã  CBGBanque au quotidien.
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
