import { Check, CheckCircle2, Cog, Hourglass, Package, PackageCheck, Truck, XCircle, type LucideIcon } from "lucide-react";
import { STATUS_META, TRACK_STEPS } from "../status";
import type { OrderStatus, PublicOrder } from "../types";
import { formatDateTime } from "./format";

/**
 * Tracking timeline. Server-component friendly (no hooks).
 * Styling uses the design-token class names of this project's Tailwind theme
 * (primary, secondary, surface-container…) – rename them if your theme differs.
 */
const STEP_ICON: Record<OrderStatus, LucideIcon> = {
  pending_payment: Hourglass,
  confirmed: CheckCircle2,
  processing: Cog,
  shipped: Package,
  out_for_delivery: Truck,
  delivered: PackageCheck,
  cancelled: XCircle,
};

export function OrderTimeline({ order }: { order: PublicOrder }) {
  if (order.status === "cancelled") {
    return (
      <div className="flex items-start gap-3 rounded-lg bg-error-container text-on-error-container p-space-md">
        <XCircle size={22} className="shrink-0 mt-0.5" />
        <div>
          <p className="font-headline-sm text-headline-sm font-semibold">{STATUS_META.cancelled.label}</p>
          <p className="font-body-sm text-body-sm">{order.events.at(-1)?.note ?? STATUS_META.cancelled.description}</p>
        </div>
      </div>
    );
  }

  const current = TRACK_STEPS.indexOf(order.status); // -1 while waiting for payment
  const timeOf = (status: OrderStatus) => [...order.events].reverse().find((e) => e.status === status)?.at;

  return (
    <div className="flex flex-col gap-space-md">
      {order.status === "pending_payment" && (
        <div className="flex items-start gap-3 rounded-lg bg-surface-container text-on-surface p-space-md">
          <Hourglass size={20} className="shrink-0 mt-0.5 text-secondary" />
          <p className="font-body-sm text-body-sm">{STATUS_META.pending_payment.description}</p>
        </div>
      )}

      <ol className="flex flex-col">
        {TRACK_STEPS.map((step, i) => {
          const done = i <= current;
          const active = i === current;
          const Icon = done && !active ? Check : STEP_ICON[step];
          const at = timeOf(step);
          return (
            <li key={step} className="flex gap-space-sm">
              <div className="flex flex-col items-center">
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    done ? "bg-secondary text-on-secondary" : "bg-surface-container-high text-on-surface-variant"
                  } ${active ? "ring-4 ring-secondary/25" : ""}`}
                >
                  <Icon size={18} />
                </span>
                {i < TRACK_STEPS.length - 1 && <span className={`w-0.5 flex-1 min-h-8 ${i < current ? "bg-secondary" : "bg-outline-variant/60"}`} />}
              </div>
              <div className="pb-space-md">
                <p className={`font-headline-sm text-[16px] font-semibold ${done ? "text-primary" : "text-on-surface-variant"}`}>{STATUS_META[step].label}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{at ? formatDateTime(at) : STATUS_META[step].description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
