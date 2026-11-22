import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Seite nicht gefunden | CBGBanque",
  description:
    "Die gesuchte Seite ist nicht verfügbar. Kehren Sie zur Startseite von CBGBanque zurück oder entdecken Sie unser Angebot an Brennholz, Pellets und Kaminöfen.",
};

export default function NotFound() {
  return (
    <main className="legal-page">
      <div className="legal-container">
        <span className="section-subtitle">CBGBanque</span>
        <h1 className="legal-title">Seite nicht gefunden</h1>
        <p className="legal-intro">
          Möglicherweise hat sich die Adresse geändert oder der Inhalt ist nicht
          mehr verfügbar.
        </p>
        <Link href="/" className="about-link-btn">
          Zurück zur Startseite
        </Link>
      </div>
    </main>
  );
}
