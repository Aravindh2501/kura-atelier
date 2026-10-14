import Link from "next/link";
import { Img } from "@/components/ui/img";
import type { Media } from "@/lib/media";

const zoomImage = "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105";

export function Hero({ images }: { images: Media["home"]["hero"] }) {
  return (
    <section className="relative w-full px-margin-mobile lg:px-margin pb-space-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch">
        <div className="lg:col-span-5 flex flex-col justify-between p-space-md lg:p-space-lg bg-surface-container-low rounded-lg shadow-sm">
          <div className="flex flex-col gap-space-lg py-space-sm">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-semibold">Series 07 / Solstice</span>
            <h1 className="font-headline-xl-mobile text-headline-xl-mobile lg:font-headline-xl lg:text-headline-xl text-primary tracking-tight uppercase leading-none">
              WEARABLE ART
              <br />
              <span className="text-on-surface-variant font-light">/ 280 GSM</span>
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              Limited-run combed jersey tees hand-screened with water-based archival inks in Tokyo.
            </p>
            <div className="flex flex-wrap items-center gap-space-sm pt-space-md">
              <Link href="#mens-portal" className="bg-primary text-on-primary font-label-md text-label-md uppercase px-space-lg py-space-sm rounded-full hover:bg-primary-container transition-all">
                Explore Men
              </Link>
              <Link href="#womens-portal" className="bg-surface text-on-surface font-label-md text-label-md uppercase px-space-lg py-space-sm rounded-full hover:bg-surface-variant transition-all">
                Explore Women
              </Link>
            </div>
          </div>
          <div className="pt-space-md">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Hand Screened in Tokyo</span>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-space-md">
          <div className="md:col-span-8 relative rounded-lg overflow-hidden min-h-[440px] shadow-sm bg-surface-container-high group">
            <Img
              src={images.main}
              alt="Model in an oversized boxy 280 GSM ecru t-shirt with a brutalist black and terracotta typographic print across the shoulder blades"
              className={`absolute inset-0 ${zoomImage}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent flex flex-col justify-end p-space-md">
              <span className="bg-surface/90 backdrop-blur-md text-primary font-label-sm text-label-sm uppercase px-space-sm py-1 rounded-full w-fit mb-space-xs">Plate No. 07-A</span>
              <p className="font-headline-sm text-headline-sm text-on-primary uppercase font-bold tracking-tight">Oversized Concrete Block Cut</p>
              <p className="font-label-sm text-label-sm text-surface-variant uppercase">Model is 185cm wearing Studio Size II (L)</p>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col gap-space-md justify-between">
            <div className="relative rounded-lg overflow-hidden h-52 bg-surface-container shadow-sm group">
              <Img src={images.macro} alt="Macro close-up of thick 280 GSM cotton knit ribs with discharge pigment in the fibres" className={zoomImage} />
              <div className="absolute top-space-xs right-space-xs bg-surface/85 backdrop-blur-sm px-space-xs py-0.5 rounded-full">
                <span className="font-label-sm text-label-sm uppercase text-primary">Knit Macro 1:1</span>
              </div>
              <div className="absolute bottom-space-xs left-space-xs right-space-xs bg-surface-container-low/95 p-space-xs rounded-sm">
                <p className="font-label-sm text-label-sm uppercase font-semibold text-primary">Micro-Ribbed 1.25&quot; Collar</p>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden h-56 bg-surface-container shadow-sm group">
              <Img src={images.botanical} alt="Relaxed drop-shoulder faded terracotta graphic tee with a botanical lithograph print on the chest" className={zoomImage} />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent flex flex-col justify-end p-space-sm">
                <span className="font-label-sm text-label-sm uppercase text-on-primary tracking-wider">Botanical Series • 04</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
