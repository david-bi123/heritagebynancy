/**
 * Canonical site URL for absolute links (metadata, sitemap, structured data).
 * APP_SITE_URL is the current name; NEXT_PUBLIC_SITE_URL is kept as a
 * backwards-compatible fallback for older deployments.
 */
const configured =
  process.env.APP_SITE_URL?.trim() ||
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  "http://localhost:3000";

export const SITE_URL = configured.replace(/\/+$/, "");
