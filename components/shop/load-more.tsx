"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import shop from "@/data/shop.json";
import type { ShopFilters } from "./use-shop-filters";

/**
 * "8 of 24 Prints Loaded" progress + "Load Archive Next Drop" button.
 * The 24 is `archiveTotal` in data/shop.json (the whole archive, released or not).
 */
export function LoadMore({ filters }: { filters: ShopFilters }) {
  const [note, setNote] = useState(false);
  const shown = filters.visible.length;
  const archive = Math.max(shop.archiveTotal, filters.filtered.length);
  const pct = Math.round((shown / archive) * 100);

  function onClick() {
    if (filters.hasMore) filters.loadMore();
    else setNote(true); // everything released is already on screen
  }

  return (
    <section className="w-full px-margin-mobile lg:px-margin pt-space-xl pb-space-lg flex flex-col items-center justify-center gap-space-md text-center">
      <div className="flex flex-col items-center gap-space-xs max-w-sm w-full">
        <div className="flex items-center justify-between w-full font-label-md text-label-md uppercase text-on-surface-variant tracking-wider">
          <span>{shown} of {archive} Prints Loaded</span>
          <span className="text-primary font-bold">{pct}% Documented</span>
        </div>
        <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <Button
        variant="plain"
        size="none"
        onClick={onClick}
        className="font-label-md text-label-md uppercase gap-space-sm bg-primary hover:bg-primary-container text-on-primary tracking-wider px-space-xl py-space-md rounded-full shadow-md transition-all hover:scale-[1.02] active:scale-95"
      >
        <span>Load Archive Next Drop</span>
        <Icon name="expand_more" size={18} />
      </Button>

      {note && <p role="status" className="font-body-sm text-body-sm text-on-surface-variant">Every released print is already shown. The next drop opens soon.</p>}

      <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">{shop.nextDrop}</span>
    </section>
  );
}