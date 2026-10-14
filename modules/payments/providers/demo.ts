import type { PaymentProvider } from "../types";

export type DemoConfig = { enabled: boolean };

/**
 * Test-mode gateway so the full checkout + tracking flow works without any keys.
 * Keep `enabled` false in production.
 */
export function demoProvider({ enabled }: DemoConfig): PaymentProvider {
  return {
    id: "demo",
    label: "Test payment (demo)",
    description: "Simulated payment – no money moves. For development only.",
    icon: "flask",
    mode: "instant",
    isAvailable: () => enabled,
    create: async () => ({ provider: "demo", mode: "instant", providerOrderId: `demo_${Date.now()}` }),
    verify: async () => ({ ok: true, providerPaymentId: `demo_pay_${Date.now()}` }),
  };
}
