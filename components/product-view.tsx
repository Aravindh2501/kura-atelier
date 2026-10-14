"use client";
import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { BuyBox } from "@/components/product/buy-box";
import { DetailsAccordion } from "@/components/product/details-accordion";
import { ProductGallery } from "@/components/product/product-gallery";
import { SizeGuideDialog } from "@/components/product/size-guide-dialog";
import type { Product } from "@/lib/types";

/** Product page: gallery on the left, sticky buy box + details on the right. */
export function ProductView({ product: p }: { product: Product }) {
  const [color, setColor] = useState(p.colors[0].name);
  const [size, setSize] = useState(p.sizes.includes("M") ? "M" : p.sizes[0]);
  const [guideOpen, setGuideOpen] = useState(false);

  const sizeRow = p.sizeGuide.find((r) => r.size === size) ?? p.sizeGuide.find((r) => r.size === "M") ?? p.sizeGuide[0];

  return (
    <div className="w-full px-margin-mobile lg:px-margin mx-auto py-space-md">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-space-md text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
        <Link href="/shop/all" className="hover:text-on-surface transition-colors">Catalog</Link>
        <span className="text-outline-variant">/</span>
        <span className="text-on-surface font-semibold">{p.breadcrumb ?? p.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <div className="lg:col-span-7 flex flex-col gap-space-md">
          <ProductGallery product={p} sizeRow={sizeRow} />

          <div className="bg-surface-container rounded-lg p-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <Icon name="spa" size={18} />
              </div>
              <div>
                <p className="font-headline-sm text-headline-sm font-semibold text-primary">Water-Based Discharge Ink Alchemy</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">The pigment extracts cotton natural fiber dyes rather than laying plastic atop the knit, allowing total airflow.</p>
              </div>
            </div>
            <Link href="/info/garment-care" className="font-label-md text-label-md text-primary hover:text-secondary flex items-center gap-1 shrink-0 uppercase tracking-wider font-semibold">
              Lab Notes
              <Icon name="arrow_forward" size={16} />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-space-md lg:sticky lg:top-32">
          <BuyBox product={p} color={color} size={size} onColor={setColor} onSize={setSize} onOpenGuide={() => setGuideOpen(true)} />
          <DetailsAccordion details={p.details} />
        </div>
      </div>

      <SizeGuideDialog open={guideOpen} onClose={() => setGuideOpen(false)} rows={p.sizeGuide} selected={size} />
    </div>
  );
}
