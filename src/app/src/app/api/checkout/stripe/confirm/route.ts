import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/schema";
import { getStripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const stripe = getStripe();
    const { sessionId } = await request.json();
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "La sesión de Stripe no es válida." },
        { status: 400 },
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid" || !session.metadata?.orderId) {
      return NextResponse.json({ paid: false });
    }

    await db
      .update(orders)
      .set({ status: "paid", paymentStatus: "paid" })
      .where(eq(orders.id, session.metadata.orderId));

    return NextResponse.json({ paid: true });
  } catch (error) {
    console.error("Error al confirmar el pago con Stripe:", error);
    return NextResponse.json(
      { error: "No se ha podido confirmar el pago." },
      { status: 500 },
    );
  }
}
