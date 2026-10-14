"use client";
import type { PaymentSession } from "../types";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open(): void; on(event: string, cb: (r: unknown) => void): void };
  }
}

export type PaymentOutcome = { ok: true } | { ok: false; reason: string; dismissed?: boolean };

let razorpayScript: Promise<void> | null = null;
const loadRazorpay = () => {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if (window.Razorpay) return Promise.resolve();
  razorpayScript ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve();
    s.onerror = () => {
      razorpayScript = null;
      reject(new Error("Could not load the payment window. Check your connection."));
    };
    document.body.appendChild(s);
  });
  return razorpayScript;
};

/** Opens the Razorpay popup and resolves with the signed response (or rejects when closed). */
function openRazorpay(payload: Record<string, unknown>): Promise<Record<string, string>> {
  return new Promise((resolve, reject) => {
    const rz = new window.Razorpay!({
      ...payload,
      handler: (response: Record<string, string>) => resolve(response),
      modal: { ondismiss: () => reject(new Error("dismissed")) },
    });
    rz.on("payment.failed", (r) => {
      const err = (r as { error?: { description?: string } }).error;
      reject(new Error(err?.description ?? "Payment failed."));
    });
    rz.open();
  });
}

async function postVerify(verifyUrl: string, body: Record<string, unknown>): Promise<PaymentOutcome> {
  const res = await fetch(verifyUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  return res.ok && data.ok ? { ok: true } : { ok: false, reason: data.error ?? "We could not confirm your payment." };
}

/**
 * Completes the payment for a session returned by your "create order" API:
 *   offline  -> nothing to do
 *   instant  -> straight to verify
 *   razorpay -> open popup, then verify the signed response on the server
 */
export async function runPayment(
  session: PaymentSession,
  ctx: { orderId: string; token: string; verifyUrl: string },
): Promise<PaymentOutcome> {
  const base = { orderId: ctx.orderId, token: ctx.token, method: session.provider };
  try {
    if (session.mode === "offline") return { ok: true };
    if (session.mode === "instant") return await postVerify(ctx.verifyUrl, { ...base, payload: {} });
    if (session.provider === "razorpay") {
      await loadRazorpay();
      const payload = await openRazorpay(session.clientPayload ?? {});
      return await postVerify(ctx.verifyUrl, { ...base, payload });
    }
    return { ok: false, reason: `Unsupported payment provider "${session.provider}".` };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Payment failed.";
    return message === "dismissed" ? { ok: false, reason: "Payment window closed. Your order is saved – you can retry.", dismissed: true } : { ok: false, reason: message };
  }
}
