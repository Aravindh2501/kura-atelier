import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { payments } from "@/lib/commerce";
import site from "@/data/site.json";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

// Rendered per request, so payment methods always reflect the runtime env vars.
async function CheckoutContent() {
  await connection();
  return <CheckoutForm methods={payments.listMethods()} countries={site.shipping.countries} />;
}

export default function CheckoutPage() {
  return (
    <div className="w-full px-margin-mobile lg:px-margin mx-auto py-space-md flex flex-col gap-space-lg">
      <div>
        <span className="font-label-md text-label-md uppercase tracking-widest text-secondary font-bold">Secure checkout</span>
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold">Delivery &amp; payment</h1>
      </div>
      <Suspense fallback={<div className="min-h-[400px]" />}>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}