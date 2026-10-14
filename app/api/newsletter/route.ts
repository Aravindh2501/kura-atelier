import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FILE = process.env.SUBSCRIBERS_DB_PATH ?? path.join(process.cwd(), ".data", "subscribers.json");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Stores the address in a JSON file. Swap for your mailing-list provider when ready. */
export async function POST(req: Request) {
  const { email } = (await req.json().catch(() => ({}))) as { email?: string };
  const clean = (email ?? "").trim().toLowerCase();
  if (!EMAIL.test(clean)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });

  let list: { email: string; at: string }[] = [];
  try {
    list = JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    /* first subscriber */
  }
  if (!list.some((s) => s.email === clean)) list.push({ email: clean, at: new Date().toISOString() });
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list, null, 2));
  return NextResponse.json({ ok: true });
}
