import Link from "next/link";
import { notFound } from "next/navigation";
import { isDatabaseConfigured, connectToDatabase } from "@/lib/db";
import { Category, Product } from "@/lib/models";
import { ProductForm, type ProductFormValues } from "@/components/product-form";
import { AdminPageHeader } from "@/components/admin-page-header";
import { ArrowLeftIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isDatabaseConfigured()) {
    return (
      <p className="mx-auto max-w-md rounded-2xl border border-champagne/40 bg-white p-8 text-sm text-fig/75">
        The database is not configured. Set <code className="rounded bg-petal px-1">MONGODB_URI</code> first.
      </p>
    );
  }
  if (!/^[a-f0-9]{24}$/i.test(id)) notFound();

  await connectToDatabase();
  const doc = await Product.findById(id).lean();
  if (!doc) notFound();
  const cats = await Category.find().sort({ order: 1 }).lean();

  const initial: ProductFormValues = {
    id: String(doc._id),
    name: doc.name,
    brand: doc.brand ?? "",
    category: doc.category,
    concentration: doc.concentration,
    description: doc.description ?? "",
    notesTop: doc.notesTop ?? "",
    notesHeart: doc.notesHeart ?? "",
    notesBase: doc.notesBase ?? "",
    stock: doc.stock ?? 0,
    featured: Boolean(doc.featured),
    active: doc.active !== false,
    sizes: (doc.sizes ?? []).map((s) => ({ label: s.label, price: s.price })),
    images: doc.images ?? [],
  };

  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader
        eyebrow="Inventory"
        title="Edit fragrance"
        description={doc.name}
        action={
          <Link
            href="/admin/products"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-fig/15 bg-white px-5 text-[9.5px] font-bold uppercase tracking-[0.2em] text-fig/65 transition-colors hover:border-rose hover:text-rose-deep"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" /> All fragrances
          </Link>
        }
      />
      <div className="relative mt-7 overflow-hidden rounded-2xl border border-fig/10 bg-white shadow-[var(--shadow-card)]">
        <div aria-hidden className="h-1 w-full bg-gradient-to-r from-rose via-champagne to-rose-deep" />
        <div className="p-6 sm:p-8">
          <ProductForm initial={initial} categories={cats.map((c) => ({ slug: c.slug, name: c.name }))} />
        </div>
      </div>
    </div>
  );
}
