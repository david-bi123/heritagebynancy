"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "Our Story" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {LINKS.map((link) => {
        const active =
          link.href === "/"
            ? pathname === "/"
            : pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative text-[12px] font-semibold uppercase tracking-[0.2em] transition-colors duration-200",
              active ? "text-rose-deep" : "text-fig/75 hover:text-fig",
            )}
          >
            {link.label}
            <span
              aria-hidden
              className={cn(
                "absolute -bottom-1.5 left-0 h-px bg-rose transition-all duration-300",
                active ? "w-full" : "w-0",
              )}
            />
          </Link>
        );
      })}
    </>
  );
}

export function MobileNavLinks({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {LINKS.map((link) => {
        const active =
          link.href === "/"
            ? pathname === "/"
            : pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-lg px-4 py-3.5 font-display text-lg transition-colors",
              active ? "bg-rose text-white" : "text-porcelain hover:bg-white/5",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}
