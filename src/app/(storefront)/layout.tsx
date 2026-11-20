import { getSettings } from "@/lib/settings";
import { buildWaLink } from "@/lib/whatsapp";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";

export const dynamic = "force-dynamic";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const waLink = settings.whatsappNumber
    ? buildWaLink(
        settings.whatsappNumber,
        `Hello ${settings.businessName}! I would like to enquire about your fragrances.`,
      )
    : null;

  return (
    <>
      <SiteHeader
        announcement={settings.announcement}
        businessName={settings.businessName}
        tagline={settings.tagline}
        whatsappLink={waLink}
      />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter settings={settings} />
      {waLink ? <FloatingWhatsApp link={waLink} businessName={settings.businessName} /> : null}
    </>
  );
}
