"use client";

import { usePathname } from "next/navigation";
import NavbarFR from "@/app/FR/components/Navbar";
import NavbarDE from "@/app/DE/components/Navbar";
import NavbarES from "@/app/ES/components/Navbar";
import FooterFR from "@/app/FR/components/Footer";
import FooterDE from "@/app/DE/components/Footer";
import FooterES from "@/app/ES/components/Footer";
import { useEffect } from "react";
import CookieBanner from "@/components/CookieBanner";

interface SiteFrameProps {
  children: React.ReactNode;
}

function getLocaleFromPath(pathname: string): "fr" | "de" | "es" {
  if (pathname === "/DE" || pathname.startsWith("/DE/")) return "de";
  if (pathname === "/ES" || pathname.startsWith("/ES/")) return "es";
  return "fr";
}

export default function SiteFrame({ children }: SiteFrameProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  const isAuthPage = [
    "/FR/login", "/FR/register", "/FR/admin",
    "/DE/login", "/DE/register", "/DE/admin",
    "/ES/login", "/ES/register", "/ES/admin",
  ].includes(pathname);
  const isDashboardPage =
    pathname.startsWith("/FR/dashboard") ||
    pathname.startsWith("/DE/dashboard") ||
    pathname.startsWith("/ES/dashboard");
  const hideSiteNavFooter = isAuthPage || isDashboardPage;
  const Navbar = locale === "de" ? NavbarDE : locale === "es" ? NavbarES : NavbarFR;
  const Footer = locale === "de" ? FooterDE : locale === "es" ? FooterES : FooterFR;

  return (
    <div className="site-frame">
      {!hideSiteNavFooter && <Navbar />}
      <main className="main-content">{children}</main>
      {!hideSiteNavFooter && <Footer />}
      <CookieBanner locale={locale} />
    </div>
  );
}

