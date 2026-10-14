import { money } from "@/lib/utils";
import site from "@/data/site.json";

/** "Add $42 more for complimentary shipping" + progress bar. */
export function ShippingProgress({ subtotal }: { subtotal: number }) {
  const target = site.shipping.freeOver;
  const left = Math.max(0, target - subtotal);
  const pct = Math.min(100, (subtotal / target) * 100);

  return (
    <div className="font-body-sm text-body-sm text-on-surface-variant">
      {left > 0 ? `Add ${money(left)} more for complimentary shipping` : "Complimentary global shipping unlocked"}
      <div className="h-1.5 rounded-full bg-surface-container mt-2 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={target} aria-valuenow={Math.min(subtotal, target)}>
        <div className="h-full bg-secondary transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
