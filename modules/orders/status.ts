import type { OrderStatus } from "./types";

export type StatusMeta = { label: string; description: string };

export const STATUS_META: Record<OrderStatus, StatusMeta> = {
  pending_payment: { label: "Awaiting payment", description: "We are waiting for the payment to be confirmed." },
  confirmed: { label: "Order confirmed", description: "Your order is confirmed and queued for production." },
  processing: { label: "In production", description: "Your pieces are being printed, cured and quality-checked." },
  shipped: { label: "Shipped", description: "Your parcel has left the studio and is with the carrier." },
  out_for_delivery: { label: "Out for delivery", description: "The carrier is delivering your parcel today." },
  delivered: { label: "Delivered", description: "Your parcel has been delivered." },
  cancelled: { label: "Cancelled", description: "This order was cancelled." },
};

/** The happy path, in order. Used by the tracking timeline. */
export const TRACK_STEPS: OrderStatus[] = ["confirmed", "processing", "shipped", "out_for_delivery", "delivered"];

const NEXT: Record<OrderStatus, OrderStatus[]> = {
  pending_payment: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["out_for_delivery", "delivered"],
  out_for_delivery: ["delivered"],
  delivered: [],
  cancelled: [],
};

export const canTransition = (from: OrderStatus, to: OrderStatus) => NEXT[from].includes(to);
export const isOrderStatus = (v: unknown): v is OrderStatus => typeof v === "string" && v in STATUS_META;
