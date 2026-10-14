import type { Metadata } from "next";
import { WishlistGrid } from "@/components/wishlist-grid";
import { getProducts } from "@/lib/api";

export const metadata: Metadata = { title: "Wishlist" };

export default async function WishlistPage() {
  const products = await getProducts();
  return (
    <div className="w-full px-margin-mobile lg:px-margin mx-auto py-space-md flex flex-col gap-space-lg">
      <h1 className="font-headline-lg text-headline-lg text-primary font-bold">Wishlist</h1>
      <WishlistGrid products={products} />
    </div>
  );
}
