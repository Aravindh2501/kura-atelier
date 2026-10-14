import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Plus_Jakarta_Sans, Space_Grotesk, Syne } from "next/font/google";
import "./globals.css";
import { BagDrawer } from "@/components/bag-drawer";
import { CartProvider } from "@/components/cart-provider";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WishlistProvider } from "@/components/wishlist-provider";
import { getMedia } from "@/lib/media";
import site from "@/data/site.json";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-jakarta", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-grotesk", display: "swap" });
const syne = Syne({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-syne", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${site.shortName} – Heavyweight Japanese cotton tees`, template: `%s | ${site.shortName}` },
  description: site.description,
};

export const viewport: Viewport = { themeColor: "#fbf9f5" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const media = await getMedia();

  return (
    <html lang="en" className={`${jakarta.variable} ${grotesk.variable} ${syne.variable}`}>
      <body className="bg-surface font-body-md text-body-md text-on-surface antialiased">
        <CartProvider>
          <WishlistProvider>
            <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-on-primary focus:px-4 focus:py-2 focus:rounded-full">
              Skip to content
            </a>
            {/* Header uses usePathname(), which Cache Components requires inside Suspense */}
            <Suspense fallback={<div className="h-28" />}>
              <Header logo={media.brand.logo} />
            </Suspense>
            <main id="content" className="w-full pt-28 bg-surface min-h-screen">
              {children}
            </main>
            <Footer />
            <BagDrawer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}