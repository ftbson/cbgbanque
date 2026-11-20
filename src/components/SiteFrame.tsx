"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

type Locale = "fr" | "de" | "es";

interface SiteFrameProps {
  children: React.ReactNode;
}

function getLocaleFromPath(pathname: string): Locale {
  if (pathname.startsWith("/DE")) return "de";
  if (pathname.startsWith("/ES")) return "es";
  return "fr";
}

function getLocaleForDocument(locale: Locale): string {
  return locale;
}

export default function SiteFrame({ children }: SiteFrameProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);

  // Masquer sur les pages d'authentification et sur TOUTES les pages du dashboard
  const isAuthPage = ["/FR/login", "/FR/register", "/FR/admin", "/DE/anmelden", "/DE/konto-eroeffnen", "/DE/admin", "/ES/iniciar-sesion", "/ES/abrir-cuenta", "/ES/admin"].includes(pathname);
  const isDashboardPage = pathname.startsWith("/FR/dashboard") || pathname.startsWith("/DE/dashboard") || pathname.startsWith("/ES/dashboard");

  const hideSiteNavFooter = isAuthPage || isDashboardPage;

  // Update HTML lang attribute on locale change
  useEffect(() => {
    document.documentElement.lang = getLocaleForDocument(locale);
  }, [locale]);

  return (
    <div className="site-frame">
      {!hideSiteNavFooter && <Navbar locale={locale} />}
      <main className="main-content">{children}</main>
      {!hideSiteNavFooter && <Footer locale={locale} />}
      <CookieBanner />
    </div>
  );
}
