"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface DashboardIdentity {
  user: { firstName: string; lastName?: string };
  unreadNotifications: number;
}

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [identity, setIdentity] = useState<DashboardIdentity | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/dashboard")
      .then(async (response) => {
        if (!response.ok) return;
        const data = await response.json();
        setIdentity(data);
      })
      .catch((error: unknown) => console.error("Erreur lors du chargement du compte :", error));
  }, []);

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (!response.ok) {
      console.error("La déconnexion n'a pas abouti.");
      return;
    }
    router.push("/login");
    router.refresh();
  };

  const getInitials = () => {
    if (!identity?.user) return "CB";
    const fn = identity.user.firstName?.[0] || "";
    const ln = identity.user.lastName?.[0] || "";
    return `${fn}${ln}`.toUpperCase() || "CH";
  };

  return (
    <div className="dashboard-layout">
      {/* ================= REPRODUCED TOPBAR (SCREENSHOT 1) ================= */}
      <header className="dashboard-topbar">
        {/* User Avatar Circle (CH) linking to Paramètres */}
        <Link
          href="/dashboard/parametres"
          className="topbar-avatar-round"
          title={`${identity?.user.firstName || ""} ${identity?.user.lastName || ""} - Ouvrir les paramètres`}
          style={{ textDecoration: "none" }}
        >
          {getInitials()}
        </Link>

        {/* Center Search Pill */}
        <div className="topbar-search-pill">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Rechercher"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="topbar-search-input"
          />
        </div>

        {/* Right Action Icons */}
        <div className="topbar-actions">
          <Link
            href="/dashboard/analyse"
            className="topbar-icon-round"
            title="Analyses & Statistiques"
          >
            <i className="fa-solid fa-chart-simple"></i>
          </Link>

          <Link
            href="/dashboard/carte"
            className="topbar-icon-round card-icon-wrap"
            title="Mes Cartes"
          >
            <i className="fa-regular fa-credit-card"></i>
            <span className="card-red-badge-dot"></span>
          </Link>

          <Link
            href="/dashboard/parametres"
            className="topbar-icon-round"
            title="Paramètres du compte"
          >
            <i className="fa-solid fa-gear"></i>
          </Link>

          <button
            type="button"
            className="topbar-icon-round"
            onClick={handleLogout}
            title="Se déconnecter"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </button>
        </div>
      </header>

      <main className="dashboard-main-content">{children}</main>

      {/* ================= REPRODUCED BOTTOM NAVIGATION (SCREENSHOT 1 & 7) ================= */}
      <nav className="dashboard-bottom-nav">
        <Link
          href="/dashboard"
          className={`nav-item-bottom ${pathname === "/dashboard" ? "active" : ""}`}
        >
          <i className="fa-solid fa-house"></i>
          <span>Accueil</span>
        </Link>
        <Link
          href="/dashboard/pret"
          className={`nav-item-bottom ${pathname === "/dashboard/pret" ? "active" : ""}`}
        >
          <i className="fa-solid fa-arrow-trend-up"></i>
          <span>Prêts</span>
        </Link>
        <Link
          href="/dashboard/envoyer"
          className={`nav-item-bottom ${pathname === "/dashboard/envoyer" ? "active" : ""}`}
        >
          <i className="fa-solid fa-arrow-right-arrow-left"></i>
          <span>Virements</span>
        </Link>
        <Link
          href="/dashboard/carte"
          className={`nav-item-bottom ${pathname === "/dashboard/carte" ? "active" : ""}`}
        >
          <i className="fa-regular fa-credit-card"></i>
          <span>Cartes</span>
        </Link>
        <Link
          href="/dashboard/epargne"
          className={`nav-item-bottom ${pathname === "/dashboard/epargne" ? "active" : ""}`}
        >
          <i className="fa-solid fa-bag-shopping"></i>
          <span>Lifestyle</span>
        </Link>
      </nav>
    </div>
  );
}
