import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";

export const metadata: Metadata = { title: "Order", robots: { index: false } };

// TEMPLATE: sample order data. Replace with a real database lookup when one is connected.
const SAMPLE_ORDER = {
  status: "Confirmed",
  placedOn: "12 Oct 2026",
  items: [
    { name: "Sample Graphic Tee", size: "M", color: "Bone / Ecru", qty: 1, price: 2499 },
    { name: "Sample Archive Tee", size: "L", color: "Carbon Washed Black", qty: 2, price: 2799 },
  ],
  shipping: 0,
};

// params is read inside <Suspense>, as Cache Components requires.
async function OrderContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const subtotal = SAMPLE_ORDER.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const total = subtotal + SAMPLE_ORDER.shipping;
  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

  return (
    <div className="flex flex-col gap-space-md">
      <div className="flex flex-col gap-1">
        <span className="font-label-md text-label-md uppercase tracking-widest text-secondary font-bold">
          {SAMPLE_ORDER.status} · {SAMPLE_ORDER.placedOn}
        </span>
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold">Order {id}</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Sample order shown for template purposes. Real order data will appear here once a database is connected.
        </p>
      </div>

      <ul className="flex flex-col gap-space-sm">
        {SAMPLE_ORDER.items.map((i) => (
          <li key={i.name} className="flex items-center justify-between bg-surface-container-low rounded-2xl p-space-sm">
            <div className="flex flex-col">
              <span className="font-label-md text-label-md uppercase text-primary font-bold">{i.name}</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {i.color} · {i.size} · Qty {i.qty}
              </span>
            </div>
            <span className="font-label-md text-label-md text-primary font-bold">{fmt(i.price * i.qty)}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t border-outline-variant/40 pt-space-sm">
        <span className="font-label-md text-label-md uppercase text-on-surface-variant">Total</span>
        <span className="font-headline-sm text-headline-sm text-primary font-bold">{fmt(total)}</span>
      </div>

      <Link href="/shop/all" className="font-label-md text-label-md uppercase underline underline-offset-4 text-primary">
        Continue shopping
      </Link>
    </div>
  );
}

export default function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="w-full px-margin-mobile lg:px-margin mx-auto py-space-md">
      <Suspense fallback={<div className="min-h-[400px]" />}>
        <OrderContent params={params} />
      </Suspense>
    </div>
  );
}
