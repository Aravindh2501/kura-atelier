const ZERO_DECIMAL = new Set(["JPY", "KRW", "VND", "CLP", "ISK", "UGX", "XAF", "XOF"]);
const THREE_DECIMAL = new Set(["KWD", "BHD", "OMR", "JOD", "TND"]);

/** 78.5 USD -> 7850 (smallest unit, what gateways expect). */
export function toMinorUnits(amount: number, currency: string): number {
  const c = currency.toUpperCase();
  const factor = ZERO_DECIMAL.has(c) ? 1 : THREE_DECIMAL.has(c) ? 1000 : 100;
  return Math.round(amount * factor);
}
