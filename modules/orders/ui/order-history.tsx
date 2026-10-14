import type { PublicOrder } from "../types";
import { formatDateTime } from "./format";

/** Every recorded event, newest first (payment notes, status changes…). */
export function OrderHistory({ order }: { order: PublicOrder }) {
  return (
    <ul className="flex flex-col gap-2 font-body-sm text-body-sm">
      {[...order.events].reverse().map((event, i) => (
        <li key={`${event.at}-${i}`} className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant shrink-0">{formatDateTime(event.at)}</span>
          <span className="text-on-surface">{event.note ?? event.status}</span>
        </li>
      ))}
    </ul>
  );
}
