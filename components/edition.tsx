"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Img } from "@/components/ui/img";
import { useCart } from "@/components/cart-provider";
import { cn, money } from "@/lib/utils";
import type { Product } from "@/lib/types";

const CUTS = ["I", "II", "III", "IV"];
const pill = "px-space-xs py-0.5 rounded-full font-label-sm text-[9px] uppercase transition-all";

/** Home-page limited edition card: front/back flip, cut selector, one-tap add. */
export function Edition({ product: p }: { product: Product }) {
  const { add, setOpen } = useCart();
  const [showBack, setShowBack] = useState(false);
  const [cut, setCut] = useState(p.edition?.cut ?? 0);
  const badge = p.edition?.badge ?? p.tag;
  const front = p.gallery[0];
  const back = p.gallery[1] ?? front;

  function acquire() {
    const size = p.sizes.includes("M") ? "M" : p.sizes[0];
    add({ slug: p.slug, name: p.name, price: p.price, image: front.src, color: p.colors[0].name, size, cut: CUTS[cut] });
    setOpen(true);
  }

  return (
    <div className="bg-surface-container-low rounded-lg p-space-xs flex flex-col justify-between shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between px-0.5">
          <span className={cn("font-label-sm text-[9px] uppercase px-space-xs py-0.5 rounded-full font-semibold", badge.startsWith("Edition") ? "bg-tertiary-fixed text-on-tertiary-fixed" : "bg-secondary-container text-on-secondary-container")}>
            {badge}
          </span>
          <span className="bg-surface-container-high text-on-surface-variant font-label-sm text-[9px] uppercase px-space-xs py-0.5 rounded-full">{p.gsm} GSM</span>
        </div>

        <div className="relative w-full aspect-[3/4] rounded-sm bg-surface-container overflow-hidden">
          <Link href={`/product/${p.slug}`}>
            <Img src={showBack ? back.src : front.src} alt={`${p.name} – ${showBack ? "back" : "front"}`} className="w-full h-full object-cover" />
          </Link>
          <div className="absolute bottom-space-xs left-1/2 -translate-x-1/2 bg-surface/90 backdrop-blur-md rounded-full p-0.5 flex items-center shadow-sm z-20" role="group" aria-label="Product side">
            {([["Front", false], ["Back", true]] as const).map(([label, isBack]) => (
              <Button key={label} variant="plain" size="none" aria-pressed={showBack === isBack} onClick={() => setShowBack(isBack)} className={cn(pill, showBack === isBack ? "bg-primary text-on-primary" : "text-on-surface hover:text-primary")}>
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div className="pt-space-xs px-0.5 flex flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <Link href={`/product/${p.slug}`} className="font-headline-sm text-body-md text-primary font-bold tracking-tight truncate">{p.name}</Link>
            <span className="font-headline-sm text-body-md text-primary font-bold shrink-0">{money(p.price)}</span>
          </div>
          <p className="font-body-sm text-[10px] text-on-surface-variant truncate">{p.subtitle}</p>
        </div>

        <div className="flex items-center gap-1 pt-0.5 px-0.5">
          <span className="font-label-sm text-[9px] text-on-surface-variant uppercase mr-0.5">Cut:</span>
          {CUTS.map((label, i) => (
            <Button
              key={label}
              variant="plain"
              size="none"
              aria-label={`Cut ${label}`}
              aria-pressed={cut === i}
              onClick={() => setCut(i)}
              className={cn("w-6 h-6 rounded-full font-label-sm text-[9px] uppercase transition-colors", cut === i ? "bg-primary text-on-primary font-semibold" : "bg-surface text-on-surface hover:bg-primary hover:text-on-primary")}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <Button variant="plain" size="none" onClick={acquire} className="w-full mt-space-xs bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface font-label-sm text-[10px] uppercase py-1.5 rounded-full transition-all gap-1">
        <Icon name="add_shopping_cart" size={14} />
        <span>Add to bag</span>
      </Button>
    </div>
  );
}
