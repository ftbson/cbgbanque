import type { Metadata } from "next";
import "./globals.css";
import "./layout.css";
import SiteFrame from "@/components/SiteFrame";
import { CartProvider } from "@/context/CartContext";
import PwaRegistrar from "@/components/PwaRegistrar";

export const metadata: Metadata = {
  title: "CBGBank - Ihre Online-Bank und Finanzdienstleistungen",
  description: "Entdecken Sie die Online-Banking-Services von CBGBank. Kontoverwaltung, Zahlungslösungen und maßgeschneiderte Begleitung.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CBGBank",
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
