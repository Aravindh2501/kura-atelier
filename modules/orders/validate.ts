import type { Address, Customer } from "./types";

export type FieldErrors = Record<string, string>;
export type Parsed<T> = { ok: true; data: T } | { ok: false; errors: FieldErrors };

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+\d][\d\s\-()]{6,17}$/;

export function parseCustomer(raw: unknown): Parsed<Customer> {
  const r = (raw ?? {}) as Record<string, unknown>;
  const data = { name: str(r.name), email: str(r.email).toLowerCase(), phone: str(r.phone) };
  const errors: FieldErrors = {};
  if (data.name.length < 2) errors.name = "Enter your full name.";
  if (!EMAIL.test(data.email)) errors.email = "Enter a valid email address.";
  if (!PHONE.test(data.phone)) errors.phone = "Enter a valid phone number.";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

export function parseAddress(raw: unknown, countries?: string[]): Parsed<Address> {
  const r = (raw ?? {}) as Record<string, unknown>;
  const data: Address = {
    line1: str(r.line1),
    line2: str(r.line2) || undefined,
    city: str(r.city),
    state: str(r.state),
    postalCode: str(r.postalCode),
    country: str(r.country),
  };
  const errors: FieldErrors = {};
  if (data.line1.length < 3) errors.line1 = "Enter your street address.";
  if (!data.city) errors.city = "Enter your city.";
  if (!data.state) errors.state = "Enter your state / region.";
  if (data.postalCode.length < 3) errors.postalCode = "Enter your postal code.";
  if (!data.country || (countries && !countries.includes(data.country))) errors.country = "Choose a country.";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
