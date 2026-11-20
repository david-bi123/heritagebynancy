"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { logoutAction } from "@/app/admin/actions";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const Icon = {
  overview: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className={p.className} aria-hidden>
      <rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  tag: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={p.className} aria-hidden>
      <path d="M20.59 13.41 11 3H4v7l9.59 10.41a2 2 0 0 0 2.82 0l4.18-4.18a2 2 0 0 0 0-2.82Z" /><circle cx="8.5" cy="7.5" r="1.5" />
    </svg>
  ),
  folder: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" className={p.className} aria-hidden>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
    </svg>
  ),
  mail: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className={p.className} aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" />
    </svg>
  ),
  people: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={p.className} aria-hidden>
      <circle cx="9" cy="8" r="3.2" /><path d="M3.5 20c.8-3.4 3-5.2 5.5-5.2s4.7 1.8 5.5 5.2" /><circle cx="17" cy="9.5" r="2.6" /><path d="M16 14.9c2.8.3 4.3 2 4.9 4.6" />
    </svg>
  ),
  gear: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={p.className} aria-hidden>
      <circle cx="12" cy="12" r="3.2" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  ),
};

interface SidebarItem {
  href: string;
  label: string;
  Icon: (props: { className?: string }) => ReactNode;
  badge?: number;
}

export function AdminShell({
  userName,
  newEnquiries,
  role,
  children,
}: {
  userName: string;
  newEnquiries: number;
  role: "admin" | "superadmin";
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items: SidebarItem[] = [
    { href: "/admin", label: "Overview", Icon: Icon.overview },
    { href: "/admin/products", label: "Products", Icon: Icon.tag },
    { href: "/admin/categories", label: "Categories", Icon: Icon.folder },
    { href: "/admin/enquiries", label: "Enquiries", Icon: Icon.mail, badge: newEnquiries },
    { href: "/admin/settings", label: "Settings", Icon: Icon.gear },
    ...(role === "superadmin" ? [{ href: "/admin/users", label: "Team", Icon: Icon.people }] : []),
  ];

  const current = items.find((item) =>
    item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href),
  );
  const initials =
    userName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "H";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const sidebar = (
    <aside className="flex h-full w-[17.5rem] flex-col bg-fig text-porcelain">
      <div className="relative overflow-hidden border-b border-white/10 px-5 py-6">
        <div aria-hidden className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-rose/20 blur-3xl" />
        <Link href="/" className="relative flex items-center gap-3" aria-label="Back to the website">
          <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[radial-gradient(circle_at_32%_30%,#d99aa4,#96555f_72%)] font-display text-lg italic text-white ring-1 ring-rose-deep/40 shadow-[0_8px_24px_-8px_rgb(0_0_0/0.7)]">
            H
            <span aria-hidden className="pointer-events-none absolute inset-[3px] rounded-full border border-white/25" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[15px] font-semibold text-porcelain">
              Heritage <em className="italic text-rose-light">By Nancy</em>
            </span>
            <span className="mt-0.5 block text-[7.5px] font-semibold uppercase tracking-[0.42em] text-champagne-light/80">
              Atelier Console
            </span>
          </span>
        </Link>
      </div>

      <nav aria-label="Admin" className="console-scroll flex-1 overflow-y-auto px-3 py-5">
        <p className="px-3 pb-2 text-[7.5px] font-semibold uppercase tracking-[0.38em] text-porcelain/30">
          Commerce
        </p>
        <div className="space-y-1">
          {items.slice(0, 4).map(({ href, label, Icon: ItemIcon, badge }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all",
                  active
                    ? "bg-gradient-to-r from-rose/90 to-rose-deep text-white shadow-[0_14px_30px_-16px_rgb(150_85_95/0.9)]"
                    : "text-porcelain/60 hover:bg-white/[0.06] hover:text-porcelain",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                    active ? "bg-white/15 text-white" : "bg-white/[0.04] text-porcelain/50 group-hover:text-rose-light",
                  )}
                >
                  <ItemIcon className="h-[17px] w-[17px]" />
                </span>
                <span className="flex-1">{label}</span>
                {badge && badge > 0 ? (
                  <span className={cn(
                    "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[9px] font-bold",
                    active ? "bg-fig text-rose-light" : "bg-rose text-white",
                  )}>
                    {badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>

        <p className="px-3 pb-2 pt-6 text-[7.5px] font-semibold uppercase tracking-[0.38em] text-porcelain/30">
          Studio
        </p>
        <div className="space-y-1">
          {items.slice(4).map(({ href, label, Icon: ItemIcon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all",
                  active
                    ? "bg-gradient-to-r from-rose/90 to-rose-deep text-white shadow-[0_14px_30px_-16px_rgb(150_85_95/0.9)]"
                    : "text-porcelain/60 hover:bg-white/[0.06] hover:text-porcelain",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                    active ? "bg-white/15 text-white" : "bg-white/[0.04] text-porcelain/50 group-hover:text-rose-light",
                  )}
                >
                  <ItemIcon className="h-[17px] w-[17px]" />
                </span>
                <span className="flex-1">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose to-rose-deep text-[11px] font-bold text-white ring-1 ring-white/20">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold leading-tight text-porcelain">{userName}</p>
              <p className="mt-0.5 text-[7.5px] font-semibold uppercase tracking-[0.24em] text-rose-light/80">
                {role === "superadmin" ? "Super Admin" : "Store Admin"}
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="mt-3 flex items-center justify-between rounded-lg bg-white/[0.05] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-porcelain/60 transition-colors hover:bg-white/[0.1] hover:text-porcelain"
          >
            View storefront
            <span aria-hidden className="text-champagne">↗</span>
          </Link>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-petal via-porcelain to-petal/60">
      {/* Desktop sidebar */}
      <div className="sticky top-0 hidden h-screen shrink-0 lg:block">{sidebar}</div>

      {/* Mobile overlay sidebar */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-fig/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 shadow-2xl">{sidebar}</div>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute left-[18.6rem] top-4 flex h-10 w-10 items-center justify-center rounded-full border border-rose/40 bg-fig-lift text-rose-light"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-fig/10 bg-porcelain/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-fig/15 bg-white/60 text-fig lg:hidden"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
            <nav aria-label="Breadcrumb" className="min-w-0">
              <ol className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-fig/40">
                <li className="hidden sm:block">Atelier</li>
                <li aria-hidden className="hidden text-blush sm:block">/</li>
                <li className="truncate text-fig/70">{current?.label ?? "Console"}</li>
              </ol>
              <p className="mt-0.5 hidden text-[10px] text-fig/40 sm:block">Management console</p>
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-full border border-fig/15 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-fig/60 transition-colors hover:border-rose hover:text-rose-deep sm:inline-flex"
            >
              Storefront <span aria-hidden className="text-champagne-deep">↗</span>
            </Link>
            <span className="hidden h-8 w-px bg-fig/10 sm:block" />
            <span className="hidden items-center gap-2 sm:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-rose to-rose-deep text-[10px] font-bold text-white ring-2 ring-white">
                {initials}
              </span>
              <span className="hidden text-[11px] font-semibold leading-tight text-fig lg:block">
                {userName.split(" ")[0]}
              </span>
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="h-9 rounded-full border border-fig/15 px-4 text-[9px] font-bold uppercase tracking-[0.22em] text-fig/70 transition-colors hover:border-rose-deep hover:bg-rose-deep hover:text-porcelain"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
