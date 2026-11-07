"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface SiteFrameProps {
  children: React.ReactNode;
}

export default function SiteFrame({ children }: SiteFrameProps) {
  const pathname = usePathname();

  // Masquer sur les pages d'authentification et sur TOUTES les pages du dashboard
  const isAuthPage = ["/login", "/register", "/admin"].includes(pathname);
  const isDashboardPage = pathname.startsWith("/dashboard");

  const hideSiteNavFooter = isAuthPage || isDashboardPage;

  return (
    <div className="site-frame">
      {!hideSiteNavFooter && <Navbar />}
      <main className="main-content">{children}</main>
      {!hideSiteNavFooter && <Footer />}
    </div>
  );
}