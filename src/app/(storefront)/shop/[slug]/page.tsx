import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getProductBySlug, getRelatedProducts, startingPrice } from "@/lib/data";
import { getSettings } from "@/lib/settings";
import { SITE_URL } from "@/lib/site-url";
import { formatPrice } from "@/lib/utils";
import { ProductGallery } from "@/components/product-gallery";
import { OrderPanel } from "@/components/order-panel";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { ArrowLeftIcon, ArrowRightIcon, ShieldCheckIcon, SparkleIcon, TruckIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Fragrance not found" };
  return {
    title: `${product.name} — ${product.concentration}`,
    description:
      product.description.slice(0, 160) ||
      `Buy ${product.name} at Heritage By Nancy — authentic, sealed and delivered nationwide.`,
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [{ url: product.images[0], alt: product.name }] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const settings = await getSettings();
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, categories] = await Promise.all([
    getRelatedProducts(product, 3),
    getCategories(),
  ]);
  const categoryName =
    categories.find((c) => c.slug === product.category)?.name ?? "Fragrance";
  const notes = [
    { label: "Top notes", value: product.notesTop },
    { label: "Heart notes", value: product.notesHeart },
    { label: "Base notes", value: product.notesBase },
  ].filter((note) => note.value);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    description: product.description,
    image: product.images,
    offers: product.sizes.map((s) => ({
      "@type": "Offer",
      price: s.price,
      priceCurrency: "GHS",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(ellipse_60%_70%_at_20%_0%,rgb(243_222_222/0.9),transparent_70%)]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-6 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-fig/45">
            <Link href="/shop" className="inline-flex items-center gap-1.5 transition-colors hover:text-rose-deep">
              <ArrowLeftIcon className="h-3 w-3" /> Shop
            </Link>
            <span aria-hidden className="text-blush">/</span>
            <Link href={`/shop?category=${product.category}`} className="transition-colors hover:text-rose-deep">
              {categoryName}
            </Link>
            <span aria-hidden className="text-blush">/</span>
            <span className="text-fig/75">{product.name}</span>
          </nav>

          <div className="mt-7 grid gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Gallery */}
            <div className="lg:col-span-5">
              <ProductGallery images={product.images} alt={`${product.name} bottle`} />
            </div>

            {/* Details */}
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2.5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-rose-deep">
                  {product.brand || "Signature"}
                </p>
                <span aria-hidden className="h-1 w-1 rounded-full bg-champagne" />
                <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-fig/45">
                  {product.concentration}
                </p>
                <span
                  className={`ml-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[8px] font-semibold uppercase tracking-[0.18em] ${
                    product.stock <= 0
                      ? "border-rose-deep/30 bg-rose-soft/50 text-rose-deep"
                      : product.stock <= 3
                        ? "border-champagne/60 bg-champagne/15 text-champagne-deep"
                        : "border-wa-dark/30 bg-wa/10 text-wa-dark"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`h-1.5 w-1.5 rounded-full ${
                      product.stock <= 0 ? "bg-rose-deep" : product.stock <= 3 ? "bg-champagne-deep" : "bg-wa"
                    }`}
                  />
                  {product.stock <= 0 ? "Out of stock" : product.stock <= 3 ? `Only ${product.stock} left` : "In stock"}
                </span>
              </div>

              <h1 className="mt-3 font-display text-[2.1rem] font-semibold leading-[1.1] tracking-[-0.01em] text-fig sm:text-[2.7rem]">
                {product.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-[9px] font-semibold uppercase tracking-[0.26em] text-fig/45">From</span>
                <span className="font-display text-2xl font-bold text-fig">
                  {formatPrice(startingPrice(product), settings.currency)}
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-fig/40">
                  · {product.sizes.length} size{product.sizes.length === 1 ? "" : "s"} available
                </span>
              </div>

              <div aria-hidden className="rose-rule mt-5 w-24 opacity-70" />

              <p className="mt-5 max-w-2xl text-[15px] leading-8 text-fig/75">{product.description}</p>

              {/* Notes */}
              {notes.length > 0 ? (
                <div className="mt-7">
                  <p className="flex items-center gap-2.5 text-[9px] font-semibold uppercase tracking-[0.36em] text-fig/50">
                    <SparkleIcon aria-hidden className="h-3.5 w-3.5 text-champagne" />
                    The composition
                  </p>
                  <dl className="mt-3 grid gap-2 sm:grid-cols-3">
                    {notes.map(({ label, value }, index) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-blush/70 bg-white px-4 py-3.5 shadow-[0_10px_26px_-22px_rgb(34_23_34/0.5)]"
                      >
                        <dt className="flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.26em] text-rose-deep">
                          <span className="font-display text-[11px] italic tracking-normal text-champagne-deep">
                            0{index + 1}
                          </span>
                          {label}
                        </dt>
                        <dd className="mt-1.5 text-[12.5px] leading-5 text-fig/75">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}

              <div className="mt-7">
                <OrderPanel
                  product={product}
                  businessName={settings.businessName}
                  currency={settings.currency}
                  whatsappNumber={settings.whatsappNumber}
                  siteUrl={SITE_URL}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hero-style promise strip */}
        <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-px overflow-hidden rounded-3xl border border-fig/10 bg-blush/40 sm:grid-cols-3">
            {[
              { Icon: ShieldCheckIcon, title: "Factory sealed", body: "Original designer stock, checked before dispatch." },
              { Icon: SparkleIcon, title: "Personal guidance", body: "Tell us your taste — we will help you choose." },
              { Icon: TruckIcon, title: "Nationwide delivery", body: "Delivery fee confirmed on WhatsApp before payment." },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="flex items-start gap-3.5 bg-white px-5 py-5 sm:px-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-petal text-rose-deep">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <p className="font-display text-[15px] font-semibold text-fig">{title}</p>
                  <p className="mt-0.5 text-[12px] leading-5 text-fig/60">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Related */}
      {related.length > 0 ? (
        <section className="mt-14 border-t border-blush/60 bg-petal/50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-6">
              <SectionHeading eyebrow="Complete The Edit" title="You may also love" align="left" />
              <Link
                href="/shop"
                className="hidden shrink-0 items-center gap-2 border-b border-rose pb-1 text-[10px] font-bold uppercase tracking-[0.26em] text-fig transition-all hover:gap-3 hover:text-rose-deep sm:inline-flex"
              >
                All fragrances <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} currency={settings.currency} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
