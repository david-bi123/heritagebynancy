import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { buildWaLink } from "@/lib/whatsapp";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { CONTACT_HERO_IMAGE } from "@/lib/fallback-data";
import {
  ArrowRightIcon,
  ClockIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Reach Heritage By Nancy on WhatsApp, by phone or email — or send the contact form. We reply fast, usually within the day.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  const waLink = settings.whatsappNumber
    ? buildWaLink(
        settings.whatsappNumber,
        `Hello ${settings.businessName}! I would like to enquire about your fragrances.`,
      )
    : null;

  const contactRows = [
    waLink
      ? { Icon: WhatsAppIcon, label: "WhatsApp", value: "Chat with us instantly", href: waLink, accent: true }
      : null,
    settings.phone ? { Icon: PhoneIcon, label: "Phone", value: settings.phone, href: `tel:${settings.phone}` } : null,
    settings.email ? { Icon: MailIcon, label: "Email", value: settings.email, href: `mailto:${settings.email}` } : null,
    settings.address ? { Icon: MapPinIcon, label: "Visit", value: settings.address, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}` } : null,
    settings.hours ? { Icon: ClockIcon, label: "Hours", value: settings.hours } : null,
  ].filter(Boolean) as Array<{
    Icon: typeof PhoneIcon;
    label: string;
    value: string;
    href?: string;
    accent?: boolean;
  }>;

  return (
    <>
      <PageHero
        eyebrow="Concierge"
        title={
          <>
            Let&rsquo;s find <em className="italic text-rose-light">your</em> fragrance.
          </>
        }
        subtitle="Ask about a bottle, a budget or a gift. A real person answers — usually within the day."
        image={CONTACT_HERO_IMAGE}
        imagePosition="50% 50%"
        size="sm"
        aside={
          waLink ? (
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-13 items-center gap-3 rounded-full bg-wa px-7 text-[10px] font-bold uppercase tracking-[0.22em] text-white shadow-[0_18px_44px_-14px_rgb(18_140_126/0.75)] transition-colors hover:bg-wa-dark"
            >
              <WhatsAppIcon className="h-5 w-5" /> Chat on WhatsApp
            </a>
          ) : null
        }
      />

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative z-10 -mt-7 grid gap-6 lg:grid-cols-12">
          {/* Info column */}
          <div className="rounded-3xl border border-blush/70 bg-white p-6 shadow-[var(--shadow-lift)] sm:p-8 lg:col-span-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-rose-deep">Direct lines</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-fig">
              Talk to a human, not a bot.
            </h2>
            <p className="mt-2 text-[13px] leading-6 text-fig/60">
              The quickest way to reach {settings.businessName} is WhatsApp. Prefer the form? We read every message.
            </p>

            <ul className="mt-6 divide-y divide-petal">
              {contactRows.map(({ Icon, label, value, href, accent }) => {
                const inner = (
                  <>
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        accent ? "bg-wa/12 text-wa-dark" : "bg-petal text-rose-deep"
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[8px] font-semibold uppercase tracking-[0.28em] text-fig/45">
                        {label}
                      </span>
                      <span className="mt-0.5 block break-words text-[13.5px] font-medium leading-6 text-fig">
                        {value}
                      </span>
                    </span>
                    {href ? (
                      <ArrowRightIcon className="ml-auto h-4 w-4 shrink-0 text-fig/25 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-rose-deep" />
                    ) : null}
                  </>
                );
                return href ? (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="group flex items-center gap-4 py-3.5 transition-colors"
                    >
                      {inner}
                    </a>
                  </li>
                ) : (
                  <li key={label} className="flex items-center gap-4 py-3.5">
                    {inner}
                  </li>
                );
              })}
            </ul>

            {contactRows.length === 0 ? (
              <p className="mt-6 rounded-2xl border border-dashed border-fig/20 bg-porcelain p-5 text-[13px] leading-6 text-fig/55">
                Our official phone, WhatsApp line and address will be published here shortly. Until
                then, the form reaches us directly.
              </p>
            ) : null}

            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-fig px-4 py-3.5 text-porcelain">
              <ClockIcon aria-hidden className="h-4 w-4 shrink-0 text-champagne" />
              <p className="text-[11px] leading-5 text-porcelain/70">
                <span className="font-semibold text-champagne-light">Average reply:</span> under 2 hours during opening hours.
              </p>
            </div>
          </div>

          {/* Form column */}
          <div className="relative overflow-hidden rounded-3xl border border-blush/70 bg-white shadow-[var(--shadow-lift)] lg:col-span-7">
            <div aria-hidden className="h-1 w-full bg-gradient-to-r from-rose via-champagne to-rose-deep" />
            <div className="p-6 sm:p-10">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-rose-deep">Send a note</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-fig">Tell us what you&rsquo;re looking for</h2>
                </div>
                <Link href="/faq" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fig/45 underline-offset-4 hover:text-rose-deep hover:underline">
                  Read the FAQ
                </Link>
              </div>
              <p className="mt-2 text-[13px] leading-6 text-fig/60">
                Share your taste, occasion or budget — we&rsquo;ll reply with a personal recommendation.
              </p>
              <div className="mt-7">
                <ContactForm businessName={settings.businessName} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
