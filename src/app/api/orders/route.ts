// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/schema";
import { cookies } from "next/headers";

// POST: Eine neue Bestellung speichern
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, subtotal, shippingCost, grandTotal } = body;

    // Generierung einer eindeutigen Bestell-ID (z. B. ORD-1725450000000)
    const orderId = `ORD-${Date.now()}`;

    await db.insert(orders).values({
      id: orderId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      country: customer.country, // Sera enregistré ou mis à jour côté client pour Deutschland
      streetAddress: customer.streetAddress,
      whatsapp: customer.whatsapp,
      email: customer.email,
      subtotal: parseFloat(subtotal),
      shippingCost: parseFloat(shippingCost),
      grandTotal: parseFloat(grandTotal),
      status: "pending",
      paymentMethod: "bank_transfer",
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error("Fehler beim Erstellen der Bestellung:", error);
    return NextResponse.json(
      { error: "Fehler beim Erstellen der Bestellung" },
      { status: 500 },
    );
  }
}

// GET: Alle Bestellungen für die Admin-Seite abrufen
export async function GET() {
  try {
    const token = (await cookies()).get("admin_token")?.value;
    if (token !== "authenticated_admin_holz_session") {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }
    const allOrders = await db.select().from(orders);
    return NextResponse.json(allOrders);
  } catch (error) {
    console.error("Fehler beim Laden der Bestellungen:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Bestellungen" },
      { status: 500 },
    );
  }
}