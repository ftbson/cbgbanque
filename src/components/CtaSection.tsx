"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

export default function CtaSection() {
  const { t, locale } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    clients: 0,
    capital: 0,
    languages: 0,
    year: 0,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (sectionRef.current) observer.unobserve(sectionRef.current);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animation de comptage progressif des chiffres au scroll
  useEffect(() => {
    if (!isVisible) return;

    let startTimestamp: number | null = null;
    const duration = 2000;

    const animateCounts = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounts({
        clients: Math.floor(easeOut * 50000),
        capital: Math.floor(easeOut * 2000000),
        languages: Math.floor(easeOut * 12),
        year: Math.floor(easeOut * 2018),
      });

      if (progress < 1) {
        window.requestAnimationFrame(animateCounts);
      }
    };

    window.requestAnimationFrame(animateCounts);
  }, [isVisible]);

  const formatNumber = (num: number) => {
    const locales: Record<string, string> = { fr: "fr-FR", es: "es-ES", de: "de-DE" };
    return num.toLocaleString(locales[locale] || "fr-FR");
  };

  return (
    <section ref={sectionRef} className="cta-section">
      <div className={`cta-container ${isVisible ? "is-visible" : ""}`}>

        {/* Card 1: Key Statistics Block */}
        <div className="stats-card reveal-item reveal-card-1">
          <div className="stats-tag">{t("cta.statsTag")}</div>

          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">
                {formatNumber(counts.clients)} +
              </span>
              <span className="stat-label">{t("cta.stats.clients")}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {formatNumber(counts.capital)} €
              </span>
              <span className="stat-label">{t("cta.stats.capital")}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{counts.languages}</span>
              <span className="stat-label">{t("cta.stats.languages")}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{counts.year}</span>
              <span className="stat-label">{t("cta.stats.year")}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Ultra-Modern Glow & Ring CTA */}
        <div className="cta-banner-card reveal-item reveal-card-2">
          {/* Animated Neon Rings */}
          <div className="neon-ring ring-left"></div>
          <div className="neon-ring ring-right"></div>

          <div className="cta-content">
            <h2 className="cta-title">
              {t("cta.title")}{" "}
              <span className="gradient-text">{t("cta.titleHighlight")}</span>
            </h2>

            <p className="cta-description">
              {t("cta.description")}
            </p>

            <div className="cta-actions">
              <Link href="/register" className="btn-cta-white">
                {t("cta.ctaPrimary")} <i className="fa-solid fa-arrow-right"></i>
              </Link>
              <Link href="/download" className="btn-cta-glow">
                {t("cta.ctaSecondary")}
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}