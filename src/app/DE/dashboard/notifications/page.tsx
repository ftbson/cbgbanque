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
    const response = await fetch("/DE/api/dashboard/notifications");
    const data: { notifications?: NotificationItem[]; message?: string } = await response.json();
    if (!response.ok) throw new Error(data.message ?? "Benachrichtigungen konnten nicht geladen werden.");
    setNotifications(data.notifications ?? []);
  };

  useEffect(() => {
    let active = true;
    fetch("/DE/api/dashboard/notifications")
      .then(async (response) => {
        const data: { notifications?: NotificationItem[]; message?: string } = await response.json();
        if (!response.ok) throw new Error(data.message ?? "Benachrichtigungen konnten nicht geladen werden.");
        if (active) setNotifications(data.notifications ?? []);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Ladefehler.");
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
      if (!response.ok) throw new Error(data.message ?? "Benachrichtigungen konnten nicht aktualisiert werden.");
      await loadNotifications();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Aktualisierungsfehler.");
    }
  };

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <div className="notifications-header">
          <div className="notifications-title-group">
            <h1 className="notifications-main-title">Benachrichtigungen</h1>
            <span className="notifications-count-sub">{unreadCount} ungelesen</span>
          </div>
          <button
            type="button"
            onClick={() => void markRead()}
            disabled={unreadCount === 0}
            className="btn-icon-action"
            aria-label="Alle als gelesen markieren"
          >
            <i className="fa-solid fa-check"></i>
          </button>
        </div>

        {error && <p role="alert">{error}</p>}
        {loading ? <p>Wird geladen…</p> : notifications.length === 0 ? (
          <div className="history-empty-card">
            <p className="empty-state-text">Keine Benachrichtigungen.</p>
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
                      {new Date(item.createdAt).toLocaleString("de-DE")}
                    </time>
                    {item.readAt === null && (
                      <button type="button" className="btn-text-modifier" onClick={() => void markRead(item.id)}>
                        Als gelesen markieren
                      </button>
                    )}
                  </div>
                </div>
                {item.readAt === null && <span className="unread-dot dot-orange" aria-label="Ungelesen"></span>}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}