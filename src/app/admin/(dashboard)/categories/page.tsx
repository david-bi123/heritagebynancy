import { isDatabaseConfigured, connectToDatabase } from "@/lib/db";
import { Category, Product } from "@/lib/models";
import { CategoryManager } from "@/components/category-manager";
import { AdminPageHeader } from "@/components/admin-page-header";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string; count?: string }>;
}) {
  const params = await searchParams;

  if (!isDatabaseConfigured()) {
    return (
      <p className="mx-auto max-w-xl rounded-2xl border border-champagne/40 bg-white p-8 text-sm text-fig/75">
        Categories live in MongoDB. Set <code className="rounded bg-petal px-1">MONGODB_URI</code> and run{" "}
        <code className="rounded bg-petal px-1">npm run seed</code>.
      </p>
    );
  }

  let categories: Array<{
    id: string; name: string; slug: string; description: string; image: string; order: number; productCount: number;
  }> = [];

  try {
    await connectToDatabase();
    const [cats, counts] = await Promise.all([
      Category.find().sort({ order: 1, name: 1 }).lean(),
      Product.aggregate<{ _id: string; count: number }>([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
    ]);
    const countMap = new Map(counts.map((c) => [c._id, c.count]));
    categories = cats.map((c) => ({
      id: String(c._id),
      name: c.name,
      slug: c.slug,
      description: c.description ?? "",
      image: c.image ?? "",
      order: c.order ?? 0,
      productCount: countMap.get(c.slug) ?? 0,
    }));
  } catch (error) {
    console.error("[admin/categories] failed:", error);
  }

  const banner = params.saved ? "Category saved."
    : params.deleted ? "Category deleted."
    : params.error === "inuse" ? `That category still has ${params.count ?? "some"} product(s). Reassign or delete them first.`
    : params.error ? `Something went wrong (${params.error}).`
    : null;

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        eyebrow="Organisation"
        title="Categories"
        description="How the collection is organised on the website. Categories power the shop filters and the homepage split."
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
      <div className="mt-7">
        <CategoryManager categories={categories} />
      </div>
    </div>
  );
}
