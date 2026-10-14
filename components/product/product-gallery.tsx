"use client";
import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Img } from "@/components/ui/img";
import { cn } from "@/lib/utils";
import type { GalleryImage, Product, SizeRow } from "@/lib/types";

const panel = "group relative rounded-lg overflow-hidden bg-surface-container-low shadow-sm flex flex-col";
const imageClass = "absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105";
const overlay = "relative z-10 p-space-md bg-gradient-to-t from-primary/80 via-primary/20 to-transparent flex items-end justify-between text-on-primary";
const roundButton = "w-10 h-10 rounded-full bg-surface/90 text-on-surface flex items-center justify-center backdrop-blur shadow-md hover:bg-surface transition-all";
const inch = (cm: number) => (Math.floor((cm / 2.54) * 10) / 10).toFixed(1);

function Caption({ image }: { image: GalleryImage }) {
  return (
    <div>
      <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-primary/80">{image.label}</span>
      <p className="font-headline-sm text-headline-sm font-medium">{image.title}</p>
    </div>
  );
}

type Props = { product: Product; sizeRow: SizeRow };

export function ProductGallery({ product, sizeRow }: Props) {
  const gallery = product.gallery;
  const hasFullSet = gallery.length >= 4; // front, back, macro, flat-lay
  const [focus, setFocus] = useState<number | null>(null);
  const [zoom, setZoom] = useState<string | null>(null);

  const modes: [string, number | null][] = [[`All Angles (${gallery.length})`, null], ["Focus Back Graphic", 1], ["Macro Weave", 2]];
  const visible = focus === null ? gallery.map((_, i) => i) : [focus];
  const single = visible.length === 1 ? "sm:col-span-2" : "";

  function renderPanel(index: number) {
    const image = gallery[index];
    const zoomButton = (icon: string, label: string) => (
      <Button variant="plain" size="none" aria-label={label} onClick={() => setZoom(image.src)} className={roundButton}>
        <Icon name={icon} size={18} />
      </Button>
    );

    if (hasFullSet && index === 1) {
      return (
        <div key={index} className={cn(panel, "justify-end min-h-[520px]", single)}>
          <Img src={image.src} alt={image.title} className={imageClass} />
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-tertiary-container/90 text-on-tertiary-container backdrop-blur px-space-sm py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider font-semibold">Back Plinth Screenprint</span>
          </div>
          <div className={overlay}>
            <Caption image={image} />
            {zoomButton("crop_free", "Expand image")}
          </div>
        </div>
      );
    }

    if (hasFullSet && index === 2) {
      return (
        <div key={index} className={cn(panel, "justify-end min-h-[460px]", single)}>
          <Img src={image.src} alt={image.title} className={imageClass} />
          <div className={overlay}>
            <Caption image={image} />
            <span className="bg-secondary-container text-on-secondary-container px-space-sm py-1 rounded-full font-label-sm text-label-sm">ZERO CRACKING</span>
          </div>
        </div>
      );
    }

    if (hasFullSet && index === 3) {
      const rows: [string, number][] = [
        [`Chest Pit-to-Pit (Size ${sizeRow.size})`, sizeRow.chest],
        ["Body Length (Center Back)", sizeRow.length],
        ["Sleeve Inseam Overhang", sizeRow.sleeve],
      ];
      return (
        <div key={index} className={cn(panel, "justify-between p-space-md min-h-[460px]", single)}>
          <Img src={image.src} alt={image.title} className={cn(imageClass, "opacity-80")} />
          <div className="relative z-10 flex items-center justify-between">
            <span className="bg-surface/90 text-on-surface backdrop-blur px-space-sm py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider font-semibold">Pattern Matrix</span>
            <span className="font-label-sm text-label-sm text-on-surface bg-surface-container-high/80 px-2 py-0.5 rounded-full">CUT № 07-B</span>
          </div>
          <div className="relative z-10 bg-surface/95 backdrop-blur-md p-space-md rounded-xl flex flex-col gap-1 text-on-surface">
            {rows.map(([label, cm]) => (
              <div key={label} className="flex justify-between items-center font-label-sm text-label-sm">
                <span className="text-on-surface-variant uppercase">{label}</span>
                <span className="font-semibold">{cm} cm / {inch(cm)} in</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // front shot (index 0) and any image that is not part of the full set
    return (
      <div key={index} className={cn(panel, "justify-end min-h-[520px]", single || (gallery.length === 1 ? "sm:col-span-2" : ""))}>
        <Img src={image.src} alt={image.title} className={imageClass} />
        <div className={overlay}>
          <Caption image={image} />
          {zoomButton("zoom_in", "Zoom image")}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-space-md">
      {hasFullSet && (
        <div className="flex flex-wrap items-center justify-between gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded-full">
          <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar">
            {modes.map(([label, value]) => (
              <Button
                key={label}
                variant="plain"
                size="none"
                aria-pressed={focus === value}
                onClick={() => setFocus(value)}
                className={cn("px-space-md py-1 rounded-full font-label-sm text-label-sm uppercase transition-all shrink-0", focus === value ? "bg-primary text-on-primary" : "hover:bg-surface-container-high text-on-surface-variant")}
              >
                {label}
              </Button>
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm uppercase">
            <Icon name="verified" size={16} />
            <span>{product.gsm} GSM Japanese combed knit</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">{visible.map(renderPanel)}</div>

      <Dialog open={zoom !== null} onClose={() => setZoom(null)} className="relative z-[70]">
        <DialogBackdrop transition className="fixed inset-0 bg-primary/80 backdrop-blur-sm transition-opacity duration-200 data-[closed]:opacity-0" />
        <div className="fixed inset-0 flex items-center justify-center p-space-md">
          <DialogPanel transition className="relative max-h-full transition duration-200 data-[closed]:scale-95 data-[closed]:opacity-0">
            <DialogTitle className="sr-only">{product.name} – enlarged view</DialogTitle>
            {zoom && <Img src={zoom} alt={`${product.name} enlarged`} className="max-h-[90vh] max-w-full object-contain rounded-lg" />}
            <Button variant="plain" size="none" aria-label="Close" onClick={() => setZoom(null)} className="absolute top-3 right-3 w-10 h-10 rounded-full bg-surface text-on-surface shadow-md">
              <Icon name="close" />
            </Button>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
