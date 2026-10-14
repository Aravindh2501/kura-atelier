import type { OrderItem, OrderTotals } from "./types";

export type PricingRules = {
  /** Orders at or above this subtotal ship free. */
  freeShippingOver: number;
  /** Shipping charged below the threshold. */
  flatShipping: number;
};

export const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export const itemsSubtotal = (items: Pick<OrderItem, "unitPrice" | "qty">[]) =>
  round2(items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0));

export function calculateTotals(subtotal: number, rules: PricingRules): OrderTotals {
  const shipping = subtotal === 0 || subtotal >= rules.freeShippingOver ? 0 : rules.flatShipping;
  return { subtotal: round2(subtotal), shipping, total: round2(subtotal + shipping) };
}
