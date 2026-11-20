import Link from "next/link";
import Image from "next/image";
import { isDatabaseConfigured, connectToDatabase } from "@/lib/db";
import { Category, Enquiry, Product } from "@/lib/models";
import { getSettings } from "@/lib/settings";
import { getSession } from "@/lib/auth";
import {
  ArrowRightIcon,
  ClockIcon,
  MailIcon,
  SparkleIcon,
  TruckIcon,
} from "@/components/icons";

export const dynamic = "force-dynamic";

function StatIcon({ kind }: { kind: "products" | "featured" | "out" | "low" | "mail" }) {
  const common = "h-[18px] w-[18px]";
  if (kind === "products")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" className={common} aria-hidden>
        <path d="M10 3h4v3h3l2 4v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-9l2-4h3V3Z" />
        <path d="M5 12h14" />
      </svg>
    );
  if (kind === "featured")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" className={common} aria-hidden>
        <path d="M12 2.5 14.95 8.9l6.9.8-5.1 4.75 1.35 6.8L12 17.9 5.9 21.25l1.35-6.8-5.1-4.75 6.9-.8L12 2.5Z" />
      </svg>
    );
  if (kind === "out")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className={common} aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 8l8 8" />
      </svg>
    );
  if (kind === "low")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className={common} aria-hidden>
        <path d="M12 3 2.5 20h19L12 3Z" />
        <path d="M12 9v5M12 17.2v.01" />
      </svg>
    );
  return <MailIcon className={common} />;
}

export default async function AdminOverviewPage() {
  if (!isDatabaseConfigured()) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-champagne/40 bg-white p-8 shadow-[var(--shadow-card)]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-rose-deep">Setup Required</p>
        <h1 className="mt-3 font-display text-2xl font-semibold text-fig">Connect your database</h1>
        <p className="mt-3 text-sm leading-7 text-fig/75">
          The admin console needs MongoDB. Set <code className="rounded bg-petal px-1.5 py-0.5">MONGODB_URI</code> in
          your environment (see <code className="rounded bg-petal px-1.5 py-0.5">.env.example</code>), then seed the
          catalogue and create your administrator account:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-fig p-4 text-xs leading-6 text-champagne-light">{`npm run seed
npm run create-admin -- you@example.com "YourStrongPassword" "Nancy"`}</pre>
        <p className="mt-4 text-xs leading-6 text-fig/55">
          The public website works without a database (it serves the bundled sample catalogue), but products,
          settings and enquiries only persist once MongoDB is connected.
        </p>
      </div>
    );
  }

  let productCount = 0;
  let featuredCount = 0;
  let outOfStock = 0;
  let lowStock = 0;
  let newEnquiries = 0;
  let totalUnits = 0;
  let recentEnquiries: Array<{ _id: unknown; name: string; contact: string; message: string; createdAt: Date }> = [];
  let watchlist: Array<{ _id: unknown; name: string; brand: string; stock: number; images: string[] }> = [];
  let categoryMix: Array<{ name: string; count: number }> = [];
  let dbError = false;

  try {
    await connectToDatabase();
    const [counts, enquiries, low, cats, mix] = await Promise.all([
      Promise.all([
        Product.countDocuments({ active: true }),
        Product.countDocuments({ active: true, featured: true }),
        Product.countDocuments({ active: true, stock: { $lte: 0 } }),
        Product.countDocuments({ active: true, stock: { $gt: 0, $lte: 3 } }),
        Enquiry.countDocuments({ status: "new" }),
      ]),
      Enquiry.find().sort({ createdAt: -1 }).limit(4).lean(),
      Product.find({ active: true, stock: { $lte: 3 } })
        .sort({ stock: 1 })
        .limit(4)
        .select("name brand stock images")
        .lean(),
      Category.find().sort({ order: 1 }).lean(),
      Product.aggregate<{ _id: string; count: number }>([
        { $match: { active: true } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]),
    ]);
    [productCount, featuredCount, outOfStock, lowStock, newEnquiries] = counts;
    recentEnquiries = enquiries as unknown as typeof recentEnquiries;
    watchlist = low as unknown as typeof watchlist;
    const countsBySlug = new Map(mix.map((row) => [row._id, row.count]));
    categoryMix = cats.map((c) => ({ name: c.name, count: countsBySlug.get(c.slug) ?? 0 }));
    const stockAgg = await Product.aggregate<{ total: number }>([
      { $match: { active: true } },
      { $group: { _id: null, total: { $sum: "$stock" } } },
    ]);
    totalUnits = stockAgg[0]?.total ?? 0;
  } catch (error) {
    console.error("[admin/overview] failed to load stats:", error);
    dbError = true;
  }

  const settings = await getSettings();
  const session = await getSession();
  const accountName = (session?.name || session?.email || "there").split(/[\s@]+/)[0] ?? "there";
  const firstName = accountName.charAt(0).toUpperCase() + accountName.slice(1);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const maxMix = Math.max(1, ...categoryMix.map((c) => c.count));

  const stats = [
    { kind: "products" as const, label: "Active products", value: productCount, href: "/admin/products", note: `${totalUnits} bottles on hand` },
    { kind: "mail" as const, label: "New enquiries", value: newEnquiries, href: "/admin/enquiries", note: newEnquiries > 0 ? "Awaiting a reply" : "All caught up" },
    { kind: "low" as const, label: "Low stock", value: lowStock, href: "/admin/products", note: "3 bottles or fewer" },
    { kind: "out" as const, label: "Out of stock", value: outOfStock, href: "/admin/products", note: "Hidden urgency" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      {dbError ? (
        <p role="alert" className="mb-5 rounded-xl border border-rose-deep/30 bg-rose-deep/5 px-5 py-4 text-sm text-rose-deep">
          The database is unreachable right now. Check your MONGODB_URI and network connection.
        </p>
      ) : null}

      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-3xl bg-fig p-6 text-porcelain shadow-[var(--shadow-soft)] sm:p-8">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_80%_at_88%_0%,rgb(183_110_121/0.45),transparent_65%),radial-gradient(ellipse_40%_60%_at_5%_100%,rgb(200_161_90/0.2),transparent_65%)]" />
        <div aria-hidden className="grain absolute inset-0" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="flex items-center gap-2.5 text-[8.5px] font-semibold uppercase tracking-[0.4em] text-champagne">
              <SparkleIcon aria-hidden className="h-3.5 w-3.5" />
              {greeting}, {firstName}
            </p>
            <h1 className="mt-3 font-display text-[1.9rem] font-semibold leading-tight sm:text-3xl">
              The atelier is <em className="italic text-rose-light">open</em>.
            </h1>
            <p className="mt-2 max-w-md text-[13px] leading-6 text-porcelain/65">
              {featuredCount} featured bottles live on the storefront, {totalUnits} units in stock,{" "}
              {newEnquiries === 0 ? "no new enquiries" : `${newEnquiries} new ${newEnquiries === 1 ? "enquiry" : "enquiries"}`}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/admin/products/new"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-champagne px-5 text-[9.5px] font-bold uppercase tracking-[0.22em] text-fig transition-colors hover:bg-champagne-light"
            >
              + Add fragrance
            </Link>
            <Link
              href="/admin/enquiries"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/25 px-5 text-[9.5px] font-bold uppercase tracking-[0.22em] text-porcelain transition-colors hover:border-white/60 hover:bg-white/5"
            >
              Open inbox
            </Link>
          </div>
        </div>
      </section>

      {/* KPI cards */}
      <div className="mt-5 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {stats.map(({ kind, label, value, href, note }, index) => (
          <Link
            key={label}
            href={href}
            className="group relative overflow-hidden rounded-2xl border border-fig/10 bg-white p-4 shadow-[0_10px_30px_-24px_rgb(34_23_34/0.5)] transition-all hover:-translate-y-0.5 hover:border-rose/40 hover:shadow-[var(--shadow-card)] sm:p-5"
          >
            <div className="flex items-start justify-between">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  index === 2
                    ? "bg-champagne/20 text-champagne-deep"
                    : index === 3
                      ? "bg-rose-deep/10 text-rose-deep"
                      : "bg-petal text-rose-deep"
                }`}
              >
                <StatIcon kind={kind} />
              </span>
              <ArrowRightIcon className="h-3.5 w-3.5 text-fig/20 transition-all group-hover:translate-x-0.5 group-hover:text-rose-deep" />
            </div>
            <p className="mt-3 font-display text-[1.9rem] font-bold leading-none text-fig tabular-nums">{value}</p>
            <p className="mt-1.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-fig/50">{label}</p>
            <p className="mt-1 text-[10px] text-fig/40">{note}</p>
          </Link>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {/* Stock watch */}
        <section className="overflow-hidden rounded-2xl border border-fig/10 bg-white shadow-[var(--shadow-card)] lg:col-span-2">
          <div className="flex items-center justify-between gap-3 border-b border-petal px-5 py-4">
            <div className="min-w-0">
              <h2 className="font-display text-lg font-semibold text-fig">Stock watch</h2>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-fig/40">
                Bottles running low or sold out
              </p>
            </div>
            <Link
              href="/admin/products"
              className="shrink-0 text-[9px] font-bold uppercase tracking-[0.22em] text-rose-deep hover:underline"
            >
              Inventory →
            </Link>
          </div>
          {watchlist.length === 0 ? (
            <p className="px-5 py-10 text-center text-[13px] text-fig/45">
              Every active fragrance has healthy stock. Nice work.
            </p>
          ) : (
            <ul className="divide-y divide-petal">
              {watchlist.map((product) => {
                const out = product.stock <= 0;
                return (
                  <li key={String(product._id)}>
                    <Link
                      href={`/admin/products/${String(product._id)}`}
                      className="flex items-center gap-3.5 px-5 py-3.5 transition-colors hover:bg-porcelain/70"
                    >
                      <span className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg border border-fig/10 bg-petal">
                        {product.images[0] ? (
                          <Image src={product.images[0]} alt="" fill sizes="40px" className="object-cover" />
                        ) : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold text-fig">{product.name}</span>
                        <span className="mt-0.5 block text-[8.5px] uppercase tracking-[0.2em] text-fig/40">
                          {product.brand || "Signature"}
                        </span>
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.14em] ${
                          out ? "bg-rose-deep text-white" : "bg-champagne/25 text-champagne-deep"
                        }`}
                      >
                        {out ? "Sold out" : `${product.stock} left`}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Category mix */}
        <section className="rounded-2xl border border-fig/10 bg-white p-5 shadow-[var(--shadow-card)]">
          <h2 className="font-display text-lg font-semibold text-fig">Category mix</h2>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-fig/40">Active bottles by house edit</p>
          <ul className="mt-5 space-y-4">
            {categoryMix.length === 0 ? (
              <li className="text-[12px] text-fig/45">No categories yet.</li>
            ) : (
              categoryMix.map((cat) => (
                <li key={cat.name}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate text-[11px] font-medium text-fig/70">{cat.name}</p>
                    <p className="font-display text-[13px] font-bold text-fig tabular-nums">{cat.count}</p>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-petal">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose to-rose-deep"
                      style={{ width: `${Math.round((cat.count / maxMix) * 100)}%` }}
                    />
                  </div>
                </li>
              ))
            )}
          </ul>
          <div className="mt-6 rounded-xl bg-petal/70 px-3.5 py-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-fig/45">Storefront currency</p>
            <p className="mt-0.5 font-display text-base font-semibold text-fig">{settings.currency}</p>
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {/* Latest enquiries */}
        <section className="rounded-2xl border border-fig/10 bg-white shadow-[var(--shadow-card)] lg:col-span-2">
          <div className="flex items-center justify-between border-b border-petal px-5 py-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-fig">Latest enquiries</h2>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-fig/40">
                Messages from the contact form
              </p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-[9px] font-bold uppercase tracking-[0.22em] text-rose-deep hover:underline"
            >
              Inbox →
            </Link>
          </div>
          {recentEnquiries.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-petal text-rose-deep">
                <MailIcon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-[13px] text-fig/50">
                No enquiries yet. Customer messages will appear here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-petal">
              {recentEnquiries.map((enquiry) => {
                const initials =
                  enquiry.name
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase() ?? "")
                    .join("") || "?";
                return (
                  <li key={String(enquiry._id)} className="flex gap-3.5 px-5 py-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fig text-[10px] font-bold text-rose-light">
                      {initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="truncate text-[13px] font-semibold text-fig">{enquiry.name}</p>
                        <time className="flex shrink-0 items-center gap-1 text-[9px] uppercase tracking-[0.14em] text-fig/40">
                          <ClockIcon className="h-3 w-3" />
                          {new Date(enquiry.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                        </time>
                      </div>
                      <p className="mt-0.5 truncate text-[10px] uppercase tracking-[0.16em] text-rose-deep">
                        {enquiry.contact}
                      </p>
                      <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-fig/60">{enquiry.message}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Quick actions */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-fig-raise to-fig p-5 text-porcelain shadow-[var(--shadow-card)]">
          <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose/25 blur-3xl" />
          <h2 className="relative font-display text-lg font-semibold text-champagne-light">Quick actions</h2>
          <ul className="relative mt-4 space-y-2">
            {[
              { href: "/admin/products/new", label: "Add a new fragrance", Icon: SparkleIcon },
              { href: "/admin/products", label: "Update stock levels", Icon: TruckIcon },
              { href: "/admin/categories", label: "Manage categories", Icon: SparkleIcon },
              { href: "/admin/settings", label: "Set WhatsApp & hours", Icon: ClockIcon },
            ].map(({ href, label, Icon: ItemIcon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex items-center gap-3 rounded-xl border border-white/10 px-3.5 py-3 text-[11px] text-porcelain/75 transition-colors hover:border-champagne/40 hover:bg-white/5 hover:text-champagne-light"
                >
                  <ItemIcon className="h-4 w-4 shrink-0 text-rose-light" />
                  <span className="flex-1">{label}</span>
                  <ArrowRightIcon className="h-3.5 w-3.5 text-porcelain/25 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="relative mt-5 text-[9px] leading-4 text-porcelain/30">
            Prices display in {settings.currency}. Images can be uploaded or pasted as URLs.
          </p>
        </section>
      </div>
    </div>
  );
}
