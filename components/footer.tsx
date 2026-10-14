import Link from "next/link";
import { Newsletter } from "@/components/newsletter";
import site from "@/data/site.json";

const heading = "font-label-md text-label-md uppercase text-on-surface font-semibold tracking-wider";
const { footer } = site;

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-low text-on-surface-variant pt-space-xl pb-space-lg">
      <div className="w-full px-margin-mobile lg:px-margin mx-auto flex flex-col gap-space-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-gutter items-start">
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            <span className="font-headline-sm text-headline-sm text-primary uppercase font-bold tracking-tight">{footer.newsletterTitle}</span>
            <p className="font-body-md text-body-md max-w-md">{footer.newsletterBody}</p>
            <Newsletter />
            <div className="flex items-center gap-space-sm pt-space-xs">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="font-label-sm text-label-sm tracking-widest uppercase">{footer.promise}</span>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-space-sm">
            <span className={heading}>{footer.studiosTitle}</span>
            {footer.studios.map((studio) => (
              <div key={studio.name} className="font-body-sm text-body-sm flex flex-col gap-1">
                <p className="text-on-surface font-medium">{studio.name}</p>
                <p>{studio.address}</p>
              </div>
            ))}
          </div>

          {footer.columns.map((column, index) => (
            <div key={column.title} className={`${index === 0 ? "lg:col-span-2" : "lg:col-span-3"} flex flex-col gap-space-sm`}>
              <span className={heading}>{column.title}</span>
              <div className="flex flex-col gap-2 font-body-sm text-body-sm">
                {column.links.map((link) => (
                  <Link key={link.href} href={link.href} className="hover:text-on-surface transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-lg">
          <p className="font-label-sm text-label-sm uppercase tracking-widest">{footer.legal}</p>
          <div className="flex items-center gap-space-lg font-label-sm text-label-sm uppercase tracking-widest">
            {footer.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
