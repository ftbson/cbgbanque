import type { Metadata } from "next";
import "./globals.css";
import "./layout.css";
import SiteFrame from "@/components/SiteFrame";
import { CartProvider } from "@/context/CartContext";
import PwaRegistrar from "@/components/PwaRegistrar";

export const metadata: Metadata = {
  title: "CBGBanque - Votre banque en ligne et services financiers",
  description: "Découvrez les services bancaires en ligne de CBGBanque. Gestion de compte, solutions de paiement et accompagnement sur mesure.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CBGBanque",
  },
};

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <PwaRegistrar />
      <SiteFrame>{children}</SiteFrame>
    </CartProvider>
  );
}

