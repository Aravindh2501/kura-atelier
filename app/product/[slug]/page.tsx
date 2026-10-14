import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { ProductView } from "@/components/product-view";
import { getProduct, getProducts, getRelated } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: `${p.name} – ${p.subtitle}. ${p.details[0]?.body ?? ""}`.trim(),
    openGraph: { images: p.gallery[0]?.src ? [p.gallery[0].src] : [] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const related = await getRelated(product.slug);

  return (
    <>
      <ProductView product={product} />
      <div className="w-full px-margin-mobile lg:px-margin mx-auto mt-space-xl flex flex-col gap-space-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-space-sm">
          <div>
            <span className="font-label-md text-label-md uppercase tracking-widest text-secondary font-semibold">Curation Atelier</span>
            <h2 className="font-headline-lg text-headline-lg text-primary font-bold">Complete The Look</h2>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">Pieces engineered in texture, grammage and tone to pair with the {product.name}.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          {related.map((r) => (
            <ProductCard key={r.slug} product={r} />
          ))}
        </div>
      </div>
    </>
  );
}
