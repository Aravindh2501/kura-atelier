import {
  AlertCircle, ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, Banknote, Check, CheckCircle2, ChevronDown,
  Circle, Cog, CreditCard, Droplet, FlaskConical, Grid3x3, Heart, Layers, LayoutGrid, Leaf, Loader2, Lock,
  Mail, Maximize, Menu, Minus, Package, PackageCheck, Palette, Plus, Receipt, RefreshCw, Ruler, Search,
  ShieldCheck, ShoppingBag, ShoppingCart, SlidersHorizontal, Sprout, Trash2, Truck, User, X, XCircle, ZoomIn,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

/**
 * One icon set for the whole store (lucide, inline SVG – no icon font, no flash of text).
 * Data files (products.json, shop.json) refer to icons by these string keys, so the
 * API can send icon names without knowing anything about React.
 */
const ICONS: Record<string, LucideIcon> = {
  add: Plus,
  add_shopping_cart: ShoppingCart,
  arrow_back: ArrowLeft,
  arrow_forward: ArrowRight,
  banknote: Banknote,
  check: Check,
  check_circle: CheckCircle2,
  close: X,
  cancel: XCircle,
  credit_card: CreditCard,
  crop_free: Maximize,
  eco: Leaf,
  error: AlertCircle,
  expand_more: ChevronDown,
  favorite: Heart,
  flask: FlaskConical,
  grid_view: LayoutGrid,
  layers: Layers,
  loader: Loader2,
  lock: Lock,
  mail: Mail,
  menu: Menu,
  north_east: ArrowUpRight,
  package: Package,
  package_check: PackageCheck,
  palette: Palette,
  processing: Cog,
  receipt: Receipt,
  autorenew: RefreshCw,
  remove: Minus,
  search: Search,
  shopping_bag: ShoppingBag,
  spa: Sprout,
  straighten: Ruler,
  trash: Trash2,
  truck: Truck,
  tune: SlidersHorizontal,
  user: User,
  verified: BadgeCheck,
  verified_user: ShieldCheck,
  view_comfy: Grid3x3,
  water_drop: Droplet,
  zoom_in: ZoomIn,
};

export type IconProps = Omit<LucideProps, "name"> & { name: string };

export function Icon({ name, size = 18, strokeWidth = 1.75, ...props }: IconProps) {
  const Glyph = ICONS[name] ?? Circle; // unknown names (from the API) fall back to a dot
  return <Glyph size={size} strokeWidth={strokeWidth} aria-hidden="true" {...props} />;
}
