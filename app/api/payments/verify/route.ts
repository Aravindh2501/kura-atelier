import { NextResponse } from "next/server";
import { orders, payments } from "@/lib/commerce";


/** Browser calls this after the gateway popup succeeds. Signature is checked on the server. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { orderId?: string; token?: string; method?: string; payload?: Record<string, string> };
  const order = body.orderId && body.token ? await orders.getForBuyer(body.orderId, { token: body.token }) : null;
  if (!order) return NextResponse.json({ ok: false, error: "Order not found." }, { status: 404 });
  if (order.payment.status === "paid") return NextResponse.json({ ok: true });
  if (body.method !== order.payment.method) return NextResponse.json({ ok: false, error: "Payment method mismatch." }, { status: 400 });

  const result = await payments.verify(order.payment.method, {
    orderId: order.id,
    payload: body.payload ?? {},
    expectedProviderOrderId: order.payment.providerOrderId,
  });
  if (!result.ok) {
    await orders.markPaymentFailed(order.id, result.reason);
    return NextResponse.json({ ok: false, error: result.reason }, { status: 402 });
  }

  await orders.markPaid(order.id, { providerPaymentId: result.providerPaymentId, providerOrderId: result.providerOrderId });
  return NextResponse.json({ ok: true });
}
