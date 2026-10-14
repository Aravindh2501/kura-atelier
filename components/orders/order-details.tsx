import { Img } from "@/components/ui/img";
import { OrderHistory, OrderTimeline, formatDate } from "@/modules/orders/ui";
import type { PublicOrder } from "@/modules/orders";
import { STATUS_META } from "@/modules/orders";
import { money } from "@/lib/utils";

const card = "bg-surface-container-low rounded-lg p-space-lg shadow-sm flex flex-col gap-space-sm";
const heading = "font-headline-sm text-headline-sm text-primary font-semibold";
const paymentLabel = { paid: "Paid", unpaid: "Awaiting payment", cod: "Pay on delivery", failed: "Payment failed", refunded: "Refunded" } as const;

/** Timeline + items + totals + address. Used by the order page and the tracking page. */
export function OrderDetails({ order }: { order: PublicOrder }) {
  const a = order.shippingAddress;
  const s = order.shipment;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
      <div className="lg:col-span-7 flex flex-col gap-space-md">
        <section className={card}>
          <div className="flex items-center justify-between gap-space-sm">
            <h2 className={heading}>Tracking</h2>
            <span className="font-label-md text-label-md uppercase tracking-wider bg-secondary-container text-on-secondary-container px-space-sm py-0.5 rounded-full">{STATUS_META[order.status].label}</span>
          </div>
          <OrderTimeline order={order} />
          {s && (s.carrier || s.trackingNumber || s.estimatedDelivery) && (
            <dl className="grid grid-cols-2 gap-space-sm bg-surface rounded-xl p-space-sm font-body-sm text-body-sm">
              {s.carrier && <div><dt className="text-on-surface-variant">Carrier</dt><dd className="font-semibold text-primary">{s.carrier}</dd></div>}
              {s.trackingNumber && (
                <div>
                  <dt className="text-on-surface-variant">Tracking number</dt>
                  <dd className="font-semibold text-primary break-all">
                    {s.trackingUrl ? <a href={s.trackingUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{s.trackingNumber}</a> : s.trackingNumber}
                  </dd>
                </div>
              )}
              {s.estimatedDelivery && <div><dt className="text-on-surface-variant">Estimated delivery</dt><dd className="font-semibold text-primary">{formatDate(s.estimatedDelivery)}</dd></div>}
            </dl>
          )}
        </section>

        <section className={card}>
          <h2 className={heading}>History</h2>
          <OrderHistory order={order} />
        </section>
      </div>

      <div className="lg:col-span-5 flex flex-col gap-space-md">
        <section className={card}>
          <h2 className={heading}>Items</h2>
          <ul className="flex flex-col gap-space-sm">
            {order.items.map((item, i) => (
              <li key={`${item.productId}-${i}`} className="flex items-center gap-space-sm">
                <div className="w-14 aspect-[4/5] rounded-lg overflow-hidden bg-surface-container shrink-0">{item.image && <Img src={item.image} alt="" className="w-full h-full object-cover" />}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-body-sm text-body-sm font-semibold text-primary truncate">{item.name} × {item.qty}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase truncate">{Object.values(item.options).join(" / ")}</p>
                </div>
                <span className="font-label-md text-label-md font-bold">{money(item.unitPrice * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-1 pt-space-xs border-t border-outline-variant/40 font-body-md text-body-md">
            <div className="flex justify-between"><span>Subtotal</span><span>{money(order.totals.subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{order.totals.shipping === 0 ? "Complimentary" : money(order.totals.shipping)}</span></div>
            <div className="flex justify-between font-headline-sm text-headline-sm text-primary"><span>Total</span><span>{money(order.totals.total)}</span></div>
          </div>
        </section>

        <section className={card}>
          <h2 className={heading}>Delivery &amp; payment</h2>
          <address className="not-italic font-body-sm text-body-sm text-on-surface-variant">
            <span className="text-on-surface font-semibold">{order.customer.name}</span><br />
            {a.line1}{a.line2 && `, ${a.line2}`}<br />
            {a.city}, {a.state} {a.postalCode}<br />
            {a.country}
          </address>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Payment: <span className="text-on-surface font-semibold">{paymentLabel[order.payment.status]}</span>
          </p>
        </section>
      </div>
    </div>
  );
}
