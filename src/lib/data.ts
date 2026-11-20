import { connectToDatabase, isDatabaseConfigured } from "@/lib/db";
import { Category, Product } from "@/lib/models";
import {
  FALLBACK_CATEGORIES,
  FALLBACK_PRODUCTS,
  type StorefrontCategory,
  type StorefrontProduct,
} from "@/lib/fallback-data";

export type { StorefrontCategory, StorefrontProduct };

function mapProduct(doc: Record<string, unknown>): StorefrontProduct {
  return {
    id: String(doc._id),
    name: String(doc.name ?? ""),
    slug: String(doc.slug ?? ""),
    brand: String(doc.brand ?? ""),
    category: String(doc.category ?? ""),
    concentration: String(doc.concentration ?? "Eau de Parfum"),
    description: String(doc.description ?? ""),
    notesTop: String(doc.notesTop ?? ""),
    notesHeart: String(doc.notesHeart ?? ""),
    notesBase: String(doc.notesBase ?? ""),
    sizes: Array.isArray(doc.sizes)
      ? (doc.sizes as { label: string; price: number }[]).map((s) => ({
          label: String(s.label),
          price: Number(s.price) || 0,
        }))
      : [],
    stock: Number(doc.stock ?? 0),
    featured: Boolean(doc.featured),
    active: doc.active !== false,
    images: Array.isArray(doc.images) ? (doc.images as string[]).filter(Boolean) : [],
  };
}

function mapCategory(doc: Record<string, unknown>): StorefrontCategory {
  return {
    id: String(doc._id),
    name: String(doc.name ?? ""),
    slug: String(doc.slug ?? ""),
    description: String(doc.description ?? ""),
    image: String(doc.image ?? ""),
    order: Number(doc.order ?? 0),
  };
}

export async function getCategories(): Promise<StorefrontCategory[]> {
  if (!isDatabaseConfigured()) return [...FALLBACK_CATEGORIES].sort(byOrder);
  try {
    await connectToDatabase();
    const docs = await Category.find().sort({ order: 1, name: 1 }).lean();
    if (docs.length === 0) return [...FALLBACK_CATEGORIES].sort(byOrder);
    return docs.map((d) => mapCategory(d as unknown as Record<string, unknown>));
  } catch (error) {
    console.error("[data] getCategories fallback:", error);
    return [...FALLBACK_CATEGORIES].sort(byOrder);
  }
}

const byOrder = (a: StorefrontCategory, b: StorefrontCategory) => a.order - b.order;

export interface ProductQuery {
  category?: string;
  search?: string;
  featuredOnly?: boolean;
  includeInactive?: boolean;
}

function applyClientSideFilter(
  items: StorefrontProduct[],
  query: ProductQuery,
): StorefrontProduct[] {
  let out = items;
  if (!query.includeInactive) out = out.filter((p) => p.active);
  if (query.category) out = out.filter((p) => p.category === query.category);
  if (query.featuredOnly) out = out.filter((p) => p.featured);
  if (query.search) {
    const q = query.search.trim().toLowerCase();
    if (q) {
      out = out.filter((p) =>
        [p.name, p.brand, p.description, p.concentration, p.notesTop, p.notesHeart, p.notesBase]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
  }
  return out;
}

export async function getProducts(query: ProductQuery = {}): Promise<StorefrontProduct[]> {
  if (!isDatabaseConfigured()) {
    return applyClientSideFilter(FALLBACK_PRODUCTS, query);
  }
  try {
    await connectToDatabase();
    const filter: Record<string, unknown> = {};
    if (!query.includeInactive) filter.active = true;
    if (query.category) filter.category = query.category;
    if (query.featuredOnly) filter.featured = true;
    const docs = await Product.find(filter).sort({ featured: -1, createdAt: -1 }).lean();
    let items = docs.map((d) => mapProduct(d as unknown as Record<string, unknown>));
    if (query.search) {
      const q = query.search.trim().toLowerCase();
      if (q) {
        items = items.filter((p) =>
          [p.name, p.brand, p.description, p.concentration, p.notesTop, p.notesHeart, p.notesBase]
            .join(" ")
            .toLowerCase()
            .includes(q),
        );
      }
    }
    return items;
  } catch (error) {
    console.error("[data] getProducts fallback:", error);
    return applyClientSideFilter(FALLBACK_PRODUCTS, query);
  }
}

export async function getProductBySlug(slug: string): Promise<StorefrontProduct | null> {
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) return null;
  if (!isDatabaseConfigured()) {
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug && p.active) ?? null;
  }
  try {
    await connectToDatabase();
    const doc = await Product.findOne({ slug, active: true }).lean();
    if (doc) return mapProduct(doc as unknown as Record<string, unknown>);
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug && p.active) ?? null;
  } catch (error) {
    console.error("[data] getProductBySlug fallback:", error);
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug && p.active) ?? null;
  }
}

export async function getRelatedProducts(
  product: StorefrontProduct,
  limit = 3,
): Promise<StorefrontProduct[]> {
  const all = await getProducts({ category: product.category });
  return all.filter((p) => p.slug !== product.slug).slice(0, limit);
}

export function stockStatus(product: Pick<StorefrontProduct, "stock">) {
  if (product.stock <= 0) return "out" as const;
  if (product.stock <= 3) return "low" as const;
  return "in" as const;
}

export function startingPrice(product: StorefrontProduct): number {
  if (!product.sizes.length) return 0;
  return Math.min(...product.sizes.map((s) => s.price));
}
