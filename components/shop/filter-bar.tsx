"use client";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import shop from "@/data/shop.json";
import { ALL_FITS, type ShopFilters } from "./use-shop-filters";

const pillBase = "font-label-md text-label-md uppercase px-space-md py-space-xs rounded-full shrink-0 transition-colors";

type Props = {
  filters: ShopFilters;
  cols: 3 | 4;
  onCols: (cols: 3 | 4) => void;
  drawerOpen: boolean;
  onToggleDrawer: () => void;
};

/** Sticky strip: All Filters button, quick fit pills, sort menu, grid density. */
export function FilterBar({ filters, cols, onCols, drawerOpen, onToggleDrawer }: Props) {
  const currentSort = shop.sorts.find((s) => s.key === filters.sort) ?? shop.sorts[0];

  const pill = (label: string) => (
    <Button
      key={label}
      variant="plain"
      size="none"
      aria-pressed={filters.pill === label}
      onClick={() => filters.setPill(label)}
      className={cn(pillBase, filters.pill === label ? "bg-surface-container-high text-on-surface" : "bg-surface hover:bg-surface-container text-on-surface-variant hover:text-on-surface")}
    >
      {label}
    </Button>
  );

  const divider = <div className="h-5 w-px bg-outline-variant/40 mx-1 shrink-0" />;

  return (
    <div className="flex flex-wrap items-center justify-between gap-space-sm">
      <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar flex-1 py-0.5">
        <Button
          variant="plain"
          size="none"
          aria-expanded={drawerOpen}
          onClick={onToggleDrawer}
          className="font-label-md text-label-md uppercase gap-space-xs bg-primary text-on-primary px-space-md py-space-xs rounded-full shadow-sm hover:bg-primary-container transition-all shrink-0"
        >
          <Icon name="tune" size={16} />
          <span>All Filters</span>
          {filters.activeCount > 0 && (
            <span className="bg-surface/20 text-on-primary w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold">{filters.activeCount}</span>
          )}
        </Button>

        {divider}
        {pill(ALL_FITS)}
        {filters.fits.map(pill)}
        {filters.placements.length > 0 && divider}
        {filters.placements.map(pill)}
      </div>

      <div className="flex items-center gap-space-xs shrink-0 pl-space-xs">
        <Menu>
          <MenuButton className="font-label-md text-label-md uppercase inline-flex items-center gap-space-xs bg-surface text-on-surface px-space-md py-space-xs rounded-full shadow-sm hover:bg-surface-container transition-colors">
            <span className="text-on-surface-variant">Sort:</span>
            <span className="font-semibold">{currentSort.short}</span>
            <Icon name="expand_more" size={14} />
          </MenuButton>
          <MenuItems
            transition
            anchor="bottom end"
            className="z-50 min-w-60 origin-top-right rounded-2xl bg-surface-container-lowest p-1.5 shadow-[0_12px_32px_-6px_rgba(78,66,52,0.18)] ring-1 ring-outline-variant/30 [--anchor-gap:8px] focus:outline-none transition duration-150 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            {shop.sorts.map((s) => {
              const selected = filters.sort === s.key;
              return (
                <MenuItem key={s.key}>
                  <button
                    type="button"
                    onClick={() => filters.setSort(s.key as typeof filters.sort)}
                    className={cn(
                      "w-full flex items-center justify-between gap-space-sm font-label-md text-label-md uppercase tracking-wider text-left px-space-md py-2 rounded-full transition-colors data-[focus]:bg-surface-container",
                      selected ? "text-primary font-semibold" : "text-on-surface-variant",
                    )}
                  >
                    <span>{s.label}</span>
                    {selected && <Icon name="check" size={14} strokeWidth={2.5} className="text-secondary shrink-0" />}
                  </button>
                </MenuItem>
              );
            })}
          </MenuItems>
        </Menu>

        <div className="hidden md:flex items-center bg-surface p-1 rounded-full shadow-sm" role="group" aria-label="Grid density">
          {([[3, "grid_view", "Editorial 3-Column"], [4, "view_comfy", "Dense 4-Column"]] as const).map(([n, icon, title]) => (
            <Button
              key={n}
              variant="plain"
              size="none"
              title={title}
              aria-label={title}
              aria-pressed={cols === n}
              onClick={() => onCols(n)}
              className={cn("p-1.5 rounded-full transition-colors", cols === n ? "bg-surface-container-high text-on-surface" : "text-on-surface-variant hover:text-on-surface")}
            >
              <Icon name={icon} size={18} />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}