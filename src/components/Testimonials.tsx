"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n";

interface Testimonial {
  id: string;
  quoteKey: string;
  authorKey: string;
  initial: string;
  avatarBg: string;
}

export default function Testimonials() {
  const { t } = useTranslation();

  const testimonialsData: Testimonial[] = [
    {
      id: "1",
      quoteKey: "testimonials.items.1.quote",
      authorKey: "testimonials.items.1.author",
      initial: "É",
      avatarBg: "avatar-blue",
    },
    {
      id: "2",
      quoteKey: "testimonials.items.2.quote",
      authorKey: "testimonials.items.2.author",
      initial: "A",
      avatarBg: "avatar-green",
    },
    {
      id: "3",
      quoteKey: "testimonials.items.3.quote",
      authorKey: "testimonials.items.3.author",
      initial: "S",
      avatarBg: "avatar-purple",
    },
    {
      id: "4",
      quoteKey: "testimonials.items.4.quote",
      authorKey: "testimonials.items.4.author",
      initial: "C",
      avatarBg: "avatar-amber",
    },
    {
      id: "5",
      quoteKey: "testimonials.items.5.quote",
      authorKey: "testimonials.items.5.author",
      initial: "J",
      avatarBg: "avatar-cyan",
    },
    {
      id: "6",
      quoteKey: "testimonials.items.6.quote",
      authorKey: "testimonials.items.6.author",
      initial: "N",
      avatarBg: "avatar-pink",
    },
  ];

  // Duplication des témoignages pour assurer une boucle infinie fluide
  const duplicatedTestimonials = [...testimonialsData, ...testimonialsData];

  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <span className="testimonials-tag">{t("testimonials.tag")}</span>
        <h2 className="testimonials-title">{t("testimonials.title")}</h2>
        <p className="testimonials-subtitle">
          {t("testimonials.subtitle")}
        </p>
      </div>

      {/* Infinite Marquee Slider Container */}
      <div className="marquee-container">
        <div className="marquee-track">
          {duplicatedTestimonials.map((item, index) => (
            <div key={`${item.id}-${index}`} className="testimonial-card">
              <div className="quote-icon">
                <i className="fa-solid fa-quote-left"></i>
              </div>
              <p className="testimonial-quote">"{t(item.quoteKey)}"</p>
              <div className="testimonial-author-box">
                <div className={`author-avatar ${item.avatarBg}`}>
                  {item.initial}
                </div>
                <span className="author-name">{t(item.authorKey)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}