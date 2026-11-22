"use client";

import Link from "next/link";
import Hero from "@/app/FR/components/Hero";
import Features from "@/app/FR/components/Features";
import CtaSection from "@/app/FR/components/CtaSection";
import Testimonials from "@/app/FR/components/Testimonials";


export default function Home() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Features / Ã‰cosystÃ¨me de la banque */}
      <Features />

       <CtaSection />
       <Testimonials />



      {/* Bouton de retour en haut de page */}
      <section className="scroll-top-section">
        <button
          onClick={scrollToTop}
          className="scroll-top-btn-fixed"
          aria-label="Retourner en haut de la page"
        >
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      </section>
    </main>
  );
}
