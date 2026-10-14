import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderDetails } from "@/components/orders/order-details";
import { orders } from "@/lib/commerce";
import { TrackForm } from "@/modules/orders/ui";
import { toPublicOrder } from "@/modules/orders/server";

export const metadata: Metadata = { title: "Archival Tracking", robots: { index: false } };

type SearchParams = Promise<{ id?: string; email?: string }>;

async function TrackContent({ searchParams }: { searchParams: SearchParams }) {
  const { id = "", email = "" } = await searchParams;
  const searched = Boolean(id && email);
  const order = searched ? await orders.getForBuyer(id, { email }) : null;

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="max-w-xl w-full">
        <TrackForm action="/track" defaultId={id} defaultEmail={email} error={searched && !order ? "We couldn't find an order with those details." : undefined} />
      </div>
      {order && (
        <div className="flex flex-col gap-space-md">
          <p className="font-body-md text-body-md text-on-surface-variant">Order <strong className="text-primary">{order.id}</strong></p>
          <OrderDetails order={toPublicOrder(order)} />
        </div>
      )}
    </div>
  );
}

export default function TrackPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="w-full px-margin-mobile lg:px-margin mx-auto py-space-md flex flex-col gap-space-lg">
      <div className="max-w-xl flex flex-col gap-space-sm">
        <span className="font-label-md text-label-md uppercase tracking-widest text-secondary font-bold">Order tracking</span>
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold">Where is my parcel?</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Enter the order number from your confirmation and the email you used at checkout.</p>
      </div>
      <Suspense fallback={<div className="min-h-64" />}>
        <TrackContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}