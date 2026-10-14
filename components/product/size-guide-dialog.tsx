"use client";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import type { SizeRow } from "@/lib/types";

const inch = (cm: number) => (Math.floor((cm / 2.54) * 10) / 10).toFixed(1);
const headings = ["Size Grade", "Chest (Width)", "Length (HPS)", "Shoulder Drop", "Sleeve Length"];

type Props = { open: boolean; onClose: () => void; rows: SizeRow[]; selected: string };

export function SizeGuideDialog({ open, onClose, rows, selected }: Props) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-[70]">
      <DialogBackdrop transition className="fixed inset-0 bg-primary/60 backdrop-blur-sm transition-opacity duration-200 data-[closed]:opacity-0" />
      <div className="fixed inset-0 flex items-center justify-center p-space-md">
        <DialogPanel transition className="bg-surface rounded-2xl max-w-2xl w-full p-space-lg shadow-xl flex flex-col gap-space-md transition duration-200 data-[closed]:scale-95 data-[closed]:opacity-0">
          <div className="flex items-center justify-between gap-space-sm">
            <div>
              <DialogTitle className="font-headline-md text-headline-md font-bold text-primary">Atelier Sizing Geometry</DialogTitle>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Metric &amp; imperial dimensions for the boxy block</p>
            </div>
            <Button variant="secondary" size="icon" className="w-10 h-10" aria-label="Close size guide" onClick={onClose}>
              <Icon name="close" />
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-sm text-body-sm">
              <thead className="bg-surface-container-high text-on-surface uppercase font-label-sm text-label-sm">
                <tr>
                  {headings.map((h, i) => (
                    <th key={h} scope="col" className={cn("py-2.5 px-3 whitespace-nowrap", i === 0 && "rounded-l-lg", i === headings.length - 1 && "rounded-r-lg")}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-on-surface-variant">
                {rows.map((row) => {
                  const active = row.size === selected;
                  return (
                    <tr key={row.size} className={active ? "bg-secondary-container/30 font-medium" : "hover:bg-surface-container-low"}>
                      <td className={cn("py-2 px-3 text-primary", active ? "font-bold" : "font-semibold")}>
                        {row.size}
                        {active && " (Selected)"}
                      </td>
                      {[row.chest, row.length, row.shoulder, row.sleeve].map((cm, i) => (
                        <td key={i} className="py-2 px-3 whitespace-nowrap">{cm} cm / {inch(cm)}&quot;</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant">Tolerance ± 1.2 cm due to artisan small-batch garment dyeing and pre-shrunk tumbling.</p>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
