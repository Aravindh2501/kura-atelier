export type ProductColor = { name: string; hex: string };
export type GalleryImage = { src: string; label: string; title: string };
export type ProductDetail = { icon: string; title: string; body: string };
export type SizeRow = { size: string; chest: number; length: number; shoulder: number; sleeve: number };

export type Product = {
  slug: string;
  name: string;
  price: number;
  subtitle: string;
  gsm: number;
  categories: string[];
  tag: string;
  colors: ProductColor[];
  sizes: string[];
  gallery: GalleryImage[];
  details: ProductDetail[];
  sizeGuide: SizeRow[];
  edition?: { badge: string; cut: number };
  fitLabel?: string;
  fit?: string;
  technique?: string;
  placement?: string;
  badge?: string;
  badgeStyle?: "primary" | "secondary" | "tertiary" | "neutral";
  breadcrumb?: string;
};
