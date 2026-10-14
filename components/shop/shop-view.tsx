"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import site from "@/data/site.json";
import type { Product } from "@/lib/types";
import { FilterBar } from "./filter-bar";
import { FilterDrawer } from "./filter-drawer";
import { GuaranteeBanner } from "./guarantee-banner";
import { LoadMore } from "./load-more";
import { ShopCard } from "./shop-card";
import { ShopHeader } from "./shop-header";
import { useShopFilters } from "./use-shop-filters";

type Props = { products: Product[]; initialTab: string; collection?: string };

export function ShopView({ products, initialTab, collection }: Props) {
  const query = useSearchParams().get("q") ?? "";
  const filters = useShopFilters(products, { initialTab, initialQuery: query, pageSize: site.pageSize });
  const [drawer, setDrawer] = useState(false);
  const [cols, setCols] = useState<3 | 4>(4);

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full overflow-hidden pb-space-xl">
        {/* soft background atmosphere */}
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-[420px] h-[420px] rounded-full bg-tertiary-fixed-dim/15 blur-[100px] pointer-events-none" />

        <ShopHeader collection={collection} />

        <section className="w-full px-margin-mobile lg:px-margin sticky top-28 z-30">
          <div className="bg-surface-container-low/95 backdrop-blur-md rounded-2xl p-space-sm shadow-[0_8px_24px_-4px_rgba(78,66,52,0.06),0_2px_6px_-1px_rgba(78,66,52,0.03)] flex flex-col gap-space-sm">
            <FilterBar filters={filters} cols={cols} onCols={setCols} drawerOpen={drawer} onToggleDrawer={() => setDrawer((d) => !d)} />
            {drawer && (
              <div className="pt-space-sm pb-space-xs">
                <FilterDrawer filters={filters} onClose={() => setDrawer(false)} />
              </div>
            )}
          </div>
        </section>

        <div className="w-full px-margin-mobile lg:px-margin pt-space-lg">
          {filters.query.trim() && (
            <div className="flex items-center gap-space-sm pb-space-md font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
              <span>
                {filters.filtered.length} result{filters.filtered.length === 1 ? "" : "s"} for “{filters.query.trim()}”
              </span>
              <Button variant="plain" size="none" aria-label="Clear search" onClick={() => filters.setQuery("")} className="gap-1 bg-surface-container-high rounded-full px-space-sm py-0.5 hover:bg-surface-variant">
                <Icon name="close" size={12} /> Clear
              </Button>
            </div>
          )}

          {filters.filtered.length === 0 ? (
            <div className="py-space-xl flex flex-col items-center gap-space-sm text-center">
              <Icon name="search" size={40} className="text-outline" />
              <p className="font-body-md text-body-md text-on-surface-variant">No prints match these filters.</p>
              <Button onClick={filters.reset} className="px-space-lg font-label-md text-label-md uppercase">Reset filters</Button>
            </div>
          ) : (
            <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-gutter transition-all duration-300", cols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4")}>
              {filters.visible.map((p) => (
                <ShopCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </div>

        <LoadMore filters={filters} />
        <GuaranteeBanner />
      </div>
    </div>
  );
}