"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function CtaSection() {
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
          // Une fois visible, on peut arrêter d'observer
          if (sectionRef.current) observer.unobserve(sectionRef.current);
        }
      },
      { threshold: 0.2 } // Se déclenche à 20% de visibilité
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
    const duration = 2000; // 2 secondes pour l'animation

    const animateCounts = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3); // Easing fluide

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

  return (
    <section ref={sectionRef} className="cta-section">
      <div className={`cta-container ${isVisible ? "is-visible" : ""}`}>
        
        {/* Card 1: Key Statistics Block */}
        <div className="stats-card reveal-item reveal-card-1">
          <div className="stats-tag">CBGBANQUE EN CHIFFRES</div>

          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">
                {counts.clients.toLocaleString("fr-FR")} +
              </span>
              <span className="stat-label">Clients en Europe</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {counts.capital.toLocaleString("fr-FR")} €
              </span>
              <span className="stat-label">Capital libéré</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{counts.languages}</span>
              <span className="stat-label">Langues supportées</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{counts.year}</span>
              <span className="stat-label">Siège à Bruxelles</span>
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
              Prêt à transformer votre{" "}
              <span className="gradient-text">expérience bancaire ?</span>
            </h2>

            <p className="cta-description">
              Ouvrez votre compte en moins de 5 minutes. Sans frais cachés, sans
              engagement.
            </p>

            <div className="cta-actions">
              <Link href="/register" className="btn-cta-white">
                Ouvrir un compte <i className="fa-solid fa-arrow-right"></i>
              </Link>
              <Link href="/download" className="btn-cta-glow">
                Découvrir l'application
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}