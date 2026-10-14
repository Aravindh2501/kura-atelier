import Link from "next/link";
import { Icon } from "@/components/ui/icon";

const pillars = [
  { icon: "layers", eyebrow: "Fiber Architecture", title: "280 GSM Jersey", body: "Carded long-staple Japanese ring-spun yarn with structural drape.", foot: "100% Bio-combed" },
  { icon: "water_drop", eyebrow: "Print Chemistry", title: "Discharge Inks", body: "Extracts fabric base dye naturally. Zero rubberized plastic hand-feel.", foot: "Skin-Soft Feel" },
  { icon: "autorenew", eyebrow: "Thermal Stabilization", title: "Enzyme Wash", body: "Natural organic bio-enzyme tumble. Silhouette remains exact over time.", foot: "< 1% Variance" },
  { icon: "straighten", eyebrow: "Collar Engineering", title: '1.25" Ribbed Collar', body: "Double-needle twill tape neck-banding stops collar stretching permanently.", foot: "Double Bound" },
];

export function Standard() {
  return (
    <section className="w-full px-margin-mobile lg:px-margin pb-space-xl">
      <div className="bg-surface-container rounded-xl p-space-md lg:p-space-lg flex flex-col gap-space-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-space-sm">
          <div>
            <span className="font-label-md text-label-md text-on-secondary-container uppercase tracking-wider font-semibold">Fabric Integrity &amp; Method</span>
            <h2 className="font-headline-lg text-headline-lg text-primary uppercase tracking-tight">The Atelier Standard</h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
            Every piece is built from the fiber up in small collaborative mills. We reject plastisol heat transfers in favor of archival breathable discharge silk-screening.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {pillars.map((p) => (
            <div key={p.title} className="bg-surface-container-lowest rounded-lg p-space-sm flex flex-col justify-between shadow-sm">
              <div className="flex flex-col gap-space-xs">
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary">
                  <Icon name={p.icon} size={18} />
                </div>
                <span className="font-label-sm text-label-sm uppercase text-secondary font-semibold">{p.eyebrow}</span>
                <h3 className="font-headline-sm text-[18px] text-primary uppercase font-semibold">{p.title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{p.body}</p>
              </div>
              <div className="pt-space-sm">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest font-semibold">{p.foot}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-surface-container-low rounded-lg p-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <Icon name="eco" size={28} className="text-secondary shrink-0" />
            <div>
              <p className="font-headline-sm text-headline-sm text-primary uppercase">GOTS &amp; OEKO-TEX STANDARD 100 CERTIFIED</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Spun in Wakayama, knit on vintage loopwheel machines, finished in Tokyo Studio.</p>
            </div>
          </div>
          <Link href="/info/provenance" className="bg-surface-container-high hover:bg-surface-variant text-on-surface px-space-md py-space-xs rounded-full font-label-md text-label-md uppercase transition-colors shrink-0">
            Read Mill Provenance
          </Link>
        </div>
      </div>
    </section>
  );
}
