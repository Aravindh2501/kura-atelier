import type { CreatePaymentInput, PaymentMethodInfo, PaymentProvider, PaymentSession, VerifyInput, VerifyResult, WebhookEvent } from "./types";

/** Registry of payment providers. Add / remove providers without touching the rest of the app. */
export function createPaymentService(providers: PaymentProvider[]) {
  const available = () => providers.filter((p) => p.isAvailable());
  const find = (id: string) => available().find((p) => p.id === id);

  return {
    /** Methods the shopper can choose from (safe to send to the browser). */
    listMethods(): PaymentMethodInfo[] {
      return available().map(({ id, label, description, icon, mode }) => ({ id, label, description, icon, mode }));
    },
    has: (id: string) => Boolean(find(id)),
    isOffline: (id: string) => find(id)?.mode === "offline",

    async start(methodId: string, input: CreatePaymentInput): Promise<PaymentSession> {
      const p = find(methodId);
      if (!p) throw new Error(`Payment method "${methodId}" is not available.`);
      return p.create(input);
    },

    async verify(methodId: string, input: VerifyInput): Promise<VerifyResult> {
      const p = find(methodId);
      if (!p) return { ok: false, reason: `Payment method "${methodId}" is not available.` };
      return p.verify(input);
    },

    webhook(methodId: string, rawBody: string, headers: Headers): WebhookEvent | null {
      const p = find(methodId);
      return p?.parseWebhook ? p.parseWebhook(rawBody, headers) : null;
    },
  };
}

export type PaymentService = ReturnType<typeof createPaymentService>;
