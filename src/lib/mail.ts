// src/lib/mail.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export async function sendOtpEmail(toEmail: string, otpCode: string) {
  await transporter.sendMail({
    from: `"CBGBanque" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "Vérification de votre adresse e-mail - CBGBanque",
    html: `
        <div style="font-family: Arial, sans-serif; background-color: #03050a; color: #ffffff; padding: 2rem; border-radius: 12px;">
          <h2 style="color: #3b82f6;">Bienvenue chez CBGBanque</h2>
          <p>Voici votre code de vérification à 6 chiffres pour continuer votre inscription :</p>
          <div style="background: rgba(59, 130, 246, 0.15); border: 1px solid #3b82f6; font-size: 2rem; font-weight: bold; text-align: center; padding: 1rem; border-radius: 8px; letter-spacing: 5px; color: #60a5fa; margin: 1.5rem 0;">
            ${otpCode}
          </div>
          <p style="color: #94a3b8; font-size: 0.85rem;">Ce code est valable pendant 30 minutes. Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet e-mail.</p>
        </div>
      `,
    text: `Votre code de vérification CBGBanque est ${otpCode}. Il est valable 30 minutes.`,
  });
}

export async function sendApprovalEmail(toEmail: string, firstName: string) {
  const safeFirstName = escapeHtml(firstName);
  const loginUrl = new URL("/login", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");
  if (loginUrl.protocol !== "http:" && loginUrl.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_APP_URL must use HTTP or HTTPS.");
  }
  const safeLoginUrl = escapeHtml(loginUrl.toString());
  await transporter.sendMail({
    from: `"CBGBanque" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "Compte validé ! Bienvenue sur CBGBanque",
    html: `
        <div style="font-family: Arial, sans-serif; background-color: #03050a; color: #ffffff; padding: 2rem; border-radius: 12px;">
          <h2 style="color: #22c55e;">Félicitations ${safeFirstName} !</h2>
          <p>Votre compte CBGBanque a été examiné et validé avec succès par notre équipe de conformité.</p>
          <p>Vous pouvez dès à présent vous connecter à votre espace sécurisé pour gérer vos comptes et votre épargne.</p>
          <div style="text-align: center; margin: 2rem 0;">
            <a href="${safeLoginUrl}" style="background-color: #3b82f6; color: #ffffff; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 8px; font-weight: bold;">Accéder à mon Dashboard</a>
          </div>
          <p style="color: #94a3b8; font-size: 0.85rem;">Merci de faire confiance à CBGBanque.</p>
        </div>
      `,
    text: `Félicitations ${firstName} ! Votre compte CBGBanque a été validé. Connectez-vous sur ${loginUrl.toString()}.`,
  });
}

export async function sendAccountCreditedEmail(
  toEmail: string,
  firstName: string,
  amount: string,
  currency: string,
  description: string
) {
  const safeFirstName = escapeHtml(firstName);
  const safeAmount = escapeHtml(amount);
  const safeCurrency = escapeHtml(currency);
  const safeDescription = escapeHtml(description);
  const loginUrl = new URL("/dashboard", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");
  if (loginUrl.protocol !== "http:" && loginUrl.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_APP_URL must use HTTP or HTTPS.");
  }
  const safeLoginUrl = escapeHtml(loginUrl.toString());
  await transporter.sendMail({
    from: `"CBGBanque" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: `Votre compte a été crédité de ${safeAmount} ${safeCurrency}`,
    html: `
        <div style="font-family: Arial, sans-serif; background-color: #03050a; color: #ffffff; padding: 2rem; border-radius: 12px;">
          <h2 style="color: #10b981;">Bonjour ${safeFirstName},</h2>
          <p>Votre compte CBGBanque vient d'être crédité par notre équipe.</p>
          <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0; text-align: center;">
            <div style="font-size: 2rem; font-weight: bold; color: #6ee7b7;">${safeAmount} ${safeCurrency}</div>
            <div style="color: #94a3b8; font-size: 0.9rem; margin-top: 0.5rem;">Montant crédité</div>
          </div>
          <p><strong>Motif :</strong> ${safeDescription}</p>
          <p>Les fonds sont désormais disponibles sur votre compte.</p>
          <div style="text-align: center; margin: 2rem 0;">
            <a href="${safeLoginUrl}" style="background-color: #3b82f6; color: #ffffff; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 8px; font-weight: bold;">Voir mon compte</a>
          </div>
          <p style="color: #94a3b8; font-size: 0.85rem;">Merci de faire confiance à CBGBanque.</p>
        </div>
      `,
    text: `Bonjour ${firstName}, votre compte a été crédité de ${amount} ${currency}. Motif : ${description}. Consultez votre compte sur ${loginUrl.toString()}.`,
  });
}

export async function sendTransferBlockedEmail(
  toEmail: string,
  firstName: string,
  amount: string,
  currency: string,
  recipientName: string,
  reason: string
) {
  const safeFirstName = escapeHtml(firstName);
  const safeAmount = escapeHtml(amount);
  const safeCurrency = escapeHtml(currency);
  const safeRecipient = escapeHtml(recipientName);
  const safeReason = escapeHtml(reason);
  const loginUrl = new URL("/dashboard", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");
  if (loginUrl.protocol !== "http:" && loginUrl.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_APP_URL must use HTTP or HTTPS.");
  }
  const safeLoginUrl = escapeHtml(loginUrl.toString());
  await transporter.sendMail({
    from: `"CBGBanque" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: `Virement bloqué - ${safeAmount} ${safeCurrency} vers ${safeRecipient}`,
    html: `
        <div style="font-family: Arial, sans-serif; background-color: #03050a; color: #ffffff; padding: 2rem; border-radius: 12px;">
          <h2 style="color: #ef4444;">Bonjour ${safeFirstName},</h2>
          <p>Nous vous informons que votre virement a été bloqué par notre service de sécurité.</p>
          <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <div style="color: #fca5a5; font-weight: bold;">Virement bloqué</div>
            <div style="margin-top: 0.5rem;"><strong>Montant :</strong> ${safeAmount} ${safeCurrency}</div>
            <div><strong>Bénéficiaire :</strong> ${safeRecipient}</div>
            <div><strong>Motif :</strong> ${safeReason}</div>
          </div>
          <p>Pour plus d'informations, veuillez contacter votre conseiller bancaire.</p>
          <div style="text-align: center; margin: 2rem 0;">
            <a href="${safeLoginUrl}" style="background-color: #3b82f6; color: #ffffff; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 8px; font-weight: bold;">Contacter le support</a>
          </div>
          <p style="color: #94a3b8; font-size: 0.85rem;">CBGBanque - Service Sécurité</p>
        </div>
      `,
    text: `Bonjour ${firstName}, votre virement de ${amount} ${currency} vers ${recipientName} a été bloqué. Motif : ${reason}. Contactez le support sur ${loginUrl.toString()}.`,
  });
}

export async function sendAccountBlockedEmail(
  toEmail: string,
  firstName: string,
  reason: string
) {
  const safeFirstName = escapeHtml(firstName);
  const safeReason = escapeHtml(reason);
  const loginUrl = new URL("/login", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");
  if (loginUrl.protocol !== "http:" && loginUrl.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_APP_URL must use HTTP or HTTPS.");
  }
  const safeLoginUrl = escapeHtml(loginUrl.toString());
  await transporter.sendMail({
    from: `"CBGBanque" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "Votre compte CBGBanque a été bloqué",
    html: `
        <div style="font-family: Arial, sans-serif; background-color: #03050a; color: #ffffff; padding: 2rem; border-radius: 12px;">
          <h2 style="color: #ef4444;">Bonjour ${safeFirstName},</h2>
          <p>Nous vous informons que votre compte CBGBanque a été bloqué par notre équipe de sécurité.</p>
          <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <div style="color: #fca5a5; font-weight: bold;">Compte bloqué</div>
            <div style="margin-top: 0.5rem;"><strong>Motif :</strong> ${safeReason}</div>
          </div>
          <p>Vous ne pourrez plus accéder à votre espace client ni effectuer d'opérations tant que le blocage est en vigueur.</p>
          <p>Pour plus d'informations ou pour contester cette décision, veuillez contacter notre service client.</p>
          <div style="text-align: center; margin: 2rem 0;">
            <a href="${safeLoginUrl}" style="background-color: #3b82f6; color: #ffffff; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 8px; font-weight: bold;">Contacter le support</a>
          </div>
          <p style="color: #94a3b8; font-size: 0.85rem;">CBGBanque - Service Sécurité</p>
        </div>
      `,
    text: `Bonjour ${firstName}, votre compte a été bloqué. Motif : ${reason}. Contactez le support sur ${loginUrl.toString()}.`,
  });
}

export async function sendAccountStatusEmail(
  toEmail: string,
  firstName: string,
  status: "approved" | "rejected",
  reason?: string
) {
  const safeFirstName = escapeHtml(firstName);
  const safeReason = reason ? escapeHtml(reason) : "";
  const loginUrl = new URL("/login", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");
  if (loginUrl.protocol !== "http:" && loginUrl.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_APP_URL must use HTTP or HTTPS.");
  }
  const safeLoginUrl = escapeHtml(loginUrl.toString());

  const isApproved = status === "approved";
  await transporter.sendMail({
    from: `"CBGBanque" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: isApproved ? "Votre compte a été approuvé" : "Votre compte a été rejeté",
    html: `
        <div style="font-family: Arial, sans-serif; background-color: #03050a; color: #ffffff; padding: 2rem; border-radius: 12px;">
          <h2 style="color: ${isApproved ? "#22c55e" : "#ef4444"};">
            ${isApproved ? "Félicitations" : "Information importante"} ${safeFirstName}
          </h2>
          <p>Votre compte CBGBanque a été <strong>${isApproved ? "approuvé" : "rejeté"}</strong> par notre équipe.</p>
          ${safeReason ? `
          <div style="background: rgba(59, 130, 246, 0.15); border: 1px solid #3b82f6; border-radius: 8px; padding: 1rem; margin: 1.5rem 0;">
            <strong>Motif :</strong> ${safeReason}
          </div>
          ` : ""}
          ${isApproved ? `
          <p>Vous pouvez dès à présent vous connecter à votre espace sécurisé.</p>
          <div style="text-align: center; margin: 2rem 0;">
            <a href="${safeLoginUrl}" style="background-color: #3b82f6; color: #ffffff; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 8px; font-weight: bold;">Accéder à mon Dashboard</a>
          </div>
          ` : `
          <p>Pour plus d'informations, veuillez contacter notre service client.</p>
          <div style="text-align: center; margin: 2rem 0;">
            <a href="${safeLoginUrl}" style="background-color: #3b82f6; color: #ffffff; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 8px; font-weight: bold;">Contacter le support</a>
          </div>
          `}
          <p style="color: #94a3b8; font-size: 0.85rem;">Merci de faire confiance à CBGBanque.</p>
        </div>
      `,
    text: `${isApproved ? "Félicitations" : "Information"} ${firstName}, votre compte a été ${isApproved ? "approuvé" : "rejeté"}. ${reason ? "Motif : " + reason : ""} ${loginUrl.toString()}.`,
  });
}

export async function sendTransferInitiatedAdminEmail(
  adminEmail: string,
  userFirstName: string,
  userLastName: string,
  userEmail: string,
  amount: string,
  currency: string,
  recipientName: string,
  iban: string
) {
  const safeFirstName = escapeHtml(userFirstName);
  const safeLastName = escapeHtml(userLastName);
  const safeUserEmail = escapeHtml(userEmail);
  const safeAmount = escapeHtml(amount);
  const safeCurrency = escapeHtml(currency);
  const safeRecipient = escapeHtml(recipientName);
  const safeIban = escapeHtml(iban);
  const adminUrl = new URL("/admin", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");
  if (adminUrl.protocol !== "http:" && adminUrl.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_APP_URL must use HTTP or HTTPS.");
  }
  const safeAdminUrl = escapeHtml(adminUrl.toString());

  await transporter.sendMail({
    from: `"CBGBanque" <${process.env.GMAIL_USER}>`,
    to: adminEmail,
    subject: `🔔 Nouveau virement initié - ${safeAmount} ${safeCurrency} vers ${safeRecipient}`,
    html: `
        <div style="font-family: Arial, sans-serif; background-color: #03050a; color: #ffffff; padding: 2rem; border-radius: 12px;">
          <h2 style="color: #f59e0b;">⚠️ Alerte : Nouveau virement initié</h2>
          <p>Un client vient d'initier un virement bancaire. Le code OTP a été généré et est en attente de saisie par le client.</p>
          <div style="background: rgba(245, 158, 11, 0.15); border: 1px solid #f59e0b; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <div style="color: #fbbf24; font-weight: bold;">Détails du virement</div>
            <div style="margin-top: 0.75rem;"><strong>Client :</strong> ${safeFirstName} ${safeLastName} (${safeUserEmail})</div>
            <div><strong>Montant :</strong> ${safeAmount} ${safeCurrency}</div>
            <div><strong>Bénéficiaire :</strong> ${safeRecipient}</div>
            <div><strong>IBAN :</strong> ${safeIban}</div>
            <div style="margin-top: 0.5rem; color: #94a3b8; font-size: 0.85rem;">Le code OTP a été généré. Le virement n'est pas encore exécuté - il attend la saisie du code par le client.</div>
          </div>
          <p>Connectez-vous à l'espace admin pour voir le code OTP et gérer ce virement.</p>
          <div style="text-align: center; margin: 2rem 0;">
            <a href="${safeAdminUrl}" style="background-color: #3b82f6; color: #ffffff; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 8px; font-weight: bold;">Accéder à l'espace Admin</a>
          </div>
          <p style="color: #94a3b8; font-size: 0.85rem;">CBGBanque - Supervision Virements</p>
        </div>
      `,
    text: `ALERTE : Nouveau virement initié par ${userFirstName} ${userLastName} (${userEmail}). Montant : ${amount} ${currency} vers ${recipientName} (IBAN: ${iban}). Le code OTP a été généré. Consultez l'admin sur ${adminUrl.toString()}.`,
  });
}