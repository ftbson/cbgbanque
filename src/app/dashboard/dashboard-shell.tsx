"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface DashboardIdentity {
  user: { firstName: string };
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

  return (
    <div className="dashboard-layout">
      <header className="dashboard-topbar">
        <div className="topbar-left">
          <div className="user-avatar-badge" aria-label="Compte utilisateur">
            {identity?.user.firstName.slice(0, 2).toUpperCase() ?? "…"}
          </div>
        </div>
        <span>{identity?.user.firstName ?? "Mon compte"}</span>
        <div className="topbar-actions">
          <Link
            href="/dashboard/analyse"
            className="topbar-icon-btn"
            aria-label="Statistiques"
          >
            <i className="fa-solid fa-chart-bar"></i>
          </Link>
          <Link
            href="/dashboard/notifications"
            className="topbar-icon-btn notification-btn"
            aria-label="Notifications"
          >
            <i className="fa-regular fa-bell"></i>
            {Boolean(identity?.unreadNotifications) && <span className="notification-dot"></span>}
          </Link>
          <button type="button" className="topbar-icon-btn" onClick={handleLogout} aria-label="Se déconnecter">
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </header>

      <main className="dashboard-main-content">{children}</main>

      <nav className="dashboard-bottom-nav">
        <Link
          href="/dashboard"
          className={`nav-item-bottom ${pathname === "/dashboard" ? "active" : ""}`}
        >
          <i className="fa-solid fa-house"></i>
          <span>Accueil</span>
        </Link>
        <Link
          href="/dashboard/activite"
          className={`nav-item-bottom ${pathname === "/dashboard/activite" ? "active" : ""}`}
        >
          <i className="fa-solid fa-chart-line"></i>
          <span>Activité</span>
        </Link>
        <Link
          href="/dashboard/envoyer"
          className={`nav-item-bottom ${pathname === "/dashboard/envoyer" ? "active" : ""}`}
        >
          <i className="fa-solid fa-paper-plane"></i>
          <span>Envoyer</span>
        </Link>
        <Link
          href="/dashboard/carte"
          className={`nav-item-bottom ${pathname === "/dashboard/carte" ? "active" : ""}`}
        >
          <i className="fa-regular fa-credit-card"></i>
          <span>Carte</span>
        </Link>
        {/* <Link
          href="/dashboard/epargne"
          className={`nav-item-bottom ${pathname === "/dashboard/epargne" ? "active" : ""}`}
        >
          <i className="fa-solid fa-piggy-bank"></i>
          <span>Épargne</span>
        </Link> */}
      </nav>
    </div>
  );
}