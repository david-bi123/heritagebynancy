import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { buildAdviceMessage, buildWaLink } from "@/lib/whatsapp";
import { PageHero } from "@/components/page-hero";
import { FAQ_HERO_IMAGE } from "@/lib/fallback-data";
import { ArrowRightIcon, WhatsAppIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FAQ — Orders, Delivery & Authenticity",
  description:
    "Answers about ordering on WhatsApp, delivery across Ghana, authenticity, samples, gift wrapping and returns at Heritage By Nancy.",
};

export default async function FaqPage() {
  const settings = await getSettings();
  const waLink = settings.whatsappNumber
    ? buildWaLink(settings.whatsappNumber, buildAdviceMessage(settings))
    : null;

  const faqs = [
    {
      q: "How do I place an order?",
      a: "Simply browse the shop, open the fragrance you love, pick your size and quantity, and tap “Order on WhatsApp”. Your order arrives in our WhatsApp with product, size, quantity and link pre-filled — review it, hit send, and we take it from there.",
    },
    {
      q: "How do I pay?",
      a: "We confirm your order and total (including delivery) on WhatsApp first, then share payment details — typically Mobile Money or bank transfer. Your bottle is dispatched once payment is confirmed. We never ask for card details on this website.",
    },
    {
      q: "Do you deliver? How much does delivery cost?",
      a: settings.deliveryInfo,
    },
    {
      q: "Are the fragrances authentic?",
      a: "Yes. Heritage By Nancy only sells 100% original, factory-sealed designer fragrances. If a bottle ever looked wrong to you on arrival, message us immediately — we will verify and make it right.",
    },
    {
      q: "Can I smell or sample a fragrance before buying?",
      a: "Message us on WhatsApp! Tell us your favourite notes or a fragrance you already wear, and we will recommend the closest match in stock. Sampling options depend on availability.",
    },
    {
      q: "Can I return or exchange a fragrance?",
      a: settings.returnsInfo,
    },
    {
      q: "Do you offer gift sets or wrapping?",
      a: "Yes — ask us on WhatsApp. We can wrap suitable purchases as gifts and, when stock allows, bundle fragrances into gift sets.",
    },
    {
      q: "How long does delivery take?",
      a: "Accra deliveries are usually fast (often same-day or next-day once payment is confirmed). Other regions typically take 1–3 business days via our courier partners. Exact timing is confirmed with you on WhatsApp.",
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <PageHero
        eyebrow="Questions & Answers"
        title={
          <>
            Before you <em className="italic text-rose-light">ask</em>.
          </>
        }
        subtitle="Ordering, delivery, authenticity and gifts — the answers customers ask for most."
        image={FAQ_HERO_IMAGE}
        imagePosition="50% 40%"
        size="sm"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:pb-24">
        <div className="-mt-7 divide-y divide-petal overflow-hidden rounded-3xl border border-blush/70 bg-white shadow-[var(--shadow-lift)]">
          {faqs.map(({ q, a }, index) => (
            <details key={q} className="group transition-colors open:bg-porcelain/60">
              <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-5 transition-colors marker:content-none hover:bg-porcelain/70 sm:px-7 [&::-webkit-details-marker]:hidden">
                <span className="font-display text-[11px] italic tabular-nums text-champagne-deep">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-display text-[1.05rem] font-semibold leading-snug text-fig sm:text-lg">
                  {q}
                </span>
                <span
                  aria-hidden
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blush text-rose-deep transition-all duration-300 group-open:rotate-45 group-open:border-rose-deep group-open:bg-rose-deep group-open:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-6 pl-[3.15rem] pr-14 sm:px-7 sm:pl-[3.6rem]">
                <p className="max-w-2xl text-[13.5px] leading-7 text-fig/70">{a}</p>
              </div>
            </details>
          ))}
        </div>

        <div className="relative mt-8 overflow-hidden rounded-3xl bg-fig px-6 py-7 text-porcelain sm:px-8">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_55%_70%_at_90%_10%,rgb(183_110_121/0.4),transparent_65%)]" />
          <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-champagne">Still deciding?</p>
              <p className="mt-2 max-w-md font-display text-xl font-semibold leading-snug sm:text-2xl">
                Tell us your taste — we&rsquo;ll recommend the bottle.
              </p>
            </div>
            {waLink ? (
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 shrink-0 items-center gap-2.5 rounded-full bg-wa px-6 text-[10px] font-bold uppercase tracking-[0.22em] text-white transition-colors hover:bg-wa-dark"
              >
                <WhatsAppIcon className="h-4 w-4" /> Get a recommendation
              </a>
            ) : (
              <Link
                href="/contact"
                className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-champagne px-6 text-[10px] font-bold uppercase tracking-[0.22em] text-fig"
              >
                Contact us <ArrowRightIcon className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
