"use client";

import { useActionState } from "react";
import Image from "next/image";
import {
  saveCategoryAction,
  deleteCategoryAction,
  type ActionState,
} from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  productCount: number;
}

export function CategoryManager({ categories }: { categories: AdminCategory[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(saveCategoryAction, { ok: false });
  const field =
    "h-12 w-full rounded-xl border border-fig/15 bg-porcelain px-4 text-sm outline-none placeholder:text-fig/40 focus:border-rose focus:bg-white";

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Existing categories */}
      <section className="lg:col-span-3">
        <h2 className="font-display text-lg font-semibold text-fig">Current categories</h2>
        <ul className="mt-4 space-y-3">
          {categories.length === 0 ? (
            <li className="rounded-2xl border border-dashed border-fig/25 bg-white px-6 py-10 text-center text-sm text-fig/55">
              No categories yet — create your first on the right.
            </li>
          ) : (
            categories.map((category) => (
              <li key={category.id} className="flex items-center gap-4 rounded-2xl border border-fig/10 bg-white p-4 shadow-sm">
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border border-fig/10 bg-petal">
                  {category.image ? (
                    <Image src={category.image} alt={category.name} fill sizes="80px" className="object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-[9px] uppercase text-fig/35">No image</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold leading-snug text-fig">{category.name}</p>
                  <p className="mt-0.5 truncate text-[11px] text-fig/55">{category.description || "No description"}</p>
                  <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-rose-deep">
                    {category.productCount} {category.productCount === 1 ? "product" : "products"} · /{category.slug}
                  </p>
                </div>
                <form
                  action={deleteCategoryAction}
                  onSubmit={(event) => {
                    if (!window.confirm(`Delete “${category.name}”?`)) event.preventDefault();
                  }}
                >
                  <input type="hidden" name="id" value={category.id} />
                  <button
                    type="submit"
                    aria-label={`Delete ${category.name}`}
                    title="Delete category"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-rose-deep/25 text-rose-deep transition-colors hover:bg-rose-deep hover:text-porcelain"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-4 w-4" aria-hidden>
                      <path d="M4 7h16" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M6.5 7l1.2 13a2 2 0 0 0 2 1.8h4.6a2 2 0 0 0 2-1.8L17.5 7" />
                    </svg>
                  </button>
                </form>
              </li>
            ))
          )}
        </ul>
      </section>

      {/* Add new category */}
      <section className="lg:col-span-2">
        <div className="rounded-2xl border border-fig/10 bg-white p-6 shadow-[var(--shadow-card)]">
          <h2 className="font-display text-lg font-semibold text-fig">Add category</h2>
          <p className="mt-1 text-[11px] text-fig/55">e.g. “Unisex”, “Gift Sets”, “Niche Houses”.</p>
          <form action={formAction} className="mt-5 space-y-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.3em] text-fig/55">Name *</label>
              <input id="name" name="name" required placeholder="Unisex" className={field} />
              {state.fieldErrors?.name ? <p className="mt-1.5 text-xs text-rose-deep">{state.fieldErrors.name[0]}</p> : null}
            </div>
            <div>
              <label htmlFor="description" className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.3em] text-fig/55">Description</label>
              <input id="description" name="description" placeholder="Fragrances that sit across the spectrum…" className={field} />
            </div>
            <div>
              <label htmlFor="image" className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.3em] text-fig/55">Image URL</label>
              <input id="image" name="image" type="url" placeholder="https://…" className={field} />
              {state.fieldErrors?.image ? <p className="mt-1.5 text-xs text-rose-deep">{state.fieldErrors.image[0]}</p> : null}
            </div>
            <div>
              <label htmlFor="order" className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.3em] text-fig/55">Display order</label>
              <input id="order" name="order" type="number" min={0} step={1} defaultValue={categories.length + 1} className={field} />
            </div>
            {state.message ? (
              <p role="alert" className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                state.ok ? "border-wa-dark/30 bg-wa/10 text-wa-dark" : "border-rose-deep/30 bg-rose-deep/5 text-rose-deep",
              )}>
                {state.message}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={pending}
              className="h-12 w-full rounded-xl bg-fig text-[11px] font-bold uppercase tracking-[0.26em] text-champagne-light transition-colors hover:bg-fig-lift disabled:opacity-60"
            >
              {pending ? "Saving…" : "Add category"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
