"use client";

import { useEffect, useState } from "react";

interface NotificationItem {
  id: string;
  type: "account" | "card" | "transaction" | "savings";
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const unreadCount = notifications.filter((item) => item.readAt === null).length;

  const loadNotifications = async () => {
    const response = await fetch("/api/dashboard/notifications");
    const data: { notifications?: NotificationItem[]; message?: string } = await response.json();
    if (!response.ok) throw new Error(data.message ?? "Impossible de charger les notifications.");
    setNotifications(data.notifications ?? []);
  };

  useEffect(() => {
    let active = true;
    fetch("/api/dashboard/notifications")
      .then(async (response) => {
        const data: { notifications?: NotificationItem[]; message?: string } = await response.json();
        if (!response.ok) throw new Error(data.message ?? "Impossible de charger les notifications.");
        if (active) setNotifications(data.notifications ?? []);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Erreur de chargement.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const markRead = async (notificationId?: string) => {
    setError("");
    try {
      const response = await fetch("/api/dashboard/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notificationId ? { notificationId } : { markAll: true }),
      });
      const data: { message?: string } = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Impossible de mettre à jour les notifications.");
      await loadNotifications();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Erreur de mise à jour.");
    }
  };

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <div className="notifications-header">
          <div className="notifications-title-group">
            <h1 className="notifications-main-title">Notifications</h1>
            <span className="notifications-count-sub">{unreadCount} non lue(s)</span>
          </div>
          <button
            type="button"
            onClick={() => void markRead()}
            disabled={unreadCount === 0}
            className="btn-icon-action"
            aria-label="Tout marquer comme lu"
          >
            <i className="fa-solid fa-check"></i>
          </button>
        </div>

        {error && <p role="alert">{error}</p>}
        {loading ? <p>Chargement…</p> : notifications.length === 0 ? (
          <div className="history-empty-card">
            <p className="empty-state-text">Aucune notification.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((item) => (
              <article
                key={item.id}
                className={`notification-item-card ${item.readAt === null ? "unread" : ""}`}
              >
                <div className="notif-card-left">
                  <div className={`notif-icon-badge ${item.type}`}>
                    <i className={`fa-solid ${
                      item.type === "card" ? "fa-credit-card"
                        : item.type === "transaction" ? "fa-arrow-right-arrow-left"
                          : item.type === "savings" ? "fa-piggy-bank" : "fa-user-check"
                    }`}></i>
                  </div>
                  <div className="notif-content">
                    <h2 className="notif-title">{item.title}</h2>
                    <p className="notif-message">{item.message}</p>
                    <time className="notif-time" dateTime={item.createdAt}>
                      {new Date(item.createdAt).toLocaleString("fr-FR")}
                    </time>
                    {item.readAt === null && (
                      <button type="button" className="btn-text-modifier" onClick={() => void markRead(item.id)}>
                        Marquer comme lue
                      </button>
                    )}
                  </div>
                </div>
                {item.readAt === null && <span className="unread-dot dot-orange" aria-label="Non lue"></span>}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
