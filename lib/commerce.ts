import "server-only";
import path from "node:path";
import site from "@/data/site.json";
import { getProduct } from "@/lib/api";
import { createFileOrderStore, createOrderService, type OrderService } from "@/modules/orders/server";
import { calculateTotals, itemsSubtotal, round2, type OrderItem, type OrderTotals } from "@/modules/orders";
import { codProvider, createPaymentService, demoProvider, razorpayProvider, type PaymentService } from "@/modules/payments/server";
import type { CustomerInfo, PaymentSession } from "@/modules/payments";
import { shippingRules } from "@/lib/utils";

/**
 * PROJECT GLUE – the only file that knows about THIS store's catalog, env vars and storage.
 * When you reuse modules/orders and modules/payments in another project, copy this file
 * and adjust: priceCart() (catalog lookup) and the config below.
 */

const env = process.env;
const razorpayConfigured = Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET);
const demoEnabled = env.PAYMENTS_DEMO ? env.PAYMENTS_DEMO === "true" : !razorpayConfigured && env.NODE_ENV !== "production";

type Services = { orders: OrderService; payments: PaymentService };

function build(): Services {
  const repo = createFileOrderStore(env.ORDERS_DB_PATH ?? path.join(process.cwd(), ".data", "orders.json"));
  const orders = createOrderService({ repo, idPrefix: site.orders.idPrefix, offlineMethods: ["cod"] });
  const payments = createPaymentService([
    razorpayProvider({
      keyId: env.RAZORPAY_KEY_ID,
      keySecret: env.RAZORPAY_KEY_SECRET,
      webhookSecret: env.RAZORPAY_WEBHOOK_SECRET,
      businessName: site.shortName,
    }),
    codProvider({ enabled: env.COD_ENABLED !== "false" }),
    demoProvider({ enabled: demoEnabled }),
  ]);
  return { orders, payments };
}

// Keep one instance across hot reloads in development.
const g = globalThis as unknown as { __commerce?: Services };
const services = (g.__commerce ??= build());
export const orders = services.orders;
export const payments = services.payments;
export const currency = site.currency.code;

export type CartLineInput = { slug: string; color: string; size: string; qty: number; cut?: string };
export type PricedCart = { ok: true; items: OrderItem[]; totals: OrderTotals } | { ok: false; error: string };

/** Never trust prices from the browser: re-price every line from the catalog. */
export async function priceCart(raw: unknown): Promise<PricedCart> {
  if (!Array.isArray(raw) || raw.length === 0) return { ok: false, error: "Your bag is empty." };
  if (raw.length > 50) return { ok: false, error: "Too many items in the bag." };

  const items: OrderItem[] = [];
  for (const line of raw as CartLineInput[]) {
    const product = await getProduct(String(line?.slug));
    if (!product) return { ok: false, error: "An item in your bag is no longer available." };
    if (!product.colors.some((c) => c.name === line.color)) return { ok: false, error: `${product.name}: choose a valid colour.` };
    if (!product.sizes.includes(line.size)) return { ok: false, error: `${product.name}: choose a valid size.` };
    const qty = Math.floor(Number(line.qty));
    if (!Number.isFinite(qty) || qty < 1 || qty > site.orders.maxQtyPerLine) return { ok: false, error: `${product.name}: quantity must be 1–${site.orders.maxQtyPerLine}.` };

    const options: Record<string, string> = { color: line.color, size: line.size };
    if (line.cut) options.cut = String(line.cut).slice(0, 12);
    items.push({ productId: product.slug, name: product.name, image: product.gallery[0]?.src, unitPrice: round2(product.price), qty, options });
  }
  return { ok: true, items, totals: calculateTotals(itemsSubtotal(items), shippingRules) };
}

/** Creates (or re-creates, for a retry) the gateway session for an existing order. */
export async function startPaymentForOrder(order: { id: string; currency: string; totals: OrderTotals; customer: CustomerInfo; payment: { method: string } }): Promise<PaymentSession> {
  const session = await payments.start(order.payment.method, {
    orderId: order.id,
    amount: order.totals.total,
    currency: order.currency,
    customer: order.customer,
    description: `${site.shortName} order ${order.id}`,
  });
  if (session.providerOrderId) await orders.attachProviderOrder(order.id, session.providerOrderId);
  return session;
}
