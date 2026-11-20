# Heritage By Nancy — Authentic Designer Perfumes

A luxury fragrance retail website with WhatsApp-first ordering and a complete
admin dashboard, built by **SamTech Labs**.

The storefront presents the collection editorially (dark, gold and ivory
identity), and every "Order on WhatsApp" button composes a fully-formatted
message — product, brand, size, quantity, total and a link to the product page.
The owner manages products, categories, stock, business info and enquiries from
`/admin` — no code editing required.

---

## Tech stack

| Layer       | Choice |
|-------------|--------|
| Framework   | Next.js 16 (App Router, Server Actions, Route Handlers) |
| Language    | TypeScript |
| Styling     | Tailwind CSS v4 |
| Database    | MongoDB (Mongoose) — Atlas in production, local `mongod` in dev |
| Auth        | Custom session JWT (`jose`, HS256) in httpOnly cookies + bcrypt password hashing |
| Images      | `next/image` + Cloudinary (admin uploads) or any pasted image URL |
| Validation  | zod (server-side everywhere) |
| Rate limits | In-memory fixed-window limiter (login, contact, uploads) |

## Quick start (local)

```powershell
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local   # then edit values (see table below)

# 3. Start MongoDB — either a local mongod on 27017,
#    or point MONGODB_URI at a MongoDB Atlas cluster instead.

# 4. Create the sample catalogue + first admin account
npm run seed

# 5. Run the dev server
npm run dev
```

Open http://localhost:3000 (storefront) and http://localhost:3000/admin (console).

> **Note:** the public site works even without a database — it serves a small
> bundled sample catalogue. Admin, enquiries and anything you edit require
> MongoDB. The production build does **not** need a live database at build time.

The bundled sample catalogue is **sample data**: placeholder products, prices
and stock photography. Replace everything via Admin → Products / Settings.
No bottle shown is the client's physical stock until they say so.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run seed` | Upsert sample catalogue + settings; create the first admin (if none) |
| `npm run create-admin -- you@example.com "Password" "Name"` | Create an admin or **reset** an admin password (recovery path) |

## Environment variables

Copy `.env.example` → `.env.local`. Never commit real secrets.

| Variable | Required | Used for |
|---|---|---|
| `MONGODB_URI` | Yes (admin + enquiries) | DB connection. Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/heritagebynancy?retryWrites=true&w=majority` |
| `SESSION_SECRET` | Yes (prod) | HS256 key for admin sessions, ≥ 32 chars. Generate: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
| `APP_SITE_URL` | Yes (prod) | Absolute URLs in metadata, sitemap, OG tags (`NEXT_PUBLIC_SITE_URL` still accepted) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Bootstrap only | First admin via `npm run seed` (only when no admin exists) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Optional | Admin image uploads. Without them, paste image URLs manually |

## Accounts & roles

- **SamTech Labs — `superadmin`**: full access including the Team console (`/admin/users`)
  to create, reset and remove console accounts.
- **Client — `admin` (Store Admin)**: store operations — products, categories, enquiries,
  Settings (WhatsApp number, hours, address, socials, hero copy) — everything except Team management.
- Accounts are created via the Team console (super admin) or `npm run create-admin`.
  The bootstrap/first account from `npm run seed` is the super admin. Server-side checks
  enforce the roles on every action; the UI only hides links cosmetically.
- There is no self-registration. If anyone forgets a password, the super admin resets it from
  Team (or `npm run create-admin <email> "<new password>" "<name>"` from a machine with `MONGODB_URI`).

## The admin dashboard (`/admin`)

- **Overview** — live counts (active products, featured, out of stock, low stock, new enquiries) + latest enquiries + quick actions.
- **Products** — search, add, edit, delete; feature on homepage; toggle visibility; stock badges (Out / only N left / in stock); prices per size; multiple images (upload via Cloudinary or paste URLs).
- **Categories** — add/delete; deletion is blocked while products still reference a category.
- **Enquiries** — everything submitted via the contact form; mark handled / delete; one-tap `wa.me` reply when the contact looks like a phone number.
- **Settings** — business name, tagline, announcement bar, hero heading & subheading, our story, currency, WhatsApp number, phone, email, address, hours, social links, delivery info, returns info. **Everything updates the live site immediately.**
- **Change password** — in Settings. Minimum 10 chars with letters and numbers.
- Sign-in is rate-limited (8 attempts / 15 min per IP) with httpOnly, SameSite=Lax, 8-hour sessions.

### Client handover checklist (owner does this once)

1. Open `/admin` and sign in.
2. **Settings → WhatsApp number**: enter the shop's WhatsApp line in international format, e.g. `233 54 123 4567` (we normalise spaces). Every "Order on WhatsApp" button appears and works — until this is set, WhatsApp CTAs stay hidden and customers are pointed to the contact form instead.
3. Settings → phone, email, address, opening hours, socials, delivery & returns copy.
4. Products → replace sample products with the real catalogue (swap photos, prices, stock).
5. Optional: set up Cloudinary and upload real product photos.
6. Change the seed password if one was set via `.env` (`npm run create-admin` or Settings → Change Password).

## How WhatsApp ordering works

1. Customer picks a fragrance, size and quantity on any product page.
2. Taps **Order on WhatsApp** — a `wa.me/<number>?text=<url-encoded-message>` link opens with a complete order message (brand, product, concentration, size, quantity, unit price, total, product URL and business name).
3. Customer reviews the pre-filled message in WhatsApp and sends it.
4. No payment is taken on the site — payment (Mobile Money / bank transfer) and delivery fees are confirmed personally in the chat. This mirrors how such shops actually sell and avoids pretending an order is "placed" just because WhatsApp opened.

The WhatsApp number and business name live in **one place** (Settings in the DB, falling back to `src/lib/settings.ts` defaults), normalised centrally in `src/lib/whatsapp.ts`.<br>
`054 123 4567` → `233541234567`, `+233 54 123 4567` → `233541234567`, etc.

## Deployment (Vercel + MongoDB Atlas)

1. **MongoDB Atlas** — create a free M0 cluster; add a database user; allow access from anywhere (`0.0.0.0/0`) or Vercel's IPs; copy the `mongodb+srv://…` URI.
2. **Vercel** — import the repository; framework preset **Next.js**; build command `next build` (default); no custom output directory.
3. **Environment variables** (Project → Settings → Environment Variables, all environments):
   - `MONGODB_URI` (Atlas URI), `SESSION_SECRET` (fresh 48-byte secret), `APP_SITE_URL` (e.g. `https://heritagebynancy.com`)
   - Optionally `CLOUDINARY_*` for image uploads.
4. **Seed once** — from a machine with the Atlas URI: `MONGODB_URI="mongodb+srv://…" ADMIN_EMAIL=… ADMIN_PASSWORD=… npm run seed`
5. Deploy, then follow the handover checklist above.
6. `sitemap.xml` / `robots.txt` are generated dynamically; product pages carry Product + FAQ JSON-LD; metadata templated from Settings.

## Project structure

```
src/
  app/
    (storefront)/        # public site (route group) — home, shop, about, faq, contact, policies
    admin/               # login + (dashboard) group, guarded by proxy + server-side session checks
    api/contact/         # enquiry intake (zod + rate-limit + honeypot)
    api/admin/upload/    # Cloudinary image upload (session required, magic-byte checked)
    sitemap.ts robots.ts icon.svg not-found.tsx error.tsx
  components/            # header, footer, cards, order panel (client), forms, admin shell
  lib/                   # db, models, settings, data layer, whatsapp builder, auth, rate-limit, utils
  proxy.ts               # optimistic /admin gate (real checks live server-side)
scripts/
  seed.mjs               # idempotent catalogue/settings/admin seed
  create-admin.mjs       # admin create / password reset
```

## Security notes

- Passwords hashed with bcrypt (cost 12); sessions are HS256 JWTs in httpOnly cookies (`secure` in production, `SameSite=Lax`, 8 h).
- `/admin/*` is gated twice: an optimistic check in `src/proxy.ts` and authoritative checks in the admin layout + every Server Action + the upload route.
- All mutations validate with zod server-side; file uploads verify MIME type, size (≤5 MB) and magic bytes.
- Login and contact endpoints are rate-limited per IP; the contact form has a honeypot.
- No secrets in the repo: `.env*` is gitignored; `.env.example` documents names only. There are no hardcoded credentials anywhere — the first admin is created via `ADMIN_EMAIL`/`ADMIN_PASSWORD` at seed time, or `npm run create-admin`.
- Admin area is `noindex`; `robots.txt` disallows `/admin` and `/api`.
- Baseline headers: `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`.

## Known limitations / next steps

- Image uploads require Cloudinary (free tier is fine); otherwise the admin pastes image URLs.
- The in-memory rate limiter is per-instance; for multi-region deployments use a shared store (e.g. Upstash).
- No strict Content-Security-Policy yet (Next inline scripts need nonce plumbing) — the safe headers above are in place.
- Product photos are temporary stock imagery; swap for the client's real bottle photos in the dashboard (never present stock photos as verified client stock).
