"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Img } from "@/components/ui/img";
import { useCart, type CartItem } from "@/components/cart-provider";
import { cn, money } from "@/lib/utils";

type Props = {
  item: CartItem;
  /** Smaller layout used inside the bag drawer. */
  compact?: boolean;
  /** Called when the product link is clicked (the drawer uses it to close itself). */
  onNavigate?: () => void;
};

export function CartLine({ item, compact = false, onNavigate }: Props) {
  const { setQty, remove } = useCart();
  const variant = [item.color, item.size, item.cut && `Cut ${item.cut}`].filter(Boolean).join(" / ");

  return (
    <div className={cn("flex bg-surface-container-low rounded-lg", compact ? "gap-space-sm p-space-sm" : "gap-space-md p-space-sm")}>
      <Link
        href={`/product/${item.slug}`}
        onClick={onNavigate}
        className={cn("aspect-[4/5] rounded-lg overflow-hidden shrink-0 bg-surface-container", compact ? "w-20" : "w-28")}
      >
        <Img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </Link>

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex justify-between gap-2">
          <Link href={`/product/${item.slug}`} onClick={onNavigate} className="font-headline-sm text-[16px] font-semibold text-primary truncate">
            {item.name}
          </Link>
          <span className="font-label-md text-label-md font-bold shrink-0">{money(item.price * item.qty)}</span>
        </div>
        <span className="font-body-sm text-body-sm text-on-surface-variant">{variant}</span>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-1 bg-surface rounded-full">
            <Button variant="ghost" size="icon" className="w-8 h-8" aria-label={`Decrease quantity of ${item.name}`} onClick={() => setQty(item.key, item.qty - 1)}>
              <Icon name="remove" size={16} />
            </Button>
            <span className="font-label-md text-label-md w-5 text-center" aria-live="polite">{item.qty}</span>
            <Button variant="ghost" size="icon" className="w-8 h-8" aria-label={`Increase quantity of ${item.name}`} onClick={() => setQty(item.key, item.qty + 1)}>
              <Icon name="add" size={16} />
            </Button>
          </div>
          <Button variant="plain" size="none" className="gap-1 font-label-sm text-label-sm uppercase text-on-surface-variant hover:text-primary" onClick={() => remove(item.key)}>
            <Icon name="trash" size={14} />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
