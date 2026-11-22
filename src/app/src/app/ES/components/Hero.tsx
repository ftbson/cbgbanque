"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Hero() {
  const [balance, setBalance] = useState(0);
  const targetBalance = 12458.9;

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 2000;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutProgress = 1 - (1 - progress) * (1 - progress);
      setBalance(easeOutProgress * targetBalance);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, []);

  const formatNumber = (num: number) => {
    return Math.floor(num).toLocaleString("es-ES");
  };

  const integerPart = formatNumber(balance);
  const centsPart = (balance % 1).toFixed(2).substring(2);

  return (
    <section className="hero-section">
      <div className="hero-glow glow-blue"></div>
      <div className="hero-glow glow-purple"></div>

      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="pulse-dot"></span>
            <span>El Neo-Banco de Nueva Generación</span>
          </div>

          <h1 className="hero-title">
            Reimagina tu libertad{" "}
            <span className="hero-gradient-text">financiera.</span>
          </h1>

          <p className="hero-subtitle">
            Cuenta sin comisiones, rentabilidad hasta 4,2 %, tarjetas virtuales instantáneas y transferencias sin demora. Toma el control de tu dinero con CBGBanco.
          </p>

          <div className="hero-actions">
            <Link href="/ES/abrir-cuenta" className="btn-hero-primary">
              Abrir mi cuenta <i className="fa-solid fa-arrow-right"></i>
            </Link>
            <div className="hero-secondary-group">
              <Link href="/ES/iniciar-sesion" className="btn-hero-secondary">
                Ya tengo una cuenta
              </Link>
              <Link href="/ES/descargar" className="btn-hero-outline">
                <i className="fa-solid fa-download"></i> App Móvil
              </Link>
            </div>
          </div>

          <div className="hero-trust">
            <div className="trust-item">
              <i className="fa-solid fa-shield-halved"></i>
              <span>Cuenta 100% gratuita</span>
            </div>
            <div className="trust-item">
              <i className="fa-solid fa-circle-check"></i>
              <span>Licencia Banco Digital</span>
            </div>
            <div className="trust-item">
              <i className="fa-solid fa-lock"></i>
              <span>Seguridad militar</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="phone-mockup">
            <div className="float-badge badge-top-right">
              <div className="badge-icon icon-green">
                <i className="fa-solid fa-arrow-up"></i>
              </div>
              <div className="badge-info">
                <span className="badge-title">Salario recibido</span>
                <span className="badge-amount">+2 450,00 €</span>
              </div>
            </div>

            <div className="float-badge badge-left-mid">
              <div className="badge-icon icon-blue">
                <i className="fa-solid fa-paper-plane"></i>
              </div>
              <div className="badge-info">
                <span className="badge-title">Transferencia instantánea</span>
                <span className="badge-amount">-120,00 €</span>
              </div>
            </div>

            <div className="phone-screen">
              <div className="phone-header">
                <span>9:41</span>
                <div className="phone-icons">
                  <i className="fa-solid fa-signal"></i>
                  <i className="fa-solid fa-wifi"></i>
                  <i className="fa-solid fa-battery-full"></i>
                </div>
              </div>

              <div className="app-balance-card">
                <span className="balance-label">Saldo disponible</span>
                <div className="balance-amount">
                  {integerPart}
                  <span className="balance-cents">,{centsPart} €</span>
                </div>
                <div className="balance-trend">
                  <i className="fa-solid fa-arrow-trend-up"></i> +245,30 € hoy
                </div>
              </div>

              <div className="app-chart">
                <svg viewBox="0 0 300 80" className="chart-svg">
                  <path
                    d="M0,60 Q 60,10 120,50 T 240,20 T 300,40"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    className="animated-chart-line"
                  />
                  <path
                    d="M0,60 Q 60,10 120,50 T 240,20 T 300,40 L 300,80 L 0,80 Z"
                    fill="url(#chart-gradient)"
                    opacity="0.2"
                  />
                  <defs>
                    <linearGradient
                      id="chart-gradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="app-actions">
                <div className="action-btn">
                  <i className="fa-solid fa-arrow-up"></i>
                  <span>Enviar</span>
                </div>
                <div className="action-btn">
                  <i className="fa-solid fa-arrow-down"></i>
                  <span>Recibir</span>
                </div>
                <div className="action-btn">
                  <i className="fa-solid fa-plus"></i>
                  <span>Añadir</span>
                </div>
                <div className="action-btn">
                  <i className="fa-solid fa-credit-card"></i>
                  <span>Tarjetas</span>
                </div>
              </div>

              <div className="app-card-preview animated-glass-card">
                <div className="glass-shine"></div>
                <div className="card-top">
                  <span className="card-brand">CBG BANCO</span>
                  <div className="card-chip"></div>
                </div>
                <div className="card-number">•••• 5403</div>
                <div className="card-bottom">
                  <span className="card-holder">KENDRA D.</span>
                  <i className="fa-brands fa-cc-visa visa-icon"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}