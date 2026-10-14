"use client";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/types";

export type SortKey = "newest" | "price-asc" | "price-desc" | "demand";
export const ALL_FITS = "All Fits";

const unique = (values: (string | undefined)[]) => Array.from(new Set(values.filter((v): v is string => Boolean(v))));

type Options = { initialTab: string; initialQuery: string; pageSize: number };

/** All catalog filtering / sorting / paging state for the shop page. */
export function useShopFilters(products: Product[], { initialTab, initialQuery, pageSize }: Options) {
  const prices = products.map((p) => p.price);
  const minPrice = prices.length ? Math.floor(Math.min(...prices)) : 0;
  const maxPrice = prices.length ? Math.ceil(Math.max(...prices)) : 0;

  const [tab, setTab] = useState(initialTab);
  const [query, setQuery] = useState(initialQuery);
  const [pill, setPill] = useState(ALL_FITS);
  const [sizes, setSizes] = useState<string[]>([]);
  const [techniques, setTechniques] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [cap, setCap] = useState(maxPrice);
  const [sort, setSort] = useState<SortKey>("newest");
  const [pages, setPages] = useState(1);

  // The header search box changes ?q= while this component stays mounted.
  useEffect(() => setQuery(initialQuery), [initialQuery]);

  // Options shown in the UI are derived from the real catalog data.
  const fits = useMemo(() => unique(products.map((p) => p.fit)), [products]);
  const placements = useMemo(() => unique(products.map((p) => p.placement)), [products]);
  const techniqueOptions = useMemo(
    () => unique(products.map((p) => p.technique)).map((name) => ({ name, count: products.filter((p) => p.technique === name).length })),
    [products],
  );
  const colorOptions = useMemo(() => {
    const seen = new Map<string, string>();
    products.forEach((p) => p.colors.forEach((c) => seen.set(c.name, c.hex)));
    return Array.from(seen, ([name, hex]) => ({ name, hex }));
  }, [products]);

  const tabCount = (key: string) => products.filter((p) => key === "all" || p.categories.includes(key)).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => tab === "all" || p.categories.includes(tab));

    if (q) {
      list = list.filter((p) =>
        [p.name, p.subtitle, p.technique, p.fit, p.placement, p.tag, `${p.gsm} gsm`].some((field) => field?.toLowerCase().includes(q)),
      );
    }
    if (pill !== ALL_FITS) list = list.filter((p) => p.fit === pill || p.placement === pill);
    if (sizes.length) list = list.filter((p) => sizes.some((s) => p.sizes.includes(s)));
    if (techniques.length) list = list.filter((p) => p.technique && techniques.includes(p.technique));
    if (colors.length) list = list.filter((p) => p.colors.some((c) => colors.includes(c.name)));
    list = list.filter((p) => p.price <= cap);

    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "demand") sorted.sort((a, b) => Number(Boolean(b.badge)) - Number(Boolean(a.badge)) || b.price - a.price);
    return sorted;
  }, [products, tab, query, pill, sizes, techniques, colors, cap, sort]);

  // Back to page 1 whenever the result set changes.
  const signature = filtered.map((p) => p.slug).join(",");
  useEffect(() => setPages(1), [signature]);

  const visible = filtered.slice(0, pageSize * pages);
  const activeCount =
    (pill !== ALL_FITS ? 1 : 0) + sizes.length + techniques.length + colors.length + (cap < maxPrice ? 1 : 0) + (query.trim() ? 1 : 0);

  const toggle = (list: string[], value: string, set: (next: string[]) => void) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const reset = () => {
    setPill(ALL_FITS);
    setSizes([]);
    setTechniques([]);
    setColors([]);
    setCap(maxPrice);
    setQuery("");
  };

  return {
    // state
    tab, setTab, query, setQuery, pill, setPill, sizes, techniques, colors, cap, setCap, sort, setSort,
    // derived
    minPrice, maxPrice, fits, placements, techniqueOptions, colorOptions, tabCount,
    filtered, visible, activeCount,
    hasMore: visible.length < filtered.length,
    // actions
    toggleSize: (s: string) => toggle(sizes, s, setSizes),
    toggleTechnique: (t: string) => toggle(techniques, t, setTechniques),
    toggleColor: (c: string) => toggle(colors, c, setColors),
    loadMore: () => setPages((p) => p + 1),
    reset,
  };
}

export type ShopFilters = ReturnType<typeof useShopFilters>;
