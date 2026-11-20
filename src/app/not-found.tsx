import Image from "next/image";
import Link from "next/link";
import { HERO_IMAGE } from "@/lib/fallback-data";
import { ArrowRightIcon, SparkleIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="relative flex min-h-svh flex-1 items-center overflow-hidden bg-fig px-4 py-16 text-porcelain sm:px-6 lg:px-8">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_18%_30%,rgb(183_110_121/0.3),transparent_65%)]" />
      <div aria-hidden className="grain absolute inset-0" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.44em] text-champagne sm:text-[10px]">
            <span aria-hidden className="h-px w-9 bg-gradient-to-r from-transparent via-champagne to-champagne/40" />
            Error 404
          </p>
          <h1 className="mt-5 font-display text-[2.6rem] font-semibold leading-[1.06] sm:text-6xl">
            This bottle isn&rsquo;t on <em className="italic text-rose-light">our shelf.</em>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-porcelain/70 sm:text-[15px] sm:leading-8">
            The page you were looking for doesn&rsquo;t exist or has been moved. The collection is
            still beautiful — let us help you find your signature.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex h-13 items-center gap-2.5 rounded-full bg-gradient-to-br from-rose to-rose-deep px-7 text-[10px] font-bold uppercase tracking-[0.22em] text-white shadow-[0_18px_44px_-16px_rgb(183_110_121/0.8)] transition-all hover:brightness-110"
            >
              Back home <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex h-13 items-center rounded-full border border-white/25 px-7 text-[10px] font-bold uppercase tracking-[0.22em] text-porcelain transition-colors hover:border-champagne/70 hover:text-champagne-light"
            >
              Browse the shop
            </Link>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-[9px] font-semibold uppercase tracking-[0.22em] text-porcelain/45">
            <li className="flex items-center gap-2">
              <SparkleIcon aria-hidden className="h-3.5 w-3.5 text-champagne" /> Sealed stock
            </li>
            <li className="flex items-center gap-2">
              <SparkleIcon aria-hidden className="h-3.5 w-3.5 text-champagne" /> Personal guidance
            </li>
            <li className="flex items-center gap-2">
              <SparkleIcon aria-hidden className="h-3.5 w-3.5 text-champagne" /> Nationwide delivery
            </li>
          </ul>
        </div>

        <div className="relative mx-auto hidden w-full max-w-sm lg:block">
          <div aria-hidden className="absolute -inset-3 rounded-t-full border border-champagne/25" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full border border-rose/30 shadow-[0_45px_100px_-40px_rgb(0_0_0/0.9)]">
            <Image
              src={HERO_IMAGE}
              alt="A crystal perfume flacon resting among blush garden roses"
              fill
              sizes="40vw"
              className="object-cover object-[50%_35%]"
              priority
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-fig/85 via-fig/10 to-fig/25" />
            <div aria-hidden className="pointer-events-none absolute inset-4 rounded-t-full border border-white/20" />
            <p className="absolute inset-x-0 bottom-7 text-center font-display text-sm italic text-champagne-light">
              The edit continues inside
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
