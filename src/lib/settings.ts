import { connectToDatabase, isDatabaseConfigured } from "@/lib/db";
import { Setting } from "@/lib/models";

export interface SiteSettings {
  businessName: string;
  tagline: string;
  announcement: string;
  heroHeading: string;
  heroSubheading: string;
  aboutStory: string;
  whatsappNumber: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  x: string;
  currency: string;
  deliveryInfo: string;
  returnsInfo: string;
}

/**
 * Safe defaults. Anything factual about the business (number, address,
 * hours, links) defaults to EMPTY and is hidden in the UI until the owner
 * fills it in via Admin → Settings. No invented contact details.
 */
export const DEFAULT_SETTINGS: SiteSettings = {
  businessName: "Heritage By Nancy",
  tagline: "Authentic Designer Perfumes",
  announcement: "Authentic designer fragrances • Delivered nationwide",
  heroHeading: "Wear a signature, not just a scent.",
  heroSubheading:
    "Authentic designer fragrances for men and women — curated in Ghana, ordered in seconds on WhatsApp.",
  aboutStory:
    "Heritage By Nancy was created for people who believe a fragrance is more than a grooming choice — it is a signature, a memory, a quiet confidence. We curate authentic designer perfumes for men and women, and help every customer find the scent that feels like them. Every order is handled personally over WhatsApp, from selection to delivery.",
  whatsappNumber: "",
  phone: "",
  email: "",
  address: "",
  hours: "",
  instagram: "",
  facebook: "",
  tiktok: "",
  x: "",
  currency: "GH₵",
  deliveryInfo:
    "Delivery is available nationwide. Delivery fees and timelines depend on your location — send us a WhatsApp message or the contact form below and we will confirm the exact cost before you pay.",
  returnsInfo:
    "Because fragrances are sealed personal-care products, we cannot accept returns once a seal is broken. If your bottle arrives damaged or incorrect, contact us within 48 hours of delivery and we will make it right.",
};

export async function getSettings(): Promise<SiteSettings> {
  if (!isDatabaseConfigured()) return DEFAULT_SETTINGS;
  try {
    await connectToDatabase();
    const doc = await Setting.findOne({ key: "site" }).lean();
    if (!doc) return DEFAULT_SETTINGS;
    const merged = { ...DEFAULT_SETTINGS } as Record<string, string>;
    for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof SiteSettings)[]) {
      const value = (doc as unknown as Record<string, unknown>)[key];
      if (typeof value === "string" && value.trim().length > 0) {
        merged[key] = value;
      }
    }
    return merged as unknown as SiteSettings;
  } catch (error) {
    console.error("[settings] Falling back to defaults:", error);
    return DEFAULT_SETTINGS;
  }
}
