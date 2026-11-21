"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TransferTrackingModal from "@/components/TransferTrackingModal";

interface Activity {
  id: string;
  type: string;
  relatedId?: string;
  description: string;
  amountCents: number;
  currency: string;
  status: string;
  createdAt: string;
}

interface CardReference {
  id: string;
  name: string;
  reference: string;
  status?: string;
}

interface Vault {
  id: string;
  name: string;
  targetCents: number;
  currentCents: number;
}

interface LoanRequest {
  id: string;
  amount: number;
  durationMonths: number;
  purpose: string;
  status: string;
}

interface DashboardData {
  user: { firstName: string; lastName?: string; currency: string };
  account: { currency: string; balanceCents: number; iban?: string };
  availableBalanceCents: number;
  transactions: Activity[];
  cards: CardReference[];
  vaults: Vault[];
  loans: LoanRequest[];
  unreadNotifications: number;
}

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency }).format(cents / 100);
}

function statusLabel(status: string) {
  if (status === "pending") return "Pendiente";
  if (status === "cancelled") return "Cancelada";
  return "Registrada";
}

export default function DashboardHomePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [trackingTransferId, setTrackingTransferId] = useState<string | null>(null);

  const loadDashboard = () => {
    fetch("/api/dashboard")
      .then(async (response) => {
        const result: DashboardData & { message?: string } = await response.json();
        if (response.ok) {
          setData(result);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    let active = true;
    fetch("/api/dashboard")
      .then(async (response) => {
        const result: DashboardData & { message?: string } = await response.json();
        if (!response.ok) throw new Error(result.message ?? "No se pudo cargar la cuenta.");
        if (active) setData(result);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Error de carga.");
      });
    return () => { active = false; };
  }, []);

  if (error) return <p className="dashboard-home" role="alert">{error}</p>;
  if (!data) return <p className="dashboard-home" aria-live="polite">Cargando…</p>;

  return (
    <div className="dashboard-home-redesign">
      <header className="dashboard-welcome">
        <p>Tu espacio personal</p>
        <h1>Hola, {data.user.firstName}</h1>
      </header>

      <section className="cbg-balance-card">
        <span className="balance-account-type">Cuenta Personal · {data.account.currency}</span>
        <div className="balance-huge-row">
          <p className="balance-huge-value">
            {isBalanceHidden ? "••••••" : formatMoney(data.availableBalanceCents, data.account.currency)}
          </p>
          <button
            type="button"
            onClick={() => setIsBalanceHidden((hidden) => !hidden)}
            className="balance-eye-btn"
            aria-label={isBalanceHidden ? "Mostrar saldo" : "Ocultar saldo"}
          >
            <i className={`fa-regular ${isBalanceHidden ? "fa-eye-slash" : "fa-eye"}`}></i>
          </button>
        </div>

        {/* Clickable IBAN badge leading to official RIB */}
        <div style={{ marginTop: "0.6rem" }}>
          <Link
            href="/ES/dashboard/rib"
            title="Ver mi RIB y datos bancarios"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.85)",
              textDecoration: "none",
              background: "rgba(255,255,255,0.06)",
              padding: "0.4rem 0.9rem",
              borderRadius: "100px",
              border: "1px solid rgba(255,255,255,0.12)",
              transition: "all 0.2s ease",
            }}
          >
            <i className="fa-solid fa-house" style={{ fontSize: "0.75rem", color: "#60a5fa" }}></i>
            <span style={{ fontFamily: "monospace", letterSpacing: "0.5px" }}>{data.account.iban}</span>
            <i className="fa-solid fa-chevron-right" style={{ fontSize: "0.65rem", opacity: 0.6 }}></i>
          </Link>
        </div>
      </section>

      <nav className="cbg-circle-actions-row" aria-label="Acciones de cuenta">
        <Link href="/ES/dashboard/rib" className="circle-action-item">
          <div className="action-circle-bg"><i className="fa-solid fa-plus"></i></div>
          <span>Añadir dinero</span>
        </Link>
        <Link href="/ES/dashboard/envoyer" className="circle-action-item">
          <div className="action-circle-bg"><i className="fa-solid fa-arrow-right-arrow-left"></i></div>
          <span>Transferencia y Retiro</span>
        </Link>
        <Link href="/ES/dashboard/rib" className="circle-action-item">
          <div className="action-circle-bg"><i className="fa-solid fa-building-columns"></i></div>
          <span>Mi RIB</span>
        </Link>
        <Link href="/ES/dashboard/pret" className="circle-action-item">
          <div className="action-circle-bg"><i className="fa-solid fa-hand-holding-dollar"></i></div>
          <span>Solicitar préstamo</span>
        </Link>
      </nav>

      {data.unreadNotifications > 0 && (
        <section className="cbg-transactions-section">
          <Link href="/ES/dashboard/notifications" className="cbg-sublink">
            {data.unreadNotifications} notificación(es) sin leer
          </Link>
        </section>
      )}

      <section className="cbg-transactions-section">
        {data.transactions.length > 0 ? (
          <>
            <div className="section-head-title-row">
              <h2 className="cbg-title-bold">Actividad reciente</h2>
              <Link href="/ES/dashboard/activite" className="cbg-sublink">Historial completo</Link>
            </div>
            <div className="history-list-wrapper">
              {data.transactions.map((transaction) => {
                const isOutgoing = transaction.type === "withdrawal_request" || transaction.type === "vault_deposit";
                const isPendingWithdrawal = transaction.type === "withdrawal_request" && transaction.status === "pending";

                return (
                  <article
                    key={transaction.id}
                    className="history-item-row"
                    onClick={isPendingWithdrawal ? () => setTrackingTransferId(transaction.relatedId || transaction.id) : undefined}
                    style={isPendingWithdrawal ? { cursor: "pointer" } : undefined}
                  >
                    <div className="history-item-texts">
                      <span className="history-item-title">{transaction.description}</span>
                      <span className="history-item-sub">
                        {new Date(transaction.createdAt).toLocaleString("es-ES")} · {statusLabel(transaction.status)}
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.35rem" }}>
                      <span className="history-item-amount">
                        {transaction.amountCents === 0
                          ? "—"
                          : `${isOutgoing ? "−" : "+"}${formatMoney(transaction.amountCents, transaction.currency)}`}
                      </span>

                      {isPendingWithdrawal && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTrackingTransferId(transaction.relatedId || transaction.id);
                          }}
                          style={{
                            background: "linear-gradient(135deg, rgba(234, 179, 8, 0.25), rgba(245, 158, 11, 0.35))",
                            color: "#fbbf24",
                            border: "1px solid rgba(234, 179, 8, 0.6)",
                            borderRadius: "16px",
                            padding: "0.2rem 0.6rem",
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            boxShadow: "0 0 10px rgba(234, 179, 8, 0.25)",
                          }}
                          title="Haz clic para seguir el estado de la transferencia"
                        >
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fbbf24" }}></span>
                          Pendiente
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          <div className="dashboard-empty-state">
            <h2 className="cbg-title-bold">Ninguna actividad por ahora</h2>
            <p>Tus operaciones aparecerán aquí después de su registro.</p>
            <Link href="/ES/dashboard/activite" className="cbg-sublink">Abrir historial</Link>
          </div>
        )}
      </section>

      <section className="cbg-transactions-section">
        {data.cards.length > 0 ? (
          <>
            <div className="section-head-title-row">
              <h2 className="cbg-title-bold">Mi tarjeta bancaria Visa</h2>
              <Link href="/ES/dashboard/carte" className="cbg-sublink">Gestionar mi tarjeta</Link>
            </div>
            {data.cards.map((card) => (
              <Link key={card.id} href="/ES/dashboard/carte" className="discover-tile dashboard-card-reference">
                <div>
                  <strong>{card.name}</strong>
                  <span>{card.status === "frozen" ? "Tarjeta temporalmente bloqueada" : "Tarjeta Visa Débito activa"}</span>
                </div>
                <span style={{ fontSize: "0.85rem", color: "#60a5fa" }}>Gestionar</span>
              </Link>
            ))}
          </>
        ) : (
          <div className="dashboard-empty-state">
            <h2 className="cbg-title-bold">Ninguna tarjeta activa</h2>
            <p>Pide y activa tu tarjeta física Visa para tus pagos y retiros diarios.</p>
            <Link href="/ES/dashboard/carte" className="cbg-sublink">Pedir mi tarjeta Visa</Link>
          </div>
        )}
      </section>

      <section className="cbg-transactions-section">
        {data.loans.length > 0 ? (
          <>
            <div className="section-head-title-row">
              <h2 className="cbg-title-bold">Mis solicitudes de financiación</h2>
              <Link href="/ES/dashboard/pret" className="cbg-sublink">Ver solicitudes</Link>
            </div>
            {data.loans.map((loan) => (
              <article key={loan.id} className="discover-tile dashboard-data-tile">
                <div>
                  <strong>{loan.purpose}</strong>
                  <span>{formatMoney(Math.round(loan.amount * 100), data.user.currency)} · {loan.durationMonths} meses</span>
                </div>
                <span>
                  {loan.status === "approved" ? "Aceptada" : loan.status === "rejected" ? "Rechazada" : "Pendiente"}
                </span>
              </article>
            ))}
          </>
        ) : (
          <div className="dashboard-empty-state">
            <h2 className="cbg-title-bold">Ninguna solicitud de financiación</h2>
            <p>Las solicitudes que registres aparecerán aquí.</p>
            <Link href="/ES/dashboard/pret" className="cbg-sublink">Registrar una solicitud</Link>
          </div>
        )}
      </section>

      <section className="cbg-budgets-section">
        {data.vaults.length > 0 ? (
          <>
            <div className="section-head-title-row">
              <h2 className="cbg-title-bold">Mis cajas de ahorro</h2>
              <Link href="/ES/dashboard/epargne" className="cbg-sublink">Gestionar</Link>
            </div>
            <div className="budget-gauges-grid">
              {data.vaults.map((vault) => {
                const progress = vault.targetCents > 0
                  ? Math.min(100, Math.round(vault.currentCents / vault.targetCents * 100))
                  : 0;
                return (
                  <article key={vault.id} className="gauge-card">
                    <strong className="gauge-name">{vault.name}</strong>
                    <span className="gauge-ratio">
                      {formatMoney(vault.currentCents, data.account.currency)} / {formatMoney(vault.targetCents, data.account.currency)}
                    </span>
                    <span className="gauge-percent">{progress}%</span>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          <div className="dashboard-empty-state">
            <h2 className="cbg-title-bold">Ninguna caja de ahorro</h2>
            <p>Crea una caja con tu objetivo para empezar a seguir tu ahorro.</p>
            <Link href="/ES/dashboard/epargne" className="cbg-sublink">Crear una caja</Link>
          </div>
        )}
      </section>

      {trackingTransferId && (
        <TransferTrackingModal
          transferId={trackingTransferId}
          onClose={() => setTrackingTransferId(null)}
          onSuccessOrHalted={() => loadDashboard()}
        />
      )}
    </div>
  );
}