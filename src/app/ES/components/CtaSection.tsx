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
    return num.toLocaleString("es-ES");
  };

  return (
    <section ref={sectionRef} className="cta-section">
      <div className={`cta-container ${isVisible ? "is-visible" : ""}`}>

        <div className="stats-card reveal-item reveal-card-1">
          <div className="stats-tag">CBGBANCO EN CIFRAS</div>

          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">
                {formatNumber(counts.clients)} +
              </span>
              <span className="stat-label">Clientes en Europa</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {formatNumber(counts.capital)} €
              </span>
              <span className="stat-label">Capital liberado</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{counts.languages}</span>
              <span className="stat-label">Idiomas soportados</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{counts.year}</span>
              <span className="stat-label">Sede en Bruselas</span>
            </div>
          </div>
        </div>

        <div className="cta-banner-card reveal-item reveal-card-2">
          <div className="neon-ring ring-left"></div>
          <div className="neon-ring ring-right"></div>

          <div className="cta-content">
            <h2 className="cta-title">
              ¿Listo para transformar tu{" "}
              <span className="gradient-text">experiencia bancaria?</span>
            </h2>

            <p className="cta-description">
              Abre tu cuenta en menos de 5 minutos. Sin comisiones ocultas, sin compromiso.
            </p>

            <div className="cta-actions">
              <Link href="/ES/abrir-cuenta" className="btn-cta-white">
                Abrir una cuenta <i className="fa-solid fa-arrow-right"></i>
              </Link>
              <Link href="/ES/descargar" className="btn-cta-glow">
                Descubrir la aplicación
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}