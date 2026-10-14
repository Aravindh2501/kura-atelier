import "server-only";
import productsData from "@/data/products.json";
import pagesData from "@/data/pages.json";
import { getMedia } from "@/lib/media";
import type { Product } from "@/lib/types";

/**
 * DATA LAYER – the only place pages read catalog data from.
 * To go live, replace the bodies with e.g.
 *   fetch(`${process.env.API_URL}/products`, { next: { revalidate: 60 } }).then(r => r.json())
 * and keep the return types.
 */

type RawProduct = Omit<Product, "gallery"> & { gallery: Omit<Product["gallery"][number], "src">[] };

/** Joins products.json with the image URLs from media.jsonc. */
async function loadProducts(): Promise<Product[]> {
  const media = await getMedia();
  return (productsData as RawProduct[]).map((p) => ({
    ...p,
    gallery: p.gallery.map((g, i) => ({ ...g, src: media.products[p.slug]?.[i] ?? media.products[p.slug]?.[0] ?? "" })),
  }));
}

export async function getProducts(category?: string): Promise<Product[]> {
  const all = await loadProducts();
  if (!category || category === "all") return all;
  return all.filter((p) => p.categories.includes(category));
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return (await loadProducts()).find((p) => p.slug === slug);
}

export async function getRelated(slug: string, limit = 3): Promise<Product[]> {
  return (await loadProducts()).filter((p) => p.slug !== slug).slice(0, limit);
}

type InfoPage = { title: string; body: string };
export async function getPage(slug: string): Promise<InfoPage | undefined> {
  return (pagesData as Record<string, InfoPage>)[slug];
}
export const pageSlugs = Object.keys(pagesData);
