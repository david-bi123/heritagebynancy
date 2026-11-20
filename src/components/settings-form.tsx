"use client";

import { useActionState } from "react";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/settings";
import { changePasswordAction, saveSettingsAction, type ActionState } from "@/app/admin/actions";

const input =
  "h-12 w-full rounded-xl border border-fig/15 bg-porcelain px-4 text-sm outline-none transition placeholder:text-fig/40 focus:border-rose focus:bg-white";
const label = "mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.3em] text-fig/55";
const area =
  "w-full rounded-xl border border-fig/15 bg-porcelain px-4 py-3 text-sm leading-6 outline-none placeholder:text-fig/40 focus:border-rose focus:bg-white";

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-2xl border border-fig/10 bg-white p-6 shadow-[var(--shadow-card)]">
      <legend className="px-2 font-display text-base font-semibold text-fig">{title}</legend>
      {hint ? <p className="mb-4 -mt-2 max-w-2xl text-[11px] leading-5 text-fig/50">{hint}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(saveSettingsAction, { ok: false });
  const err = (name: string) => state.fieldErrors?.[name]?.[0];

  return (
    <form action={formAction} className="space-y-6">
      <Section title="Storefront" hint="The headline message your visitors see first. Keep it short and evocative.">
        <div>
          <label htmlFor="businessName" className={label}>Business name *</label>
          <input id="businessName" name="businessName" required defaultValue={initial.businessName} className={input} />
          {err("businessName") ? <p className="mt-1.5 text-xs text-rose-deep">{err("businessName")}</p> : null}
        </div>
        <div>
          <label htmlFor="tagline" className={label}>Tagline</label>
          <input id="tagline" name="tagline" defaultValue={initial.tagline} placeholder="Authentic Designer Perfumes" className={input} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="announcement" className={label}>Announcement bar</label>
          <input id="announcement" name="announcement" defaultValue={initial.announcement} placeholder="Authentic designer fragrances • Delivered nationwide" className={input} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="heroHeading" className={label}>Hero heading *</label>
          <input id="heroHeading" name="heroHeading" required defaultValue={initial.heroHeading} className={input} />
          {err("heroHeading") ? <p className="mt-1.5 text-xs text-rose-deep">{err("heroHeading")}</p> : null}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="heroSubheading" className={label}>Hero subheading *</label>
          <textarea id="heroSubheading" name="heroSubheading" required rows={2} maxLength={300} defaultValue={initial.heroSubheading} className={area} />
          {err("heroSubheading") ? <p className="mt-1.5 text-xs text-rose-deep">{err("heroSubheading")}</p> : null}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="aboutStory" className={label}>Our story (About page)</label>
          <textarea id="aboutStory" name="aboutStory" rows={4} maxLength={4000} defaultValue={initial.aboutStory} className={area} />
        </div>
        <div>
          <label htmlFor="currency" className={label}>Currency symbol</label>
          <input id="currency" name="currency" defaultValue={initial.currency} placeholder="GH₵" className={input} />
        </div>
      </Section>

      <Section title="Contact & Location" hint="These power the order buttons and contact blocks across the site. Use the international format with country code for the WhatsApp line, e.g. 233541234567 — spaces are fine, we normalise them.">
        <div className="sm:col-span-2">
          <label htmlFor="whatsappNumber" className={label}>WhatsApp number (with country code)</label>
          <input
            id="whatsappNumber"
            name="whatsappNumber"
            inputMode="tel"
            defaultValue={initial.whatsappNumber}
            placeholder="233541234567"
            aria-describedby="wa-hint"
            className={cn(input, err("whatsappNumber") && "border-rose-deep/60")}
          />
          <p id="wa-hint" className="mt-1.5 text-[11px] text-fig/45">
            This is what every &ldquo;Order on WhatsApp&rdquo; button dials. Leave empty to hide WhatsApp buttons until you&rsquo;re ready.
          </p>
          {err("whatsappNumber") ? <p className="mt-1.5 text-xs text-rose-deep">{err("whatsappNumber")}</p> : null}
        </div>
        <div>
          <label htmlFor="phone" className={label}>Phone (optional)</label>
          <input id="phone" name="phone" inputMode="tel" defaultValue={initial.phone} placeholder="+233 54 123 4567" className={input} />
        </div>
        <div>
          <label htmlFor="email" className={label}>Email (optional)</label>
          <input id="email" name="email" type="email" defaultValue={initial.email} placeholder="hello@heritagebynancy.com" className={input} />
          {err("email") ? <p className="mt-1.5 text-xs text-rose-deep">{err("email")}</p> : null}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="address" className={label}>Shop address (optional)</label>
          <input id="address" name="address" defaultValue={initial.address} placeholder="Accra, Ghana — shown on the contact page & maps link" className={input} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="hours" className={label}>Opening hours (optional)</label>
          <input id="hours" name="hours" defaultValue={initial.hours} placeholder="Mon–Sat 9:00–19:00 · Sun 13:00–17:00" className={input} />
        </div>
      </Section>

      <Section title="Socials" hint="Paste full profile URLs. Empty networks are hidden from the footer automatically.">
        <div>
          <label htmlFor="instagram" className={label}>Instagram URL</label>
          <input id="instagram" name="instagram" inputMode="url" defaultValue={initial.instagram} placeholder="https://instagram.com/…" className={input} />
        </div>
        <div>
          <label htmlFor="facebook" className={label}>Facebook URL</label>
          <input id="facebook" name="facebook" inputMode="url" defaultValue={initial.facebook} placeholder="https://facebook.com/…" className={input} />
        </div>
        <div>
          <label htmlFor="tiktok" className={label}>TikTok URL</label>
          <input id="tiktok" name="tiktok" inputMode="url" defaultValue={initial.tiktok} placeholder="https://tiktok.com/@…" className={input} />
        </div>
        <div>
          <label htmlFor="x" className={label}>X (Twitter) URL</label>
          <input id="x" name="x" inputMode="url" defaultValue={initial.x} placeholder="https://x.com/…" className={input} />
        </div>
      </Section>

      <Section title="Policies" hint="Shown on the FAQ and Delivery & Returns pages. Write in plain, friendly language.">
        <div className="sm:col-span-2">
          <label htmlFor="deliveryInfo" className={label}>Delivery information</label>
          <textarea id="deliveryInfo" name="deliveryInfo" rows={3} maxLength={2000} defaultValue={initial.deliveryInfo} className={area} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="returnsInfo" className={label}>Returns &amp; damages</label>
          <textarea id="returnsInfo" name="returnsInfo" rows={3} maxLength={2000} defaultValue={initial.returnsInfo} className={area} />
        </div>
      </Section>

      {state.message ? (
        <p role="status" className={cn(
          "rounded-xl border px-5 py-4 text-sm font-medium",
          state.ok ? "border-wa-dark/30 bg-wa/10 text-wa-dark" : "border-rose-deep/30 bg-rose-deep/5 text-rose-deep",
        )}>
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="h-14 w-full rounded-xl bg-fig text-xs font-bold uppercase tracking-[0.28em] text-champagne-light transition-all hover:bg-fig-lift disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-14"
      >
        {pending ? "Saving…" : "Save all settings"}
      </button>
    </form>
  );
}

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(changePasswordAction, { ok: false });

  return (
    <form action={formAction} className="max-w-md space-y-4 rounded-2xl border border-fig/10 bg-white p-6 shadow-[var(--shadow-card)]">
      <h2 className="font-display text-lg font-semibold text-fig">Change password</h2>
      <p className="text-[11px] leading-5 text-fig/55">Minimum 10 characters with letters and numbers.</p>
      <div>
        <label htmlFor="currentPassword" className={label}>Current password</label>
        <input id="currentPassword" name="currentPassword" type="password" required autoComplete="current-password" className={input} />
      </div>
      <div>
        <label htmlFor="newPassword" className={label}>New password</label>
        <input id="newPassword" name="newPassword" type="password" required minLength={10} autoComplete="new-password" className={input} />
      </div>
      <div>
        <label htmlFor="confirmPassword" className={label}>Confirm new password</label>
        <input id="confirmPassword" name="confirmPassword" type="password" required minLength={10} autoComplete="new-password" className={input} />
      </div>
      {state.message ? (
        <p role="alert" className={cn(
          "rounded-xl border px-4 py-3 text-sm",
          state.ok ? "border-wa-dark/30 bg-wa/10 text-wa-dark" : "border-rose-deep/30 bg-rose-deep/5 text-rose-deep",
        )}>
          {state.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-xl border border-fig px-8 text-[10px] font-bold uppercase tracking-[0.26em] text-fig transition-colors hover:bg-fig hover:text-champagne-light disabled:opacity-60"
      >
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
