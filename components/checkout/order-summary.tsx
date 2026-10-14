import type { ReactNode } from "react";
import { Img } from "@/components/ui/img";
import { calculateTotals } from "@/modules/orders";
import { money, shippingRules } from "@/lib/utils";

type Line = { key: string; name: string; image: string; price: number; qty: number; color: string; size: string; cut?: string };

type Props = { items: Line[]; showItems?: boolean; children?: ReactNode };

/** Subtotal / shipping / total card, optionally with the item list. Children = the call-to-action. */
export function OrderSummary({ items, showItems = false, children }: Props) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totals = calculateTotals(subtotal, shippingRules);

  return (
    <div className="bg-surface-container-low rounded-lg p-space-lg flex flex-col gap-space-sm lg:sticky lg:top-32">
      <h2 className="font-headline-md text-headline-md text-primary font-bold">Summary</h2>

      {showItems && (
        <ul className="flex flex-col gap-space-sm pb-space-xs">
          {items.map((i) => (
            <li key={i.key} className="flex items-center gap-space-sm">
              <div className="relative w-14 aspect-[4/5] rounded-lg overflow-hidden bg-surface-container shrink-0">
                <Img src={i.image} alt="" className="w-full h-full object-cover" />
                <span className="absolute -top-0 -right-0 bg-primary text-on-primary font-label-sm text-[10px] min-w-4 h-4 px-1 rounded-bl-lg flex items-center justify-center">{i.qty}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body-sm text-body-sm font-semibold text-primary truncate">{i.name}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase truncate">{[i.color, i.size, i.cut && `Cut ${i.cut}`].filter(Boolean).join(" / ")}</p>
              </div>
              <span className="font-label-md text-label-md font-bold">{money(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-between font-body-md text-body-md"><span>Subtotal</span><span>{money(totals.subtotal)}</span></div>
      <div className="flex justify-between font-body-md text-body-md"><span>Shipping</span><span>{totals.shipping === 0 ? "Complimentary" : money(totals.shipping)}</span></div>
      <div className="flex justify-between font-headline-sm text-headline-sm text-primary pt-space-xs border-t border-outline-variant/40"><span>Total</span><span>{money(totals.total)}</span></div>
      {children}
    </div>
  );
}
