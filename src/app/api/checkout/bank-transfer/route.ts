import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/schema";
import { productsData } from "@/data/products";
import { getBankTransferSettings } from "@/lib/bank-transfer";

export async function POST(request: Request) {
  try {
    const { customer, items } = await request.json();
    const bankDetails = await getBankTransferSettings();
    if (!bankDetails.enabled || !bankDetails.accountName || !bankDetails.iban) {
      return NextResponse.json(
        { error: "La transferencia bancaria no está disponible en este momento." },
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
    if (!customer?.email || validItems.length === 0)
      return NextResponse.json(
        { error: "Los datos no son válidos." },
        { status: 400 },
      );
    const subtotal = validItems.reduce(
      (sum, item) => sum + item.product!.price * item.quantity,
      0,
    );
    const shippingCost = subtotal > 150 ? 0 : 15;
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
      grandTotal: subtotal + shippingCost,
      status: "pending",
      paymentMethod: "bank_transfer",
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({
      orderId,
      grandTotal: subtotal + shippingCost,
      bankDetails: {
        accountName: bankDetails.accountName,
        iban: bankDetails.iban,
        bic: bankDetails.bic,
      },
    });
  } catch (error) {
    console.error("Error en la transferencia bancaria:", error);
    return NextResponse.json(
      { error: "No se ha podido registrar el pedido." },
      { status: 500 },
    );
  }
}
