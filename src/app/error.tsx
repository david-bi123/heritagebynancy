"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-porcelain px-6 py-24 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-rose-deep">Something Went Wrong</p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-fig sm:text-5xl">
        A spritz too far.
      </h1>
      <p className="mt-4 max-w-md text-sm leading-7 text-fig/65">
        An unexpected error occurred. Please try again — if it persists, reach us on WhatsApp and we
        will sort it out.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex h-12 items-center rounded-full bg-fig px-8 text-[11px] font-bold uppercase tracking-[0.24em] text-champagne-light hover:bg-fig-lift"
      >
        Try again
      </button>
    </div>
  );
}
