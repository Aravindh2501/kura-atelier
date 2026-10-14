"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import type { ProductDetail } from "@/lib/types";

export function DetailsAccordion({ details }: { details: ProductDetail[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="bg-surface-container-low rounded-lg p-space-md flex flex-col gap-2 shadow-sm">
      {details.map((detail, i) => {
        const expanded = open === i;
        return (
          <div key={detail.title} className="rounded-xl bg-surface overflow-hidden">
            <Button
              variant="plain"
              size="none"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : i)}
              className="w-full px-space-md py-space-sm justify-between text-left font-headline-sm text-headline-sm font-semibold text-primary hover:bg-surface-container-high transition-colors"
            >
              <span className="flex items-center gap-2">
                <Icon name={detail.icon} size={16} className="text-secondary" />
                {detail.title}
              </span>
              <Icon name="expand_more" size={20} className={cn("transition-transform duration-200", expanded && "rotate-180")} />
            </Button>
            {expanded && <p className="px-space-md py-space-sm font-body-sm text-body-sm text-on-surface-variant">{detail.body}</p>}
          </div>
        );
      })}
    </div>
  );
}
