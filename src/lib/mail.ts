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