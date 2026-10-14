import type { Order } from "../types";

/**
 * Storage contract. Implement this for MongoDB / Postgres / your REST API and
 * pass it to createOrderService – nothing else in the module changes.
 */
export interface OrderRepository {
  create(order: Order): Promise<void>;
  get(id: string): Promise<Order | null>;
  /** Read-modify-write that must be atomic. Return null when the order does not exist. */
  update(id: string, mutate: (order: Order) => Order): Promise<Order | null>;
}
