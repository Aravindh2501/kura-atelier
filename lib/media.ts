import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseJsonc } from "@/lib/jsonc";

/**
 * Image URLs live ONLY in data/media.jsonc.
 * To move them to your API later, change `load()` to a fetch() – nothing else changes.
 */
export type Media = {
  brand: { logo: string };
  home: {
    hero: { main: string; macro: string; botanical: string };
    portals: { men: string; women: string };
    lookbook: string[];
  };
  products: Record<string, string[]>;
};

const FILE = path.join(process.cwd(), "data", "media.jsonc");
const load = async (): Promise<Media> => parseJsonc<Media>(await readFile(FILE, "utf8"));

let cached: Promise<Media> | null = null;
export function getMedia(): Promise<Media> {
  // In dev we re-read the file so edits show up immediately.
  if (process.env.NODE_ENV !== "production") return load();
  return (cached ??= load());
}
