"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/icons";

/**
 * Single, tasteful floating WhatsApp shortcut — appears after a short scroll
 * so it never covers primary content on load.
 */
export function FloatingWhatsApp({ link, businessName }: { link: string; businessName: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 240);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      aria-label={`Chat with ${businessName} on WhatsApp`}
      className={`group fixed bottom-5 right-4 z-40 flex items-center gap-0 rounded-full bg-wa text-white shadow-[0_14px_40px_-8px_rgb(18_140_126/0.65)] transition-all duration-300 hover:bg-wa-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wa-dark sm:bottom-7 sm:right-7 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <span className="relative flex h-14 w-14 items-center justify-center">
        <span aria-hidden className="absolute inline-flex h-full w-full animate-ping rounded-full bg-wa/40 group-hover:hidden" />
        <WhatsAppIcon className="relative h-7 w-7" />
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-semibold uppercase tracking-[0.18em] opacity-0 transition-all duration-300 group-hover:max-w-40 group-hover:pr-5 group-hover:opacity-100 max-sm:hidden">
        Order on WhatsApp
      </span>
    </a>
  );
}
