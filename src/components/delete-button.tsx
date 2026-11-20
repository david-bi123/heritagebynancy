"use client";

import { deleteProductAction } from "@/app/admin/actions";
import { deleteEnquiryAction } from "@/app/admin/actions";

type Mode = "product" | "enquiry";

export function DeleteButton({ id, mode, label }: { id: string; mode: Mode; label: string }) {
  const action = mode === "product" ? deleteProductAction : deleteEnquiryAction;
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Delete this ${mode}? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label={label}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-deep/25 text-rose-deep transition-colors hover:bg-rose-deep hover:text-porcelain"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-4 w-4" aria-hidden>
          <path d="M4 7h16" />
          <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
          <path d="M6.5 7l1.2 13a2 2 0 0 0 2 1.8h4.6a2 2 0 0 0 2-1.8L17.5 7" />
        </svg>
      </button>
    </form>
  );
}
