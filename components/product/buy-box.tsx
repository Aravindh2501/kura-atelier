"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useCart } from "@/components/cart-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { cn, money } from "@/lib/utils";
import site from "@/data/site.json";
import type { Product } from "@/lib/types";

type Props = {
  product: Product;
  color: string;
  size: string;
  onColor: (color: string) => void;
  onSize: (size: string) => void;
  onOpenGuide: () => void;
};

const label = "text-on-surface-variant uppercase tracking-wider font-semibold";

export function BuyBox({ product: p, color, size, onColor, onSize, onOpenGuide }: Props) {
  const { add, setOpen, items } = useCart();
  const wishlist = useWishlist();
  const [added, setAdded] = useState(false);
  const wished = wishlist.has(p.slug);
  const inBag = items.find((i) => i.key === `${p.slug}|${color}|${size}|`)?.qty ?? 0;

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2200);
    return () => clearTimeout(t);
  }, [added]);

  function addToBag() {
    add({ slug: p.slug, name: p.name, price: p.price, image: p.gallery[0].src, color, size });
    setAdded(true);
    setOpen(true);
  }

  return (
    <div className="bg-surface-container-low rounded-lg p-space-lg shadow-sm flex flex-col gap-space-md">
      <div className="flex items-center gap-2">
        <span className="bg-surface-container-high text-on-surface font-label-sm text-label-sm uppercase px-space-sm py-0.5 rounded-full font-medium">{p.subtitle}</span>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight leading-tight">{p.name}</h1>
        <div className="flex flex-wrap items-baseline gap-space-sm mt-0.5">
          <span className="font-headline-md text-headline-md font-bold text-primary">{money(p.price)}</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">Complimentary global shipping over {money(site.shipping.freeOver)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-space-xs">
        <div className="flex items-center justify-between font-label-md text-label-md">
          <span className={label}>Tonal Colorway:</span>
          <span className="text-primary font-semibold">{color}</span>
        </div>
        <div className="flex items-center gap-3">
          {p.colors.map((c) => (
            <Button
              key={c.name}
              variant="plain"
              size="none"
              aria-label={c.name}
              aria-pressed={color === c.name}
              onClick={() => onColor(c.name)}
              style={{ backgroundColor: c.hex }}
              className={cn("relative w-9 h-9 rounded-full shadow-sm transition-all", color === c.name ? "ring-2 ring-primary ring-offset-2 ring-offset-surface-container-low scale-110" : "hover:scale-105")}
            >
              {color === c.name && <Icon name="check" size={16} className="text-white mix-blend-difference" strokeWidth={3} />}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-space-xs">
        <div className="flex items-center justify-between font-label-md text-label-md">
          <span className={label}>Select Size</span>
          <Button variant="plain" size="none" onClick={onOpenGuide} className="font-label-sm text-label-sm text-on-surface-variant underline uppercase tracking-wider hover:text-primary">
            Size Guide
          </Button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {p.sizes.map((s) => (
            <Button
              key={s}
              variant="plain"
              size="none"
              aria-pressed={size === s}
              onClick={() => onSize(s)}
              className={cn("py-2 rounded-full font-label-md text-label-md transition-colors", size === s ? "text-on-primary bg-primary shadow-sm font-bold" : "text-on-surface bg-surface hover:bg-surface-container-high")}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {p.fit && (
        <div className="bg-surface rounded-xl p-space-sm flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
          <Icon name="straighten" size={16} className="text-secondary shrink-0" />
          <span>
            Cut: <strong className="text-primary font-semibold">{p.fit}</strong>
            {p.fitLabel && ` (${p.fitLabel})`} · fits true to size
          </span>
        </div>
      )}

      <div className="flex items-center gap-space-sm pt-space-xs">
        <Button
          variant="plain"
          size="none"
          onClick={addToBag}
          className={cn(
            "flex-1 text-on-primary py-space-md px-space-lg rounded-full font-label-md text-label-md uppercase tracking-wider font-bold transition-all active:scale-95 shadow-md gap-space-sm",
            added ? "bg-secondary" : "bg-primary hover:bg-primary-container",
          )}
        >
          <Icon name={added ? "check_circle" : "shopping_bag"} size={18} />
          <span>{added ? `In Bag (${inBag})` : `Add to Bag — ${money(p.price)}`}</span>
        </Button>
        <Button
          variant="plain"
          size="none"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          onClick={() => wishlist.toggle(p.slug)}
          className="w-12 h-12 rounded-full bg-surface hover:bg-surface-container-high text-on-surface shrink-0 shadow-sm transition-all"
        >
          <Icon name="favorite" size={20} className={cn(wished && "text-error fill-current")} />
        </Button>
      </div>
    </div>
  );
}
