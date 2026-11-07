"use client";

import React from "react";

interface FeatureCard {
  id: string;
  icon: string;
  iconBg: string;
  glowColor: string; // RGB pour les halos lumineux
  highlightColor?: string; // Couleur spécifique pour le texte highlight
  title: string;
  highlight?: string;
  description: string;
  badge?: string;
}

const featuresData: FeatureCard[] = [
  {
    id: "account",
    icon: "fa-regular fa-credit-card",
    iconBg: "gradient-blue",
    glowColor: "37, 99, 235", // Bleu
    title: "Compte courant",
    description: "IBAN belge, carte Visa, paiements instantanés. 0 € de frais.",
  },
  {
    id: "savings",
    icon: "fa-solid fa-dollar-sign",
    iconBg: "gradient-green",
    glowColor: "22, 163, 74", // Vert
    highlightColor: "#22c55e",
    title: "Épargne",
    highlight: "3,25 %",
    description: "Coffres illimités, intérêts journaliers. Disponibilité immédiate.",
  },
  {
    id: "virtual-cards",
    icon: "fa-solid fa-clone",
    iconBg: "gradient-purple",
    glowColor: "147, 51, 234", // Violet
    title: "Cartes virtuelles",
    description: "Créez une carte jetable en 2 secondes. Sécurité maximale en ligne.",
  },
  {
    id: "loans",
    icon: "fa-solid fa-house",
    iconBg: "gradient-amber",
    glowColor: "234, 88, 12", // Orange / Ambre
    highlightColor: "#f97316",
    title: "Prêts dès",
    highlight: "5,90 %",
    description: "Réponse en 24h. Auto, immo, perso. Jusqu'à 50 000 € sur 84 mois.",
  },
  {
    id: "payments",
    icon: "fa-solid fa-arrow-right",
    iconBg: "gradient-cyan",
    glowColor: "8, 145, 178", // Cyan
    title: "Paiements",
    description: "Payez en magasin et en ligne, en un geste, avec votre carte CBG.",
  },
  {
    id: "exchange",
    icon: "fa-solid fa-globe",
    iconBg: "gradient-pink",
    glowColor: "225, 29, 72", // Rose / Magenta
    title: "Change",
    description: "Payez et retirez à l'étranger avec un change transparent.",
  },
  {
    id: "transfers",
    icon: "fa-solid fa-arrows-up-down",
    iconBg: "gradient-indigo",
    glowColor: "37, 99, 235", // Bleu / Indigo
    title: "Transferts",
    description: "Envoyez de l'argent vite, en Belgique et en Europe, en quelques secondes.",
  },
  {
    id: "travel",
    icon: "fa-solid fa-paper-plane",
    iconBg: "gradient-emerald",
    glowColor: "5, 150, 105", // Vert émeraude
    title: "Voyage",
    description: "Gardez le contrôle de votre carte où que vous soyez : blocage instantané.",
  },
];

export default function Features() {
  return (
    <section className="features-section">
      {/* Glows d'arrière-plan de la section */}
      <div className="features-bg-glow glow-features-1"></div>
      <div className="features-bg-glow glow-features-2"></div>

      <div className="features-container">
        {/* Header de section */}
        <div className="features-header">
          <span className="features-tag">Une seule app. Toutes vos finances.</span>
          <h2 className="features-title">
            Tout pour piloter votre argent en un <span className="gradient-text">seul endroit.</span>
          </h2>
          <p className="features-subtitle">
            Une expérience bancaire simplifiée, ultra-rapide et sécurisée conçue pour votre quotidien.
          </p>
        </div>

        {/* Grille de cartes */}
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