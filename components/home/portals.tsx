import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Img } from "@/components/ui/img";
import type { Media } from "@/lib/media";

type Portal = { id: string; eyebrow: string; title: string; href: string; image: string; alt: string };

export function Portals({ images }: { images: Media["home"]["portals"] }) {
  const portals: Portal[] = [
    { id: "mens-portal", eyebrow: "Archive Studio", title: "Men's Archival", href: "/shop/men", image: images.men, alt: "Archival graphic tee for men" },
    { id: "womens-portal", eyebrow: "Botanica Studio", title: "Women's Botanical", href: "/shop/women", image: images.women, alt: "Botanical graphic tee for women" },
  ];

  return (
    <section className="w-full px-margin-mobile lg:px-margin pb-space-xl">
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-space-xs mb-space-md">
        <div>
          <span className="font-label-md text-label-md text-secondary uppercase font-semibold tracking-wider">Studio Dichotomy</span>
          <h2 className="font-headline-lg text-headline-lg text-primary uppercase tracking-tight">Curated Portals</h2>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
          Engineered garment proportions tailored to specific silhouettes. Choose your aesthetic frequency.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        {portals.map((portal) => (
          <div key={portal.id} id={portal.id} className="relative rounded-xl overflow-hidden bg-surface-container aspect-[3/4] group scroll-mt-32">
            <Img src={portal.image} alt={portal.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent flex flex-col justify-end p-space-lg">
              <span className="font-label-sm text-label-sm uppercase text-surface tracking-widest mb-space-xs">{portal.eyebrow}</span>
              <h3 className="font-headline-lg text-headline-lg text-on-primary uppercase font-bold tracking-tight mb-space-sm">{portal.title}</h3>
              <Link href={portal.href} className="inline-flex items-center justify-between w-full max-w-xs bg-surface text-primary font-label-md text-label-md uppercase px-space-md py-space-sm rounded-full hover:bg-surface-variant transition-all">
                <span>Explore Series</span>
                <Icon name="arrow_forward" size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
