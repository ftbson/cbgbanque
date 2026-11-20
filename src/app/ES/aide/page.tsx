"use client";

import { useState } from "react";
import Link from "next/link";

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

const faqs: FaqItem[] = [
  {
    category: "cuenta",
    q: "¿Cómo abrir una cuenta en CBG Banco?",
    a: "La apertura se realiza completamente en línea en menos de 5 minutos. Complete el formulario, suba el anverso y reverso de su documento de identidad en vigor, y nuestro equipo de cumplimiento validará su expediente en un plazo de 24 horas laborables. Recibirá un correo de confirmación en cuanto su cuenta esté activa.",
  },
  {
    category: "cuenta",
    q: "¿Qué documentos se aceptan para la inscripción?",
    a: "Aceptamos el Documento Nacional de Identidad europeo (anverso y reverso), el Pasaporte internacional en vigor, el Permiso de conducir en formato tarjeta o el Título de residencia europeo.",
  },
  {
    category: "tarjetas",
    q: "¿Cómo pedir o crear una tarjeta bancaria?",
    a: "Desde su Dashboard, acceda a la sección «Mis tarjetas». Puede generar al instante una tarjeta virtual segura para sus compras en línea o solicitar una tarjeta física Visa Classic que se entrega en 5 a 7 días laborables en su domicilio.",
  },
  {
    category: "tarjetas",
    q: "¿Puedo congelar temporalmente mi tarjeta u ocultar mis números?",
    a: "¡Sí! Con un clic desde su espacio Tarjetas, puede mostrar/ocultar el número de 16 dígitos y el código CVV, o bloquear/desbloquear instantáneamente su tarjeta en caso de duda.",
  },
  {
    category: "prestamos",
    q: "¿Cómo funciona la solicitud de préstamo en línea?",
    a: "Vaya a su espacio de cliente, apartado «Solicitud de préstamo». Use el simulador interactivo para elegir el importe y la duración deseados. El tipo de interés, las cuotas mensuales y los gastos de gestión se calculan al instante con total transparencia antes del envío.",
  },
  {
    category: "prestamos",
    q: "¿Cuál es el plazo de respuesta para una solicitud de crédito?",
    a: "Una vez enviada su simulación, el equipo de análisis examina su perfil en 24 a 48 horas. La decisión se notifica directamente en su Dashboard y por correo electrónico.",
  },
  {
    category: "seguridad",
    q: "¿Están protegidos mis fondos y datos personales?",
    a: "Absolutamente. CBG Banco aplica los protocolos de cifrado bancario TLS 1.3 / AES-256 y respeta escrupulosamente el reglamento europeo RGPD. Sus depósitos se benefician de los mecanismos de garantía de depósitos vigentes.",
  },
  {
    category: "app",
    q: "¿Cómo instalar la aplicación CBG en mi teléfono?",
    a: "Nuestra aplicación es una Progressive Web App (PWA). Pulse el botón «Descargar la aplicación» al pie de página o en la parte superior del sitio. En iPhone, use el menú Compartir > «En la pantalla de inicio». En Android y ordenador, simplemente pulse «Instalar».",
  },
];

export default function AidePage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCat = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      faq.q.toLowerCase().includes(search.toLowerCase()) ||
      faq.a.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="legal-page-wrapper">
      <div className="legal-hero-banner">
        <div className="legal-hero-glow" />
        <span className="legal-pill-badge">
          <i className="fa-solid fa-headset"></i> Soporte & FAQ
        </span>
        <h1 className="legal-main-heading">Centro de Ayuda & Asistencia</h1>
        <p className="legal-lead-text">
          Encuentre respuestas claras a sus preguntas o contacte con nuestro equipo de asesores bancarios dedicados.
        </p>

        {/* Search input */}
        <div className="help-search-box">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            placeholder="Buscar una pregunta (ej: préstamo, tarjeta virtual, inscripción...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="help-search-input"
          />
          {search && (
            <button onClick={() => setSearch("")} className="search-clear-btn" aria-label="Borrar">
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
      </div>

      <div className="legal-page-container">
        {/* Category filters */}
        <div className="help-categories-bar">
          {[
            { id: "all", label: "Todas las preguntas", icon: "fa-list" },
            { id: "cuenta", label: "Cuenta & Inscripción", icon: "fa-user" },
            { id: "tarjetas", label: "Tarjetas Visa", icon: "fa-credit-card" },
            { id: "prestamos", label: "Préstamos & Crédito", icon: "fa-hand-holding-dollar" },
            { id: "seguridad", label: "Seguridad & RGPD", icon: "fa-shield-halved" },
            { id: "app", label: "Aplicación & PWA", icon: "fa-mobile-screen" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`help-cat-pill ${activeCategory === cat.id ? "active" : ""}`}
            >
              <i className={`fa-solid ${cat.icon}`}></i> {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="faq-list-card">
          {filteredFaqs.length === 0 ? (
            <div className="faq-empty-state">
              <i className="fa-solid fa-circle-question"></i>
              <p>No se ha encontrado ninguna respuesta para su búsqueda.</p>
              <button onClick={() => { setSearch(""); setActiveCategory("all"); }} className="btn-table-details">
                Restablecer la búsqueda
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className={`faq-accordion-item ${isOpen ? "open" : ""}`}>
                  <button
                    className="faq-question-btn"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <i className={`fa-solid ${isOpen ? "fa-minus" : "fa-plus"} toggle-icon`}></i>
                  </button>
                  {isOpen && (
                    <div className="faq-answer-pane">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Contact Support Blocks */}
        <div className="help-contact-grid">
          <div className="help-contact-card">
            <div className="contact-card-icon blue">
              <i className="fa-solid fa-envelope"></i>
            </div>
            <h4>Por e-mail</h4>
            <p>Nuestro equipo responde a sus mensajes en 24 horas laborables.</p>
            <a href="mailto:serviceclient@cbgbanque.com" className="contact-card-link">
              serviceclient@cbgbanque.com
            </a>
          </div>

          <div className="help-contact-card">
            <div className="contact-card-icon green">
              <i className="fa-solid fa-phone"></i>
            </div>
            <h4>Por teléfono</h4>
            <p>Asesores disponibles de lunes a sábado de 8h a 20h.</p>
            <a href="tel:+33189714200" className="contact-card-link">
              +33 (0) 1 89 71 42 00
            </a>
          </div>

          <div className="help-contact-card">
            <div className="contact-card-icon purple">
              <i className="fa-solid fa-comments"></i>
            </div>
            <h4>Área de Cliente</h4>
            <p>Acceda a su mensajería segura y a sus solicitudes de préstamo.</p>
            <Link href="/ES/dashboard" className="contact-card-link">
              Abrir mi dashboard <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}