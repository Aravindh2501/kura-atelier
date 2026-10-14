"use client";
import { Button } from "@/components/ui/button";
import { cn, money } from "@/lib/utils";
import shop from "@/data/shop.json";
import type { ShopFilters } from "./use-shop-filters";

const title = "font-label-md text-label-md uppercase tracking-wider text-primary font-bold";

/** Expanded filter panel: technique, colour, size and price. */
export function FilterDrawer({ filters, onClose }: { filters: ShopFilters; onClose: () => void }) {
  const selectedColors = filters.colors.length ? filters.colors.join(", ") : "Any tone";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md bg-surface-container rounded-xl p-space-md">
      <fieldset className="flex flex-col gap-space-xs">
        <legend className={title}>Print Technique</legend>
        <div className="flex flex-col gap-1 pt-space-xs font-body-sm text-body-sm text-on-surface-variant">
          {filters.techniqueOptions.map((t) => (
            <label key={t.name} className="flex items-center gap-2 cursor-pointer hover:text-on-surface">
              <input type="checkbox" checked={filters.techniques.includes(t.name)} onChange={() => filters.toggleTechnique(t.name)} className="rounded accent-secondary w-3.5 h-3.5" />
              <span>{t.name} ({t.count})</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-space-xs">
        <legend className={title}>Base Canvas Tone</legend>
        <div className="flex flex-wrap items-center gap-2 pt-space-xs">
          {filters.colorOptions.map((c) => (
            <Button
              key={c.name}
              variant="plain"
              size="none"
              title={c.name}
              aria-label={c.name}
              aria-pressed={filters.colors.includes(c.name)}
              onClick={() => filters.toggleColor(c.name)}
              style={{ backgroundColor: c.hex }}
              className={cn("w-6 h-6 rounded-full hover:scale-110 transition-transform shadow-sm", filters.colors.includes(c.name) && "ring-2 ring-primary ring-offset-2 ring-offset-surface-container")}
            />
          ))}
        </div>
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant pt-1">Selected: {selectedColors}</span>
      </fieldset>

      <fieldset className="flex flex-col gap-space-xs">
        <legend className={title}>Size Availability</legend>
        <div className="flex flex-wrap items-center gap-1.5 pt-space-xs">
          {shop.sizes.map((s) => (
            <Button
              key={s}
              variant="plain"
              size="none"
              aria-pressed={filters.sizes.includes(s)}
              onClick={() => filters.toggleSize(s)}
              className={cn(
                "min-w-8 h-8 px-1 rounded-full font-label-sm text-label-sm uppercase transition-colors",
                filters.sizes.includes(s) ? "bg-primary text-on-primary font-bold" : "bg-surface-container-highest text-on-surface hover:bg-primary hover:text-on-primary",
              )}
            >
              {s}
            </Button>
          ))}
        </div>
        <span className="font-body-sm text-body-sm text-on-surface-variant pt-1">{shop.sizeHint}</span>
      </fieldset>

      <div className="flex flex-col justify-between gap-space-sm">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between font-label-md text-label-md uppercase">
            <label htmlFor="price-cap" className="text-primary font-bold">Acquisition Tier</label>
            <span className="text-secondary font-semibold">{money(filters.minPrice)} — {money(filters.cap)}</span>
          </div>
          <input
            id="price-cap"
            type="range"
            min={filters.minPrice}
            max={filters.maxPrice}
            value={filters.cap}
            onChange={(e) => filters.setCap(Number(e.target.value))}
            className="w-full accent-secondary cursor-pointer"
          />
        </div>
        <div className="flex items-center justify-end gap-space-sm">
          <Button variant="plain" size="none" onClick={filters.reset} className="font-label-sm text-label-sm uppercase text-on-surface-variant hover:text-primary transition-colors underline underline-offset-4">
            Reset
          </Button>
          <Button variant="plain" size="none" onClick={onClose} className="font-label-md text-label-md uppercase bg-primary text-on-primary px-space-md py-1.5 rounded-full hover:bg-primary-container transition-colors">
            Apply Matrix
          </Button>
        </div>
      </div>
    </div>
  );
}
