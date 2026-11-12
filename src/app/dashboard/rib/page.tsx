"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface RibData {
  bank: {
    name: string;
    legalName: string;
    address: string;
    capital: string;
    rcs: string;
    acpr: string;
    domiciliation: string;
    bic: string;
  };
  holder: {
    name: string;
    civility: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
  };
  rib: {
    iban: string;
    rawIban: string;
    bic: string;
    codeBanque: string;
    codeGuichet: string;
    numeroCompte: string;
    cleRib: string;
    devise: string;
  };
}

export default function RibPage() {
  const [data, setData] = useState<RibData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"official" | "request">("official");
  const [copied, setCopied] = useState(false);

  // "Demander de l'argent" fields
  const [requestedAmount, setRequestedAmount] = useState("");
  const [requestReason, setRequestReason] = useState("");
  const [sharedToast, setSharedToast] = useState("");

  useEffect(() => {
    fetch("/api/dashboard/rib")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData);
        }
      })
      .catch((err) => console.error("Erreur chargement RIB :", err))
      .finally(() => setLoading(false));
  }, []);

  const copyIban = () => {
    if (!data?.rib.rawIban) return;
    navigator.clipboard.writeText(data.rib.rawIban);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareDetails = () => {
    if (!data) return;
    const text = `Bonjour,\nVoici mes coordonnées bancaires CBG Banque Finance pour le virement${
      requestedAmount ? ` de ${requestedAmount} €` : ""
    }${requestReason ? ` (${requestReason})` : ""} :\n\nTitulaire : ${data.holder.name}\nIBAN : ${
      data.rib.iban
    }\nBIC/SWIFT : ${data.rib.bic}\nBanque : ${data.bank.name}\n\nMerci !`;

    if (navigator.share) {
      navigator.share({
        title: "Mes coordonnées bancaires (RIB)",
        text,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setSharedToast("Coordonnées copiées dans le presse-papier !");
      setTimeout(() => setSharedToast(""), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ maxWidth: "600px", margin: "4rem auto", textAlign: "center", color: "#fff" }}>
        <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: "1.75rem" }}></i>
        <p style={{ marginTop: "1rem" }}>Génération de votre Relevé d&apos;Identité Bancaire…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ maxWidth: "600px", margin: "4rem auto", textAlign: "center", color: "#f87171" }}>
        <p>Impossible de charger votre RIB pour le moment.</p>
        <Link href="/dashboard" style={{ color: "#60a5fa" }}>Retour au tableau de bord</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "1.5rem 1rem 6rem", color: "#fff" }}>
      {/* Top Navigation */}
      <div className="no-print" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <Link
          href="/dashboard"
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            textDecoration: "none",
          }}
        >
          <i className="fa-solid fa-chevron-left"></i>
        </Link>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Relevé d&apos;Identité Bancaire (RIB)</h1>
        <div style={{ width: "38px" }}></div>
      </div>

      {/* Tabs */}
      <div
        className="no-print"
        style={{
          display: "flex",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "100px",
          padding: "4px",
          marginBottom: "1.75rem",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("official")}
          style={{
            flex: 1,
            padding: "0.65rem 1rem",
            borderRadius: "100px",
            border: "none",
            background: activeTab === "official" ? "linear-gradient(135deg, #4361ee, #3a0ca3)" : "transparent",
            color: activeTab === "official" ? "#fff" : "rgba(255,255,255,0.65)",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <i className="fa-solid fa-file-invoice" style={{ marginRight: "0.5rem" }}></i>
          Attestation Officielle
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("request")}
          style={{
            flex: 1,
            padding: "0.65rem 1rem",
            borderRadius: "100px",
            border: "none",
            background: activeTab === "request" ? "linear-gradient(135deg, #4361ee, #3a0ca3)" : "transparent",
            color: activeTab === "request" ? "#fff" : "rgba(255,255,255,0.65)",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <i className="fa-solid fa-hand-holding-dollar" style={{ marginRight: "0.5rem" }}></i>
          Demander de l&apos;argent
        </button>
      </div>

      {/* TAB 1: OFFICIAL RIB DOCUMENT */}
      {activeTab === "official" && (
        <div>
          {/* Action buttons (Print / Copy) */}
          <div className="no-print" style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <button
              type="button"
              onClick={handlePrint}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #4361ee, #3a0ca3)",
                color: "#fff",
                border: "none",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                boxShadow: "0 4px 15px rgba(67, 97, 238, 0.35)",
              }}
            >
              <i className="fa-solid fa-print"></i> Imprimer mon RIB (PDF)
            </button>
            <button
              type="button"
              onClick={copyIban}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.12)",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <i className="fa-solid fa-copy"></i>
              {copied ? "IBAN copié !" : "Copier l'IBAN"}
            </button>
          </div>

          {/* Authentic Banking Document Certificate */}
          <div
            id="official-rib-document"
            style={{
              background: "#ffffff",
              color: "#1e293b",
              borderRadius: "16px",
              padding: "2.5rem 2rem",
              boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
              border: "1px solid #cbd5e1",
              position: "relative",
            }}
          >
            {/* Header: Bank logo & address */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #0f172a", paddingBottom: "1.25rem", marginBottom: "1.75rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800 }}>
                    C
                  </div>
                  <strong style={{ fontSize: "1.3rem", letterSpacing: "1px", color: "#0f172a" }}>CBG BANQUE</strong>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", lineHeight: 1.4 }}>
                  {data.bank.legalName}<br />
                  {data.bank.address}<br />
                  {data.bank.rcs} · {data.bank.acpr}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", color: "#2563eb", display: "block" }}>
                  DOCUMENT OFFICIEL
                </span>
                <strong style={{ fontSize: "1.1rem", color: "#0f172a", display: "block", marginTop: "0.2rem" }}>
                  RELEVÉ D&apos;IDENTITÉ BANCAIRE
                </strong>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  Émis le {new Date().toLocaleDateString("fr-FR")}
                </span>
              </div>
            </div>

            {/* Titulaire Card */}
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1.25rem", marginBottom: "1.75rem" }}>
              <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1px", color: "#64748b", fontWeight: 700, display: "block", marginBottom: "0.4rem" }}>
                TITULAIRE DU COMPTE
              </span>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>
                {data.holder.civility} {data.holder.name}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#475569", marginTop: "0.2rem" }}>
                {data.holder.address}<br />
                {data.holder.postalCode} {data.holder.city}, {data.holder.country}
              </div>
            </div>

            {/* French Standard RIB Table */}
            <div style={{ marginBottom: "1.75rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#334155", display: "block", marginBottom: "0.5rem" }}>
                COORDONNÉES BANCAIRES NATIONALES
              </span>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center", border: "1px solid #cbd5e1" }}>
                <thead>
                  <tr style={{ background: "#f1f5f9", fontSize: "0.75rem", color: "#475569", textTransform: "uppercase" }}>
                    <th style={{ padding: "0.6rem", border: "1px solid #cbd5e1" }}>Code Banque</th>
                    <th style={{ padding: "0.6rem", border: "1px solid #cbd5e1" }}>Code Guichet</th>
                    <th style={{ padding: "0.6rem", border: "1px solid #cbd5e1" }}>N° de Compte</th>
                    <th style={{ padding: "0.6rem", border: "1px solid #cbd5e1" }}>Clé RIB</th>
                    <th style={{ padding: "0.6rem", border: "1px solid #cbd5e1" }}>Domiciliation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", fontFamily: "monospace" }}>
                    <td style={{ padding: "0.75rem", border: "1px solid #cbd5e1" }}>{data.rib.codeBanque}</td>
                    <td style={{ padding: "0.75rem", border: "1px solid #cbd5e1" }}>{data.rib.codeGuichet}</td>
                    <td style={{ padding: "0.75rem", border: "1px solid #cbd5e1" }}>{data.rib.numeroCompte}</td>
                    <td style={{ padding: "0.75rem", border: "1px solid #cbd5e1" }}>{data.rib.cleRib}</td>
                    <td style={{ padding: "0.75rem", border: "1px solid #cbd5e1", fontSize: "0.75rem", fontFamily: "sans-serif" }}>
                      {data.bank.domiciliation}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* International Coordinates (IBAN & BIC) */}
            <div style={{ marginBottom: "1.75rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#334155", display: "block", marginBottom: "0.5rem" }}>
                IDENTIFIANT INTERNATIONAL (IBAN & BIC)
              </span>

              <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "10px", padding: "1rem 1.25rem", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700, display: "block" }}>
                  NUMÉRO IBAN (INTERNATIONAL BANK ACCOUNT NUMBER)
                </span>
                <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", fontFamily: "monospace", letterSpacing: "1.5px", display: "block", marginTop: "0.2rem" }}>
                  {data.rib.iban}
                </span>
              </div>

              <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "10px", padding: "1rem 1.25rem" }}>
                <span style={{ fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700, display: "block" }}>
                  CODE BIC / SWIFT (BANK IDENTIFIER CODE)
                </span>
                <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", fontFamily: "monospace", letterSpacing: "1.5px", display: "block", marginTop: "0.2rem" }}>
                  {data.rib.bic}
                </span>
              </div>
            </div>

            {/* Notice & Bank Seal */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid #e2e8f0", paddingTop: "1.25rem" }}>
              <div style={{ fontSize: "0.7rem", color: "#64748b", maxWidth: "340px", lineHeight: 1.4 }}>
                Le présent Relevé d&apos;Identité Bancaire certifie que les coordonnées mentionnées ci-dessus correspondent bien au compte ouvert auprès de notre établissement. À communiquer pour tout virement ou prélèvement.
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: "90px", height: "45px", border: "2px dashed #94a3b8", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", color: "#64748b", fontWeight: 700 }}>
                  Cachet Établissement
                </div>
                <span style={{ fontSize: "0.65rem", color: "#94a3b8", display: "block", marginTop: "0.3rem" }}>
                  CBG FINANCE OPÉRATIONS
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DEMANDER DE L'ARGENT (Matching Screenshot 5) */}
      {activeTab === "request" && (
        <div
          style={{
            background: "#181d28",
            borderRadius: "20px",
            padding: "1.75rem",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 20px 45px rgba(0,0,0,0.4)",
          }}
        >
          <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "1.25rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 0.3rem" }}>Demander de l&apos;argent</h2>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", margin: 0 }}>
              Partagez vos coordonnées bancaires pour recevoir un virement instantané.
            </p>
          </div>

          {/* Details list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}>BIC / SWIFT</span>
              <strong style={{ fontSize: "0.95rem", fontFamily: "monospace" }}>{data.rib.bic}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}>Banque</span>
              <strong style={{ fontSize: "0.95rem" }}>{data.bank.name}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}>Titulaire</span>
              <strong style={{ fontSize: "0.95rem" }}>{data.holder.name}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}>IBAN</span>
              <strong style={{ fontSize: "0.9rem", fontFamily: "monospace" }}>{data.rib.iban}</strong>
            </div>
          </div>

          {/* Interactive Inputs */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.75)", marginBottom: "0.4rem", fontWeight: 600 }}>
              Montant demandé (optionnel)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={requestedAmount}
              onChange={(e) => setRequestedAmount(e.target.value)}
              placeholder="0,00"
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                fontSize: "1.1rem",
                fontWeight: 700,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.75rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.75)", marginBottom: "0.4rem", fontWeight: 600 }}>
              Motif
            </label>
            <input
              type="text"
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
              placeholder="Remboursement, cadeau, facture..."
              maxLength={80}
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Toast message */}
          {sharedToast && (
            <div style={{ background: "rgba(16, 185, 129, 0.2)", border: "1px solid rgba(16, 185, 129, 0.4)", color: "#6ee7b7", padding: "0.75rem", borderRadius: "10px", marginBottom: "1rem", textAlign: "center", fontSize: "0.85rem" }}>
              <i className="fa-solid fa-circle-check"></i> {sharedToast}
            </div>
          )}

          {/* Action buttons matching screenshot */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <button
              type="button"
              onClick={shareDetails}
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "100px",
                background: "linear-gradient(135deg, #4361ee, #3a0ca3)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(67, 97, 238, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <i className="fa-solid fa-share-nodes"></i> Partager mes coordonnées
            </button>

            <button
              type="button"
              onClick={copyIban}
              style={{
                width: "100%",
                padding: "0.9rem",
                borderRadius: "100px",
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.95rem",
                border: "1px solid rgba(255,255,255,0.12)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <i className="fa-solid fa-copy"></i>
              {copied ? "IBAN copié !" : "Copier l'IBAN"}
            </button>
          </div>
        </div>
      )}

      {/* Print CSS styles */}
      <style jsx global>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          .no-print, header, footer, nav, .dashboard-bottom-nav {
            display: none !important;
          }
          #official-rib-document {
            box-shadow: none !important;
            border: 1px solid #000000 !important;
            padding: 1.5cm !important;
            margin: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
