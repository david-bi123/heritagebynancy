import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { PageHero } from "@/components/page-hero";
import { POLICY_HERO_IMAGE } from "@/lib/fallback-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Delivery, Returns & Privacy",
  description:
    "How Heritage By Nancy handles nationwide delivery, delivery fees, sealed-product returns and your privacy.",
};

export default async function PoliciesPage() {
  const settings = await getSettings();

  const sections = [
    {
      id: "delivery",
      title: "Delivery",
      body: settings.deliveryInfo,
    },
    {
      id: "returns",
      title: "Returns & Damages",
      body: settings.returnsInfo,
    },
    {
      id: "privacy",
      title: "Privacy",
      body: "This website does not require an account and does not set advertising trackers. When you message us on WhatsApp or submit the contact form, we use your details only to handle your enquiry or order (quotes, payment confirmation and delivery). We do not sell your information. Messages sent through WhatsApp are also governed by WhatsApp's own privacy policy. You may ask us at any time to delete your contact details from our records.",
    },
    {
      id: "authenticity",
      title: "Authenticity",
      body: "Heritage By Nancy sells original, factory-sealed designer fragrances. Every order is checked before dispatch. If you ever have doubts about a bottle you received, contact us within 48 hours and we will verify it with you.",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="The Fine Print"
        title={
          <>
            Clear terms, <em className="italic text-rose-light">humanly</em> written.
          </>
        }
        subtitle="Delivery, returns, privacy and authenticity — the same policies we would want as customers. The shop owner can update them any time from the console."
        image={POLICY_HERO_IMAGE}
        imagePosition="50% 30%"
        size="sm"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="-mt-7 grid gap-8 lg:grid-cols-12">
          <nav aria-label="Policy sections" className="lg:col-span-4">
            <div className="rounded-2xl border border-blush/70 bg-white p-5 shadow-[var(--shadow-card)] lg:sticky lg:top-24">
              <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-rose-deep">On this page</p>
              <ol className="mt-3 space-y-1">
                {sections.map(({ id, title }, index) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-fig/70 transition-colors hover:bg-porcelain hover:text-rose-deep"
                    >
                      <span className="font-display text-[11px] italic text-champagne-deep">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="space-y-5 lg:col-span-8">
            {sections.map(({ id, title, body }, index) => (
              <section
                key={id}
                id={id}
                className="scroll-mt-28 rounded-3xl border border-blush/70 bg-white p-6 shadow-[var(--shadow-card)] sm:p-8"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-sm italic text-champagne-deep">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-xl font-semibold text-fig">{title}</h2>
                </div>
                <div aria-hidden className="rose-rule mt-4 w-16 opacity-70" />
                <p className="mt-4 text-[13.5px] leading-7 text-fig/75">{body}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
