"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { useTranslation } from "@/lib/i18n";

interface SiteFrameProps {
  children: React.ReactNode;
}

export default function SiteFrame({ children }: SiteFrameProps) {
  const pathname = usePathname();
  const { locale } = useTranslation();

  // Masquer sur les pages d'authentification et sur TOUTES les pages du dashboard
  const isAuthPage = ["/login", "/register", "/admin"].includes(pathname);
  const isDashboardPage = pathname.startsWith("/dashboard");

  const hideSiteNavFooter = isAuthPage || isDashboardPage;

  // Update HTML lang attribute on locale change
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <div className="site-frame">
      {!hideSiteNavFooter && <Navbar />}
      <main className="main-content">{children}</main>
      {!hideSiteNavFooter && <Footer />}
      <CookieBanner />
    </div>
  );
}
