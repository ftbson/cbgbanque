"use client";

import React from "react";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  initial: string;
  avatarBg: string;
}

const testimonialsData: Testimonial[] = [
  {
    id: "1",
    quote: "J'ai ouvert mon compte en quelques minutes seulement. Zéro frais sur mes virements et une interface fluide, c'est tout simplement parfait pour gérer mon budget au quotidien.",
    author: "Éric K.",
    initial: "É",
    avatarBg: "avatar-blue",
  },
  {
    id: "2",
    quote: "Le service d'épargne booster est une vraie pépite. Les intérêts versés chaque jour m'offrent un rendement optimal sans bloquer mon capital. Je recommande à 100 % !",
    author: "Aïcha M.",
    initial: "A",
    avatarBg: "avatar-green",
  },
  {
    id: "30",
    quote: "Obtenir un prêt personnel n'a jamais été aussi simple. Réponse rapide en moins de 24h et des taux ultra compétitifs. Une banque moderne qui tient ses promesses.",
    author: "Stéphane B.",
    initial: "S",
    avatarBg: "avatar-purple",
  },
  {
    id: "4",
    quote: "La génération de cartes virtuelles éphémères a totalement sécurisé mes achats sur Internet. Plus aucune crainte de fraude, un vrai confort d'esprit.",
    author: "Chantal R.",
    initial: "C",
    avatarBg: "avatar-amber",
  },
  {
    id: "5",
    quote: "Voyageant souvent en dehors de la zone euro, le change multi-devises sans commissions cachées m'a fait économiser un montant fou. Bravo à toute l'équipe !",
    author: "Julien P.",
    initial: "J",
    avatarBg: "avatar-cyan",
  },
  {
    id: "6",
    quote: "Le support client est réactif, professionnel et à l'écoute. La meilleure néo-banque que j'ai eu l'occasion d'utiliser jusqu'à présent.",
    author: "Nathalie D.",
    initial: "N",
    avatarBg: "avatar-pink",
  },
];

export default function Testimonials() {
  // Duplication des témoignages pour assurer une boucle infinie fluide
  const duplicatedTestimonials = [...testimonialsData, ...testimonialsData];

  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <span className="testimonials-tag">AVIS CLIENTS</span>
        <h2 className="testimonials-title">Ce que disent nos clients</h2>
        <p className="testimonials-subtitle">
          Découvrez pourquoi des milliers de utilisateurs font confiance à CBGBanque au quotidien.
        </p>
      </div>

      {/* Infinite Marquee Slider Container */}
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