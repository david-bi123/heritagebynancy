import Link from "next/link";
import type { SiteSettings } from "@/lib/settings";
import {
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  TikTokIcon,
  WhatsAppIcon,
  XIcon,
} from "@/components/icons";
import { buildWaLink } from "@/lib/whatsapp";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  const waLink = settings.whatsappNumber
    ? buildWaLink(
        settings.whatsappNumber,
        `Hello ${settings.businessName}! I would like to enquire about your fragrances.`,
      )
    : null;

  const socials = [
    { href: settings.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: settings.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: settings.tiktok, label: "TikTok", Icon: TikTokIcon },
    { href: settings.x, label: "X (Twitter)", Icon: XIcon },
  ].filter((s) => s.href);

  return (
    <footer className="relative bg-fig text-porcelain">
      {/* Soft rose aurora behind the footer */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_15%_0%,rgb(183_110_121/0.16),transparent_65%),radial-gradient(ellipse_50%_45%_at_90%_100%,rgb(200_161_90/0.1),transparent_60%)]" />
      <div className="relative gold-rule opacity-70" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-display text-2xl font-semibold">
              Heritage <em className="italic text-rose-light">By Nancy</em>
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-champagne">
              {settings.tagline}
            </p>
            <p className="mt-5 max-w-sm text-sm leading-7 text-porcelain/70">
              Authentic designer fragrances for men and women — personally guided, sealed and
              delivered with care. Order in seconds on WhatsApp.
            </p>
            {socials.length > 0 ? (
              <div className="mt-6 flex items-center gap-3">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href!}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-porcelain/80 transition-all hover:scale-110 hover:border-rose hover:text-rose-light"
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <nav aria-label="Explore" className="md:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-rose-light">Explore</p>
            <ul className="mt-4 space-y-3 text-sm text-porcelain/75">
              <li><Link href="/shop" className="transition-colors hover:text-rose-light">Shop</Link></li>
              <li><Link href="/about" className="transition-colors hover:text-rose-light">Our Story</Link></li>
              <li><Link href="/faq" className="transition-colors hover:text-rose-light">FAQ</Link></li>
              <li><Link href="/policies" className="transition-colors hover:text-rose-light">Delivery &amp; Returns</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-rose-light">Contact</Link></li>
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-rose-light">Collections</p>
            <ul className="mt-4 space-y-3 text-sm text-porcelain/75">
              <li><Link href="/shop?category=womens" className="transition-colors hover:text-rose-light">Women&rsquo;s Fragrances</Link></li>
              <li><Link href="/shop?category=mens" className="transition-colors hover:text-rose-light">Men&rsquo;s Fragrances</Link></li>
              <li><Link href="/shop?sort=price-asc" className="transition-colors hover:text-rose-light">Under GH₵ 1,000</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-rose-light">Reach Us</p>
            <ul className="mt-4 space-y-3 text-sm text-porcelain/75">
              {waLink ? (
                <li>
                  <a href={waLink} target="_blank" rel="noreferrer" className="flex items-start gap-2.5 transition-colors hover:text-rose-light">
                    <WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0 text-wa" /> Chat on WhatsApp
                  </a>
                </li>
              ) : null}
              {settings.phone ? (
                <li>
                  <a href={`tel:${settings.phone}`} className="flex items-start gap-2.5 transition-colors hover:text-rose-light">
                    <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-champagne" /> {settings.phone}
                  </a>
                </li>
              ) : null}
              {settings.email ? (
                <li>
                  <a href={`mailto:${settings.email}`} className="flex items-start gap-2.5 break-all transition-colors hover:text-rose-light">
                    <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-champagne" /> {settings.email}
                  </a>
                </li>
              ) : null}
              {settings.address ? (
                <li className="flex items-start gap-2.5">
                  <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-champagne" /> {settings.address}
                </li>
              ) : null}
              {settings.hours ? (
                <li className="flex items-start gap-2.5">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-champagne" /> {settings.hours}
                </li>
              ) : null}
              {!waLink && !settings.phone && !settings.email && !settings.address && !settings.hours ? (
                <li className="text-porcelain/50">
                  Contact details will be published here soon. Meanwhile, use the{" "}
                  <Link href="/contact" className="text-rose-light underline underline-offset-2">
                    contact form
                  </Link>
                  .
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-[10px] uppercase tracking-[0.2em] text-porcelain/45 sm:flex-row sm:px-6 lg:px-8">
          <p>© {year} {settings.businessName}. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <a href="https://www.samtechlabs.com" className="transition-colors hover:text-rose-light">
              Authentic fragrances, personally delivered ·{" "}
              <span className="text-champagne-light/80">SamTech Labs</span>
            </a>
            <Link href="/admin" className="inline-flex items-center gap-1.5 transition-colors hover:text-rose-light" aria-label="Staff sign in">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
              Staff sign in
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
