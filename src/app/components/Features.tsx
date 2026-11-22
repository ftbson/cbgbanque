"use client";

import React from "react";

interface FeatureCard {
  id: string;
  icon: string;
  iconBg: string;
  glowColor: string;
  highlightColor?: string;
  title: string;
  highlight?: string;
  description: string;
}

export default function Features() {
  const featuresData: FeatureCard[] = [
    {
      id: "account",
      icon: "fa-regular fa-credit-card",
      iconBg: "gradient-blue",
      glowColor: "37, 99, 235",
      title: "Compte courant",
      description: "IBAN belge, carte Visa, paiements instantanÃ©s. 0 â‚¬ de frais.",
    },
    {
      id: "savings",
      icon: "fa-solid fa-dollar-sign",
      iconBg: "gradient-green",
      glowColor: "22, 163, 74",
      highlightColor: "#22c55e",
      title: "Ã‰pargne",
      highlight: "3,25 %",
      description: "Coffres illimitÃ©s, intÃ©rÃªts journaliers. DisponibilitÃ© immÃ©diate.",
    },
    {
      id: "virtual-cards",
      icon: "fa-solid fa-clone",
      iconBg: "gradient-purple",
      glowColor: "147, 51, 234",
      title: "Cartes virtuelles",
      description: "CrÃ©ez une carte jetable en 2 secondes. SÃ©curitÃ© maximale en ligne.",
    },
    {
      id: "loans",
      icon: "fa-solid fa-house",
      iconBg: "gradient-amber",
      glowColor: "234, 88, 12",
      highlightColor: "#f97316",
      title: "PrÃªts dÃ¨s",
      highlight: "5,90 %",
      description: "RÃ©ponse en 24h. Auto, immo, perso. Jusqu'Ã  50 000 â‚¬ sur 84 mois.",
    },
    {
      id: "payments",
      icon: "fa-solid fa-arrow-right",
      iconBg: "gradient-cyan",
      glowColor: "8, 145, 178",
      title: "Paiements",
      description: "Payez en magasin et en ligne, en un geste, avec votre carte CBG.",
    },
    {
      id: "exchange",
      icon: "fa-solid fa-globe",
      iconBg: "gradient-pink",
      glowColor: "225, 29, 72",
      title: "Change",
      description: "Payez et retirez Ã  l'Ã©tranger avec un change transparent.",
    },
    {
      id: "transfers",
      icon: "fa-solid fa-arrows-up-down",
      iconBg: "gradient-indigo",
      glowColor: "37, 99, 235",
      title: "Transferts",
      description: "Envoyez de l'argent vite, en Belgique et en Europe, en quelques secondes.",
    },
    {
      id: "travel",
      icon: "fa-solid fa-paper-plane",
      iconBg: "gradient-emerald",
      glowColor: "5, 150, 105",
      title: "Voyage",
      description: "Gardez le contrÃ´le de votre carte oÃ¹ que vous soyez : blocage instantanÃ©.",
    },
  ];

  return (
    <section className="features-section">
      <div className="features-bg-glow glow-features-1"></div>
      <div className="features-bg-glow glow-features-2"></div>

      <div className="features-container">
        <div className="features-header">
          <span className="features-tag">Une seule app. Toutes vos finances.</span>
          <h2 className="features-title">
            Tout pour piloter votre argent en un <span className="gradient-text">seul endroit.</span>
          </h2>
          <p className="features-subtitle">
            Une expÃ©rience bancaire simplifiÃ©e, ultra-rapide et sÃ©curisÃ©e conÃ§ue pour votre quotidien.
          </p>
        </div>

        <div className="features-grid">
          {featuresData.map((feature, index) => (
            <div
              key={feature.id}
              className="feature-card"
              style={
                {
                  "--card-glow": feature.glowColor,
                  "--card-highlight-color": feature.highlightColor || "#4ade80",
                  animationDelay: `${index * 0.08}s`,
                } as React.CSSProperties
              }
            >
              <div className="card-top-bar">
                <div className={`feature-icon-wrapper ${feature.iconBg}`}>
                  <i className={feature.icon}></i>
                </div>
              </div>

              <h3 className="card-title">
                {feature.title}{" "}
                {feature.highlight && (
                  <span className="card-highlight">{feature.highlight}</span>
                )}
              </h3>

              <p className="card-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
