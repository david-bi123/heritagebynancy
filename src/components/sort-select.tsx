"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <label className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-fig/60">
      <span className="hidden sm:inline">Sort</span>
      <select
        value={value}
        onChange={(event) => {
          const params = new URLSearchParams(searchParams.toString());
          const next = event.target.value;
          if (next === "featured") params.delete("sort");
          else params.set("sort", next);
          const qs = params.toString();
          router.push(qs ? `/shop?${qs}` : "/shop");
        }}
        className="h-11 rounded-lg border border-blush bg-white px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-fig focus:border-rose focus:outline-none"
        aria-label="Sort products"
      >
        <option value="featured">Featured</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="price-desc">Price: High → Low</option>
        <option value="name">Name A → Z</option>
      </select>
    </label>
  );
}
