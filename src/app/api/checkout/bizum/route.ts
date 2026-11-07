import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, bizumSettings } from "@/lib/schema";
import { productsData } from "@/data/products";

export async function POST(request: Request) {
  try {
    const { customer, items } = await request.json();
    const [settings] = await db.select().from(bizumSettings).limit(1);

    if (
      !settings?.enabled ||
      !settings.recipientName ||
      !settings.phoneNumber
    ) {
      return NextResponse.json(
        { error: "El pago mediante Bizum no está disponible en este momento." },
        { status: 503 },
      );
    }

    const validItems = Array.isArray(items)
      ? items
          .map((item) => ({
            product: productsData.find((candidate) => candidate.id === item.id),
            quantity: item.quantity,
          }))
          .filter(
            (item) =>
              item.product &&
              Number.isInteger(item.quantity) &&
              item.quantity > 0,
          )
      : [];

    if (!customer?.email || validItems.length === 0) {
      return NextResponse.json(
        { error: "Los datos del pedido no son válidos." },
        { status: 400 },
      );
    }

    const subtotal = validItems.reduce(
      (sum, item) => sum + item.product!.price * item.quantity,
      0,
    );
    const shippingCost = subtotal > 150 ? 0 : 15;
    const grandTotal = subtotal + shippingCost;
    const orderId = `ORD-${Date.now()}`;

    await db.insert(orders).values({
      id: orderId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      country: customer.country,
      streetAddress: customer.streetAddress,
      whatsapp: customer.whatsapp,
      email: customer.email,
      subtotal,
      shippingCost,
      grandTotal,
      status: "pending",
      paymentMethod: "bizum",
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      orderId,
      grandTotal,
      bizumDetails: {
        recipientName: settings.recipientName,
        phoneNumber: settings.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Error al registrar el pedido de Bizum:", error);
    return NextResponse.json(
      { error: "No se ha podido registrar el pedido." },
      { status: 500 },
    );
  }
}
