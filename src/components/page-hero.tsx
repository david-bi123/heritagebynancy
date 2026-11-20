import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Editorial page banner used across the storefront: a graded photograph under
 * a deep aubergine wash, with a champagne rule and optional action slot.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  imagePosition = "50% 45%",
  size = "md",
  children,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  image: string;
  imagePosition?: string;
  size?: "sm" | "md";
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-fig text-porcelain">
      <Image
        src={image}
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        style={{ objectPosition: imagePosition }}
        className="kenburns object-cover opacity-70"
      />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(100deg,rgb(34_23_34/0.94)_0%,rgb(34_23_34/0.72)_45%,rgb(34_23_34/0.35)_100%)]" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_12%_15%,rgb(183_110_121/0.32),transparent_65%)]" />
      <div aria-hidden className="grain absolute inset-0" />

      <div
        className={cn(
          "relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8",
          size === "sm" ? "py-14 sm:py-16" : "py-16 sm:py-20 lg:py-24",
        )}
      >
        <div className="max-w-2xl">
          <p className="flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.44em] text-champagne-light sm:text-[10px]">
            <span aria-hidden className="h-px w-9 bg-gradient-to-r from-transparent via-champagne to-champagne/40" />
            {eyebrow}
          </p>
          <h1
            className={cn(
              "mt-4 font-display font-semibold leading-[1.08] tracking-[-0.01em]",
              size === "sm" ? "text-[2.15rem] sm:text-4xl" : "text-[2.35rem] sm:text-5xl",
            )}
          >
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-4 max-w-xl text-sm leading-7 text-porcelain/70 sm:text-[15px] sm:leading-8">
              {subtitle}
            </p>
          ) : null}
          {children ? <div className="mt-7">{children}</div> : null}
        </div>
        {aside ? <div className="shrink-0">{aside}</div> : null}
      </div>

      <div aria-hidden className="gold-rule absolute inset-x-0 bottom-0 opacity-70" />
      <div aria-hidden className="inner-hairline hidden sm:block" />
    </section>
  );
}
