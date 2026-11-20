import type { ReactNode } from "react";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="relative flex flex-wrap items-end justify-between gap-4 border-b border-fig/10 pb-6">
      <div>
        <p className="flex items-center gap-2.5 text-[9px] font-semibold uppercase tracking-[0.38em] text-rose-deep">
          <span aria-hidden className="h-px w-6 bg-rose/50" />
          {eyebrow}
        </p>
        <h1 className="mt-2.5 font-display text-[1.85rem] font-semibold leading-tight text-fig sm:text-[2.1rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-[13px] leading-6 text-fig/55">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
