import shop from "@/data/shop.json";

/** Centred collection header: small eyebrow, one-line title, short blurb. */
export function ShopHeader({ collection }: { collection?: string }) {
  return (
    <header className="w-full px-margin-mobile lg:px-margin pt-space-lg pb-space-lg flex flex-col items-center text-center gap-space-sm">
      <span className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-on-surface-variant">{collection ?? shop.eyebrow}</span>
      <h1 className="font-headline-xl-mobile text-headline-xl-mobile lg:font-display-hero lg:text-display-hero uppercase tracking-tight text-primary leading-none">{shop.title}</h1>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-md">{shop.blurb}</p>
    </header>
  );
}