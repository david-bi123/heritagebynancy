"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ShieldCheckIcon } from "@/components/icons";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const safe = images.length > 0 ? images : [];
  const [active, setActive] = useState(0);

  if (safe.length === 0) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center rounded-[2rem] border border-blush/70 bg-petal font-display text-sm italic text-fig/35">
        Photograph coming soon
      </div>
    );
  }

  return (
    <div className="lg:sticky lg:top-24">
      <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-blush/70 bg-petal shadow-[0_28px_70px_-32px_rgb(34_23_34/0.5)]">
        <Image
          key={safe[active]}
          src={safe[active]}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 42vw, 100vw"
          className="object-cover object-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-fig/45 via-transparent to-fig/10" />
        <div aria-hidden className="pointer-events-none absolute inset-3 rounded-[1.5rem] border border-white/25" />

        <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-fig/50 px-3.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.24em] text-porcelain backdrop-blur-md">
          <ShieldCheckIcon aria-hidden className="h-3.5 w-3.5 text-champagne-light" />
          Sealed · Original
        </span>

        <span className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/20 bg-fig/45 px-4 py-1.5 text-[8px] font-semibold uppercase tracking-[0.3em] text-porcelain/80 backdrop-blur-md">
          The Atelier Edit
        </span>
      </div>

      {safe.length > 1 ? (
        <div className="mt-3 flex gap-3" role="group" aria-label="Product photographs">
          {safe.map((src, index) => (
            <button
              key={src + index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1}`}
              aria-pressed={index === active}
              className={cn(
                "relative h-20 w-16 overflow-hidden rounded-xl border-2 transition-all sm:h-24 sm:w-20",
                index === active
                  ? "border-rose-deep shadow-[0_10px_24px_-12px_rgb(150_85_95/0.7)]"
                  : "border-transparent opacity-55 hover:opacity-100",
              )}
            >
              <Image src={src} alt={`${alt} thumbnail ${index + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
