import { createHmac, timingSafeEqual } from "node:crypto";
import { toMinorUnits } from "../money";
import type { CreatePaymentInput, PaymentProvider, PaymentSession, VerifyInput, VerifyResult, WebhookEvent } from "../types";

export type RazorpayConfig = {
  keyId?: string;
  keySecret?: string;
  /** Set in Razorpay Dashboard → Webhooks. Needed for parseWebhook. */
  webhookSecret?: string;
  /** Shown in the Razorpay popup. */
  businessName: string;
  themeColor?: string;
  /** Injectable for tests. */
  fetchImpl?: typeof fetch;
};

const hmac = (secret: string, data: string) => createHmac("sha256", secret).update(data).digest("hex");
const same = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export function razorpayProvider(cfg: RazorpayConfig): PaymentProvider {
  const doFetch = cfg.fetchImpl ?? fetch;

  return {
    id: "razorpay",
    label: "Pay online",
    description: "UPI, cards, net banking and wallets via Razorpay.",
    icon: "credit_card",
    mode: "client-sdk",
    isAvailable: () => Boolean(cfg.keyId && cfg.keySecret),

    async create(input: CreatePaymentInput): Promise<PaymentSession> {
      const auth = Buffer.from(`${cfg.keyId}:${cfg.keySecret}`).toString("base64");
      const amount = toMinorUnits(input.amount, input.currency);
      const res = await doFetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency: input.currency.toUpperCase(),
          receipt: input.orderId,
          notes: { orderId: input.orderId },
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { id?: string; error?: { description?: string } };
      if (!res.ok || !data.id) throw new Error(data.error?.description ?? "Razorpay could not create the payment.");

      return {
        provider: "razorpay",
        mode: "client-sdk",
        providerOrderId: data.id,
        clientPayload: {
          key: cfg.keyId,
          order_id: data.id,
          amount,
          currency: input.currency.toUpperCase(),
          name: cfg.businessName,
          description: input.description ?? `Order ${input.orderId}`,
          prefill: { name: input.customer.name, email: input.customer.email, contact: input.customer.phone },
          notes: { orderId: input.orderId },
          theme: { color: cfg.themeColor ?? "#000000" },
        },
      };
    },

    async verify({ payload, expectedProviderOrderId }: VerifyInput): Promise<VerifyResult> {
      const orderId = payload.razorpay_order_id;
      const paymentId = payload.razorpay_payment_id;
      const signature = payload.razorpay_signature;
      if (!orderId || !paymentId || !signature || !cfg.keySecret) return { ok: false, reason: "Missing payment details." };
      // A valid signature for somebody else's (cheaper) order must not unlock this one.
      if (expectedProviderOrderId && expectedProviderOrderId !== orderId) return { ok: false, reason: "Payment does not belong to this order." };
      if (!same(hmac(cfg.keySecret, `${orderId}|${paymentId}`), signature)) return { ok: false, reason: "Payment signature is invalid." };
      return { ok: true, providerPaymentId: paymentId, providerOrderId: orderId };
    },

    parseWebhook(rawBody: string, headers: Headers): WebhookEvent | null {
      const signature = headers.get("x-razorpay-signature");
      if (!cfg.webhookSecret || !signature) return null;
      if (!same(hmac(cfg.webhookSecret, rawBody), signature)) return null;

      const body = JSON.parse(rawBody) as {
        event?: string;
        payload?: { payment?: { entity?: { id?: string; order_id?: string; amount?: number; notes?: { orderId?: string }; error_description?: string } } };
      };
      const p = body.payload?.payment?.entity;
      const orderId = p?.notes?.orderId;
      if (!p || !orderId) return { type: "ignored" };
      if (body.event === "payment.captured" || body.event === "order.paid") {
        return { type: "paid", orderId, providerOrderId: p.order_id, providerPaymentId: p.id, amountMinor: p.amount };
      }
      if (body.event === "payment.failed") return { type: "failed", orderId, reason: p.error_description };
      return { type: "ignored" };
    },
  };
}
