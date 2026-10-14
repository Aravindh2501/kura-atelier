"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import { cn, money } from "@/lib/utils";
import type { Product } from "@/lib/api";

const TABS = [["all", "All Prints"], ["men", "Men's Studio"], ["women", "Women's Studio"], ["unisex", "Unisex Editions"]];
const PILLS = ["All Fits", "Boxy Oversized", "Relaxed Drop-Shoulder", "Classic Vintage", "|", "Oversized Back Graphic", "Minimal Chest Crest", "All-Over Lithograph"];
const SORTS = ["Curated Drops (Newest)", "Price: Low to High", "Price: High to Low", "Collector Demand"];
const SORT_SHORT = ["Curated Drops", "Price: Low to High", "Price: High to Low", "Collector Demand"];
const SWATCHES = [["#F5F3EF", "Bone / Ecru"], ["#1C1B1B", "Carbon Washed Black"], ["#D3623A", "Faded Terracotta"], ["#486551", "Sage Moss"], ["#2A3742", "Slate Indigo"], ["#B9B8B5", "Raw Melange Grey"]];
const SIZES = ["XS", "S", "M", "L", "XL", "2XL"];
const BADGE: Record<string, string> = { primary: "bg-primary text-on-primary", secondary: "bg-secondary text-on-secondary", tertiary: "bg-on-tertiary-container text-on-tertiary", neutral: "bg-surface-container-highest text-on-surface" };
const lab = "font-label-md text-label-md uppercase";

function Card({ p }: { p: Product }) {
  const { add } = useCart();
  const [back, setBack] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const img = "w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-105";
  const quick = (size: string) => {
    add({ slug: p.slug, name: p.name, price: p.price, image: p.gallery[0].src, color: p.colors[0].name, size });
    setDone(size); setTimeout(() => setDone(null), 1200);
  };
  return (
    <article className="group relative flex flex-col bg-surface-container-low rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300">
      <div className="p-space-sm pb-0 flex items-center justify-between z-10">
        {p.badge ? <span className={cn("font-label-sm text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full", BADGE[p.badgeStyle ?? "primary"])}>{p.badge}</span> : <span />}
        <div className="flex items-center bg-surface-container-highest/80 backdrop-blur-md rounded-full p-0.5 text-on-surface">
          {[["Front", false], ["Back", true]].map(([l, v]) => (
            <Button key={l as string} variant="plain" size="none" onClick={() => setBack(v as boolean)} className={cn("px-2 py-0.5 rounded-full font-label-sm text-[10px] uppercase", back === v ? "bg-surface text-on-surface font-semibold shadow-xs" : "text-on-surface-variant hover:text-on-surface")}>{l as string}</Button>
          ))}
        </div>
      </div>
      <Link href={`/product/${p.slug}`} className="relative w-full h-48 sm:h-52 p-2 overflow-hidden flex items-center justify-center">
        <img alt={p.name} src={(back ? p.gallery[1] ?? p.gallery[0] : p.gallery[0]).src} className={img} />
        <div className="absolute bottom-2 left-2"><span className="bg-surface/90 backdrop-blur-md font-label-sm text-[9px] uppercase tracking-wider text-on-surface px-1.5 py-0.5 rounded-full shadow-xs">{p.fitLabel}</span></div>
      </Link>
      <div className="p-space-sm pt-1 flex flex-col gap-1.5 bg-surface-container-low border-t border-outline-variant/40">
        <div className="flex items-baseline justify-between gap-1">
          <Link href={`/product/${p.slug}`} className="font-headline-sm text-body-md text-primary uppercase font-bold tracking-tight truncate">{p.name}</Link>
          <span className="font-label-md text-body-md text-primary font-bold tracking-tight">{money(p.price).replace(".00", "")}</span>
        </div>
        <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-[10px] uppercase"><span>280 GSM</span><span>•</span><span className="truncate">{p.technique}</span></div>
        <div className="pt-1">
          <div className="w-full bg-surface-container-high rounded-full p-0.5 flex items-center justify-between gap-1">
            <span className="font-label-sm text-[10px] uppercase pl-2 text-on-surface-variant font-semibold">Size:</span>
            <div className="flex items-center gap-0.5">
              {p.sizes.slice(0, 4).map((s) => (
                <Button key={s} variant="plain" size="none" onClick={() => quick(s)} className={cn("w-6 h-6 rounded-full font-label-sm text-[10px] uppercase transition-colors font-bold", done === s ? "bg-secondary text-on-secondary" : "bg-surface text-on-surface hover:bg-primary hover:text-on-primary")}>{done === s ? "✓" : s}</Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ShopView({ products, initialTab }: { products: Product[]; initialTab: string }) {
  const lo = Math.floor(Math.min(...products.map((p) => p.price))), hi = Math.ceil(Math.max(...products.map((p) => p.price)));
  const [tab, setTab] = useState(initialTab);
  const [pill, setPill] = useState("All Fits");
  const [sort, setSort] = useState(0);
  const [cols, setCols] = useState(4);
  const [drawer, setDrawer] = useState(false);
  const [sizes, setSizes] = useState<string[]>([]);
  const [techs, setTechs] = useState<string[]>([]);
  const [cap, setCap] = useState(hi);
  const [swatch, setSwatch] = useState(0);
  const toggle = (arr: string[], v: string, set: (a: string[]) => void) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const count = (t: string) => products.filter((p) => t === "all" || p.categories.includes(t)).length;
  const techList = useMemo(() => Array.from(new Set(products.map((p) => p.technique ?? ""))).filter(Boolean).map((t) => [t, products.filter((p) => p.technique === t).length] as const), [products]);
  const active = (pill !== "All Fits" ? 1 : 0) + sizes.length + techs.length + (cap < hi ? 1 : 0);

  const list = useMemo(() => {
    let l = products.filter((p) => tab === "all" || p.categories.includes(tab));
    if (pill !== "All Fits") l = l.filter((p) => p.fit === pill || p.placement === pill);
    if (sizes.length) l = l.filter((p) => sizes.some((s) => p.sizes.includes(s)));
    if (techs.length) l = l.filter((p) => techs.includes(p.technique ?? ""));
    l = l.filter((p) => p.price <= cap);
    const s = [...l];
    if (sort === 1) s.sort((a, b) => a.price - b.price);
    if (sort === 2) s.sort((a, b) => b.price - a.price);
    if (sort === 3) s.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0) || b.price - a.price);
    return s;
  }, [products, tab, pill, sizes, techs, cap, sort]);

  const reset = () => { setPill("All Fits"); setSizes([]); setTechs([]); setCap(hi); setTab("all"); };
  const pct = Math.round((list.length / products.length) * 100);

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full overflow-hidden pb-space-xl">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-[420px] h-[420px] rounded-full bg-tertiary-fixed-dim/15 blur-[100px] pointer-events-none" />
        <header className="w-full px-margin-mobile lg:px-margin pt-space-lg pb-space-lg flex flex-col gap-space-lg">
          <div className="flex flex-wrap items-center justify-between gap-space-sm text-on-surface-variant">
            <div className="flex items-center gap-space-xs font-label-md text-label-md tracking-widest uppercase">
              <span className="text-on-surface font-semibold">Atelier Archive</span><span>/</span><span>Edition 07</span><span>/</span><span className="text-secondary font-semibold">Discharge Series</span>
            </div>
            <div className="flex items-center gap-space-sm font-label-sm text-label-sm uppercase tracking-wider">
              <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse" /><span>{products.length} Silhouettes Documented</span><span className="opacity-40">•</span><span>Aoyama &amp; Marais Pressing</span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-end">
            <div className="lg:col-span-8 flex flex-col gap-space-xs">
              <span className="font-label-md text-label-md uppercase tracking-[0.25em] text-secondary font-bold">280 GSM Japanese Ring-Spun Cotton</span>
              <h1 className="font-display-hero text-display-hero uppercase tracking-tighter text-primary leading-none">The Graphic<br />Print Archive</h1>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-space-sm pb-1">
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">Heavyweight 280 GSM dry-handle jersey. Water-based discharge silkscreen swaps cotton dyes for an ultra-soft hand feel that ages gracefully without cracking.</p>
              <div className="flex items-center gap-space-md pt-space-xs text-on-surface">
                {[["water_drop", "Zero-Plastisol"], ["verified", "Discharge Cured"], ["layers", "280 GSM"]].map(([i, t]) => (
                  <div key={t} className="flex items-center gap-1 font-label-sm text-label-sm uppercase tracking-wider"><span className="material-symbols-outlined text-[16px] text-secondary">{i}</span><span>{t}</span></div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-b-0 pt-space-sm overflow-x-auto">
            <div className="flex items-center gap-space-xs bg-surface-container p-1 rounded-full shadow-sm">
              {TABS.map(([k, l]) => (
                <Button key={k} variant="plain" size="none" onClick={() => setTab(k)} className={cn(lab, "px-space-md py-space-xs rounded-full transition-all duration-200 whitespace-nowrap", tab === k ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface")}>{l} ({count(k)})</Button>
              ))}
            </div>
            <div className="hidden lg:flex items-center gap-space-sm text-on-surface-variant font-label-sm text-label-sm uppercase">
              <span>Viewing Collection 07/Autumn</span><span className="w-1.5 h-1.5 rounded-full bg-outline-variant" /><span>Pre-shrunk Double Steamed</span>
            </div>
          </div>
        </header>

        <section className="w-full px-margin-mobile lg:px-margin sticky top-28 z-30 transition-all">
          <div className="bg-surface-container-low/95 backdrop-blur-md rounded-2xl p-space-sm shadow-[0_8px_24px_-4px_rgba(78,66,52,0.06),0_2px_6px_-1px_rgba(78,66,52,0.03)] flex flex-col gap-space-sm">
            <div className="flex flex-wrap items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-xs overflow-x-auto flex-1 py-0.5">
                <Button variant="plain" size="none" onClick={() => setDrawer(!drawer)} className={cn(lab, "gap-space-xs bg-primary text-on-primary px-space-md py-space-xs rounded-full shadow-sm hover:bg-primary-container transition-all shrink-0")}>
                  <span className="material-symbols-outlined text-[16px]">tune</span><span>All Filters</span>
                  {active > 0 && <span className="bg-surface/20 text-on-primary w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold">{active}</span>}
                </Button>
                {PILLS.map((l, i) => l === "|" ? <div key={i} className="h-5 w-px bg-outline-variant/40 mx-1 shrink-0" /> : (
                  <Button key={l} variant="plain" size="none" onClick={() => setPill(l)} className={cn(lab, "px-space-md py-space-xs rounded-full shrink-0 transition-colors", i === 0 && "ml-0", pill === l ? "bg-surface-container-high text-on-surface" : "bg-surface hover:bg-surface-container text-on-surface-variant hover:text-on-surface")}>{l}</Button>
                ))}
              </div>
              <div className="flex items-center gap-space-xs shrink-0 pl-space-xs">
                <div className="relative group">
                  <Button variant="plain" size="none" className={cn(lab, "gap-space-xs bg-surface text-on-surface px-space-md py-space-xs rounded-full shadow-sm hover:bg-surface-container transition-colors")}>
                    <span className="text-on-surface-variant">Sort:</span><span className="font-semibold">{SORT_SHORT[sort]}</span><span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                  </Button>
                  <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-xl p-1.5 hidden group-hover:flex flex-col gap-1 z-40">
                    {SORTS.map((l, i) => <Button key={l} variant="plain" size="none" onClick={() => setSort(i)} className={cn(lab, "justify-start text-left px-space-sm py-1.5 rounded-lg hover:bg-surface-container", sort === i ? "text-primary font-semibold" : "text-on-surface-variant")}>{l}</Button>)}
                  </div>
                </div>
                <div className="hidden md:flex items-center bg-surface p-1 rounded-full shadow-sm">
                  {[[3, "grid_view", "Editorial 3-Column"], [4, "view_comfy", "Dense 4-Column"]].map(([n, ic, t]) => (
                    <Button key={n as number} variant="plain" size="none" title={t as string} onClick={() => setCols(n as number)} className={cn("p-1.5 rounded-full transition-colors", cols === n ? "bg-surface-container-high text-on-surface" : "text-on-surface-variant hover:text-on-surface")}><span className="material-symbols-outlined text-[18px]">{ic as string}</span></Button>
                  ))}
                </div>
              </div>
            </div>
            {drawer && (
              <div className="flex flex-col gap-space-md pt-space-sm pb-space-xs">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md bg-surface-container rounded-xl p-space-md">
                  <div className="flex flex-col gap-space-xs">
                    <span className={cn(lab, "tracking-wider text-primary font-bold")}>Print Technique</span>
                    <div className="flex flex-col gap-1 font-body-sm text-body-sm text-on-surface-variant">
                      {techList.map(([t, n]) => (
                        <label key={t} className="flex items-center gap-2 cursor-pointer hover:text-on-surface"><input type="checkbox" checked={techs.includes(t)} onChange={() => toggle(techs, t, setTechs)} className="rounded accent-secondary w-3.5 h-3.5" /><span>{t} ({n})</span></label>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-space-xs">
                    <span className={cn(lab, "tracking-wider text-primary font-bold")}>Base Canvas Tone</span>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {SWATCHES.map(([h, t], i) => <Button key={h} variant="plain" size="none" title={t} onClick={() => setSwatch(i)} style={{ backgroundColor: h }} className={cn("w-6 h-6 rounded-full hover:scale-110 transition-transform shadow-sm", swatch === i && "ring-2 ring-primary ring-offset-2")} />)}
                    </div>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant pt-1">Selected: {SWATCHES[swatch][1]} ({SWATCHES[swatch][0]})</span>
                  </div>
                  <div className="flex flex-col gap-space-xs">
                    <span className={cn(lab, "tracking-wider text-primary font-bold")}>Size Availability</span>
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      {SIZES.map((s) => <Button key={s} variant="plain" size="none" onClick={() => toggle(sizes, s, setSizes)} className={cn("w-8 h-8 rounded-full font-label-sm text-label-sm uppercase transition-colors", sizes.includes(s) ? "bg-primary text-on-primary font-bold" : "bg-surface-container-highest text-on-surface hover:bg-primary hover:text-on-primary")}>{s}</Button>)}
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant pt-1">Boxy Drop fits recommend true-to-size</span>
                  </div>
                  <div className="flex flex-col justify-between gap-space-sm">
                    <div className="flex flex-col gap-space-xs">
                      <div className={cn("flex items-center justify-between", lab)}><span className="text-primary font-bold">Acquisition Tier</span><span className="text-secondary font-semibold">${lo} — ${cap} USD</span></div>
                      <input type="range" min={lo} max={hi} value={cap} onChange={(e) => setCap(Number(e.target.value))} className="w-full accent-secondary cursor-pointer" />
                    </div>
                    <div className="flex items-center justify-end gap-space-sm">
                      <Button variant="plain" size="none" onClick={reset} className="font-label-sm text-label-sm uppercase text-on-surface-variant hover:text-primary transition-colors underline underline-offset-4">Reset</Button>
                      <Button variant="plain" size="none" onClick={() => setDrawer(false)} className={cn(lab, "bg-primary text-on-primary px-space-md py-1.5 rounded-full hover:bg-primary-container transition-colors")}>Apply Matrix</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="w-full px-margin-mobile lg:px-margin pt-space-lg">
          {list.length === 0 ? (
            <p className="font-body-md text-body-md text-on-surface-variant">No prints match these filters.</p>
          ) : (
            <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-gutter transition-all duration-300", cols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4")}>{list.map((p) => <Card key={p.slug} p={p} />)}</div>
          )}
        </div>

        <section className="w-full px-margin-mobile lg:px-margin pt-space-xl pb-space-lg flex flex-col items-center justify-center gap-space-md text-center">
          <div className="flex flex-col items-center gap-space-xs max-w-sm w-full">
            <div className={cn("flex items-center justify-between w-full text-on-surface-variant tracking-wider", lab)}><span>{list.length} of {products.length} Prints Loaded</span><span className="text-primary font-bold">{pct}% Documented</span></div>
            <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} /></div>
          </div>
          <Button variant="plain" size="none" disabled={active === 0 && tab === "all"} onClick={reset} className={cn(lab, "gap-space-sm bg-primary hover:bg-primary-container text-on-primary tracking-wider px-space-xl py-space-md rounded-full shadow-md transition-all hover:scale-[1.02] active:scale-95")}>
            <span>{active === 0 && tab === "all" ? "Full Archive Loaded" : "Show Full Archive"}</span><span className="material-symbols-outlined text-[18px]">expand_more</span>
          </Button>
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Next Drop includes: 07-09 through 07-16 • Indigo Bath &amp; Acid Monoliths</span>
        </section>

        <section className="w-full px-margin-mobile lg:px-margin pt-space-md">
          <div className="w-full bg-surface-container-high rounded-3xl p-space-lg lg:p-space-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-space-lg shadow-sm">
            <div className="flex items-start gap-space-md">
              <div className="w-14 h-14 rounded-2xl bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-md"><span className="material-symbols-outlined text-[28px]">verified_user</span></div>
              <div className="flex flex-col gap-1 max-w-xl">
                <span className={cn(lab, "tracking-widest text-secondary font-bold")}>The Kura Atelier Integrity Standard</span>
                <h2 className="font-headline-md text-headline-md uppercase text-primary font-bold tracking-tight">Lifetime Discharge Silkscreen Guarantee</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Water-based discharge printing extracts organic dyes instead of plastic coatings. Guaranteed to never crack or peel. Free lifetime studio exchange.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-space-md shrink-0">
              {[["Double Rib Neckline", "Does not stretch or wave"], ["Pre-Shrunk Cold Cured", "Zero post-wash distortion"]].map(([a, b], i) => (
                <div key={a} className="contents">
                  {i === 1 && <div className="w-px h-8 bg-outline-variant/40 hidden sm:block" />}
                  <div className="flex flex-col items-center lg:items-end text-center lg:text-right font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant"><span className="text-primary font-bold">{a}</span><span>{b}</span></div>
                </div>
              ))}
              <Button asChild variant="plain" size="none" className={cn(lab, "bg-surface text-primary hover:bg-primary hover:text-on-primary px-space-lg py-space-sm rounded-full transition-colors shadow-sm shrink-0")}><Link href="/info/craft-and-cotton">Read Fabric Notes</Link></Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
