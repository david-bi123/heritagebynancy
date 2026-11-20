"use client";

import { useState } from "react";
import type { StorefrontProduct } from "@/lib/data";
import { formatPrice, cn } from "@/lib/utils";
import { buildNotifyMessage, buildProductOrderMessage, buildWaLink } from "@/lib/whatsapp";
import { ArrowRightIcon, CheckIcon, ShieldCheckIcon, SparkleIcon, TruckIcon, WhatsAppIcon } from "@/components/icons";

export function OrderPanel({
  product,
  businessName,
  currency,
  whatsappNumber,
}: {
  product: StorefrontProduct;
  businessName: string;
  currency: string;
  whatsappNumber: string;
}) {
  const [sizeIndex, setSizeIndex] = useState(
    Math.max(0, product.sizes.length - 1), // default to the largest bottle
  );
  const [quantity, setQuantity] = useState(1);

  const waConfigured = whatsappNumber.trim().length > 0;
  const status = product.stock <= 0 ? "out" : product.stock <= 3 ? "low" : "in";
  const selected = product.sizes[sizeIndex] ?? product.sizes[0];
  const total = selected ? selected.price * quantity : 0;

  const openWhatsApp = (kind: "order" | "notify") => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const productUrl = `${origin}/shop/${product.slug}`;
    const message =
      kind === "order"
        ? buildProductOrderMessage({
            settings: { businessName, currency },
            productName: product.name,
            brand: product.brand,
            concentration: product.concentration,
            sizeLabel: selected?.label ?? "",
            unitPrice: selected?.price ?? 0,
            quantity,
            productUrl,
          })
        : buildNotifyMessage({ businessName }, product.name, productUrl);
    const link = buildWaLink(whatsappNumber, message);
    if (link) window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="rounded-3xl border border-blush/60 bg-white p-5 ring-1 ring-rose/5 shadow-[var(--shadow-card)] sm:p-6">
      {/* Size selection */}
      {product.sizes.length > 0 ? (
        <fieldset>
          <legend className="text-[10px] font-semibold uppercase tracking-[0.3em] text-fig/60">
            Choose a size
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((size, index) => {
              const active = index === sizeIndex;
              return (
                <button
                  key={size.label}
                  type="button"
                  onClick={() => setSizeIndex(index)}
                  aria-pressed={active}
                  className={cn(
                    "flex min-w-[104px] flex-col items-center gap-0.5 rounded-2xl border px-4 py-3 transition-all duration-200",
                    active
                      ? "border-rose-deep bg-gradient-to-br from-fig-lift to-rose-deep text-white shadow-[var(--shadow-card)] ring-1 ring-rose-deep/40"
                      : "border-blush bg-porcelain text-fig hover:border-rose hover:bg-rose-soft/40",
                  )}
                >
                  <span className="text-sm font-semibold">{size.label}</span>
                  <span className={cn("text-[11px]", active ? "text-white/80" : "text-fig/55")}>
                    {formatPrice(size.price, currency)}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {/* Quantity */}
      <div className="mt-5 flex items-center justify-between gap-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-fig/60">
          Quantity
        </span>
        <div className="flex items-center rounded-full border border-blush bg-white">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center text-lg text-fig transition-colors hover:text-rose-deep disabled:opacity-30"
            disabled={quantity <= 1}
          >
            −
          </button>
          <span className="w-10 text-center font-display text-lg font-semibold tabular-nums">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(Math.max(product.stock, 1), q + 1))}
            className="flex h-11 w-11 items-center justify-center text-lg text-fig transition-colors hover:text-rose-deep"
          >
            +
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-5 rounded-2xl border border-petal-deep bg-petal/60 px-4 py-3.5">
        <div className="flex items-baseline justify-between">
          <span className="text-xs uppercase tracking-[0.2em] text-fig/55">Total</span>
          <span className="font-display text-2xl font-bold text-fig">
            {formatPrice(total, currency)}
          </span>
        </div>
        <p className="mt-1 text-[11px] leading-5 text-fig/50">
          Final delivery fee is confirmed on WhatsApp before payment. No payment is taken on this site.
        </p>
      </div>

      {status === "low" ? (
        <p className="mt-4 rounded-lg border border-champagne/50 bg-champagne/15 px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-deep">
          Only {product.stock} {product.stock === 1 ? "bottle" : "bottles"} left — reserve yours
        </p>
      ) : null}

      {/* CTA */}
      {status !== "out" ? (
        waConfigured ? (
          <button
            type="button"
            onClick={() => openWhatsApp("order")}
            className="mt-5 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-wa text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_16px_40px_-12px_rgb(18_140_126/0.7)] transition-all hover:bg-wa-dark hover:shadow-[0_20px_48px_-12px_rgb(18_140_126/0.8)]"
          >
            <WhatsAppIcon className="h-6 w-6" /> Order on WhatsApp
          </button>
        ) : (
          <div className="relative mt-5 overflow-hidden rounded-2xl border border-blush/70 bg-gradient-to-br from-petal/80 via-porcelain to-petal/50 px-5 py-5 text-center">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-rose-deep shadow-sm ring-1 ring-blush/70">
              <SparkleIcon className="h-5 w-5" />
            </span>
            <p className="mt-3 font-display text-[15px] font-semibold text-fig">
              Request this bottle
            </p>
            <p className="mx-auto mt-1 max-w-xs text-[11.5px] leading-5 text-fig/55">
              Send us your size and quantity — we&rsquo;ll confirm availability, delivery fee and payment
              directly with you.
            </p>
            <a
              href="/contact"
              className="mt-3 inline-flex h-11 items-center gap-2 rounded-full bg-fig px-5 text-[9.5px] font-bold uppercase tracking-[0.22em] text-champagne-light transition-colors hover:bg-fig-lift"
            >
              Send us a message <ArrowRightIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        )
      ) : waConfigured ? (
        <button
          type="button"
          onClick={() => openWhatsApp("notify")}
          className="mt-5 flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-fig-lift bg-fig text-sm font-bold uppercase tracking-[0.2em] text-champagne-light transition-colors hover:bg-fig-lift"
        >
          <WhatsAppIcon className="h-5 w-5" /> Notify me on WhatsApp
        </button>
      ) : (
        <p className="mt-5 rounded-2xl border border-rose-deep/30 bg-rose-soft/50 px-4 py-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-rose-deep">
          Currently out of stock
        </p>
      )}

      {/* Reassurance */}
      <ul className="mt-5 grid grid-cols-1 gap-2 border-t border-blush pt-5 text-[11px] font-medium text-fig/70 min-[420px]:grid-cols-3">
        <li className="flex items-center gap-2"><ShieldCheckIcon className="h-4 w-4 shrink-0 text-rose-deep" /> 100% sealed</li>
        <li className="flex items-center gap-2"><CheckIcon className="h-4 w-4 shrink-0 text-rose-deep" /> Authentic stock</li>
        <li className="flex items-center gap-2"><TruckIcon className="h-4 w-4 shrink-0 text-rose-deep" /> Nationwide delivery</li>
      </ul>
    </div>
  );
}
