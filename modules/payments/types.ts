/**
 * Payments module – shared types.
 * No project imports: copy this folder into any e-commerce project.
 */

export type CustomerInfo = { name: string; email: string; phone: string };

export type CreatePaymentInput = {
  orderId: string;
  /** Major units, e.g. 78.5 */
  amount: number;
  currency: string;
  customer: CustomerInfo;
  description?: string;
};

/**
 * - "client-sdk": the browser must open the provider's checkout (Razorpay, Stripe Elements…)
 * - "offline":    nothing to collect now (cash on delivery, bank transfer)
 * - "instant":    no real gateway (demo / test mode) – the browser just calls verify
 */
export type PaymentMode = "client-sdk" | "offline" | "instant";

export type PaymentSession = {
  provider: string;
  mode: PaymentMode;
  providerOrderId?: string;
  /** Everything the browser needs to open the checkout. Contains NO secrets. */
  clientPayload?: Record<string, unknown>;
};

export type VerifyInput = {
  orderId: string;
  /** Values the gateway returned to the browser (signature, payment id…). */
  payload: Record<string, string>;
  /** Provider order id stored on OUR order – the payload must belong to it. */
  expectedProviderOrderId?: string;
};

export type VerifyResult =
  | { ok: true; providerPaymentId?: string; providerOrderId?: string }
  | { ok: false; reason: string };

export type WebhookEvent =
  | { type: "paid"; orderId: string; providerOrderId?: string; providerPaymentId?: string; amountMinor?: number }
  | { type: "failed"; orderId: string; reason?: string }
  | { type: "ignored" };

export interface PaymentProvider {
  id: string;
  /** Shown to the shopper. */
  label: string;
  description: string;
  /** Icon key understood by your UI (e.g. "credit_card", "payments"). */
  icon: string;
  mode: PaymentMode;
  isAvailable(): boolean;
  create(input: CreatePaymentInput): Promise<PaymentSession>;
  verify(input: VerifyInput): Promise<VerifyResult>;
  /** Optional: verify + parse a server-to-server webhook. Return null when the signature is invalid. */
  parseWebhook?(rawBody: string, headers: Headers): WebhookEvent | null;
}

/** What the UI is allowed to know about a method. */
export type PaymentMethodInfo = Pick<PaymentProvider, "id" | "label" | "description" | "icon" | "mode">;
