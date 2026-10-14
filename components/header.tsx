"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Img } from "@/components/ui/img";
import { useCart } from "@/components/cart-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { cn } from "@/lib/utils";
import site from "@/data/site.json";

const iconButton =
  "relative flex items-center justify-center w-9 h-9 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors";

/** Search field that drops down under the bar when the magnifier is pressed. */
function SearchPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/shop/all?q=${encodeURIComponent(q)}` : "/shop/all");
    onClose();
  }

  return (
    <form
      role="search"
      onSubmit={submit}
      className="absolute left-0 right-0 top-full mt-2 flex items-center gap-space-xs bg-surface rounded-full px-space-md py-space-xs shadow-[0_8px_24px_-4px_rgba(78,66,52,0.12)]"
    >
      <Icon name="search" size={18} className="text-on-surface-variant shrink-0" />
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="search"
        aria-label="Search the catalog"
        placeholder="Search graphics, GSM, cuts..."
        className="flex-1 bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none py-1"
      />
      <Button variant="plain" size="none" aria-label="Close search" onClick={onClose} className={iconButton}>
        <Icon name="close" size={18} />
      </Button>
    </form>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const path = usePathname();
  return (
    <Dialog open={open} onClose={onClose} className="relative z-[60] md:hidden">
      <DialogBackdrop transition className="fixed inset-0 bg-primary/60 backdrop-blur-sm transition-opacity duration-300 data-[closed]:opacity-0" />
      <div className="fixed inset-0 flex">
        <DialogPanel transition className="h-full w-full max-w-sm bg-surface rounded-r-lg shadow-xl flex flex-col gap-space-md p-space-md transition-transform duration-300 data-[closed]:-translate-x-full">
          <div className="flex items-center justify-between">
            <DialogTitle className="font-headline-sm text-headline-sm uppercase tracking-tight text-primary font-semibold">{site.name}</DialogTitle>
            <Button variant="secondary" size="icon" className="w-10 h-10" aria-label="Close menu" onClick={onClose}>
              <Icon name="close" />
            </Button>
          </div>

          <nav className="flex flex-col gap-1" aria-label="Main">
            {site.nav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "font-label-lg text-label-lg uppercase tracking-wider px-space-md py-space-sm rounded-full transition-colors",
                  path === link.href ? "bg-surface-container-high text-on-surface" : "text-on-surface-variant hover:bg-surface-container-low",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/track" onClick={onClose} className="flex items-center gap-2 font-label-lg text-label-lg uppercase tracking-wider px-space-md py-space-sm rounded-full text-on-surface-variant hover:bg-surface-container-low">
              <Icon name="package" size={18} />
              Track an order
            </Link>
          </nav>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export function Header({ logo }: { logo: string }) {
  const path = usePathname();
  const { count, setOpen, hydrated } = useCart();
  const wishlist = useWishlist();
  const [menu, setMenu] = useState(false);
  const [searching, setSearching] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      <div className="w-full bg-primary text-on-primary py-space-xs px-margin-mobile lg:px-margin text-center flex items-center justify-center gap-space-sm">
        <span className="hidden sm:inline bg-on-primary/10 text-on-primary font-label-sm text-label-sm uppercase px-space-sm py-0.5 rounded-full">{site.announcement.badge}</span>
        <span className="font-label-md text-label-md tracking-wider uppercase truncate">{site.announcement.text}</span>
      </div>

      <div className="relative h-20 w-full px-margin-mobile lg:px-margin flex items-center">
        {/* three columns so the nav is truly centred: logo | nav | actions */}
        <div className="relative w-full h-16 bg-surface/90 backdrop-blur-md rounded-full px-space-md shadow-[0_8px_24px_-4px_rgba(78,66,52,0.06),0_2px_6px_-1px_rgba(78,66,52,0.03)] grid grid-cols-[1fr_auto_1fr] items-center gap-space-md">
          <Link href="/" className="flex items-center gap-space-sm justify-self-start min-w-0" aria-label={`${site.name} – home`}>
            <Img src={logo} alt="" className="h-9 w-9 rounded-md object-cover shrink-0" />
            <span className="font-headline-sm text-headline-sm uppercase tracking-tight text-primary font-semibold truncate">{site.name}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-space-md" aria-label="Main">
            {site.nav.map((link) => {
              const active = path === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn("font-label-md text-label-md uppercase tracking-wider px-space-xs py-1 transition-colors", active ? "text-primary font-semibold" : "text-on-surface-variant hover:text-primary")}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="col-start-3 md:col-start-auto flex items-center justify-end gap-space-xs">
            <Button variant="plain" size="none" aria-label="Search" aria-expanded={searching} onClick={() => setSearching((s) => !s)} className={iconButton}>
              <Icon name="search" size={20} />
            </Button>

            <span className="hidden sm:flex items-center font-label-md text-label-md text-on-surface-variant px-space-xs" title="Store currency">
              {site.currency.code}
            </span>

            <Link href="/wishlist" className={iconButton} aria-label={`Wishlist, ${wishlist.count} saved`}>
              <Icon name="favorite" size={20} />
              {wishlist.count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-secondary text-on-secondary font-label-sm text-[9px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center">{wishlist.count}</span>
              )}
            </Link>

            <Button variant="plain" size="none" onClick={() => setOpen(true)} aria-label={`Open bag, ${count} items`} className="bg-primary text-on-primary hover:bg-primary-container px-space-md py-space-xs rounded-full gap-space-xs">
              <Icon name="shopping_bag" size={18} />
              <span className="font-label-md text-label-md uppercase tracking-wider font-bold">Bag ({hydrated ? count : 0})</span>
            </Button>

            <Button variant="plain" size="none" aria-label="Open menu" onClick={() => setMenu(true)} className={cn(iconButton, "md:hidden")}>
              <Icon name="menu" size={22} />
            </Button>
          </div>

          {searching && <SearchPanel onClose={() => setSearching(false)} />}
        </div>
      </div>

      <MobileMenu open={menu} onClose={() => setMenu(false)} />
    </header>
  );
}