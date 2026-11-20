import { isDatabaseConfigured, connectToDatabase } from "@/lib/db";
import { Enquiry } from "@/lib/models";
import { setEnquiryStatusAction } from "@/app/admin/actions";
import { DeleteButton } from "@/components/delete-button";
import { AdminPageHeader } from "@/components/admin-page-header";
import { MailIcon, WhatsAppIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  if (!isDatabaseConfigured()) {
    return (
      <p className="mx-auto max-w-xl rounded-2xl border border-champagne/40 bg-white p-8 text-sm text-fig/75">
        Enquiries are stored in MongoDB. Set <code className="rounded bg-petal px-1">MONGODB_URI</code> to start receiving them.
      </p>
    );
  }

  let enquiries: Array<{
    _id: unknown; name: string; contact: string; message: string; source: string; status: string; createdAt: Date;
  }> = [];
  try {
    await connectToDatabase();
    enquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(100).lean() as unknown as typeof enquiries;
  } catch (error) {
    console.error("[admin/enquiries] failed:", error);
  }

  const fresh = enquiries.filter((e) => e.status === "new");
  const handled = enquiries.filter((e) => e.status === "handled");

  const renderCard = (enquiry: (typeof enquiries)[number]) => {
    const id = String(enquiry._id);
    const isNew = enquiry.status === "new";
    const waContact = enquiry.contact.replace(/[^\d]/g, "");
    const looksNumeric = waContact.replace(/\D/g, "").length >= 9;
    const initials =
      enquiry.name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("") || "?";
    return (
      <li
        key={id}
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-2xl border bg-white p-5 shadow-[0_12px_30px_-24px_rgb(34_23_34/0.5)] transition-all",
          isNew ? "border-champagne/60" : "border-fig/10 opacity-80 hover:opacity-100",
        )}
      >
        <div aria-hidden className={cn("absolute inset-x-0 top-0 h-0.5", isNew ? "bg-gradient-to-r from-champagne to-rose" : "bg-fig/10")} />
        <div className="flex items-start gap-3.5">
          <span className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
            isNew ? "bg-fig text-rose-light" : "bg-petal text-fig/60",
          )}>
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <p className="truncate font-display text-[15px] font-semibold text-fig">{enquiry.name}</p>
              <time className="shrink-0 text-[9px] uppercase tracking-[0.16em] text-fig/40">
                {new Date(enquiry.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </time>
            </div>
            {looksNumeric ? (
              <a
                href={`https://wa.me/${waContact}`}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-wa/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-wa-dark transition-colors hover:bg-wa hover:text-white"
              >
                <WhatsAppIcon className="h-3 w-3" />
                {enquiry.contact}
              </a>
            ) : (
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-rose-deep">
                {enquiry.contact}
              </p>
            )}
          </div>
        </div>

        <p className="mt-3.5 rounded-xl bg-porcelain/70 px-4 py-3 text-[12.5px] leading-6 text-fig/75">
          {enquiry.message}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-petal pt-3.5">
          <span className={cn(
            "inline-flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.2em]",
            isNew ? "text-champagne-deep" : "text-fig/40",
          )}>
            <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", isNew ? "bg-champagne-deep" : "bg-fig/30")} />
            {isNew ? "New" : "Handled"}
          </span>
          <div className="flex items-center gap-2">
            <form action={setEnquiryStatusAction}>
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="status" value={isNew ? "handled" : "new"} />
              <button
                type="submit"
                className={cn(
                  "h-9 rounded-lg border px-4 text-[9px] font-bold uppercase tracking-[0.18em] transition-colors",
                  isNew
                    ? "border-wa-dark/35 text-wa-dark hover:bg-wa hover:text-white"
                    : "border-fig/15 text-fig/60 hover:border-fig hover:text-fig",
                )}
              >
                {isNew ? "Mark handled" : "Mark as new"}
              </button>
            </form>
            <DeleteButton id={id} mode="enquiry" label="Delete enquiry" />
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        eyebrow="Inbox"
        title="Customer enquiries"
        description="Messages from the contact form. WhatsApp orders arrive in your WhatsApp directly — these are the form submissions."
        action={
          <div className="flex items-center gap-2 rounded-full border border-fig/10 bg-white px-4 py-2.5 shadow-sm">
            <MailIcon className="h-4 w-4 text-rose-deep" />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-fig/60">
              {enquiries.length} total
            </span>
          </div>
        }
      />

      <section className="mt-7">
        <h2 className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-fig/55">
          New
          <span className="rounded-full bg-champagne px-2.5 py-0.5 text-[9px] font-bold text-fig">{fresh.length}</span>
          <span aria-hidden className="h-px flex-1 bg-blush/60" />
        </h2>
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {fresh.length === 0 ? (
            <li className="rounded-2xl border border-dashed border-fig/20 bg-white px-6 py-12 text-center md:col-span-2">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-wa/10 text-wa-dark">
                <MailIcon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-sm text-fig/55">Nothing new — you&rsquo;re all caught up.</p>
            </li>
          ) : (
            fresh.map(renderCard)
          )}
        </ul>
      </section>

      {handled.length > 0 ? (
        <section className="mt-10">
          <h2 className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-fig/45">
            Handled
            <span className="rounded-full bg-fig/10 px-2.5 py-0.5 text-[9px] font-bold text-fig/60">{handled.length}</span>
            <span aria-hidden className="h-px flex-1 bg-blush/60" />
          </h2>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">{handled.map(renderCard)}</ul>
        </section>
      ) : null}
    </div>
  );
}
