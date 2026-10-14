import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { orders } from "@/lib/commerce";
import { toPublicOrder } from "@/modules/orders/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** Buyer read access: /api/orders/KUR-XXXX?t=<secret token> */
export async function GET(req: Request, { params }: Ctx) {
  const { id } = await params;
  const order = await orders.getForBuyer(id, { token: new URL(req.url).searchParams.get("t") });
  return order ? NextResponse.json(toPublicOrder(order)) : NextResponse.json({ error: "Order not found." }, { status: 404 });
}

function isAdmin(req: Request): boolean {
  const expected = process.env.ORDERS_ADMIN_TOKEN;
  const given = req.headers.get("x-admin-token") ?? "";
  if (!expected || expected.length < 16) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Fulfilment update (you, a dashboard, or a courier integration):
 *   curl -X PATCH /api/orders/KUR-XXXX -H "x-admin-token: …" -H "Content-Type: application/json" \
 *     -d '{"status":"shipped","note":"Handed to DHL","shipment":{"carrier":"DHL","trackingNumber":"123","estimatedDelivery":"2026-10-20"}}'
 */
export async function PATCH(req: Request, { params }: Ctx) {
  if (!process.env.ORDERS_ADMIN_TOKEN) return NextResponse.json({ error: "Order updates are disabled (set ORDERS_ADMIN_TOKEN)." }, { status: 503 });
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { status?: string; note?: string; shipment?: Record<string, string> };
  try {
    const shipment = body.shipment && {
      carrier: body.shipment.carrier,
      trackingNumber: body.shipment.trackingNumber,
      trackingUrl: body.shipment.trackingUrl,
      estimatedDelivery: body.shipment.estimatedDelivery,
    };
    const updated = await orders.updateStatus(id.toUpperCase(), body.status, { note: body.note, shipment });
    return updated ? NextResponse.json(toPublicOrder(updated)) : NextResponse.json({ error: "Order not found." }, { status: 404 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Update failed." }, { status: 400 });
  }
}
