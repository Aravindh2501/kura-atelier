import { randomBytes } from "node:crypto";

const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // Crockford base32 (no I, L, O, U)

/** e.g. KUR-7Q4M2XAB – easy to read out loud, hard to guess. */
export function generateOrderId(prefix: string, length = 8): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return `${prefix}-${out}`;
}

/** Secret that proves the visitor is the buyer. */
export const generateAccessToken = () => randomBytes(18).toString("base64url");
