"use client";

import { useEffect, useState } from "react";

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
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { triggerInstall } = usePwa();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const installed = await triggerInstall();
    if (installed) {
      onClose();
    }
  };

  const copyUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="pwa-modal-backdrop" onClick={onClose}>
      <div className="pwa-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="pwa-modal-close" onClick={onClose} aria-label="Fermer">
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="pwa-modal-icon-container">
          <div className="pwa-app-icon">
            <span>CBG</span>
          </div>
        </div>

        <h3 className="pwa-modal-title">Installer l&apos;application CBG</h3>

        <div className="pwa-instructions-box">
          <div className="pwa-step">
            <span className="pwa-step-num">1</span>
            <div>
              <strong>Sur Android ou Ordinateur (Chrome / Edge) :</strong>
              <p>Cliquez ci-dessous sur &quot;Installer maintenant&quot; ou dans la barre d&apos;adresse du navigateur sur l&apos;icône d&apos;installation.</p>
            </div>
          </div>
          <div className="pwa-step">
            <span className="pwa-step-num">2</span>
            <div>
              <strong>Sur iPhone / iPad (Safari) :</strong>
              <p>Appuyez sur le bouton Partager <i className="fa-solid fa-arrow-up-from-bracket"></i> en bas, puis choisissez &quot;Sur l&apos;écran d&apos;accueil&quot; <i className="fa-regular fa-square-plus"></i>.</p>
            </div>
          </div>
        </div>

        <div className="pwa-modal-actions">
          <button onClick={handleInstallClick} className="btn-pwa-primary">
            <i className="fa-solid fa-download"></i> Installer maintenant
          </button>
          <button onClick={copyUrl} className="btn-pwa-secondary">
            <i className="fa-solid fa-copy"></i> {copied ? "Lien copié !" : "Copier le lien web"}
          </button>
        </div>
      </div>
    </div>
  );
}
