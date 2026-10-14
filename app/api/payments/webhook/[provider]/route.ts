import { NextResponse } from "next/server";
import { orders, payments } from "@/lib/commerce";
import { toMinorUnits } from "@/modules/payments/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Server-to-server confirmation (Razorpay Dashboard → Webhooks → https://YOUR-DOMAIN/api/payments/webhook/razorpay).
 * Marks the order paid even if the shopper closed the tab right after paying.
 */
export async function POST(req: Request, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const raw = await req.text(); // the signature is computed over the exact raw body
  const event = payments.webhook(provider, raw, req.headers);
  if (!event) return NextResponse.json({ error: "Invalid signature." }, { status: 400 });

  if (event.type === "paid") {
    const order = await orders.get(event.orderId);
    if (order && (event.amountMinor === undefined || event.amountMinor === toMinorUnits(order.totals.total, order.currency))) {
      await orders.markPaid(order.id, { providerPaymentId: event.providerPaymentId, providerOrderId: event.providerOrderId });
    } else {
      console.warn("[webhook] ignored paid event: unknown order or amount mismatch", event.orderId);
    }
  } else if (event.type === "failed") {
    await orders.markPaymentFailed(event.orderId, event.reason ?? "Payment failed.");
  }
  return NextResponse.json({ ok: true });
}
