"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CloseIcon, MenuIcon, WhatsAppIcon } from "@/components/icons";
import { NavLinks, MobileNavLinks } from "@/components/nav-links";
import { cn } from "@/lib/utils";

export function SiteHeader({
  announcement,
  businessName,
  tagline,
  whatsappLink,
}: {
  announcement: string;
  businessName: string;
  tagline: string;
  whatsappLink: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40">
      {announcement ? (
        <div className="border-b border-white/5 bg-fig text-center [@media(max-height:780px)]:hidden">
          <p className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-[8px] font-semibold uppercase tracking-[0.18em] text-rose-light min-[420px]:text-[9px] min-[420px]:tracking-[0.24em] sm:text-[10px] sm:tracking-[0.34em]">
            <span aria-hidden className="text-champagne">✦</span>
            <span className="min-w-0 truncate">{announcement}</span>
            <span aria-hidden className="text-champagne">✦</span>
          </p>
        </div>
      ) : null}

      <div
        className={cn(
          "border-b border-blush/60 bg-porcelain/85 backdrop-blur-xl transition-shadow duration-300",
          scrolled && "shadow-[0_18px_50px_-24px_rgb(34_23_34/0.45)]",
        )}
      >
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 [@media(max-height:780px)]:h-16 lg:px-8">
          <Link href="/" className="group flex items-center gap-3" aria-label={`${businessName} — home`}>
            <span
              aria-hidden
              className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[radial-gradient(circle_at_32%_30%,#d99aa4,#96555f_72%)] font-display text-[22px] italic text-white shadow-[0_10px_28px_-8px_rgb(150_85_95/0.7)] ring-1 ring-rose-deep/40 transition-transform duration-300 group-hover:scale-105"
            >
              H
              <span className="pointer-events-none absolute inset-[3px] rounded-full border border-white/25" aria-hidden />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[19px] font-semibold tracking-tight text-fig">
                Heritage <em className="italic text-rose-deep">By Nancy</em>
              </span>
              <span className="mt-0.5 block whitespace-nowrap text-[7px] font-semibold uppercase tracking-[0.3em] text-fig/55 min-[400px]:text-[8px] min-[400px]:tracking-[0.4em]">
                {tagline}
              </span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            <NavLinks />
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {whatsappLink ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                aria-label="Chat with us on WhatsApp"
                className="hidden h-11 w-11 items-center justify-center rounded-full border border-wa-dark/25 bg-wa/10 text-wa-dark transition-all hover:scale-105 hover:bg-wa hover:text-white sm:flex"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
            ) : null}
            <Link
              href="/shop"
              className="hidden rounded-full bg-fig px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-champagne-light shadow-[0_12px_30px_-12px_rgb(34_23_34/0.6)] transition-all hover:bg-fig-lift hover:text-champagne sm:inline-flex"
            >
              Shop
            </Link>
            <Link
              href="/admin"
              aria-label="Staff sign in"
              title="Staff sign in"
              className="flex h-11 w-11 items-center justify-center rounded-full text-fig/35 transition-colors hover:bg-fig/5 hover:text-fig"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-fig/15 text-fig transition-colors hover:border-rose hover:text-rose-deep lg:hidden"
            >
              {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className={cn(
            "absolute inset-x-0 top-full origin-top overflow-hidden border-blush/40 bg-fig shadow-2xl transition-all duration-300 ease-out lg:hidden",
            open ? "max-h-[75vh] overflow-y-auto border-t pb-7 pt-4 opacity-100" : "pointer-events-none max-h-0 opacity-0",
          )}
        >
          <nav aria-label="Mobile" className="mx-auto flex max-w-7xl flex-col gap-1 px-4 sm:px-6">
            <MobileNavLinks onNavigate={() => setOpen(false)} />
            {whatsappLink ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-center justify-center gap-3 rounded-2xl bg-wa px-4 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-wa-dark"
              >
                <WhatsAppIcon className="h-5 w-5" /> Order on WhatsApp
              </a>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
}
