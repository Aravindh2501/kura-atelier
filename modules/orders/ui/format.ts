/** Same output on server and client (fixed locale + UTC), so there are no hydration mismatches. */
export function formatDateTime(iso: string): string {
  return `${new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" })} UTC`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { dateStyle: "medium", timeZone: "UTC" });
}
