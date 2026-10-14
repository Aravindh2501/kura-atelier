import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="w-full px-margin-mobile lg:px-margin py-space-xl flex flex-col items-center gap-space-sm text-center">
      <span className="font-label-md text-label-md uppercase tracking-widest text-secondary font-bold">Error 404</span>
      <h1 className="font-headline-lg text-headline-lg text-primary font-bold">This page is not in the archive.</h1>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-md">The link may be old, or the piece is no longer available.</p>
      <Button asChild className="px-space-lg font-label-md text-label-md uppercase">
        <Link href="/shop/all">Browse the catalog</Link>
      </Button>
    </div>
  );
}
