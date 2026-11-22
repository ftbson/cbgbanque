"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import CookieBanner from "@/components/CookieBanner";

interface SiteFrameProps {
  children: React.ReactNode;
}

function getLocaleFromPath(pathname: string): "fr" | "de" | "es" {
  if (pathname === "/DE" || pathname.startsWith("/DE/")) return "de";
  if (pathname === "/ES" || pathname.startsWith("/ES/")) return "es";
  return "fr";
}

const NavbarFR = dynamic(() => import("@/app/FR/components/Navbar"), { ssr: false });
const NavbarDE = dynamic(() => import("@/app/DE/components/Navbar"), { ssr: false });
const NavbarES = dynamic(() => import("@/app/ES/components/Navbar"), { ssr: false });
const FooterFR = dynamic(() => import("@/app/FR/components/Footer"), { ssr: false });
const FooterDE = dynamic(() => import("@/app/DE/components/Footer"), { ssr: false });
const FooterES = dynamic(() => import("@/app/ES/components/Footer"), { ssr: false });

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

