"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, selectClass } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { OrderSummary } from "@/components/checkout/order-summary";
import { useCart } from "@/components/cart-provider";
import { runPayment } from "@/modules/payments/client/run-payment";
import type { PaymentMethodInfo, PaymentSession } from "@/modules/payments";
import { cn } from "@/lib/utils";

type Props = { methods: PaymentMethodInfo[]; countries: string[] };
type Errors = Record<string, string>;
type CheckoutResponse = { error?: string; errors?: Errors; orderId?: string; token?: string; redirect?: string; session?: PaymentSession | null };

export function CheckoutForm({ methods, countries }: Props) {
  const router = useRouter();
  const { items, clear, hydrated } = useCart();
  const [method, setMethod] = useState(methods[0]?.id ?? "");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!hydrated) return null;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-space-sm">
        <p className="font-body-md text-body-md text-on-surface-variant">Your bag is empty.</p>
        <Button asChild className="px-space-lg font-label-md text-label-md uppercase">
          <Link href="/shop/all">Browse the catalog</Link>
        </Button>
      </div>
    );
  }

  if (methods.length === 0) {
    return <p role="alert" className="font-body-md text-body-md text-error">No payment method is configured. Set the payment keys in your environment (see .env.example).</p>;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setErrors({});
    setFormError("");

    const f = new FormData(e.currentTarget);
    const text = (name: string) => String(f.get(name) ?? "");
    const body = {
      items: items.map((i) => ({ slug: i.slug, color: i.color, size: i.size, qty: i.qty, cut: i.cut })),
      customer: { name: text("name"), email: text("email"), phone: text("phone") },
      address: { line1: text("line1"), line2: text("line2"), city: text("city"), state: text("state"), postalCode: text("postalCode"), country: text("country") },
      method,
    };

    try {
      const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = (await res.json().catch(() => ({}))) as CheckoutResponse;

      if (!res.ok || !data.orderId || !data.token || !data.redirect) {
        setErrors(data.errors ?? {});
        setFormError(data.error ?? (data.errors ? "Please check the highlighted fields." : "Something went wrong. Please try again."));
        setBusy(false);
        return;
      }

      // The order exists now. Collect the payment, then show the order page either way.
      let suffix = "";
      if (data.session) {
        const outcome = await runPayment(data.session, { orderId: data.orderId, token: data.token, verifyUrl: "/api/payments/verify" });
        if (!outcome.ok) suffix = `&payment=${outcome.dismissed ? "cancelled" : "failed"}`;
      }
      clear();
      router.push(`${data.redirect}${suffix}`);
    } catch {
      setFormError("Network problem. Please check your connection and try again.");
      setBusy(false);
    }
  }

  const section = "bg-surface-container-low rounded-lg p-space-lg shadow-sm flex flex-col gap-space-sm";
  const heading = "font-headline-sm text-headline-sm text-primary font-semibold";

  return (
    <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
      <div className="lg:col-span-8 flex flex-col gap-space-md">
        <section className={section}>
          <h2 className={heading}>Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
            <Field label="Full name" name="name" autoComplete="name" error={errors.name} className="md:col-span-2" />
            <Field label="Email" name="email" type="email" autoComplete="email" error={errors.email} />
            <Field label="Phone" name="phone" type="tel" autoComplete="tel" error={errors.phone} />
          </div>
        </section>

        <section className={section}>
          <h2 className={heading}>Shipping address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
            <Field label="Address line 1" name="line1" autoComplete="address-line1" error={errors.line1} className="md:col-span-2" />
            <Field label="Address line 2 (optional)" name="line2" autoComplete="address-line2" className="md:col-span-2" />
            <Field label="City" name="city" autoComplete="address-level2" error={errors.city} />
            <Field label="State / region" name="state" autoComplete="address-level1" error={errors.state} />
            <Field label="Postal code" name="postalCode" autoComplete="postal-code" error={errors.postalCode} />
            <Field label="Country" name="country" error={errors.country}>
              <div className="relative">
                <select name="country" defaultValue={countries[0]} autoComplete="country-name" className={selectClass}>
                  {countries.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <Icon name="expand_more" size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
              </div>
            </Field>
          </div>
        </section>

        <section className={section}>
          <h2 className={heading}>Payment</h2>
          <div className="flex flex-col gap-space-xs" role="radiogroup" aria-label="Payment method">
            {methods.map((m) => (
              <label
                key={m.id}
                className={cn(
                  "flex items-center gap-space-sm rounded-xl p-space-sm cursor-pointer transition-colors ring-2",
                  method === m.id ? "bg-surface ring-primary" : "bg-surface ring-transparent hover:bg-surface-container-high",
                )}
              >
                <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} className="sr-only" />
                <span className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                  <Icon name={m.icon} size={18} />
                </span>
                <span className="flex-1">
                  <span className="block font-label-lg text-label-lg text-primary">{m.label}</span>
                  <span className="block font-body-sm text-body-sm text-on-surface-variant">{m.description}</span>
                </span>
                {method === m.id && <Icon name="check_circle" size={20} className="text-secondary" />}
              </label>
            ))}
          </div>
        </section>
      </div>

      <div className="lg:col-span-4">
        <OrderSummary items={items} showItems>
          {formError && <p role="alert" className="font-body-sm text-body-sm text-error">{formError}</p>}
          <Button type="submit" disabled={busy} className="h-auto py-space-md font-label-md text-label-md uppercase tracking-wider font-bold shadow-md gap-2">
            <Icon name={busy ? "loader" : "lock"} size={16} className={busy ? "animate-spin" : ""} />
            {busy ? "Processing…" : method === "cod" ? "Place order" : "Pay & place order"}
          </Button>
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center">Prices are re-checked on our server when you place the order.</p>
        </OrderSummary>
      </div>
    </form>
  );
}
