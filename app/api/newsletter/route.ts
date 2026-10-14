import { NextResponse } from "next/server";
import type { MongoClient } from "mongodb";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

let clientPromise: Promise<MongoClient> | undefined;

async function getClient(uri: string) {
  if (!clientPromise) {
    const { MongoClient } = await import("mongodb");
    clientPromise = new MongoClient(uri).connect();
  }
  return clientPromise;
}

export async function POST(req: Request) {
  const { email } = (await req.json().catch(() => ({}))) as { email?: string };
  const clean = (email ?? "").trim().toLowerCase();
  if (!EMAIL.test(clean)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const uri = process.env.MONGODB_URI;

  // TEMPLATE MODE: no database configured yet, so the signup is only logged.
  // Add MONGODB_URI (and optionally MONGODB_DB) in .env / Vercel to store subscribers.
  if (!uri) {
    console.warn("Newsletter signup (NOT stored, MONGODB_URI missing):", clean);
    return NextResponse.json({ ok: true });
  }

  try {
    const client = await getClient(uri);
    await client
      .db(process.env.MONGODB_DB ?? "kura-atelier")
      .collection("subscribers")
      .updateOne({ email: clean }, { $setOnInsert: { email: clean, at: new Date() } }, { upsert: true });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Newsletter save failed:", err);
    return NextResponse.json({ error: "Could not subscribe right now. Please try again." }, { status: 500 });
  }
}
