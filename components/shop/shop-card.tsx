"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Img } from "@/components/ui/img";
import { Icon } from "@/components/ui/icon";
import { useCart } from "@/components/cart-provider";
import { cn, money } from "@/lib/utils";
import type { Product } from "@/lib/types";

const BADGE_STYLES: Record<string, string> = {
  primary: "bg-primary text-on-primary",
  secondary: "bg-secondary text-on-secondary",
  tertiary: "bg-on-tertiary-container text-on-tertiary",
  neutral: "bg-surface-container-highest text-on-surface",
};

/** Catalog card from the shop design: badge, Front/Back flip, specs, one-tap size add. */
export function ShopCard({ product: p }: { product: Product }) {
  const { add } = useCart();
  const [showBack, setShowBack] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);

  // The design shows four quick-add sizes; the rest are on the product page.
  const quickSizes = p.sizes.length > 4 ? p.sizes.filter((s) => ["S", "M", "L", "XL"].includes(s)) : p.sizes;
  const front = p.gallery[0];
  const back = p.gallery[1] ?? front;
  const image = showBack ? back : front;

  function quickAdd(size: string) {
    add({ slug: p.slug, name: p.name, price: p.price, image: front.src, color: p.colors[0].name, size });
    setJustAdded(size);
    setTimeout(() => setJustAdded(null), 1200);
  }

  return (
    <article className="group relative flex flex-col bg-surface-container-low rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300">
      <div className="p-space-sm pb-0 flex items-center justify-between z-10">
        {p.badge ? (
          <span className={cn("font-label-sm text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full", BADGE_STYLES[p.badgeStyle ?? "primary"])}>{p.badge}</span>
        ) : (
          <span />
        )}

        <div className="flex items-center bg-surface-container-highest/80 backdrop-blur-md rounded-full p-0.5 text-on-surface" role="group" aria-label="Product side">
          {([["Front", false], ["Back", true]] as const).map(([label, isBack]) => (
            <Button
              key={label}
              variant="plain"
              size="none"
              aria-pressed={showBack === isBack}
              onClick={() => setShowBack(isBack)}
              className={cn(
                "px-2 py-0.5 rounded-full font-label-sm text-[10px] uppercase",
                showBack === isBack ? "bg-surface text-on-surface font-semibold shadow-xs" : "text-on-surface-variant hover:text-on-surface",
              )}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <Link href={`/product/${p.slug}`} className="relative w-full h-48 sm:h-52 p-2 overflow-hidden flex items-center justify-center">
        <Img src={image.src} alt={`${p.name} – ${showBack ? "back" : "front"}`} className="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-105" />
        {p.fitLabel && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-surface/90 backdrop-blur-md font-label-sm text-[9px] uppercase tracking-wider text-on-surface px-1.5 py-0.5 rounded-full shadow-xs">{p.fitLabel}</span>
          </div>
        )}
      </Link>

      <div className="p-space-sm pt-1 flex flex-col gap-1.5 bg-surface-container-low border-t border-outline-variant/40">
        <div className="flex items-baseline justify-between gap-1">
          <Link href={`/product/${p.slug}`} className="font-headline-sm text-body-md text-primary uppercase font-bold tracking-tight truncate">
            {p.name}
          </Link>
          <span className="font-label-md text-body-md text-primary font-bold tracking-tight">{money(p.price)}</span>
        </div>

        <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-[10px] uppercase">
          <span>{p.gsm} GSM</span>
          {p.technique && (
            <>
              <span>•</span>
              <span className="truncate">{p.technique}</span>
            </>
          )}
        </div>

        <div className="pt-1">
          <div className="w-full bg-surface-container-high rounded-full p-0.5 flex items-center justify-between gap-1">
            <span className="font-label-sm text-[10px] uppercase pl-2 text-on-surface-variant font-semibold">Size:</span>
            <div className="flex items-center gap-0.5">
              {quickSizes.map((size) => (
                <Button
                  key={size}
                  variant="plain"
                  size="none"
                  aria-label={`Add size ${size} to bag`}
                  onClick={() => quickAdd(size)}
                  className={cn(
                    "min-w-6 h-6 px-1 rounded-full font-label-sm text-[10px] uppercase transition-colors font-bold",
                    justAdded === size ? "bg-secondary text-on-secondary" : "bg-surface text-on-surface hover:bg-primary hover:text-on-primary",
                  )}
                >
                  {justAdded === size ? <Icon name="check" size={12} strokeWidth={3} /> : size}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}