import { NextResponse } from "next/server";
import { orders, startPaymentForOrder } from "@/lib/commerce";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Re-opens the payment for an unpaid order (popup closed, card declined…). */
export async function POST(req: Request) {
  const { orderId, token } = (await req.json().catch(() => ({}))) as { orderId?: string; token?: string };
  const order = orderId && token ? await orders.getForBuyer(orderId, { token }) : null;
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  if (order.payment.status === "paid" || order.status !== "pending_payment") return NextResponse.json({ error: "This order does not need a payment." }, { status: 409 });

  try {
    return NextResponse.json({ session: await startPaymentForOrder(order) });
  } catch (e) {
    console.error("[payments/start] failed", e);
    return NextResponse.json({ error: "We could not start the payment. Please try again." }, { status: 502 });
  }
}
