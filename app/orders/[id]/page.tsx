import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { OrderDetails } from "@/components/orders/order-details";
import { RetryPayment } from "@/components/orders/retry-payment";
import { orders } from "@/lib/commerce";
import { toPublicOrder } from "@/modules/orders/server";

export const metadata: Metadata = { title: "Your order", robots: { index: false } };
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ t?: string; payment?: string }> };

export default async function OrderPage({ params, searchParams }: Props) {
  const [{ id }, { t, payment }] = await Promise.all([params, searchParams]);
  const order = await orders.getForBuyer(id, { token: t });
  if (!order) notFound(); // wrong id or missing/incorrect secret link

  const unpaid = order.status === "pending_payment";
  const note = unpaid
    ? payment === "cancelled" ? "The payment window was closed. Your order is saved – complete the payment below."
      : payment === "failed" ? "The payment did not go through. You can try again below."
      : "We are waiting for your payment to be confirmed."
    : null;

  return (
    <div className="w-full px-margin-mobile lg:px-margin mx-auto py-space-md flex flex-col gap-space-lg">
      <div className="flex flex-col gap-space-xs">
        <span className="inline-flex items-center gap-2 font-label-md text-label-md uppercase tracking-widest text-secondary font-bold">
          <Icon name={unpaid ? "receipt" : "check_circle"} size={16} />
          {unpaid ? "Order saved" : "Order confirmed"}
        </span>
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold">Thank you, {order.customer.name.split(" ")[0]}.</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Order <strong className="text-primary">{order.id}</strong> placed with {order.customer.email}. Bookmark this page, or use{" "}
          <Link href="/track" className="underline underline-offset-4 text-primary">order tracking</Link> with your order number and email.
        </p>
      </div>

      {unpaid && (
        <div className="bg-surface-container rounded-lg p-space-md flex flex-col gap-space-sm">
          <p className="font-body-md text-body-md text-on-surface">{note}</p>
          {order.payment.method !== "cod" && t && <RetryPayment orderId={order.id} token={t} />}
        </div>
      )}

      <OrderDetails order={toPublicOrder(order)} />

      <Button asChild variant="secondary" className="self-start px-space-lg font-label-md text-label-md uppercase">
        <Link href="/shop/all">Continue browsing</Link>
      </Button>
    </div>
  );
}
