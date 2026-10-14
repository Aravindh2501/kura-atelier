import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Img } from "@/components/ui/img";
import { Newsletter } from "@/components/newsletter";
import { cn } from "@/lib/utils";

const plates = [
  { code: "Lookbook 07-01 • Tokyo", title: "Heavy Drape on Raw Indigo", alt: "Candid street style in Omotesando, Tokyo: an oversized ecru graphic tee with wide-leg raw denim", offset: false },
  { code: "Lookbook 07-02 • Paris", title: "Architectural Layering Study", alt: "Editorial portrait in Le Marais, Paris: a boxy black graphic tee under an unbuttoned linen overshirt", offset: true },
  { code: "Lookbook 07-03 • Kyoto", title: "Fluid Botanical Proportions", alt: "Walking shot of a woman in a relaxed terracotta botanical lithograph tee", offset: false },
];

export function Lookbook({ images }: { images: string[] }) {
  return (
    <section className="w-full px-margin-mobile lg:px-margin pb-space-xl flex flex-col gap-space-xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-xs">
        <div>
          <span className="font-label-md text-label-md text-secondary uppercase font-semibold tracking-wider">Field Lookbook • Season 2025</span>
          <h2 className="font-headline-lg text-headline-lg text-primary uppercase tracking-tight">In The Wild: Tokyo • Paris</h2>
        </div>
        <Link href="/shop/all" className="font-label-md text-label-md text-primary hover:text-secondary uppercase tracking-wider flex items-center gap-1">
          <span>Shop The Looks</span>
          <Icon name="north_east" size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {plates.map((plate, i) => (
          <div key={plate.code} className={cn("relative rounded-xl overflow-hidden aspect-[3/4] bg-surface-container group shadow-sm", plate.offset && "md:-mt-6")}>
            <Img src={images[i]} alt={plate.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent flex flex-col justify-end p-space-md">
              <span className="font-label-sm text-label-sm uppercase text-surface tracking-widest">{plate.code}</span>
              <p className="font-headline-sm text-headline-sm text-on-primary uppercase font-semibold">{plate.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary text-on-primary rounded-xl p-space-md lg:p-space-xl flex flex-col lg:flex-row items-center justify-between gap-space-lg shadow-xl relative overflow-hidden">
        <svg aria-hidden="true" className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none select-none" fill="currentColor" height="400" viewBox="0 0 100 100" width="400">
          <circle cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="2" />
          <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="2" />
        </svg>

        <div className="flex flex-col gap-space-xs max-w-xl z-10">
          <div className="flex flex-wrap items-center gap-space-xs">
            <span className="bg-secondary text-on-secondary font-label-sm text-label-sm uppercase px-space-sm py-0.5 rounded-full">Early Access Portal</span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-primary-container">Batch 08 Drop Announcement</span>
          </div>
          <h3 className="font-headline-xl-mobile text-headline-xl-mobile lg:font-headline-xl lg:text-headline-xl uppercase font-bold tracking-tight text-on-primary">NEVER MISS A 50-PIECE SILK-SCREEN DROP.</h3>
          <p className="font-body-md text-body-md text-on-primary-container">
            Each graphic print is strictly limited to 50 physical specimens worldwide. We do not re-run archival designs. Subscribe for private 2-hour early dispatch passwords.
          </p>
        </div>

        <div className="w-full lg:w-auto flex flex-col gap-space-xs z-10 shrink-0 items-center lg:items-start">
          <Newsletter variant="dark" placeholder="atelier.client@domain.com" cta="Join Registry" doneLabel="Joined" />
          <span className="font-label-sm text-label-sm text-on-primary-container uppercase tracking-wider text-center lg:text-left">Zero marketing spam • Drop notices only</span>
        </div>
      </div>
    </section>
  );
}
