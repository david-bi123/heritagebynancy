import type { SiteSettings } from "@/lib/settings";
import { formatPrice } from "@/lib/utils";

/**
 * Normalise a phone number to the international digits-only format that
 * wa.me expects (no "+", spaces or dashes).
 *
 * Handles the common Ghanaian formats as a convenience:
 *   054 123 4567  -> 233541234567
 *   541234567     -> 233541234567
 *   +233 54 123 4567 -> 233541234567
 *   00233...      -> 233...
 * Returns null when the result is not a plausible international number.
 */
export function normalizePhoneForWa(raw: string): string | null {
  if (!raw) return null;
  let digits = raw.trim().replace(/[\s\-().]/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  digits = digits.replace(/^\+/, "").replace(/\D/g, "");
  if (/^0\d{9}$/.test(digits)) digits = `233${digits.slice(1)}`; // 054… -> 23354…
  else if (/^[25]\d{8}$/.test(digits)) digits = `233${digits}`; // 54… / 24… -> 23354…
  if (!/^\d{10,15}$/.test(digits)) return null;
  return digits;
}

export function isWhatsAppConfigured(settings: Pick<SiteSettings, "whatsappNumber">): boolean {
  return normalizePhoneForWa(settings.whatsappNumber) !== null;
}

export function buildWaLink(
  rawNumber: string,
  message: string,
): string | null {
  const normalized = normalizePhoneForWa(rawNumber);
  if (!normalized) return null;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export interface OrderMessageInput {
  settings: Pick<SiteSettings, "businessName" | "currency">;
  productName: string;
  brand: string;
  concentration: string;
  sizeLabel: string;
  unitPrice: number;
  quantity: number;
  productUrl: string;
}

export function buildProductOrderMessage(input: OrderMessageInput): string {
  const { settings, productName, brand, concentration, sizeLabel, unitPrice, quantity, productUrl } =
    input;
  const total = unitPrice * quantity;
  return [
    `Hello ${settings.businessName}! I would like to order the following fragrance:`,
    "",
    `Product: ${brand ? `${brand} — ` : ""}${productName}`,
    `Concentration: ${concentration}`,
    `Size: ${sizeLabel}`,
    `Quantity: ${quantity}`,
    `Price: ${formatPrice(unitPrice, settings.currency)} each`,
    `Total: ${formatPrice(total, settings.currency)}`,
    "",
    `Product link: ${productUrl}`,
    "",
    "Please let me know how to complete payment and delivery. Thank you!",
  ].join("\n");
}

export function buildNotifyMessage(
  settings: Pick<SiteSettings, "businessName">,
  productName: string,
  productUrl: string,
): string {
  return [
    `Hello ${settings.businessName}!`,
    "",
    `The "${productName}" is currently out of stock. Please notify me when it is available again.`,
    "",
    `Product link: ${productUrl}`,
  ].join("\n");
}

export function buildContactEnquiryMessage(
  settings: Pick<SiteSettings, "businessName">,
  name: string,
  message: string,
): string {
  return [
    `Hello ${settings.businessName}! My name is ${name}.`,
    "",
    message,
  ].join("\n");
}

export function buildAdviceMessage(
  settings: Pick<SiteSettings, "businessName">,
): string {
  return [
    `Hello ${settings.businessName}!`,
    "",
    "I would like advice choosing a fragrance. Here is what I enjoy: ",
    "",
    "(size, occasion, budget, scent family)",
  ].join("\n");
}
