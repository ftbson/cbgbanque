import type { Metadata } from "next";
import "./globals.css";
import "./layout.css";
import SiteFrame from "@/components/SiteFrame";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "CBGBanque - Votre banque en ligne et services financiers",
  description:
    "Découvrez les services bancaires en ligne de CBGBanque. Gestion de compte, solutions de paiement et accompagnement sur mesure.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <link rel="shortcut icon" href="/img/logo.jpg" type="image/x-icon" />

<link 
href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />

      </head>
<body suppressHydrationWarning={true}>
  <CartProvider>
    <SiteFrame>{children}</SiteFrame>
  </CartProvider>
</body>
    </html>
  );
}