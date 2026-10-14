import { NextResponse } from "next/server";
import { currency, orders, payments, priceCart, startPaymentForOrder } from "@/lib/commerce";
import { parseAddress, parseCustomer } from "@/modules/orders";
import site from "@/data/site.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Validates the bag + details, creates the order, and opens the payment session. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const customer = parseCustomer(body.customer);
  const address = parseAddress(body.address, site.shipping.countries);
  if (!customer.ok || !address.ok) {
    return NextResponse.json({ errors: { ...(customer.ok ? {} : customer.errors), ...(address.ok ? {} : address.errors) } }, { status: 400 });
  }

  const method = String(body.method ?? "");
  if (!payments.has(method)) return NextResponse.json({ error: "Choose a payment method." }, { status: 400 });

  const cart = await priceCart(body.items);
  if (!cart.ok) return NextResponse.json({ error: cart.error }, { status: 400 });

  const order = await orders.create({
    currency,
    items: cart.items,
    totals: cart.totals,
    customer: customer.data,
    shippingAddress: address.data,
    paymentMethod: method,
  });
  const redirect = `/orders/${order.id}?t=${order.accessToken}`;

  if (payments.isOffline(method)) return NextResponse.json({ orderId: order.id, token: order.accessToken, redirect, session: null });

  try {
    const session = await startPaymentForOrder(order);
    return NextResponse.json({ orderId: order.id, token: order.accessToken, redirect, session });
  } catch (e) {
    // Don't leave a dead pending order behind; the shopper keeps their bag and can retry.
    await orders.updateStatus(order.id, "cancelled", { note: "Payment could not be started." }).catch(() => undefined);
    console.error("[checkout] payment start failed", e);
    return NextResponse.json({ error: "We could not start the payment. Please try again." }, { status: 502 });
  }
}
