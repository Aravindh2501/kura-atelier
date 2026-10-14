"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { CartLine } from "@/components/cart/cart-line";
import { ShippingProgress } from "@/components/cart/shipping-progress";
import { OrderSummary } from "@/components/checkout/order-summary";
import { useCart } from "@/components/cart-provider";

export default function CartPage() {
  const { items, subtotal, hydrated } = useCart();

  return (
    <div className="w-full px-margin-mobile lg:px-margin mx-auto py-space-md flex flex-col gap-space-lg">
      <h1 className="font-headline-lg text-headline-lg text-primary font-bold">Your Bag</h1>

      {!hydrated ? null : items.length === 0 ? (
        <div className="flex flex-col items-start gap-space-sm">
          <p className="font-body-md text-body-md text-on-surface-variant">Your bag is empty.</p>
          <Button asChild className="px-space-lg font-label-md text-label-md uppercase">
            <Link href="/shop/all">Browse the catalog</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          <div className="lg:col-span-8 flex flex-col gap-space-sm">
            <ShippingProgress subtotal={subtotal} />
            {items.map((item) => (
              <CartLine key={item.key} item={item} />
            ))}
          </div>
          <div className="lg:col-span-4">
            <OrderSummary items={items}>
              <Button asChild className="h-auto py-space-md font-label-md text-label-md uppercase tracking-wider font-bold shadow-md gap-2">
                <Link href="/checkout">
                  <Icon name="lock" size={16} />
                  Proceed to checkout
                </Link>
              </Button>
            </OrderSummary>
          </div>
        </div>
      )}
    </div>
  );
}
