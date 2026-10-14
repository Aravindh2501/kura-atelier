import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage, pageSlugs } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return pageSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPage((await params).slug);
  return { title: page?.title };
}

export default async function Info({ params }: Props) {
  const page = await getPage((await params).slug);
  if (!page) notFound();

  return (
    <div className="w-full px-margin-mobile lg:px-margin mx-auto py-space-md max-w-3xl flex flex-col gap-space-md">
      <h1 className="font-headline-lg text-headline-lg text-primary font-bold">{page.title}</h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant">{page.body}</p>
    </div>
  );
}
