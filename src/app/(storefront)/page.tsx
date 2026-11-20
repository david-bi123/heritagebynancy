import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { getCategories, getProducts, startingPrice } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { buildWaLink } from "@/lib/whatsapp";
import { HERO_IMAGE, STORY_IMAGE } from "@/lib/fallback-data";
import { SITE_URL } from "@/lib/site-url";
import { SectionHeading } from "@/components/section-heading";
import { ProductCard } from "@/components/product-card";
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  SparkleIcon,
  TruckIcon,
  WhatsAppIcon,
} from "@/components/icons";

export const dynamic = "force-dynamic";

/** Emphasise the final word of the (editable) hero heading in rose italic. */
function renderHeroHeading(heading: string) {
  const trimmed = heading.trim();
  const lastSpace = trimmed.lastIndexOf(" ");
  if (lastSpace <= 0) return trimmed;
  return (
    <>
      {trimmed.slice(0, lastSpace)}{" "}
      <em className="italic text-rose-light">{trimmed.slice(lastSpace + 1)}</em>
    </>
  );
}

export const metadata: Metadata = {
  title: "Authentic Designer Perfumes in Ghana — Chanel, Armani, Versace",
  description:
    "Shop authentic designer fragrances for men and women at Heritage By Nancy. Sealed bottles, nationwide delivery, and personal guidance on WhatsApp.",
};

export default async function HomePage() {
  const settings = await getSettings();
  const [featured, categories, womensCount, mensCount] = await Promise.all([
    getProducts({ featuredOnly: true }),
    getCategories(),
    getProducts({ category: "womens" }),
    getProducts({ category: "mens" }),
  ]);
  const bestsellers = featured.slice(0, 4);
  // Keep the floating hero card in step with the hero photograph (Coco Mademoiselle).
  const heroProduct =
    bestsellers.find((product) => /coco mademoiselle/i.test(product.name)) ??
    bestsellers[0] ??
    null;
  const heroProductPrice = heroProduct ? startingPrice(heroProduct) : null;
  const heroProductLabel = heroProduct
    ? heroProduct.name.replace(/\s+(Extrait de Parfum|Eau de Parfum|Eau de Toilette|Eau de Cologne|Parfum)$/i, "")
    : "";
  const waLink = settings.whatsappNumber
    ? buildWaLink(
        settings.whatsappNumber,
        `Hello ${settings.businessName}! I would like to order a fragrance.`,
      )
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: settings.businessName,
    description: settings.heroSubheading,
    url: SITE_URL,
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.address ? { address: { "@type": "PostalAddress", streetAddress: settings.address } } : {}),
  };

  const categoryCounts: Record<string, number> = {
    womens: womensCount.length,
    mens: mensCount.length,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ============================== HERO ============================== */}
      <section className="relative flex min-h-[calc(100svh-110px)] flex-col overflow-hidden bg-fig text-porcelain [@media(max-height:780px)]:min-h-[calc(100svh-65px)]">
        {/* Layered rose + champagne light */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_58%_62%_at_8%_12%,rgb(183_110_121/0.32),transparent_62%),radial-gradient(ellipse_50%_55%_at_95%_88%,rgb(200_161_90/0.18),transparent_62%)]" />
        <div aria-hidden className="pointer-events-none absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-rose/10 blur-[120px]" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-[52%] hidden w-px bg-gradient-to-b from-transparent via-white/10 to-transparent lg:block" />

        <div className="grain relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-4 pb-14 pt-11 sm:px-6 sm:pt-16 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-14 xl:py-16">
          <div className="relative lg:col-span-6">
            <p className="rise flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.46em] text-champagne sm:text-[10px]">
              <span aria-hidden className="h-px w-10 bg-gradient-to-r from-transparent via-champagne to-champagne/50" />
              {settings.tagline}
              <SparkleIcon aria-hidden className="twinkle h-3 w-3 text-champagne-light" />
            </p>

            <h1 style={{ animationDelay: "80ms" }} className="rise mt-5 font-display text-[2.55rem] font-semibold leading-[1.03] tracking-[-0.015em] sm:text-[3.15rem] lg:text-[3.45rem] xl:text-[3.95rem]">
              <span className="text-balance bg-gradient-to-br from-white via-[#fbecea] to-[#e9c0c7] bg-clip-text text-transparent">
                {renderHeroHeading(settings.heroHeading)}
              </span>
            </h1>

            <p style={{ animationDelay: "150ms" }} className="rise mt-5 max-w-lg text-[0.98rem] leading-7 text-porcelain/75 sm:text-base sm:leading-8">
              {settings.heroSubheading}
            </p>

            <div style={{ animationDelay: "220ms" }} className="rise mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/shop"
                className="group relative inline-flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-br from-rose to-rose-deep px-7 sm:w-auto sm:justify-start text-[11px] font-bold uppercase tracking-[0.22em] text-white shadow-[0_20px_50px_-16px_rgb(183_110_121/0.65)] ring-1 ring-white/15 transition-all duration-300 hover:shadow-[0_24px_60px_-14px_rgb(183_110_121/0.8)] hover:brightness-110"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                />
                <span className="relative">Browse the collection</span>
                <ArrowRightIcon className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              {waLink ? (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full border border-wa/50 bg-wa/10 px-6 sm:w-auto text-[11px] font-bold uppercase tracking-[0.22em] text-[#8fe6b0] backdrop-blur-sm transition-all hover:border-wa hover:bg-wa hover:text-white"
                >
                  <WhatsAppIcon className="h-5 w-5" /> Chat on WhatsApp
                </a>
              ) : (
                <Link
                  href="/contact"
                  className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full border border-rose-light/40 bg-white/[0.03] px-6 sm:w-auto text-[11px] font-bold uppercase tracking-[0.22em] text-rose-light backdrop-blur-sm transition-all hover:border-rose-light hover:bg-rose-light hover:text-fig"
                >
                  <SparkleIcon className="h-4 w-4" /> Contact us
                </Link>
              )}
            </div>

            <dl style={{ animationDelay: "300ms" }} className="rise mt-8 flex flex-wrap items-center gap-x-5 gap-y-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-porcelain/70 backdrop-blur-sm sm:text-[9.5px]">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon aria-hidden className="h-4 w-4 shrink-0 text-rose-light" />
                Sealed bottles
              </div>
              <div className="flex items-center gap-2">
                <SparkleIcon aria-hidden className="h-4 w-4 shrink-0 text-rose-light" />
                Personal guidance
              </div>
              <div className="flex items-center gap-2">
                <TruckIcon aria-hidden className="h-4 w-4 shrink-0 text-rose-light" />
                Nationwide delivery
              </div>
            </dl>
          </div>

          {/* Arched portrait image */}
          <div style={{ animationDelay: "120ms" }} className="rise relative mx-auto w-full max-w-md sm:max-w-lg lg:col-span-6 lg:max-w-none">
            {/* Rose bloom behind the arch */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <div className="h-[82%] w-[82%] rounded-full bg-[radial-gradient(circle,rgb(183_110_121/0.42),transparent_68%)] blur-2xl" />
            </div>
            {/* Offset arches */}
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[110%] w-[92%] -translate-x-[46%] -translate-y-[53%] rounded-t-full border border-rose/20"
            />
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[104%] w-[86%] -translate-x-[46%] -translate-y-[52%] rounded-t-full border border-champagne/35 sm:w-[84%]"
            />
            <SparkleIcon
              aria-hidden
              className="twinkle absolute -right-1 top-8 h-5 w-5 text-champagne/80 sm:right-2 lg:top-10"
            />

            <div className="group relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-t-full border border-rose/30 shadow-[0_50px_120px_-30px_rgb(0_0_0/0.75)] ring-8 ring-fig-lift/40 sm:max-w-md lg:w-auto lg:max-w-none lg:h-[min(66vh,640px)]">
              <Image
                src={HERO_IMAGE}
                alt="A bottle of Coco Mademoiselle among fresh pink garden roses — the Heritage By Nancy signature mood"
                fill
                priority
                sizes="(min-width: 1024px) 42vw, (min-width: 640px) 80vw, 94vw"
                className="object-cover object-[50%_28%] transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fig/90 via-fig/15 to-fig/10" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgb(183_110_121/0.35),transparent_70%)] mix-blend-soft-light" />
              {/* Inner hairline frame */}
              <div aria-hidden className="absolute inset-3 rounded-t-full border border-white/15" />
              <div aria-hidden className="arch-shine" />


              <div className="absolute bottom-6 left-1/2 flex w-max -translate-x-1/2 items-center gap-3 rounded-full border border-white/15 bg-fig/55 px-5 py-2 backdrop-blur-md">
                <span aria-hidden className="h-px w-6 bg-gradient-to-r from-transparent to-champagne/80" />
                <span className="text-center text-[8px] font-semibold uppercase tracking-[0.4em] text-champagne-light sm:text-[9px]">
                  The Rose Atelier Edit
                </span>
                <span aria-hidden className="h-px w-6 bg-gradient-to-l from-transparent to-champagne/80" />
              </div>
            </div>

            {/* Floating bestseller card */}
            {heroProduct ? (
              <Link
                href={`/shop/${heroProduct.slug}`}
                className="float-y group absolute -left-1 bottom-12 flex w-[17.5rem] items-center gap-3 rounded-2xl border border-rose/25 bg-fig-raise/90 p-2.5 pr-3.5 shadow-[0_24px_60px_-18px_rgb(0_0_0/0.9)] backdrop-blur-md transition-all duration-300 hover:border-rose/60 hover:bg-fig-lift sm:left-1 lg:bottom-16"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-fig-lift ring-1 ring-rose/30">
                  {heroProduct.images[0] ? (
                    <Image
                      src={heroProduct.images[0]}
                      alt={heroProduct.name}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : null}
                </div>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-[7.5px] font-semibold uppercase tracking-[0.3em] text-champagne">
                    <span aria-hidden className="h-1 w-1 rounded-full bg-champagne" />
                    Featured
                  </span>
                  <span className="mt-0.5 block truncate text-[13px] font-semibold leading-tight text-porcelain">
                    {heroProductLabel}
                  </span>
                  <span className="mt-0.5 block text-[10px] text-porcelain/55">
                    From {formatPrice(heroProductPrice ?? 0, settings.currency)}
                  </span>
                </span>
              </Link>
            ) : null}

            {/* Authenticity chip */}
            <div className="absolute right-0 top-16 hidden items-center gap-2.5 rounded-2xl border border-white/10 bg-fig-raise/85 px-4 py-2.5 backdrop-blur-md sm:flex lg:top-24">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-champagne/15 ring-1 ring-champagne/30">
                <ShieldCheckIcon aria-hidden className="h-4 w-4 text-champagne" />
              </span>
              <span className="text-[9px] font-semibold uppercase leading-4 tracking-[0.22em] text-porcelain/80">
                100% Sealed<br />&amp; Authentic
              </span>
            </div>
          </div>
        </div>
        {/* Brand marquee */}
        <div className="relative border-t border-rose/20 bg-black/40 py-2" aria-hidden>
          <div className="marquee-wrap">
            <div className="marquee whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.44em] text-rose-light/75 sm:text-[11px]">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className="mx-6">Chanel <span className="text-champagne">✦</span> Giorgio Armani <span className="text-champagne">✦</span> Versace <span className="text-champagne">✦</span> Heritage By Nancy <span className="text-champagne">✦</span> Sealed &amp; Authentic <span className="text-champagne">✦</span> </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================= FEATURED FRAGRANCES ========================= */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          eyebrow="The Signature Edit"
          title="Featured fragrances"
          subtitle="Our most-loved bottles — handpicked across the houses we carry. Tap a fragrance to see notes, sizes and prices."
        />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {bestsellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={settings.currency}
            />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 rounded-full border border-fig/15 bg-white px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.3em] text-fig shadow-sm transition-all hover:border-rose hover:text-rose-deep hover:shadow-[var(--shadow-card)]"
          >
            View all fragrances <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ========================= WOMEN / MEN SPLIT ========================= */}
      <section className="relative bg-petal">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgb(255_255_255/0.8),transparent_60%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-4 p-4 sm:gap-6 sm:p-6 md:grid-cols-2 lg:p-10">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group relative min-h-[420px] overflow-hidden rounded-[2rem] bg-fig shadow-[var(--shadow-card)] sm:min-h-[520px]"
              aria-label={`Shop ${category.name}`}
            >
              {category.image ? (
                <Image
                  src={category.image}
                  alt={`${category.name} — bottle photography`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.07]"
                />
              ) : null}
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-fig/95 via-fig/55 to-fig/10 transition-opacity duration-500 group-hover:from-fig" />
              <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_110%,rgb(183_110_121/0.4),transparent_70%)] mix-blend-soft-light" />
              <div aria-hidden className="pointer-events-none absolute inset-3 rounded-[1.6rem] border border-white/15" />

              <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/20 bg-fig/40 px-3.5 py-1.5 backdrop-blur-md sm:left-8 sm:top-8">
                <span className="text-[8px] font-semibold uppercase tracking-[0.28em] text-champagne-light">
                  {index === 0 ? "For Her" : "For Him"}
                </span>
                <span aria-hidden className="h-1 w-1 rounded-full bg-champagne" />
                <span className="text-[8px] font-semibold uppercase tracking-[0.22em] text-porcelain/70">
                  {categoryCounts[category.slug] ?? 0} bottles
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 sm:p-9">
                <h3 className="font-display text-3xl font-semibold leading-tight text-porcelain sm:text-[2.9rem]">
                  {category.name}
                </h3>
                <p className="max-w-sm text-[13px] leading-6 text-porcelain/75">{category.description}</p>
                <span className="mt-2 inline-flex w-fit items-center gap-3 rounded-full border border-white/25 bg-white/10 py-2.5 pl-5 pr-2.5 text-[9px] font-bold uppercase tracking-[0.28em] text-porcelain backdrop-blur-md transition-all duration-300 group-hover:gap-5 group-hover:border-champagne/60 group-hover:text-champagne-light">
                  Shop the edit
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-champagne text-fig transition-transform duration-300 group-hover:scale-105">
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================= WHY HERITAGE ========================= */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow="The Heritage Promise"
              title="Why fragrance lovers choose us"
              subtitle="A small house with high standards: real bottles, real advice, and a person on the other end of every message."
              align="left"
            />
            <div className="mt-7 hidden items-center gap-3 rounded-2xl border border-blush/70 bg-white px-4 py-3.5 shadow-[var(--shadow-card)] lg:flex">
              <SparkleIcon aria-hidden className="h-5 w-5 shrink-0 text-champagne-deep" />
              <p className="text-[11px] leading-5 text-fig/60">
                Every order is checked by hand before it leaves the atelier.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-8">
            {[
              {
                Icon: ShieldCheckIcon,
                title: "Sealed & Authentic",
                body: "Every bottle arrives factory-sealed. We sell original designer fragrances — never inspired-by copies — and will happily walk you through authenticity markers.",
              },
              {
                Icon: SparkleIcon,
                title: "Personal Guidance",
                body: "Not sure between Chanel No.5 and Coco Mademoiselle? Message us with your favourite notes, occasion or budget — we guide you to the right bottle.",
              },
              {
                Icon: TruckIcon,
                title: "Nationwide Delivery",
                body: "Order from anywhere in Ghana. We confirm delivery fees on WhatsApp before you pay, and package every bottle with care.",
              },
            ].map(({ Icon, title, body }, index) => (
              <div
                key={title}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-blush/70 bg-white p-6 shadow-[0_14px_36px_-24px_rgb(34_23_34/0.4)] transition-all duration-300 hover:-translate-y-1.5 hover:border-rose/40 hover:shadow-[var(--shadow-lift)]"
              >
                <div aria-hidden className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-rose-soft/70 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-fig text-rose-light ring-4 ring-rose-soft transition-colors duration-300 group-hover:bg-rose-deep group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-[11px] italic text-champagne-deep">0{index + 1}</span>
                </div>
                <h3 className="relative mt-5 font-display text-lg font-semibold leading-snug text-fig">{title}</h3>
                <div aria-hidden className="rose-rule mt-3 w-10 opacity-60" />
                <p className="relative mt-3 text-[13px] leading-6 text-fig/65">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= OUR STORY TEASER ========================= */}
      <section className="relative overflow-hidden border-t border-blush/50 bg-fig text-porcelain">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_45%_55%_at_8%_90%,rgb(183_110_121/0.22),transparent_60%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div aria-hidden className="absolute -left-3 -top-3 h-full w-full rounded-[1.75rem] border border-champagne/30" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-soft)] sm:aspect-[5/4.4] lg:aspect-[4/4.6]">
              <Image
                src={STORY_IMAGE}
                alt="A lush bouquet of blush roses and peonies — the florals at the heart of fine fragrance"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-[50%_38%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fig/50 to-transparent" />
            </div>
          </div>
          <div>
            <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.42em] text-champagne">
              <span className="h-px w-8 bg-champagne/70" aria-hidden /> Our Story
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.15] sm:text-5xl">
              Fragrance, curated with <em className="italic text-rose-light">intention</em>.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-porcelain/78">{settings.aboutStory}</p>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-3 border-b border-champagne pb-1.5 text-[11px] font-bold uppercase tracking-[0.3em] text-champagne-light transition-all hover:gap-5 hover:text-champagne"
            >
              Read our story <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================= FINAL CTA ========================= */}
      <section className="relative overflow-hidden border-t border-rose/20 bg-gradient-to-br from-rose-deep via-[#5a3340] to-fig py-16 text-center text-porcelain sm:py-24">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(227_200_120/0.22),transparent_62%)]" />
        <div className="relative mx-auto max-w-3xl px-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.46em] text-champagne-light">Your Signature Awaits</p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.12] sm:text-5xl">
            Ready to find <em className="italic text-champagne-light">your</em> fragrance?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-porcelain/80 sm:text-base">
            Take two minutes on WhatsApp — tell us your taste, your occasion and your budget, and we
            will point you to the bottle that fits.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {waLink ? (
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-14 items-center gap-3 rounded-full bg-wa px-8 text-[11px] font-bold uppercase tracking-[0.22em] text-white shadow-[0_18px_45px_-12px_rgb(18_140_126/0.7)] transition-all hover:bg-wa-dark"
              >
                <WhatsAppIcon className="h-5 w-5" /> Chat on WhatsApp
              </a>
            ) : (
              <Link
                href="/contact"
                className="inline-flex h-14 items-center gap-3 rounded-full bg-champagne px-8 text-[11px] font-bold uppercase tracking-[0.22em] text-fig transition-colors hover:bg-champagne-light"
              >
                Send us a message
              </Link>
            )}
            <Link
              href="/shop"
              className="inline-flex h-14 items-center gap-2 rounded-full border border-porcelain/30 px-8 text-[11px] font-bold uppercase tracking-[0.22em] text-porcelain transition-all hover:border-champagne-light hover:text-champagne-light"
            >
              Browse the shop
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
