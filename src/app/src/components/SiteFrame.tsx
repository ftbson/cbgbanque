"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import CookieBanner from "@/components/CookieBanner";

interface SiteFrameProps {
  children: React.ReactNode;
}

function getLocaleFromPath(pathname: string): "fr" | "de" | "es" {
  if (pathname.startsWith("/DE")) return "de";
  if (pathname.startsWith("/ES")) return "es";
  return "fr";
}

function getLocaleForDocument(locale: "fr" | "de" | "es"): string {
  return locale;
}

// Dynamically import locale-specific Navbar and Footer
const NavbarFR = dynamic(() => import("@/app/FR/components/Navbar"), {
  ssr: false,
});
const NavbarDE = dynamic(() => import("@/app/DE/components/Navbar"), {
  ssr: false,
});
const NavbarES = dynamic(() => import("@/app/ES/components/Navbar"), {
  ssr: false,
});

const FooterFR = dynamic(() => import("@/app/FR/components/Footer"), {
  ssr: false,
});
const FooterDE = dynamic(() => import("@/app/DE/components/Footer"), {
  ssr: false,
});
const FooterES = dynamic(() => import("@/app/ES/components/Footer"), {
  ssr: false,
});

function getNavbar(locale: "fr" | "de" | "es") {
  if (locale === "de") return NavbarDE;
  if (locale === "es") return NavbarES;
  return NavbarFR;
}

function getFooter(locale: "fr" | "de" | "es") {
  if (locale === "de") return FooterDE;
  if (locale === "es") return FooterES;
  return FooterFR;
}

export default function SiteFrame({ children }: SiteFrameProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);

  // Masquer sur les pages d'authentification et sur TOUTES les pages du dashboard
  const isAuthPage = [
    "/FR/login",
    "/FR/register",
    "/FR/admin",
    "/DE/login",
    "/DE/register",
    "/DE/admin",
    "/ES/login",
    "/ES/register",
    "/ES/admin",
  ].includes(pathname);
  const isDashboardPage =
    pathname.startsWith("/FR/dashboard") ||
    pathname.startsWith("/DE/dashboard") ||
    pathname.startsWith("/ES/dashboard");

  const hideSiteNavFooter = isAuthPage || isDashboardPage;

  // Update HTML lang attribute on locale change
  useEffect(() => {
    document.documentElement.lang = getLocaleForDocument(locale);
  }, [locale]);

  const Navbar = getNavbar(locale);
  const Footer = getFooter(locale);

  return (
    <div className="site-frame">
      {!hideSiteNavFooter && <Navbar />}
      <main className="main-content">{children}</main>
      {!hideSiteNavFooter && <Footer />}
      <CookieBanner />
    </div>
  );
}
