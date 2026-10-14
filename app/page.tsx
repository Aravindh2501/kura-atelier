import { Edition } from "@/components/edition";
import { Hero } from "@/components/home/hero";
import { Lookbook } from "@/components/home/lookbook";
import { Portals } from "@/components/home/portals";
import { Standard } from "@/components/home/standard";
import { getProducts } from "@/lib/api";
import { getMedia } from "@/lib/media";

export default async function Home() {
  const [editions, media] = await Promise.all([getProducts("edition"), getMedia()]);

  return (
    <div className="flex flex-col w-full">
      <Hero images={media.home.hero} />
      <Portals images={media.home.portals} />
      <Standard />

      <section className="w-full px-margin-mobile lg:px-margin pb-space-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-xs mb-space-md">
          <div>
            <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold tracking-wider">Curated Selection</span>
            <h2 className="font-headline-lg text-headline-lg text-primary uppercase tracking-tight">Hand-Screened Editions</h2>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Front / Back View</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {editions.map((p) => (
            <Edition key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <Lookbook images={media.home.lookbook} />
    </div>
  );
}
