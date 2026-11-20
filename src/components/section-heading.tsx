export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  const alignCls = align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <div className={`flex flex-col gap-3 ${alignCls}`}>
      <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.42em] text-rose-deep">
        {align === "center" ? <span aria-hidden className="hidden h-px w-7 bg-rose/60 sm:block" /> : null}
        {eyebrow}
        {align === "center" ? <span aria-hidden className="hidden h-px w-7 bg-rose/60 sm:block" /> : null}
      </p>
      <h2 className="max-w-3xl font-display text-3xl font-semibold leading-[1.15] text-fig sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      <div className="rose-rule w-28 opacity-80" aria-hidden />
      {subtitle ? (
        <p className="max-w-2xl text-sm leading-7 text-fig/70 sm:text-base">{subtitle}</p>
      ) : null}
    </div>
  );
}
