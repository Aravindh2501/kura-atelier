"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  /** slug|color|size|cut – identifies a unique line. */
  key: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  /** Edition cut (I–IV), only for edition pieces. */
  cut?: string;
  qty: number;
};

export type NewCartItem = Omit<CartItem, "key" | "qty">;

type CartContext = {
  items: CartItem[];
  count: number;
  subtotal: number;
  open: boolean;
  /** false until the saved bag has been read from the browser */
  hydrated: boolean;
  setOpen: (open: boolean) => void;
  add: (item: NewCartItem) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "kura-bag";
const Ctx = createContext<CartContext | null>(null);

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

const lineKey = (i: NewCartItem) => [i.slug, i.color, i.size, i.cut ?? ""].join("|");

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(saved)) setItems(saved);
    } catch {
      /* corrupted storage – start with an empty bag */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const add = useCallback((item: NewCartItem) => {
    const key = lineKey(item);
    setItems((cur) =>
      cur.some((x) => x.key === key)
        ? cur.map((x) => (x.key === key ? { ...x, qty: Math.min(x.qty + 1, 10) } : x))
        : [...cur, { ...item, key, qty: 1 }],
    );
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((cur) => (qty < 1 ? cur.filter((x) => x.key !== key) : cur.map((x) => (x.key === key ? { ...x, qty: Math.min(qty, 10) } : x))));
  }, []);

  const remove = useCallback((key: string) => setItems((cur) => cur.filter((x) => x.key !== key)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContext>(
    () => ({
      items,
      open,
      hydrated,
      setOpen,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.qty * i.price, 0),
      add,
      setQty,
      remove,
      clear,
    }),
    [items, open, hydrated, add, setQty, remove, clear],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
