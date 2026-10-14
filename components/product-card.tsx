import Link from "next/link";
import { Img } from "@/components/ui/img";
import { money } from "@/lib/utils";
import type { Product } from "@/lib/types";

/** Simple card for "related" and wishlist grids. */
export function ProductCard({ product: p }: { product: Product }) {
  return (
    <Link href={`/product/${p.slug}`} className="group bg-surface-container-low rounded-lg p-space-sm flex flex-col gap-space-xs shadow-sm hover:shadow-md transition-all">
      <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-surface-container">
        <Img src={p.gallery[0].src} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="flex justify-between items-baseline gap-2 pt-1 px-1">
        <h3 className="font-headline-sm text-[16px] font-semibold text-primary truncate">{p.name}</h3>
        <span className="font-label-md text-label-md font-bold text-primary shrink-0">{money(p.price)}</span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant px-1">{p.subtitle}</p>
    </Link>
  );
}
