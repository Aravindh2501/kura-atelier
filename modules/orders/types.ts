/**
 * Order module – shared types.
 * No project imports here: this folder can be copied into any e-commerce project.
 */

export type OrderStatus =
  | "pending_payment"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "unpaid" | "paid" | "cod" | "failed" | "refunded";

export type OrderItem = {
  /** Your catalog id / slug. */
  productId: string;
  name: string;
  image?: string;
  /** Price of ONE unit at the time of purchase (major units, e.g. 78.00). */
  unitPrice: number;
  qty: number;
  /** Free-form variant info, e.g. { color: "Bone", size: "M" }. */
  options: Record<string, string>;
};

export type Customer = { name: string; email: string; phone: string };

export type Address = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type OrderTotals = {
  subtotal: number;
  shipping: number;
  total: number;
};

export type OrderPayment = {
  /** Payment method id, e.g. "razorpay", "cod", "demo". */
  method: string;
  status: PaymentStatus;
  providerOrderId?: string;
  providerPaymentId?: string;
  paidAt?: string;
};

export type Shipment = {
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  /** ISO date (YYYY-MM-DD). */
  estimatedDelivery?: string;
};

export type OrderEvent = {
  status: OrderStatus;
  at: string;
  note?: string;
};

export type Order = {
  id: string;
  /** Secret shown only to the buyer (in the confirmation URL). Never expose in lists. */
  accessToken: string;
  status: OrderStatus;
  currency: string;
  items: OrderItem[];
  totals: OrderTotals;
  customer: Customer;
  shippingAddress: Address;
  payment: OrderPayment;
  shipment?: Shipment;
  events: OrderEvent[];
  createdAt: string;
  updatedAt: string;
};

/** What the browser is allowed to see (no token, no provider ids). */
export type PublicOrder = Omit<Order, "accessToken" | "payment"> & {
  payment: Pick<OrderPayment, "method" | "status" | "paidAt">;
};

export type NewOrderInput = {
  currency: string;
  items: OrderItem[];
  totals: OrderTotals;
  customer: Customer;
  shippingAddress: Address;
  paymentMethod: string;
};
