"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { saveProductAction, type ActionState } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export interface ProductFormValues {
  id?: string;
  name: string;
  brand: string;
  category: string;
  concentration: string;
  description: string;
  notesTop: string;
  notesHeart: string;
  notesBase: string;
  stock: number;
  featured: boolean;
  active: boolean;
  sizes: { label: string; price: number }[];
  images: string[];
}

const emptyValues: ProductFormValues = {
  name: "",
  brand: "",
  category: "",
  concentration: "Eau de Parfum",
  description: "",
  notesTop: "",
  notesHeart: "",
  notesBase: "",
  stock: 1,
  featured: false,
  active: true,
  sizes: [
    { label: "50ml", price: 0 },
    { label: "100ml", price: 0 },
  ],
  images: [],
};

const CONCENTRATIONS = ["Eau de Parfum", "Eau de Toilette", "Eau de Cologne", "Parfum", "Extrait de Parfum"];

export function ProductForm({
  initial,
  categories,
}: {
  initial?: ProductFormValues | null;
  categories: { slug: string; name: string }[];
}) {
  const values = initial ?? emptyValues;
  const [state, formAction, pending] = useActionState<ActionState, FormData>(saveProductAction, { ok: false });

  const [sizes, setSizes] = useState(values.sizes);
  const [images, setImages] = useState<string[]>(values.images);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const fieldError = (name: string) => state.fieldErrors?.[name]?.[0];
  const fieldClass = (name: string) =>
    cn(
      "h-12 w-full rounded-xl border bg-porcelain px-4 text-sm outline-none transition placeholder:text-fig/40 focus:bg-white",
      fieldError(name) ? "border-rose-deep/60" : "border-fig/15 focus:border-rose",
    );

  const addImageUrl = () => {
    const url = imageUrl.trim();
    if (!url) return;
    try {
      new URL(url);
      setImages((prev) => [...prev, url]);
      setImageUrl("");
      setUploadError("");
    } catch {
      setUploadError("That does not look like a valid URL.");
    }
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    setUploadError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await response.json()) as { ok: boolean; url?: string; error?: string };
      if (response.ok && data.ok && data.url) {
        setImages((prev) => [...prev, data.url!]);
      } else {
        setUploadError(data.error ?? "Upload failed.");
      }
    } catch {
      setUploadError("Network error during upload — please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form action={formAction} className="space-y-6">
      {values.id ? <input type="hidden" name="id" value={values.id} /> : null}
      <input type="hidden" name="sizesJson" value={JSON.stringify(sizes.filter((s) => s.label.trim() !== ""))} />
      <input type="hidden" name="imagesJson" value={JSON.stringify(images)} />

      {state.message ? (
        <p role="alert" className={cn(
          "rounded-xl border px-4 py-3 text-sm",
          state.ok ? "border-wa-dark/30 bg-wa/10 text-wa-dark" : "border-rose-deep/30 bg-rose-deep/5 text-rose-deep",
        )}>
          {state.message}
        </p>
      ) : null}

      {/* Identity */}
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.3em] text-fig/55">Fragrance name *</label>
          <input id="name" name="name" required defaultValue={values.name} placeholder="Bleu de Chanel Eau de Parfum" className={fieldClass("name")} />
          {fieldError("name") ? <p className="mt-1.5 text-xs text-rose-deep">{fieldError("name")}</p> : null}
        </div>
        <div>
          <label htmlFor="brand" className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.3em] text-fig/55">Brand / House</label>
          <input id="brand" name="brand" defaultValue={values.brand} placeholder="Chanel" className={fieldClass("brand")} />
        </div>
        <div>
          <label htmlFor="concentration" className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.3em] text-fig/55">Concentration</label>
          <select id="concentration" name="concentration" defaultValue={values.concentration} className={fieldClass("concentration")}>
            {CONCENTRATIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="category" className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.3em] text-fig/55">Category *</label>
          <select id="category" name="category" required defaultValue={values.category} className={fieldClass("category")}>
            <option value="">Choose…</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          {fieldError("category") ? <p className="mt-1.5 text-xs text-rose-deep">{fieldError("category")}</p> : null}
        </div>
        <div>
          <label htmlFor="stock" className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.3em] text-fig/55">Stock on hand</label>
          <input id="stock" name="stock" type="number" min={0} step={1} defaultValue={values.stock} className={fieldClass("stock")} />
          <p className="mt-1.5 text-[11px] text-fig/45">0 = sold out · ≤3 = &ldquo;Only a few left&rdquo; badge</p>
          {fieldError("stock") ? <p className="mt-1.5 text-xs text-rose-deep">{fieldError("stock")}</p> : null}
        </div>
      </fieldset>

      {/* Copy */}
      <div>
        <label htmlFor="description" className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.3em] text-fig/55">Description</label>
        <textarea id="description" name="description" rows={3} maxLength={2000} defaultValue={values.description} placeholder="Two sentences that sell the bottle…" className="w-full rounded-xl border border-fig/15 bg-porcelain px-4 py-3 text-sm leading-6 outline-none placeholder:text-fig/40 focus:border-rose focus:bg-white" />
      </div>
      <fieldset className="grid gap-4 sm:grid-cols-3">
        {([["notesTop", "Top notes"], ["notesHeart", "Heart notes"], ["notesBase", "Base notes"]] as const).map(([name, label]) => (
          <div key={name}>
            <label htmlFor={name} className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.3em] text-fig/55">{label}</label>
            <input id={name} name={name} defaultValue={values[name]} placeholder="Bergamot, Neroli…" className={fieldClass(name)} />
          </div>
        ))}
      </fieldset>

      {/* Sizes */}
      <fieldset>
        <legend className="text-[9px] font-semibold uppercase tracking-[0.3em] text-fig/55">Sizes &amp; prices *</legend>
        <div className="mt-3 space-y-2">
          {sizes.map((size, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                aria-label={`Size ${index + 1} label`}
                value={size.label}
                onChange={(e) => setSizes((prev) => prev.map((s, i) => (i === index ? { ...s, label: e.target.value } : s)))}
                placeholder="50ml"
                className="h-12 w-32 rounded-xl border border-fig/15 bg-porcelain px-4 text-sm outline-none focus:border-rose"
              />
              <div className="flex h-12 flex-1 items-center rounded-xl border border-fig/15 bg-porcelain focus-within:border-rose">
                <span className="pl-4 text-sm font-semibold text-fig/45">GH₵</span>
                <input
                  aria-label={`Size ${index + 1} price`}
                  type="number" min={0} step="0.01"
                  value={size.price}
                  onChange={(e) => setSizes((prev) => prev.map((s, i) => (i === index ? { ...s, price: Number(e.target.value) } : s)))}
                  className="h-full w-full bg-transparent px-2 text-sm outline-none tabular-nums"
                />
              </div>
              <button
                type="button"
                aria-label="Remove size"
                onClick={() => setSizes((prev) => prev.filter((_, i) => i !== index))}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-fig/15 text-fig/50 hover:border-rose-deep hover:text-rose-deep"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSizes((prev) => [...prev, { label: "", price: 0 }])}
          className="mt-2 rounded-xl border border-dashed border-rose/50 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-rose-deep hover:bg-rose-soft/60"
        >
          + Add size
        </button>
        {fieldError("sizes") ? <p className="mt-1.5 text-xs text-rose-deep">{fieldError("sizes")}</p> : null}
      </fieldset>

      {/* Images */}
      <fieldset>
        <legend className="text-[9px] font-semibold uppercase tracking-[0.3em] text-fig/55">Images</legend>
        <p className="mt-1.5 text-[11px] leading-5 text-fig/50">
          Upload a file (JPEG/PNG/WebP/AVIF, max 5 MB — requires Cloudinary) or paste an image URL. The first image is the main photo.
        </p>

        {images.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-3">
            {images.map((src, index) => (
              <li key={`${src}-${index}`} className="relative h-28 w-24 overflow-hidden rounded-xl border border-fig/15 bg-petal">
                <Image src={src} alt={`Product image ${index + 1}`} fill sizes="96px" className="object-cover" />
                {index === 0 ? (
                  <span className="absolute left-1 top-1 rounded bg-fig/80 px-2 py-0.5 text-[8px] font-bold uppercase text-champagne-light">Main</span>
                ) : null}
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-fig/80 text-xs text-porcelain hover:bg-rose-deep"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            aria-label="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://…/bottle.jpg"
            className="h-12 w-full rounded-xl border border-fig/15 bg-porcelain px-4 text-sm outline-none focus:border-rose"
          />
          <button type="button" onClick={addImageUrl} className="h-12 shrink-0 rounded-xl border border-fig px-5 text-[10px] font-bold uppercase tracking-[0.22em] text-fig hover:bg-fig hover:text-champagne-light">
            Add URL
          </button>
        </div>

        <label className={cn(
          "mt-2 inline-flex h-12 cursor-pointer items-center gap-3 rounded-xl border border-rose/50 px-5 text-[10px] font-bold uppercase tracking-[0.22em] text-rose-deep transition-colors hover:bg-rose-soft/60",
          uploading && "cursor-wait opacity-60",
        )}>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void uploadImage(file);
              e.target.value = "";
            }}
          />
          {uploading ? "Uploading…" : "Upload image"}
        </label>
        {uploadError ? <p role="alert" className="mt-2 text-xs leading-5 text-rose-deep">{uploadError}</p> : null}
        {fieldError("images") ? <p className="mt-1.5 text-xs text-rose-deep">{fieldError("images")}</p> : null}
      </fieldset>

      {/* Flags + submit */}
      <fieldset className="flex flex-wrap items-center gap-6 rounded-2xl border border-fig/10 bg-porcelain p-5">
        {[
          ["featured", "Feature on homepage", values.featured],
          ["active", "Visible in the shop", values.active],
        ].map(([name, label, checked]) => (
          <label key={name as string} className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name={name as string}
              defaultChecked={checked as boolean}
              className="h-5 w-5 accent-rose-deep"
            />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fig/75">{label as string}</span>
          </label>
        ))}
        <button
          type="submit"
          disabled={pending}
          className="ml-auto h-13 rounded-xl bg-fig px-8 py-4 text-xs font-bold uppercase tracking-[0.26em] text-champagne-light transition-all hover:bg-fig-lift disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : values.id ? "Save changes" : "Add fragrance"}
        </button>
      </fieldset>
    </form>
  );
}
