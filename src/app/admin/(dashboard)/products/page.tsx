import Link from "next/link";
import Image from "next/image";
import { isDatabaseConfigured, connectToDatabase } from "@/lib/db";
import { Category, Product } from "@/lib/models";
import { getSettings } from "@/lib/settings";
import { formatPrice } from "@/lib/utils";
import { toggleProductFlagAction } from "@/app/admin/actions";
import { DeleteButton } from "@/components/delete-button";
import { AdminPageHeader } from "@/components/admin-page-header";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; saved?: string; deleted?: string; error?: string }>;
}) {
  const params = await searchParams;
  const settings = await getSettings();
  const query = (params.q ?? "").trim().slice(0, 80);

  if (!isDatabaseConfigured()) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-champagne/40 bg-white p-8">
        <h1 className="font-display text-2xl font-semibold text-fig">Database required</h1>
        <p className="mt-3 text-sm leading-7 text-fig/70">
          Products are managed in MongoDB. Set <code className="rounded bg-petal px-1">MONGODB_URI</code> and run{" "}
          <code className="rounded bg-petal px-1">npm run seed</code>.
        </p>
      </div>
    );
  }

  let products: Array<{
    _id: unknown; name: string; slug: string; brand: string; category: string;
    concentration: string; stock: number; featured: boolean; active: boolean;
    images: string[]; sizes: { label: string; price: number }[];
  }> = [];
  let categoryNames = new Map<string, string>();
  let dbError = false;

  try {
    await connectToDatabase();
    const filter = query
      ? { $or: [
          { name: { $regex: query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
          { brand: { $regex: query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
        ] }
      : {};
    const [docs, cats] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).lean(),
      Category.find().lean(),
    ]);
    products = docs as unknown as typeof products;
    categoryNames = new Map(cats.map((c) => [c.slug, c.name]));
  } catch (error) {
    console.error("[admin/products] failed:", error);
    dbError = true;
  }

  const banner = params.saved ? "Changes saved — the live site is updated."
    : params.deleted ? "Fragrance deleted."
    : params.error ? `Something went wrong (${params.error}). Please try again.`
    : null;

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        eyebrow="Inventory"
        title="Fragrances"
        description={`${products.length} ${products.length === 1 ? "product" : "products"} ${query ? `matching “${query}”` : "in the live catalogue"}. Toggle visibility, feature a bottle or open it to edit.`}
        action={
          <Link
            href="/admin/products/new"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-br from-rose to-rose-deep px-6 text-[10px] font-bold uppercase tracking-[0.22em] text-white shadow-[0_16px_36px_-16px_rgb(150_85_95/0.8)] transition-all hover:brightness-110"
          >
            + Add fragrance
          </Link>
        }
      />

      {banner ? (
        <p role="status" className={cn(
          "mt-5 flex items-center gap-2.5 rounded-xl border px-5 py-3.5 text-[13px]",
          params.error ? "border-rose-deep/30 bg-rose-deep/5 text-rose-deep" : "border-wa-dark/30 bg-wa/10 text-wa-dark",
        )}>
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
          {banner}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form method="get" action="/admin/products" role="search" className="flex w-full max-w-md items-center overflow-hidden rounded-xl border border-fig/15 bg-white transition-all focus-within:border-rose focus-within:ring-4 focus-within:ring-rose/10">
          <label htmlFor="q" className="sr-only">Search products</label>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="ml-3.5 h-4 w-4 shrink-0 text-fig/35" aria-hidden>
            <circle cx="11" cy="11" r="6.5" />
            <path d="m20 20-4.2-4.2" />
          </svg>
          <input
            id="q" name="q" defaultValue={query} placeholder="Search by name or brand…"
            className="h-11 w-full bg-transparent px-3 text-[13px] outline-none placeholder:text-fig/35"
          />
          <button type="submit" className="mr-1.5 h-8 shrink-0 rounded-lg bg-fig px-4 text-[9px] font-bold uppercase tracking-[0.2em] text-champagne-light transition-colors hover:bg-rose-deep hover:text-white">
            Search
          </button>
        </form>
        <div className="flex flex-wrap items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em]">
          <span className="rounded-full border border-wa-dark/25 bg-wa/10 px-3 py-1.5 text-wa-dark">
            {products.filter((p) => p.stock > 3).length} healthy
          </span>
          <span className="rounded-full border border-champagne/50 bg-champagne/15 px-3 py-1.5 text-champagne-deep">
            {products.filter((p) => p.stock > 0 && p.stock <= 3).length} low
          </span>
          <span className="rounded-full border border-rose-deep/25 bg-rose-soft/50 px-3 py-1.5 text-rose-deep">
            {products.filter((p) => p.stock <= 0).length} out
          </span>
        </div>
      </div>

      {dbError ? (
        <p role="alert" className="mt-6 rounded-xl border border-rose-deep/30 bg-rose-deep/5 px-5 py-4 text-sm text-rose-deep">
          Could not load products — the database is unreachable.
        </p>
      ) : products.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-fig/20 bg-white px-8 py-16 text-center">
          <p className="font-display text-xl text-fig">No fragrances yet.</p>
          <p className="mt-2 text-sm text-fig/60">Add your first product — or seed the sample catalogue with npm run seed.</p>
          <Link href="/admin/products/new" className="mt-6 inline-flex h-11 items-center rounded-full bg-fig px-7 text-[10px] font-bold uppercase tracking-[0.22em] text-champagne-light">
            Add your first fragrance
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-fig/10 bg-white shadow-[var(--shadow-card)]">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-white/95 backdrop-blur">
              <tr className="border-b border-fig/10 text-[8px] font-bold uppercase tracking-[0.26em] text-fig/40">
                <th className="px-5 py-4 font-bold">Fragrance</th>
                <th className="px-5 py-4 font-bold">Category</th>
                <th className="px-5 py-4 font-bold">From</th>
                <th className="px-5 py-4 font-bold">Stock</th>
                <th className="px-5 py-4 text-center font-bold">Featured</th>
                <th className="px-5 py-4 text-center font-bold">Visible</th>
                <th className="px-5 py-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-petal">
              {products.map((product) => {
                const id = String(product._id);
                const lowest = product.sizes.length ? Math.min(...product.sizes.map((s) => s.price)) : 0;
                return (
                  <tr key={id} className="group transition-colors hover:bg-porcelain/70">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl border border-fig/10 bg-petal">
                          {product.images[0] ? (
                            <Image src={product.images[0]} alt="" fill sizes="56px" className="object-cover" />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <Link href={`/admin/products/${id}`} className="font-semibold leading-snug text-fig transition-colors hover:text-rose-deep">
                            {product.name}
                          </Link>
                          <p className="mt-0.5 text-[9px] uppercase tracking-[0.18em] text-fig/40">
                            {product.brand || "—"} · {product.concentration}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-fig/65">{categoryNames.get(product.category) ?? product.category}</td>
                    <td className="px-5 py-4 whitespace-nowrap font-display font-semibold tabular-nums text-fig">{formatPrice(lowest, settings.currency)}</td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em]",
                        product.stock <= 0 ? "bg-rose-deep/10 text-rose-deep" : product.stock <= 3 ? "bg-champagne/20 text-champagne-deep" : "bg-wa/10 text-wa-dark",
                      )}>
                        <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", product.stock <= 0 ? "bg-rose-deep" : product.stock <= 3 ? "bg-champagne-deep" : "bg-wa")} />
                        {product.stock <= 0 ? "Out" : product.stock <= 3 ? `${product.stock} left` : product.stock}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <form action={toggleProductFlagAction}>
                        <input type="hidden" name="id" value={id} />
                        <input type="hidden" name="field" value="featured" />
                        <button type="submit" aria-pressed={product.featured} aria-label="Toggle featured" title="Toggle featured"
                          className={cn("inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors",
                            product.featured ? "border-champagne bg-champagne/20 text-rose-deep" : "border-fig/12 text-fig/30 hover:border-champagne/60 hover:text-rose-deep")}>
                          <svg viewBox="0 0 24 24" fill={product.featured ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
                            <path d="M12 2.5 14.95 8.9l6.9.8-5.1 4.75 1.35 6.8L12 17.9 5.9 21.25l1.35-6.8-5.1-4.75 6.9-.8L12 2.5Z" />
                          </svg>
                        </button>
                      </form>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <form action={toggleProductFlagAction}>
                        <input type="hidden" name="id" value={id} />
                        <input type="hidden" name="field" value="active" />
                        <button type="submit" aria-pressed={product.active} aria-label="Toggle visibility" title="Toggle visibility"
                          className={cn("inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors",
                            product.active ? "border-wa-dark/40 bg-wa/10 text-wa-dark" : "border-fig/12 text-fig/30 hover:text-fig")}>
                          {product.active
                            ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4" aria-hidden><path d="m5 13 4 4L19 7" /></svg>
                            : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>}
                        </button>
                      </form>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${id}`} aria-label="Edit product"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-fig/12 text-fig/50 transition-colors hover:border-rose hover:bg-rose-soft/40 hover:text-rose-deep">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
                            <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L9 17l-4 1 1-4L16.5 3.5Z" />
                          </svg>
                        </Link>
                        <DeleteButton id={id} mode="product" label={`Delete ${product.name}`} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
