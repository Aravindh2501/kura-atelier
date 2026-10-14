import type { PaymentProvider } from "../types";

export type CodConfig = { enabled?: boolean; label?: string; description?: string };

/** Cash on delivery: nothing to collect online. */
export function codProvider(cfg: CodConfig = {}): PaymentProvider {
  return {
    id: "cod",
    label: cfg.label ?? "Cash on delivery",
    description: cfg.description ?? "Pay when your parcel arrives.",
    icon: "banknote",
    mode: "offline",
    isAvailable: () => cfg.enabled !== false,
    create: async () => ({ provider: "cod", mode: "offline" }),
    verify: async () => ({ ok: false, reason: "Cash on delivery has nothing to verify." }),
  };
}
