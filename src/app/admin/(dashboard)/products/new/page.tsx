import { isDatabaseConfigured, connectToDatabase } from "@/lib/db";
import { Category } from "@/lib/models";
import { ProductForm } from "@/components/product-form";
import { AdminPageHeader } from "@/components/admin-page-header";

export const dynamic = "force-dynamic";

async function getCategoryOptions() {
  if (!isDatabaseConfigured()) return [{ slug: "womens", name: "Women's Fragrances" }, { slug: "mens", name: "Men's Fragrances" }];
  try {
    await connectToDatabase();
    const cats = await Category.find().sort({ order: 1 }).lean();
    return cats.map((c) => ({ slug: c.slug, name: c.name }));
  } catch {
    return [];
  }
}

export default async function NewProductPage() {
  const categories = await getCategoryOptions();
  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader
        eyebrow="Inventory"
        title="Add a fragrance"
        description="Fields marked * are required. Save and the bottle appears on the storefront instantly."
      />
      <div className="relative mt-7 overflow-hidden rounded-2xl border border-fig/10 bg-white shadow-[var(--shadow-card)]">
        <div aria-hidden className="h-1 w-full bg-gradient-to-r from-rose via-champagne to-rose-deep" />
        <div className="p-6 sm:p-8">
          <ProductForm categories={categories} />
        </div>
      </div>
    </div>
  );
}
