import { getSettings } from "@/lib/settings";
import { isDatabaseConfigured } from "@/lib/db";
import { SettingsForm, ChangePasswordForm } from "@/components/settings-form";
import { AdminPageHeader } from "@/components/admin-page-header";
import { WhatsAppIcon } from "@/components/icons";
import { normalizePhoneForWa } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  const waPreview = settings.whatsappNumber ? normalizePhoneForWa(settings.whatsappNumber) : null;

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        eyebrow="Configuration"
        title="Settings"
        description="Everything here updates the live website immediately. Start with the WhatsApp number — it powers every order button."
      />

      {!isDatabaseConfigured() ? (
        <p role="alert" className="mt-6 flex items-start gap-2.5 rounded-xl border border-champagne/50 bg-champagne/10 px-5 py-4 text-[13px] leading-6 text-rose-deep">
          <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-deep" />
          <span>
            <strong>Database not connected.</strong> You can review the form, but changes only persist once{" "}
            <code className="rounded bg-petal px-1">MONGODB_URI</code> is set (see .env.example).
          </span>
        </p>
      ) : null}

      {waPreview ? (
        <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-wa-dark/30 bg-wa/10 px-5 py-4 text-[13px] text-wa-dark">
          <WhatsAppIcon aria-hidden className="h-4 w-4" />
          WhatsApp connected: wa.me/<strong>{waPreview}</strong> — test it:{" "}
          <a className="font-semibold underline underline-offset-2" href={`https://wa.me/${waPreview}`} target="_blank" rel="noreferrer">
            open chat ↗
          </a>
        </p>
      ) : (
        <p className="mt-5 rounded-xl border border-dashed border-fig/25 bg-white px-5 py-4 text-[13px] text-fig/60">
          No WhatsApp number saved yet — “Order on WhatsApp” buttons stay hidden until you add one.
        </p>
      )}

      <div className="mt-8 grid gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SettingsForm initial={settings} />
        </div>
        <div>
          <ChangePasswordForm />
          <div className="relative mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-fig-raise to-fig p-6 text-porcelain ring-1 ring-rose/20">
            <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose/20 blur-3xl" />
            <h2 className="relative font-display text-base font-semibold text-champagne-light">Where do these save?</h2>
            <p className="relative mt-2 text-xs leading-6 text-porcelain/70">
              Settings live in the <code className="rounded bg-white/10 px-1">settings</code> collection in MongoDB.
              Product images upload to Cloudinary when configured. Nothing here changes your source code —
              and you can return to these defaults anytime by clearing the fields.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
