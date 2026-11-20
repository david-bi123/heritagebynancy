import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { buildWaLink } from "@/lib/whatsapp";
import { ABOUT_HERO_IMAGE } from "@/lib/fallback-data";
import { SectionHeading } from "@/components/section-heading";
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  SparkleIcon,
  TruckIcon,
  WhatsAppIcon,
} from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Why Heritage By Nancy exists — a curated, honest edit of authentic designer fragrances for men and women, guided personally on WhatsApp.",
};

const steps = [
  { step: "01", title: "Browse the edit", body: "Explore sealed, authentic designer fragrances by house, notes or budget — every bottle is photographed and priced clearly." },
  { step: "02", title: "Pick your size", body: "Choose your bottle size and quantity on the product page. The exact price updates instantly — no hidden fees, no surprises." },
  { step: "03", title: "Order on WhatsApp", body: "One tap sends your order straight to Nancy — product, size, quantity and link included. Pay by Mobile Money or bank transfer after confirmation." },
  { step: "04", title: "Delivered to you", body: "Your fragrance is packaged with care and delivered nationwide. Delivery fees and timing are confirmed with you on WhatsApp first." },
];

export default async function AboutPage() {
  const settings = await getSettings();
  const waLink = settings.whatsappNumber
    ? buildWaLink(settings.whatsappNumber, `Hello ${settings.businessName}! I would like to know more about your fragrances.`)
    : null;

  return (
    <>
      {/* Story hero */}
      <section className="relative isolate overflow-hidden bg-fig text-porcelain">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_65%_at_8%_8%,rgb(183_110_121/0.3),transparent_62%)]" />
        <div aria-hidden className="grain absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8 lg:py-20">
          <div className="lg:col-span-6">
            <p className="flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.44em] text-champagne sm:text-[10px]">
              <span aria-hidden className="h-px w-9 bg-gradient-to-r from-transparent via-champagne to-champagne/50" />
              Our Story
            </p>
            <h1 className="mt-5 font-display text-[2.35rem] font-semibold leading-[1.08] sm:text-5xl">
              A house built on <em className="italic text-rose-light">honest</em> fragrance.
            </h1>
            <div className="rose-rule mt-6 w-24" aria-hidden />
            <p className="mt-6 max-w-xl text-[15px] leading-8 text-porcelain/75">{settings.aboutStory}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex h-13 items-center gap-2.5 rounded-full bg-gradient-to-br from-rose to-rose-deep px-7 text-[10px] font-bold uppercase tracking-[0.22em] text-white shadow-[0_18px_44px_-16px_rgb(183_110_121/0.8)] transition-all hover:brightness-110"
              >
                Browse the edit <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href={waLink ?? "/contact"}
                {...(waLink ? { target: "_blank", rel: "noreferrer" } : {})}
                className="inline-flex h-13 items-center gap-2.5 rounded-full border border-white/20 px-7 text-[10px] font-bold uppercase tracking-[0.22em] text-porcelain transition-colors hover:border-champagne/70 hover:text-champagne-light"
              >
                {waLink ? <WhatsAppIcon className="h-4 w-4" /> : null}
                Talk to Nancy
              </Link>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 text-center">
              {[
                { value: "100%", label: "Sealed" },
                { value: "Nationwide", label: "Delivery" },
                { value: "Personal", label: "Guidance" },
              ].map(({ value, label }) => (
                <div key={label} className="bg-fig/70 px-3 py-4 backdrop-blur-sm">
                  <dt className="sr-only">{label}</dt>
                  <dd className="font-display text-[15px] font-semibold leading-tight text-champagne-light sm:text-base">
                    {value}
                  </dd>
                  <dd className="mt-1 text-[7.5px] font-semibold uppercase tracking-[0.22em] text-porcelain/45">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:col-span-6 lg:max-w-lg">
            <div aria-hidden className="absolute -right-4 -top-4 h-full w-full rounded-t-full border border-champagne/35" />
            <div aria-hidden className="absolute -left-3 -bottom-3 h-full w-full rounded-t-full border border-rose/25" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-full border border-rose/30 shadow-[0_45px_100px_-40px_rgb(0_0_0/0.85)]">
              <Image
                src={ABOUT_HERO_IMAGE}
                alt="Blush roses and peonies — the florals at the heart of fine fragrance"
                fill
                sizes="(min-width: 1024px) 42vw, 90vw"
                className="object-cover object-[50%_38%]"
                priority
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-fig/75 via-transparent to-fig/10" />
              <div aria-hidden className="pointer-events-none absolute inset-4 rounded-t-full border border-white/20" />
            </div>
            <div className="absolute -bottom-2 left-1/2 w-max -translate-x-1/2 rounded-full border border-white/20 bg-fig/70 px-5 py-2.5 backdrop-blur-md">
              <p className="text-[8px] font-semibold uppercase tracking-[0.34em] text-champagne-light">
                Curated in Ghana
              </p>
            </div>
          </div>
        </div>
        <div aria-hidden className="gold-rule absolute inset-x-0 bottom-0 opacity-70" />
      </section>

      {/* Editorial quote band */}
      <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:py-20">
        <SparkleIcon aria-hidden className="twinkle mx-auto h-5 w-5 text-champagne" />
        <blockquote className="mt-6 font-display text-2xl font-medium leading-[1.45] text-fig sm:text-[2rem]">
          &ldquo;A fragrance should feel like a memory before it is a purchase.{" "}
          <em className="italic text-rose-deep">We help you find the one that stays.</em>&rdquo;
        </blockquote>
        <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.4em] text-fig/45">
          The Heritage By Nancy house note
        </p>
      </section>

      {/* How ordering works */}
      <section className="border-y border-blush/60 bg-petal/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Simple By Design"
            title="How ordering works"
            subtitle="No accounts, no checkout queues. Four steps from discovery to doorstep."
          />
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {steps.map(({ step, title, body }, index) => (
              <li
                key={step}
                className="group relative overflow-hidden rounded-3xl border border-blush/70 bg-white p-6 shadow-[0_14px_36px_-24px_rgb(34_23_34/0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-rose/40 hover:shadow-[var(--shadow-card)]"
              >
                <div aria-hidden className="absolute -right-6 -top-8 font-display text-[5.5rem] font-bold leading-none text-petal-deep/60 transition-colors duration-300 group-hover:text-rose-soft">
                  {step}
                </div>
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-fig text-[10px] font-bold tracking-[0.06em] text-champagne-light">
                  {step}
                </span>
                <h2 className="relative mt-4 font-display text-lg font-semibold text-fig">{title}</h2>
                <p className="relative mt-2 text-[13px] leading-6 text-fig/65">{body}</p>
                {index < steps.length - 1 ? (
                  <span aria-hidden className="absolute right-4 top-6 hidden text-champagne/50 lg:block">→</span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Values + CTA */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-stretch lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center">
          <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-rose-deep">What guides us</p>
          <h2 className="mt-3 font-display text-2xl font-semibold leading-tight text-fig sm:text-3xl">
            What &ldquo;Heritage&rdquo; means to us
          </h2>
          <div aria-hidden className="rose-rule mt-5 w-20 opacity-70" />
          <ul className="mt-7 space-y-5">
            {[
              { Icon: ShieldCheckIcon, title: "Authenticity over hype", body: "Sealed, original bottles, every single order — verified before dispatch." },
              { Icon: SparkleIcon, title: "Advice before you buy", body: "We would rather steer you right than sell you fast." },
              { Icon: TruckIcon, title: "Respect for your budget", body: "Honest pricing, confirmed on WhatsApp before you pay a cedi." },
            ].map(({ Icon, title, body }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-petal text-rose-deep ring-1 ring-blush">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-[15px] font-semibold text-fig">{title}</p>
                  <p className="mt-0.5 text-[13px] leading-6 text-fig/60">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-fig-raise via-fig to-[#43242f] p-8 text-porcelain ring-1 ring-rose/25 sm:p-10">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_90%_10%,rgb(183_110_121/0.35),transparent_65%)]" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.42em] text-champagne">Talk To Nancy</p>
              <h3 className="mt-3 font-display text-2xl font-semibold leading-tight sm:text-[1.9rem]">
                Not sure where to start?
              </h3>
              <p className="mt-3 max-w-sm text-[13.5px] leading-7 text-porcelain/70">
                Send a quick voice note or message — your taste, the occasion, your budget — and get a
                personal recommendation within the day.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={waLink ?? "/contact"}
                {...(waLink ? { target: "_blank", rel: "noreferrer" } : {})}
                className="inline-flex h-12 items-center gap-2.5 rounded-full bg-wa px-6 text-[10px] font-bold uppercase tracking-[0.22em] text-white transition-colors hover:bg-wa-dark"
              >
                {waLink ? <WhatsAppIcon className="h-4 w-4" /> : null}
                {waLink ? "Chat on WhatsApp" : "Contact us"}
              </Link>
              <Link
                href="/shop"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-[10px] font-bold uppercase tracking-[0.22em] text-porcelain transition-colors hover:border-champagne/70 hover:text-champagne-light"
              >
                Browse shop <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
