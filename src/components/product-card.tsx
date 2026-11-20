import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { startingPrice, stockStatus, type StorefrontProduct } from "@/lib/data";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  currency,
  priority = false,
}: {
  product: StorefrontProduct;
  currency: string;
  priority?: boolean;
}) {
  const status = stockStatus(product);
  const price = startingPrice(product);
  const image = product.images[0];

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-[1.6rem] border border-blush/70 bg-white shadow-[0_14px_36px_-22px_rgb(34_23_34/0.35)] transition-all duration-500 hover:-translate-y-1.5 hover:border-rose/45 hover:shadow-[0_32px_64px_-26px_rgb(150_85_95/0.45)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-deep"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-petal">
        {image ? (
          <Image
            src={image}
            alt={`${product.name} fragrance bottle`}
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, (min-width: 640px) 45vw, 50vw"
            priority={priority}
            className="object-cover object-center saturate-[0.96] transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-sm italic text-fig/30">
            Photograph coming soon
          </div>
        )}

        {/* Warm atelier grade — unifies mixed photography */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-fig/75 via-fig/5 to-fig/15" />
        <div aria-hidden className="absolute inset-0 bg-rose/15 opacity-0 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-100" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-fig/25 to-transparent" />

        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          {product.featured ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-champagne/45 bg-fig/60 px-2.5 py-1 text-[7px] font-semibold uppercase tracking-[0.22em] text-champagne-light backdrop-blur-md sm:text-[8px] sm:tracking-[0.26em]">
              <span aria-hidden className="h-1 w-1 rounded-full bg-champagne" />
              Featured
            </span>
          ) : (
            <span aria-hidden />
          )}
          {status === "out" ? (
            <span className="rounded-full bg-fig/80 px-2.5 py-1 text-[7px] font-semibold uppercase tracking-[0.18em] text-rose-light backdrop-blur-md sm:text-[8px]">
              Sold out
            </span>
          ) : status === "low" ? (
            <span className="rounded-full bg-champagne/95 px-2.5 py-1 text-[7px] font-semibold uppercase tracking-[0.18em] text-fig backdrop-blur-sm sm:text-[8px]">
              Only {product.stock} left
            </span>
          ) : null}
        </div>

        {/* Hover reveal — view prompt */}
        <span className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-between gap-2 rounded-full border border-white/20 bg-fig/55 px-4 py-2.5 text-[8px] font-semibold uppercase tracking-[0.28em] text-porcelain opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          View the bottle
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
            <path d="M4 12h15M13 5l7 7-7 7" />
          </svg>
        </span>

        <div aria-hidden className="pointer-events-none absolute inset-2 rounded-[1.2rem] border border-white/20" />
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[8.5px] font-semibold uppercase tracking-[0.34em] text-rose-deep">
            {product.brand || "Signature"}
          </p>
          <span
            aria-label={status === "out" ? "Out of stock" : "In stock"}
            className={cn(
              "flex shrink-0 items-center gap-1.5 text-[7.5px] font-semibold uppercase tracking-[0.16em]",
              status === "out" ? "text-rose-deep" : "text-wa-dark",
            )}
          >
            <span
              aria-hidden
              className={cn("h-1.5 w-1.5 rounded-full", status === "out" ? "bg-rose-deep" : "bg-wa")}
            />
            {status === "out" ? "Sold out" : "Sealed"}
          </span>
        </div>

        <h3 className="mt-1.5 font-display text-[1.02rem] font-semibold leading-snug text-fig transition-colors duration-300 group-hover:text-rose-deep sm:text-[1.15rem]">
          {product.name}
        </h3>
        <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-fig/45">{product.concentration}</p>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-petal pt-3.5">
          <div>
            <p className="text-[8px] uppercase tracking-[0.24em] text-fig/45">From</p>
            <p className="font-display text-[1.15rem] font-bold text-fig sm:text-xl">
              {formatPrice(price, currency)}
            </p>
          </div>
          <span
            aria-hidden
            className="mb-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-fig/10 text-fig/50 transition-all duration-300 group-hover:border-rose-deep group-hover:bg-rose-deep group-hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M4 12h15M13 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
