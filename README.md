# KURA ATELIER storefront

## Install

```bash
npm i next react react-dom
npm i @headlessui/react lucide-react @radix-ui/react-slot class-variance-authority clsx tailwind-merge
npm i -D tailwindcss @tailwindcss/postcss typescript @types/react @types/node
cp .env.example .env.local
npm run dev
```

Works without any keys: the **Test payment (demo)** and **Cash on delivery** methods appear automatically in development.
Add `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` to enable real online payments.

## Where things live

| What | Where |
| --- | --- |
| **All image URLs** | `data/media.jsonc` (nothing else contains a URL) |
| Products / copy / nav / footer | `data/products.json`, `data/shop.json`, `data/site.json`, `data/pages.json` |
| Reading data (swap for your API here) | `lib/api.ts`, `lib/media.ts` |
| Reusable payments | `modules/payments/` |
| Reusable order tracking | `modules/orders/` |
| This store's wiring of the two modules | `lib/commerce.ts` + `app/api/*` |

## Reusing the modules in another project

1. Copy `modules/payments` and `modules/orders`.
2. Copy `lib/commerce.ts` and the `app/api/{checkout,payments,orders}` routes; change `priceCart()` to read *that* project's catalog.
3. Copy the `.env.example` keys. Add `lucide-react` (the module UI uses it).
4. Add a provider (Stripe, PayU…) by implementing `PaymentProvider` (see `providers/razorpay.ts`) and listing it in `lib/commerce.ts`.
5. Use a database by implementing `OrderRepository` (3 methods) instead of `createFileOrderStore`.

## Order flow

`/checkout` → `POST /api/checkout` (re-prices the bag on the server, creates the order, opens the gateway) → Razorpay popup →
`POST /api/payments/verify` (signature check) **and** the webhook (`/api/payments/webhook/razorpay`) → order `confirmed` → `/orders/KUR-XXXX?t=…`.

Move an order forward (you / a dashboard / a courier integration):

```bash
curl -X PATCH https://YOUR-DOMAIN/api/orders/KUR-XXXXXXXX \
  -H "x-admin-token: $ORDERS_ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{"status":"shipped","note":"Handed to DHL","shipment":{"carrier":"DHL","trackingNumber":"123","estimatedDelivery":"2026-10-20"}}'
```

Statuses: `confirmed → processing → shipped → out_for_delivery → delivered` (or `cancelled` before shipping).
Shoppers track at `/track` with order number + email.

## Notes

- The JSON order store needs a persistent disk (VPS/local). On serverless hosts (Vercel) implement `OrderRepository` with a database.
- USD is set in `data/site.json`. Razorpay must have international payments enabled for non-INR currencies; for India-only use `INR`.

