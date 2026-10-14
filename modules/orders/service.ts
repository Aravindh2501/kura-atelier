import { timingSafeEqual } from "node:crypto";
import { generateAccessToken, generateOrderId } from "./ids";
import { canTransition, isOrderStatus, STATUS_META } from "./status";
import type { OrderRepository } from "./store/types";
import type { NewOrderInput, Order, OrderPayment, OrderStatus, PublicOrder, Shipment } from "./types";

export type OrderServiceConfig = {
  repo: OrderRepository;
  /** Prefix of generated order numbers, e.g. "KUR". */
  idPrefix: string;
  /** Methods that are paid on delivery (order is confirmed immediately). Default: ["cod"]. */
  offlineMethods?: string[];
};

const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export const toPublicOrder = ({ accessToken: _token, payment, ...rest }: Order): PublicOrder => ({
  ...rest,
  payment: { method: payment.method, status: payment.status, paidAt: payment.paidAt },
});

export function createOrderService({ repo, idPrefix, offlineMethods = ["cod"] }: OrderServiceConfig) {
  const now = () => new Date().toISOString();

  const withEvent = (o: Order, status: OrderStatus, note?: string): Order => ({
    ...o,
    status,
    updatedAt: now(),
    events: [...o.events, { status, at: now(), note }],
  });

  return {
    /** Creates the order. Offline methods (COD) are confirmed straight away. */
    async create(input: NewOrderInput): Promise<Order> {
      const offline = offlineMethods.includes(input.paymentMethod);
      const t = now();
      const status: OrderStatus = offline ? "confirmed" : "pending_payment";
      const order: Order = {
        id: generateOrderId(idPrefix),
        accessToken: generateAccessToken(),
        status,
        currency: input.currency,
        items: input.items,
        totals: input.totals,
        customer: input.customer,
        shippingAddress: input.shippingAddress,
        payment: { method: input.paymentMethod, status: offline ? "cod" : "unpaid" },
        events: [{ status, at: t, note: offline ? "Order placed – pay on delivery." : "Order created." }],
        createdAt: t,
        updatedAt: t,
      };
      await repo.create(order);
      return order;
    },

    get: (id: string) => repo.get(id),

    /** Buyer access: order id + (secret token OR the email used at checkout). */
    async getForBuyer(id: string, proof: { token?: string | null; email?: string | null }): Promise<Order | null> {
      const order = await repo.get(id.trim().toUpperCase());
      if (!order) return null;
      if (proof.token && safeEqual(proof.token, order.accessToken)) return order;
      if (proof.email && safeEqual(proof.email.trim().toLowerCase(), order.customer.email)) return order;
      return null;
    },

    async attachProviderOrder(id: string, providerOrderId: string) {
      return repo.update(id, (o) => ({ ...o, payment: { ...o.payment, providerOrderId }, updatedAt: now() }));
    },

    /** Idempotent: calling it twice (verify route + webhook) is safe. */
    async markPaid(id: string, details: Pick<OrderPayment, "providerPaymentId" | "providerOrderId">) {
      return repo.update(id, (o) => {
        if (o.payment.status === "paid") return o;
        const paid: Order = {
          ...o,
          payment: { ...o.payment, ...details, status: "paid", paidAt: now() },
        };
        return o.status === "pending_payment" ? withEvent(paid, "confirmed", "Payment received.") : paid;
      });
    },

    async markPaymentFailed(id: string, note = "Payment failed.") {
      return repo.update(id, (o) => {
        if (o.payment.status === "paid") return o;
        return { ...o, payment: { ...o.payment, status: "failed" }, updatedAt: now(), events: [...o.events, { status: o.status, at: now(), note }] };
      });
    },

    /** Admin / fulfilment: move the order forward (and optionally attach tracking). */
    async updateStatus(id: string, status: unknown, extra: { note?: string; shipment?: Shipment } = {}) {
      if (!isOrderStatus(status)) throw new Error(`Unknown status "${String(status)}"`);
      const updated = await repo.update(id, (o) => {
        if (o.status !== status && !canTransition(o.status, status)) {
          throw new Error(`Cannot move an order from "${o.status}" to "${status}"`);
        }
        const next = o.status === status ? { ...o, updatedAt: now() } : withEvent(o, status, extra.note ?? STATUS_META[status].label);
        const withShipment = extra.shipment ? { ...next, shipment: { ...next.shipment, ...extra.shipment } } : next;
        // Delivered cash-on-delivery orders are paid.
        return status === "delivered" && withShipment.payment.status === "cod"
          ? { ...withShipment, payment: { ...withShipment.payment, status: "paid" as const, paidAt: now() } }
          : withShipment;
      });
      return updated;
    },
  };
}

export type OrderService = ReturnType<typeof createOrderService>;
