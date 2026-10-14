"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { runPayment } from "@/modules/payments/client/run-payment";
import type { PaymentSession } from "@/modules/payments";

/** Shown while an online order is still unpaid (popup closed, card declined…). */
export function RetryPayment({ orderId, token }: { orderId: string; token: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function retry() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/payments/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, token }) });
      const data = (await res.json().catch(() => ({}))) as { error?: string; session?: PaymentSession };
      if (!res.ok || !data.session) throw new Error(data.error ?? "Could not start the payment.");
      const outcome = await runPayment(data.session, { orderId, token, verifyUrl: "/api/payments/verify" });
      if (!outcome.ok) throw new Error(outcome.reason);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-space-xs">
      <Button onClick={retry} disabled={busy} className="px-space-lg font-label-md text-label-md uppercase tracking-wider gap-2">
        <Icon name={busy ? "loader" : "credit_card"} size={16} className={busy ? "animate-spin" : ""} />
        {busy ? "Opening payment…" : "Complete payment"}
      </Button>
      {error && <p role="alert" className="font-body-sm text-body-sm text-error">{error}</p>}
    </div>
  );
}
