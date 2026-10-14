"use client";
import Link from "next/link";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { CartLine } from "@/components/cart/cart-line";
import { ShippingProgress } from "@/components/cart/shipping-progress";
import { useCart } from "@/components/cart-provider";
import { money } from "@/lib/utils";

export function BagDrawer() {
  const { open, setOpen, items, count, subtotal } = useCart();
  const close = () => setOpen(false);

  return (
    <Dialog open={open} onClose={close} className="relative z-[60]">
      <DialogBackdrop transition className="fixed inset-0 bg-primary/60 backdrop-blur-sm transition-opacity duration-300 data-[closed]:opacity-0" />

      <div className="fixed inset-0 flex justify-end">
        <DialogPanel
          transition
          className="h-full w-full max-w-md bg-surface rounded-l-lg shadow-xl flex flex-col transition-transform duration-300 data-[closed]:translate-x-full"
        >
          <div className="flex items-center justify-between p-space-md">
            <DialogTitle className="font-headline-md text-headline-md font-bold text-primary">Your Bag ({count})</DialogTitle>
            <Button variant="secondary" size="icon" className="w-10 h-10" aria-label="Close bag" onClick={close}>
              <Icon name="close" />
            </Button>
          </div>

          <div className="px-space-md pb-space-sm">
            <ShippingProgress subtotal={subtotal} />
          </div>

          <div className="flex-1 overflow-y-auto px-space-md flex flex-col gap-space-sm">
            {items.length === 0 ? (
              <div className="m-auto text-center flex flex-col items-center gap-space-sm">
                <Icon name="shopping_bag" size={48} className="text-outline" />
                <p className="font-body-md text-body-md text-on-surface-variant">Your bag is empty.</p>
                <Button asChild className="px-space-lg font-label-md text-label-md uppercase tracking-wider">
                  <Link href="/shop/all" onClick={close}>Browse the catalog</Link>
                </Button>
              </div>
            ) : (
              items.map((item) => <CartLine key={item.key} item={item} compact onNavigate={close} />)
            )}
          </div>

          {items.length > 0 && (
            <div className="p-space-md flex flex-col gap-space-sm">
              <div className="flex justify-between font-headline-sm text-headline-sm text-primary">
                <span>Subtotal</span>
                <span>{money(subtotal)}</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Shipping and payment are completed at checkout.</p>
              <Button asChild className="h-auto py-space-md font-label-md text-label-md uppercase tracking-wider font-bold shadow-md gap-2">
                <Link href="/checkout" onClick={close}>
                  <Icon name="lock" size={16} />
                  Checkout
                </Link>
              </Button>
              <Button asChild variant="plain" size="none" className="justify-center font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-primary">
                <Link href="/cart" onClick={close}>View full bag</Link>
              </Button>
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
