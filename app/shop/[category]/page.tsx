import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopView } from "@/components/shop/shop-view";
import { getProducts } from "@/lib/api";
import shop from "@/data/shop.json";

type Props = { params: Promise<{ category: string }> };

const tabKeys = shop.tabs.map((t) => t.key);
const collections = shop.collections as Record<string, string>;

export function generateStaticParams() {
  return [...tabKeys, ...Object.keys(collections)].map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const label = collections[category] ?? shop.tabs.find((t) => t.key === category)?.label ?? "Shop";
  return { title: label };
}

export default async function Shop({ params }: Props) {
  const { category } = await params;
  const isTab = tabKeys.includes(category);
  // Tabs (all/men/women/unisex) filter inside the page; collections (drops/archive) narrow the catalog first.
  const products = isTab ? await getProducts() : await getProducts(category);

  return (
    // useSearchParams (for ?q=) needs a Suspense boundary; key resets filters when the category changes.
    <Suspense fallback={<div className="min-h-screen" />}>
      <ShopView key={category} products={products} initialTab={isTab ? category : "all"} collection={collections[category]} />
    </Suspense>
  );
}
