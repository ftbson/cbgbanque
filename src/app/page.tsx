"use client";

import Link from "next/link";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CtaSection from "@/components/CtaSection";
import Testimonials from "@/components/Testimonials";


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

      {/* 2. Features / Écosystème de la banque */}
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