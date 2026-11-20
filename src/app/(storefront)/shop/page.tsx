import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getCategories, getProducts } from "@/lib/data";
import { getSettings } from "@/lib/settings";
import { buildWaLink, buildAdviceMessage } from "@/lib/whatsapp";
import { startingPrice } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { SortSelect } from "@/components/sort-select";
import { PageHero } from "@/components/page-hero";
import { SparkleIcon, WhatsAppIcon } from "@/components/icons";
import { SHOP_HERO_IMAGE } from "@/lib/fallback-data";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop Designer Perfumes",
  description:
    "Browse authentic Chanel, Giorgio Armani, Versace and more — women's and men's fragrances with sizes, notes and prices. Order on WhatsApp.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q ?? "").trim().slice(0, 80);
  const requestedCategory = (params.category ?? "").trim().toLowerCase();
  const sort = ["featured", "price-asc", "price-desc", "name"].includes(params.sort ?? "")
    ? (params.sort as string)
    : "featured";

  const settings = await getSettings();
  const categories = await getCategories();
  const activeCategory = categories.find((c) => c.slug === requestedCategory)?.slug;

  let products = await getProducts({
    category: activeCategory,
    search: query || undefined,
  });

  if (sort === "price-asc") products = [...products].sort((a, b) => startingPrice(a) - startingPrice(b));
  else if (sort === "price-desc") products = [...products].sort((a, b) => startingPrice(b) - startingPrice(a));
  else if (sort === "name") products = [...products].sort((a, b) => a.name.localeCompare(b.name));

  const waAdvice = settings.whatsappNumber
    ? buildWaLink(settings.whatsappNumber, buildAdviceMessage(settings))
    : null;

  const filterHref = (opts: { category?: string; q?: string }) => {
    const p = new URLSearchParams();
    if (opts.q) p.set("q", opts.q);
    if (opts.category) p.set("category", opts.category);
    if (sort !== "featured") p.set("sort", sort);
    const qs = p.toString();
    return qs ? `/shop?${qs}` : "/shop";
  };

  return (
    <>
      <PageHero
        eyebrow="The Collection"
        title={
          <>
            Find your <em className="italic text-rose-light">signature</em>
          </>
        }
        subtitle={
          <>
            {products.length} authentic {products.length === 1 ? "fragrance" : "fragrances"} — sealed,
            curated and delivered with care across Ghana.
          </>
        }
        image={SHOP_HERO_IMAGE}
        imagePosition="50% 42%"
        aside={
          <dl className="hidden w-64 grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md lg:grid">
            <div className="bg-fig/60 px-5 py-4">
              <dt className="text-[8px] font-semibold uppercase tracking-[0.26em] text-porcelain/50">Bottles</dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-champagne-light">{products.length}</dd>
            </div>
            <div className="bg-fig/60 px-5 py-4">
              <dt className="text-[8px] font-semibold uppercase tracking-[0.26em] text-porcelain/50">Houses</dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-champagne-light">
                {new Set(products.map((p) => p.brand).filter(Boolean)).size || 3}
              </dd>
            </div>
            <div className="col-span-2 flex items-center gap-2 bg-fig/60 px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.22em] text-porcelain/60">
              <SparkleIcon aria-hidden className="h-3.5 w-3.5 text-champagne" />
              Every bottle sealed &amp; authentic
            </div>
          </dl>
        }
      />

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {/* Floating toolbar */}
        <div className="relative z-10 -mt-7 rounded-2xl border border-blush/60 bg-white/95 p-3 shadow-[var(--shadow-lift)] backdrop-blur-xl sm:p-4">
          <form method="get" action="/shop" role="search" className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full items-center overflow-hidden rounded-xl border border-blush bg-porcelain transition-all focus-within:border-rose focus-within:bg-white focus-within:ring-4 focus-within:ring-rose/10 md:max-w-md">
              <label htmlFor="q" className="sr-only">Search fragrances</label>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="ml-4 h-4 w-4 shrink-0 text-rose-deep/60" aria-hidden>
                <circle cx="11" cy="11" r="6.5" />
                <path d="m20 20-4.2-4.2" />
              </svg>
              <input
                id="q"
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search name, brand, notes…"
                className="h-11 w-full bg-transparent px-3 text-sm outline-none placeholder:text-fig/40"
              />
              {activeCategory ? <input type="hidden" name="category" value={activeCategory} /> : null}
              <button
                type="submit"
                className="mr-1.5 h-8 shrink-0 rounded-lg bg-fig px-4 text-[9px] font-bold uppercase tracking-[0.22em] text-champagne-light transition-all hover:bg-rose-deep hover:text-white"
              >
                Search
              </button>
            </div>
            <div className="flex items-center justify-between gap-3 md:justify-end">
              <p className="text-[10px] uppercase tracking-[0.2em] text-fig/45">
                <span className="font-bold text-fig">{products.length}</span> result{products.length === 1 ? "" : "s"}
              </p>
              <Suspense fallback={null}>
                <SortSelect value={sort} />
              </Suspense>
            </div>
          </form>
        </div>

        {/* Category pills */}
        <div className="mt-5 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
          <Link
            href={filterHref({ category: undefined, q: undefined })}
            aria-current={!activeCategory ? "true" : undefined}
            className={cn(
              "rounded-full border px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.22em] transition-all",
              !activeCategory
                ? "border-fig bg-fig text-rose-light shadow-[0_10px_26px_-12px_rgb(34_23_34/0.7)]"
                : "border-blush bg-white text-fig/65 hover:border-rose hover:text-rose-deep",
            )}
          >
            All fragrances
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={filterHref({ category: category.slug, q: query || undefined })}
              aria-current={activeCategory === category.slug ? "true" : undefined}
              className={cn(
                "rounded-full border px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.22em] transition-all",
                activeCategory === category.slug
                  ? "border-fig bg-fig text-rose-light shadow-[0_10px_26px_-12px_rgb(34_23_34/0.7)]"
                  : "border-blush bg-white text-fig/65 hover:border-rose hover:text-rose-deep",
              )}
            >
              {category.name}
            </Link>
          ))}
          {query ? (
            <Link
              href={filterHref({ category: activeCategory, q: undefined })}
              className="rounded-full border border-rose-deep/30 bg-rose-soft/60 px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.22em] text-rose-deep transition-colors hover:bg-rose-deep hover:text-porcelain"
            >
              Clear “{query}” ×
            </Link>
          ) : null}
        </div>

        {/* Grid */}
        {products.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} currency={settings.currency} />
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-16 max-w-md rounded-3xl border border-dashed border-blush bg-white px-8 py-14 text-center shadow-sm">
            <p className="font-display text-2xl font-semibold text-fig">Nothing on that shelf yet.</p>
            <p className="mt-3 text-sm leading-7 text-fig/65">
              We couldn&rsquo;t find{query ? <> matches for <strong>“{query}”</strong></> : " any fragrances"}.
              Try a different name, brand or note — or ask Nancy directly.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/shop"
                className="inline-flex h-12 items-center rounded-full border border-fig px-6 text-[10px] font-bold uppercase tracking-[0.24em] text-fig transition-colors hover:bg-fig hover:text-champagne-light"
              >
                Clear filters
              </Link>
              {waAdvice ? (
                <a
                  href={waAdvice}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-wa px-6 text-[10px] font-bold uppercase tracking-[0.24em] text-white transition-colors hover:bg-wa-dark"
                >
                  <WhatsAppIcon className="h-4 w-4" /> Ask for it
                </a>
              ) : (
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center rounded-full bg-fig px-6 text-[10px] font-bold uppercase tracking-[0.24em] text-champagne-light"
                >
                  Contact us
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Advice strip */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 rounded-2xl border border-rose/25 bg-gradient-to-r from-fig to-fig-raise px-6 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-sm leading-6 text-porcelain/85">
            <span className="font-semibold text-rose-light">Can&rsquo;t decide?</span>{" "}
            Tell us your taste and budget — we&rsquo;ll recommend the bottle.
          </p>
          {waAdvice ? (
            <a
              href={waAdvice}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-wa px-6 text-[10px] font-bold uppercase tracking-[0.24em] text-white transition-colors hover:bg-wa-dark"
            >
              <WhatsAppIcon className="h-4 w-4" /> Get guidance
            </a>
          ) : (
            <Link
              href="/contact"
              className="inline-flex h-12 shrink-0 items-center rounded-full bg-champagne px-6 text-[10px] font-bold uppercase tracking-[0.24em] text-fig"
            >
              Ask us
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
