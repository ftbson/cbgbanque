"use client";

import { useEffect, useState } from "react";
import { getMessages } from "@/lib/messages";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export function usePwa() {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const triggerInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setIsInstalled(true);
        deferredPrompt = null;
      }
      return true;
    }
    return false;
  };

  return { canInstall, isInstalled, triggerInstall };
}

export default function PwaInstallModal({
  isOpen,
  onClose,
  locale = "fr",
}: {
  isOpen: boolean;
  onClose: () => void;
  locale?: import("@/lib/messages").Locale;
}) {
  const { triggerInstall } = usePwa();
  const [copied, setCopied] = useState(false);
  const t = getMessages(locale).pwaInstall;

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const installed = await triggerInstall();
    if (installed) onClose();
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pwa-modal-backdrop" onClick={onClose}>
      <div className="pwa-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="pwa-modal-close" onClick={onClose} aria-label={t.close}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        <div className="pwa-modal-icon-container">
          <div className="pwa-app-icon"><span>CBG</span></div>
        </div>
        <h3 className="pwa-modal-title">{t.title}</h3>
        <div className="pwa-instructions-box">
          <div className="pwa-step">
            <span className="pwa-step-num">1</span>
            <div><strong>{t.androidHeading}</strong><p>{t.androidInstructions}</p></div>
          </div>
          <div className="pwa-step">
            <span className="pwa-step-num">2</span>
            <div><strong>{t.iosHeading}</strong><p>{t.iosInstructions}</p></div>
          </div>
        </div>
        <div className="pwa-modal-actions">
          <button onClick={handleInstallClick} className="btn-pwa-primary">
            <i className="fa-solid fa-download"></i> {t.install}
          </button>
          <button onClick={copyUrl} className="btn-pwa-secondary">
            <i className="fa-solid fa-copy"></i> {copied ? t.copied : t.copyLink}
          </button>
        </div>
      </div>
    </div>
  );
}
