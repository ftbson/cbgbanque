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
      title: "Girokonto",
      description: "Belgische IBAN, Visa-Karte, Sofortzahlungen. 0 € Gebühren.",
    },
    {
      id: "savings",
      icon: "fa-solid fa-dollar-sign",
      iconBg: "gradient-green",
      glowColor: "22, 163, 74",
      highlightColor: "#22c55e",
      title: "Sparen",
      highlight: "3,25 %",
      description: "Unbegrenzte Tresore, tägliche Zinsen. Sofort verfügbar.",
    },
    {
      id: "virtual-cards",
      icon: "fa-solid fa-clone",
      iconBg: "gradient-purple",
      glowColor: "147, 51, 234",
      title: "Virtuelle Karten",
      description: "Erstellen Sie eine Einweg-Karte in 2 Sekunden. Maximale Online-Sicherheit.",
    },
    {
      id: "loans",
      icon: "fa-solid fa-house",
      iconBg: "gradient-amber",
      glowColor: "234, 88, 12",
      highlightColor: "#f97316",
      title: "Kredite ab",
      highlight: "5,90 %",
      description: "Antwort in 24h. Auto, Immobilie, Privat. Bis zu 50.000 € über 84 Monate.",
    },
    {
      id: "payments",
      icon: "fa-solid fa-arrow-right",
      iconBg: "gradient-cyan",
      glowColor: "8, 145, 178",
      title: "Zahlungen",
      description: "Im Laden und online bezahlen, in einer Geste, mit Ihrer CBG-Karte.",
    },
    {
      id: "exchange",
      icon: "fa-solid fa-globe",
      iconBg: "gradient-pink",
      glowColor: "225, 29, 72",
      title: "Währungsumtausch",
      description: "Im Ausland zahlen und abheben mit transparentem Wechselkurs.",
    },
    {
      id: "transfers",
      icon: "fa-solid fa-arrows-up-down",
      iconBg: "gradient-indigo",
      glowColor: "37, 99, 235",
      title: "Überweisungen",
      description: "Geld schnell senden, in Belgien und Europa, in wenigen Sekunden.",
    },
    {
      id: "travel",
      icon: "fa-solid fa-paper-plane",
      iconBg: "gradient-emerald",
      glowColor: "5, 150, 105",
      title: "Reisen",
      description: "Behalten Sie die Kontrolle über Ihre Karte, wo immer Sie sind: sofortige Sperrung.",
    },
  ];

  return (
    <section className="features-section">
      <div className="features-bg-glow glow-features-1"></div>
      <div className="features-bg-glow glow-features-2"></div>

      <div className="features-container">
        <div className="features-header">
          <span className="features-tag">Eine App. All Ihre Finanzen.</span>
          <h2 className="features-title">
            Alles, um Ihr Geld an einem <span className="gradient-text">einzigen Ort zu steuern.</span>
          </h2>
          <p className="features-subtitle">
            Ein vereinfachtes, ultraschnelles und sicheres Bankerlebnis, entwickelt für Ihren Alltag.
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