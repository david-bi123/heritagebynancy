import type { Metadata, Viewport } from "next";
import { Jost, Playfair_Display } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/settings";
import { SITE_URL } from "@/lib/site-url";

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = `${settings.businessName} | ${settings.tagline}`;
  const description =
    "Shop authentic designer fragrances for men and women at Heritage By Nancy. Curated Chanel, Giorgio Armani, Versace and more — sealed bottles, nationwide delivery, ordered easily on WhatsApp.";
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${settings.businessName}`,
    },
    description,
    applicationName: settings.businessName,
    keywords: [
      "designer perfumes Ghana",
      "buy perfumes online Ghana",
      "Chanel perfume Accra",
      "authentic fragrances Ghana",
      "Heritage By Nancy",
    ],
    openGraph: {
      type: "website",
      siteName: settings.businessName,
      title,
      description,
      url: SITE_URL,
      images: [
        {
          url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&h=630&q=80&crop=focalpoint&fp-y=0.3",
          width: 1200,
          height: 630,
          alt: `${settings.businessName} — curated designer fragrances`,
        },
      ],
    },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#221722",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${jost.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-porcelain font-sans text-fig">
        {children}
      </body>
    </html>
  );
}
