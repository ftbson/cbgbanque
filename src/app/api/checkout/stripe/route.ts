import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/schema";
import { productsData } from "@/data/products";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const stripe = getStripe();
    const body = await request.json();
    const { customer, items } = body;
    const validItems = Array.isArray(items)
      ? (items
          .map((item) => {
            const product = productsData.find(
              (candidate) => candidate.id === item.id,
            );
            if (
              !product ||
              !Number.isInteger(item.quantity) ||
              item.quantity < 1
            )
              return null;
            return { product, quantity: item.quantity };
          })
          .filter(Boolean) as {
          product: (typeof productsData)[number];
          quantity: number;
        }[])
      : [];

    if (!customer?.email || validItems.length === 0) {
      return NextResponse.json(
        { error: "Los datos del pedido no son válidos." },
        { status: 400 },
      );
    }

    const subtotal = validItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    const shippingCost = subtotal > 150 ? 0 : 15;
    const grandTotal = subtotal + shippingCost;
    const orderId = `ORD-${Date.now()}`;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customer.email,
      success_url: `${new URL(request.url).origin}/panier?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${new URL(request.url).origin}/panier?payment=cancelled`,
      metadata: { orderId },
      line_items: validItems.map(({ product, quantity }) => ({
        quantity,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(product.price * 100),
          product_data: {
            name: product.title,
            images: [`${new URL(request.url).origin}${product.image}`],
          },
        },
      })),
      shipping_options:
        shippingCost > 0
          ? [
              {
                shipping_rate_data: {
                  type: "fixed_amount",
                  fixed_amount: { amount: 1500, currency: "eur" },
                  display_name: "Envío",
                },
              },
            ]
          : undefined,
    });

    if (!session.url) {
      throw new Error("Stripe no ha devuelto una URL de pago.");
    }

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
      paymentMethod: "stripe",
      paymentStatus: "pending",
      stripeSessionId: session.id,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error de Stripe:", error);
    return NextResponse.json(
      { error: "No se ha podido iniciar el pago con Stripe." },
      { status: 500 },
    );
  }
}
