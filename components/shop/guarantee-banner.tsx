import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import shop from "@/data/shop.json";

const { guarantee } = shop;

export function GuaranteeBanner() {
  return (
    <section className="w-full px-margin-mobile lg:px-margin pt-space-md">
      <div className="w-full bg-surface-container-high rounded-3xl p-space-lg lg:p-space-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-space-lg shadow-sm">
        <div className="flex items-start gap-space-md">
          <div className="w-14 h-14 rounded-2xl bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-md">
            <Icon name="verified_user" size={28} />
          </div>
          <div className="flex flex-col gap-1 max-w-xl">
            <span className="font-label-md text-label-md uppercase tracking-widest text-secondary font-bold">{guarantee.eyebrow}</span>
            <h2 className="font-headline-md text-headline-md uppercase text-primary font-bold tracking-tight">{guarantee.title}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">{guarantee.body}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-space-md shrink-0">
          {guarantee.points.map((point, i) => (
            <div key={point.title} className="contents">
              {i > 0 && <div className="w-px h-8 bg-outline-variant/40 hidden sm:block" />}
              <div className="flex flex-col items-center lg:items-end text-center lg:text-right font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                <span className="text-primary font-bold">{point.title}</span>
                <span>{point.note}</span>
              </div>
            </div>
          ))}
          <Link href={guarantee.cta.href} className="font-label-md text-label-md uppercase bg-surface text-primary hover:bg-primary hover:text-on-primary px-space-lg py-space-sm rounded-full transition-colors shadow-sm shrink-0">
            {guarantee.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
