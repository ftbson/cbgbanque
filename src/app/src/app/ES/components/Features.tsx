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
      title: "Cuenta corriente",
      description: "IBAN belga, tarjeta Visa, pagos instantáneos. 0 € de comisiones.",
    },
    {
      id: "savings",
      icon: "fa-solid fa-dollar-sign",
      iconBg: "gradient-green",
      glowColor: "22, 163, 74",
      highlightColor: "#22c55e",
      title: "Ahorro",
      highlight: "3,25 %",
      description: "Bóvedas ilimitadas, intereses diarios. Disponibilidad inmediata.",
    },
    {
      id: "virtual-cards",
      icon: "fa-solid fa-clone",
      iconBg: "gradient-purple",
      glowColor: "147, 51, 234",
      title: "Tarjetas virtuales",
      description: "Crea una tarjeta desechable en 2 segundos. Máxima seguridad online.",
    },
    {
      id: "loans",
      icon: "fa-solid fa-house",
      iconBg: "gradient-amber",
      glowColor: "234, 88, 12",
      highlightColor: "#f97316",
      title: "Préstamos desde",
      highlight: "5,90 %",
      description: "Respuesta en 24h. Auto, hipotecario, personal. Hasta 50.000 € a 84 meses.",
    },
    {
      id: "payments",
      icon: "fa-solid fa-arrow-right",
      iconBg: "gradient-cyan",
      glowColor: "8, 145, 178",
      title: "Pagos",
      description: "Paga en tienda y online, en un gesto, con tu tarjeta CBG.",
    },
    {
      id: "exchange",
      icon: "fa-solid fa-globe",
      iconBg: "gradient-pink",
      glowColor: "225, 29, 72",
      title: "Cambio",
      description: "Paga y retira en el extranjero con cambio transparente.",
    },
    {
      id: "transfers",
      icon: "fa-solid fa-arrows-up-down",
      iconBg: "gradient-indigo",
      glowColor: "37, 99, 235",
      title: "Transferencias",
      description: "Envía dinero rápido, en Bélgica y Europa, en pocos segundos.",
    },
    {
      id: "travel",
      icon: "fa-solid fa-paper-plane",
      iconBg: "gradient-emerald",
      glowColor: "5, 150, 105",
      title: "Viaje",
      description: "Mantén el control de tu tarjeta estés donde estés: bloqueo instantáneo.",
    },
  ];

  return (
    <section className="features-section">
      <div className="features-bg-glow glow-features-1"></div>
      <div className="features-bg-glow glow-features-2"></div>

      <div className="features-container">
        <div className="features-header">
          <span className="features-tag">Una sola app. Todas tus finanzas.</span>
          <h2 className="features-title">
            Todo para gestionar tu dinero en un <span className="gradient-text">solo lugar.</span>
          </h2>
          <p className="features-subtitle">
            Una experiencia bancaria simplificada, ultra-rápida y segura diseñada para tu día a día.
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