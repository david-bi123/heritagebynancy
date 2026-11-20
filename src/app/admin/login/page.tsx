import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { HERO_IMAGE } from "@/lib/fallback-data";
import { ArrowLeftIcon, ShieldCheckIcon, SparkleIcon } from "@/components/icons";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Atelier Access",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col bg-fig text-porcelain lg:flex-row">
      {/* ── Editorial image panel ─────────────────────────────────────── */}
      <aside className="relative isolate flex min-h-[15rem] w-full overflow-hidden sm:min-h-[19rem] lg:min-h-svh lg:w-[54%]">
        <Image
          src={HERO_IMAGE}
          alt="A crystal perfume flacon resting among blush garden roses"
          fill
          priority
          sizes="(min-width: 1024px) 54vw, 100vw"
          className="kenburns object-cover object-[50%_35%]"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-fig/80 via-fig/45 to-fig/95 lg:bg-gradient-to-tr lg:from-fig/95 lg:via-fig/55 lg:to-fig/80" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_20%_20%,rgb(183_110_121/0.35),transparent_65%)]" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_16%_58%,rgb(34_23_34/0.6),transparent_72%)]" />
        <div aria-hidden className="grain absolute inset-0" />

        <div className="relative z-10 flex w-full flex-col justify-between p-6 sm:p-10 lg:p-14">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[radial-gradient(circle_at_32%_30%,#d99aa4,#96555f_72%)] font-display text-xl italic text-white ring-1 ring-white/25 shadow-[0_10px_30px_-8px_rgb(0_0_0/0.6)]">
                H
              </span>
              <span className="leading-tight">
                <span className="block font-display text-lg font-semibold text-porcelain">
                  Heritage <em className="italic text-rose-light">By Nancy</em>
                </span>
                <span className="block text-[8px] font-semibold uppercase tracking-[0.42em] text-champagne-light/90">
                  The Atelier
                </span>
              </span>
            </span>
            <Link
              href="/"
              className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-porcelain/80 backdrop-blur-md transition-colors hover:border-champagne/60 hover:text-champagne-light sm:inline-flex"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" /> Storefront
            </Link>
          </div>

          <div className="mt-10 hidden max-w-lg sm:block lg:mt-0">
            <p className="flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.46em] text-champagne-light">
              <span aria-hidden className="h-px w-8 bg-champagne/70" />
              Private Console
            </p>
            <p className="mt-5 font-display text-3xl font-semibold leading-[1.12] text-porcelain sm:text-4xl lg:text-[2.9rem]">
              Behind every bottle,
              <br />
              a <em className="italic text-rose-light">signature</em>.
            </p>
            <p className="mt-4 max-w-md text-sm leading-7 text-porcelain/65">
              Manage the edit, watch stock, and answer every customer — all in one quiet room.
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-porcelain/60">
              <li className="flex items-center gap-2">
                <ShieldCheckIcon aria-hidden className="h-4 w-4 text-champagne" /> Sealed stock
              </li>
              <li className="flex items-center gap-2">
                <SparkleIcon aria-hidden className="h-4 w-4 text-champagne" /> Curated edit
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-rose-light" /> Live catalogue
              </li>
            </ul>
          </div>

          <p className="mt-8 hidden text-[10px] uppercase tracking-[0.26em] text-porcelain/35 sm:block">
            Authorised team only · Activity may be logged
          </p>
        </div>
      </aside>

      {/* ── Form panel ────────────────────────────────────────────────── */}
      <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-porcelain px-4 py-10 sm:px-8 lg:py-16">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-rose-soft/70 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-petal blur-3xl" />

        <div className="relative w-full max-w-sm">
          <div className="lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-fig/50 transition-colors hover:text-rose-deep">
              <ArrowLeftIcon className="h-3.5 w-3.5" /> Back to storefront
            </Link>
          </div>

          <p className="mt-8 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.44em] text-rose-deep lg:mt-0">
            <span aria-hidden className="h-px w-7 bg-rose/60" />
            Atelier Access
          </p>
          <h1 className="mt-4 font-display text-[2.15rem] font-semibold leading-[1.1] text-fig">
            Welcome <em className="italic text-rose-deep">back</em>.
          </h1>
          <p className="mt-2.5 text-sm leading-6 text-fig/60">
            Sign in to manage the Heritage By Nancy catalogue.
          </p>

          <div className="mt-8">
            <Suspense fallback={<div className="h-72 animate-pulse rounded-2xl bg-petal" />}>
              <LoginForm />
            </Suspense>
          </div>

          <div className="mt-8 border-t border-blush/70 pt-5">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-fig/50 transition-colors hover:text-rose-deep [&::-webkit-details-marker]:hidden">
                Trouble signing in?
                <span aria-hidden className="text-base leading-none transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-[12px] leading-6 text-fig/60">
                Ask the store owner to reset your password, or from a machine with the database
                credentials run{" "}
                <code className="rounded bg-petal px-1.5 py-0.5 text-[11px] text-rose-deep">npm run create-admin</code>.
                Access is limited to the heritage team.
              </p>
            </details>
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-fig/35">
            <ShieldCheckIcon aria-hidden className="h-3.5 w-3.5" />
            End-to-end protected session
          </p>
        </div>
      </main>
    </div>
  );
}
