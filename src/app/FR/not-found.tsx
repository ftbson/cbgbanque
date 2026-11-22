import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Seite nicht gefunden | CBGBanque",
  description:
    "Die gesuchte Seite ist nicht verfÃ¼gbar. Kehren Sie zur Startseite von CBGBanque zurÃ¼ck oder entdecken Sie unser Angebot an Brennholz, Pellets und KaminÃ¶fen.",
};

export default function NotFound() {
  return (
    <main className="legal-page">
      <div className="legal-container">
        <span className="section-subtitle">CBGBanque</span>
        <h1 className="legal-title">Seite nicht gefunden</h1>
        <p className="legal-intro">
          MÃ¶glicherweise hat sich die Adresse geÃ¤ndert oder der Inhalt ist nicht
          mehr verfÃ¼gbar.
        </p>
        <Link href="/" className="about-link-btn">
          ZurÃ¼ck zur Startseite
        </Link>
      </div>
    </main>
  );
}

