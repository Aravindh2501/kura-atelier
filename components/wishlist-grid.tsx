"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { useWishlist } from "@/components/wishlist-provider";
import type { Product } from "@/lib/types";

export function WishlistGrid({ products }: { products: Product[] }) {
  const { slugs } = useWishlist();
  const saved = products.filter((p) => slugs.includes(p.slug));

  if (saved.length === 0) {
    return (
      <div className="flex flex-col items-start gap-space-sm">
        <p className="font-body-md text-body-md text-on-surface-variant">Nothing saved yet. Tap the heart on a product to keep it here.</p>
        <Button asChild className="px-space-lg font-label-md text-label-md uppercase">
          <Link href="/shop/all">Browse the catalog</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
      {saved.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}
