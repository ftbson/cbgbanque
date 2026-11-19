"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n";

interface FeatureCard {
  id: string;
  icon: string;
  iconBg: string;
  glowColor: string;
  highlightColor?: string;
  titleKey: string;
  highlightKey?: string;
  descriptionKey: string;
}

export default function Features() {
  const { t } = useTranslation();

  const featuresData: FeatureCard[] = [
    {
      id: "account",
      icon: "fa-regular fa-credit-card",
      iconBg: "gradient-blue",
      glowColor: "37, 99, 235",
      titleKey: "features.items.account.title",
      descriptionKey: "features.items.account.description",
    },
    {
      id: "savings",
      icon: "fa-solid fa-dollar-sign",
      iconBg: "gradient-green",
      glowColor: "22, 163, 74",
      highlightColor: "#22c55e",
      titleKey: "features.items.savings.title",
      highlightKey: "features.items.savings.highlight",
      descriptionKey: "features.items.savings.description",
    },
    {
      id: "virtual-cards",
      icon: "fa-solid fa-clone",
      iconBg: "gradient-purple",
      glowColor: "147, 51, 234",
      titleKey: "features.items.virtualCards.title",
      descriptionKey: "features.items.virtualCards.description",
    },
    {
      id: "loans",
      icon: "fa-solid fa-house",
      iconBg: "gradient-amber",
      glowColor: "234, 88, 12",
      highlightColor: "#f97316",
      titleKey: "features.items.loans.title",
      highlightKey: "features.items.loans.highlight",
      descriptionKey: "features.items.loans.description",
    },
    {
      id: "payments",
      icon: "fa-solid fa-arrow-right",
      iconBg: "gradient-cyan",
      glowColor: "8, 145, 178",
      titleKey: "features.items.payments.title",
      descriptionKey: "features.items.payments.description",
    },
    {
      id: "exchange",
      icon: "fa-solid fa-globe",
      iconBg: "gradient-pink",
      glowColor: "225, 29, 72",
      titleKey: "features.items.exchange.title",
      descriptionKey: "features.items.exchange.description",
    },
    {
      id: "transfers",
      icon: "fa-solid fa-arrows-up-down",
      iconBg: "gradient-indigo",
      glowColor: "37, 99, 235",
      titleKey: "features.items.transfers.title",
      descriptionKey: "features.items.transfers.description",
    },
    {
      id: "travel",
      icon: "fa-solid fa-paper-plane",
      iconBg: "gradient-emerald",
      glowColor: "5, 150, 105",
      titleKey: "features.items.travel.title",
      descriptionKey: "features.items.travel.description",
    },
  ];

  return (
    <section className="features-section">
      {/* Glows d'arrière-plan de la section */}
      <div className="features-bg-glow glow-features-1"></div>
      <div className="features-bg-glow glow-features-2"></div>

      <div className="features-container">
        {/* Header de section */}
        <div className="features-header">
          <span className="features-tag">{t("features.tag")}</span>
          <h2 className="features-title">
            {t("features.title")} <span className="gradient-text">{t("features.titleHighlight")}</span>
          </h2>
          <p className="features-subtitle">
            {t("features.subtitle")}
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
                {t(feature.titleKey)}{" "}
                {feature.highlightKey && (
                  <span className="card-highlight">{t(feature.highlightKey)}</span>
                )}
              </h3>

              <p className="card-description">{t(feature.descriptionKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}