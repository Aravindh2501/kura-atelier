import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import site from "@/data/site.json";

/** tailwind-merge needs to know our custom font-size tokens, otherwise it drops them. */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "headline-xl", "headline-lg", "headline-md", "headline-sm", "headline-xl-mobile",
            "display-hero", "display-hero-mobile",
            "label-lg", "label-md", "label-sm",
            "body-lg", "body-md", "body-sm",
          ],
        },
      ],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const { code, locale } = site.currency;

/** 78 -> "$78", 78.5 -> "$78.50" */
export function money(amount: number): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export const shippingRules = {
  freeShippingOver: site.shipping.freeOver,
  flatShipping: site.shipping.flat,
};
