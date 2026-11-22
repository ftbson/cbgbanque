import type { Metadata } from "next";
import "./globals.css";
import "./layout.css";
import SiteFrame from "@/components/SiteFrame";
import { CartProvider } from "@/context/CartContext";
import PwaRegistrar from "@/components/PwaRegistrar";

export const metadata: Metadata = {
  title: "CBGBanco - Su banca en línea y servicios financieros",
  description: "Descubra los servicios bancarios en línea de CBGBanco. Gestión de cuentas, soluciones de pago y acompañamiento a medida.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CBGBanco",
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
