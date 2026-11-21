"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookiesPage() {
  const [consentStatus, setConsentStatus] = useState<string>("No definido");

  useEffect(() => {
    const consent = localStorage.getItem("cbg_cookie_consent");
    if (consent) {
      try {
        const parsed = JSON.parse(consent);
        setConsentStatus(
          parsed.marketing
            ? "Todas las cookies aceptadas"
            : parsed.analytics
            ? "Esenciales y analíticas aceptadas"
            : "Solo cookies esenciales"
        );
      } catch {
        setConsentStatus("Registrado");
      }
    }
  }, []);

  const resetCookies = () => {
    localStorage.removeItem("cbg_cookie_consent");
    window.location.reload();
  };

  return (
    <div className="legal-page-wrapper">
      <div className="legal-hero-banner">
        <div className="legal-hero-glow" />
        <span className="legal-pill-badge">
          <i className="fa-solid fa-cookie-bite"></i> Transparencia & Rastreadores
        </span>
        <h1 className="legal-main-heading">Política de Cookies</h1>
        <p className="legal-lead-text">
          Comprenda cómo CBG Banco utiliza las cookies y rastreadores para garantizar la seguridad y calidad de sus servicios bancarios.
        </p>
      </div>

      <div className="legal-page-container">
        <div className="legal-content-card">

          <div className="cookie-status-box">
            <div className="status-info">
              <span className="status-tag">SU ESTADO DE CONSENTIMIENTO ACTUAL</span>
              <strong className="status-current">{consentStatus}</strong>
            </div>
            <button onClick={resetCookies} className="btn-table-details">
              <i className="fa-solid fa-rotate-right"></i> Modificar mis preferencias
            </button>
          </div>

          <section className="legal-block">
            <h3>1. ¿Qué es una cookie?</h3>
            <p>
              Una cookie es un pequeño archivo de texto depositado en su terminal (ordenador, tableta o smartphone) al consultar un sitio web o utilizar una aplicación web. Permite al sitio memorizar sus acciones, sus preferencias de conexión y garantizar la seguridad de su sesión bancaria durante un período determinado.
            </p>
          </section>

          <section className="legal-block">
            <h3>2. Categorías de cookies utilizadas en CBG Banco</h3>

            <div className="cookie-category-block">
              <div className="cat-badge-title">
                <span className="cat-badge required">Indispensables</span>
                <h4>Cookies estrictamente necesarias para el funcionamiento y la seguridad</h4>
              </div>
              <p>
                Estas cookies son indispensables para el funcionamiento de la plataforma en línea. Le permiten navegar de forma segura, autenticarse en su Dashboard, validar operaciones financieras (KYC, transferencias, solicitudes de préstamo) y prevenir ataques de falsificación de peticiones (CSRF). Conforme a las directrices de la CNIL y el RGPD, estos rastreadores no requieren consentimiento previo.
              </p>
            </div>

            <div className="cookie-category-block">
              <div className="cat-badge-title">
                <span className="cat-badge optional">Opcionales</span>
                <h4>Cookies de medición de audiencia y análisis de rendimiento</h4>
              </div>
              <p>
                Estos rastreadores nos permiten medir el volumen de visitas, las páginas más consultadas e identificar eventuales disfunciones técnicas para mejorar continuamente la ergonomía de su espacio bancario. Todas las direcciones IP son anonimizadas antes de todo tratamiento estadístico.
              </p>
            </div>

            <div className="cookie-category-block">
              <div className="cat-badge-title">
                <span className="cat-badge optional">Opcionales</span>
                <h4>Cookies de preferencias y personalización</h4>
              </div>
              <p>
                Estos testigos permiten memorizar su idioma preferido, su divisa de referencia (EUR, CHF, USD) así como sus opciones de visualización de saldo en el Dashboard.
              </p>
            </div>
          </section>

          <section className="legal-block">
            <h3>3. Tabla detallada de las principales cookies</h3>
            <div className="legal-info-table">
              <div className="info-row">
                <span className="info-key">cbg_session</span>
                <span className="info-val">Gestión de la sesión bancaria cifrada (Duración: Sesión)</span>
              </div>
              <div className="info-row">
                <span className="info-key">cbg_cookie_consent</span>
                <span className="info-val">Memorización de sus elecciones de cookies (Duración: 12 meses)</span>
              </div>
              <div className="info-row">
                <span className="info-key">cbg_csrf_token</span>
                <span className="info-val">Seguridad anti-falsificación de formularios (Duración: Sesión)</span>
              </div>
            </div>
          </section>

          <section className="legal-block">
            <h3>4. Cómo gestionar o desactivar las cookies en su navegador</h3>
            <p>
              Puede configurar en cualquier momento su software de navegación para autorizar o rechazar el registro de cookies en su terminal:
            </p>
            <ul>
              <li><strong>Google Chrome:</strong> Configuración > Privacidad y seguridad > Cookies y otros datos de sitios.</li>
              <li><strong>Mozilla Firefox:</strong> Configuración > Privacidad y seguridad > Cookies y datos de sitios.</li>
              <li><strong>Apple Safari:</strong> Preferencias > Privacidad > Bloquear todas las cookies.</li>
              <li><strong>Microsoft Edge:</strong> Configuración > Privacidad, búsqueda y servicios > Cookies.</li>
            </ul>
            <p>
              <em>Atención: El bloqueo total de las cookies esenciales puede volver imposible el acceso a su espacio de cliente seguro.</em>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}