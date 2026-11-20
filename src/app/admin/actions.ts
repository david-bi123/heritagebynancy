"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/db";
import { AdminUser, Category, Enquiry, Product, Setting } from "@/lib/models";
import {
  clearSessionCookie,
  getSession,
  hashPassword,
  setSessionCookie,
  verifyPassword,
  createSessionToken,
} from "@/lib/auth";
import { clientIpFromHeaders, rateLimit } from "@/lib/rate-limit";
import { constantDelay, slugify } from "@/lib/utils";
import { normalizePhoneForWa } from "@/lib/whatsapp";

const CONCENTRATIONS = [
  "Eau de Parfum",
  "Eau de Toilette",
  "Eau de Cologne",
  "Parfum",
  "Extrait de Parfum",
] as const;

function requireSession() {
  return getSession();
}

function dbDownState(): ActionState {
  return { ok: false, message: "The database is not reachable. Check MONGODB_URI and try again." };
}

export interface ActionState {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

/* ------------------------------- LOGIN -------------------------------- */

const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password.").max(200),
});

export async function loginAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const headerList = await headers();
  const ip = clientIpFromHeaders(headerList);
  const limit = rateLimit(`login:${ip}`, 8, 15 * 60 * 1000);
  if (!limit.success) {
    return { ok: false, message: "Too many attempts. Wait 15 minutes and try again." };
  }

  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) {
    return { ok: false, message: "Enter a valid email and your password." };
  }

  if (!isDatabaseConfigured()) {
    return { ok: false, message: "Admin is not configured yet — set MONGODB_URI and run the seed script." };
  }

  try {
    await connectToDatabase();
    const user = await AdminUser.findOne({ email: parsed.data.email.toLowerCase() })
      .select("+passwordHash")
      .lean();
    const valid = user ? await verifyPassword(parsed.data.password, user.passwordHash) : false;
    if (!user || !valid) {
      await constantDelay(300);
      return { ok: false, message: "Incorrect email or password." };
    }
    await AdminUser.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });
    const token = await createSessionToken({
      userId: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role === "superadmin" ? "superadmin" : "admin",
    });
    await setSessionCookie(token);
  } catch (error) {
    console.error("[admin/login] failed:", error);
    return { ok: false, message: "Sign-in failed. Check the server logs." };
  }

  const next = String(formData.get("next") ?? "/admin");
  redirect(next.startsWith("/admin") && !next.startsWith("/admin/login") ? next : "/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}

/* ------------------------------ PRODUCTS ------------------------------ */

const sizeSchema = z.object({
  label: z.string().trim().min(1).max(40),
  price: z.number().min(0).max(1_000_000),
});

const productSchema = z.object({
  id: z.string().trim().max(60).optional().default(""),
  name: z.string().trim().min(3, "Name is required.").max(120),
  brand: z.string().trim().max(80).default(""),
  category: z.string().trim().min(1, "Choose a category.").max(60),
  concentration: z.enum(CONCENTRATIONS),
  description: z.string().trim().max(2000).default(""),
  notesTop: z.string().trim().max(200).default(""),
  notesHeart: z.string().trim().max(200).default(""),
  notesBase: z.string().trim().max(200).default(""),
  stock: z.number().int().min(0).max(1_000_000),
  featured: z.boolean(),
  active: z.boolean(),
  sizes: z.array(sizeSchema).min(1, "Add at least one size with a price.").max(12),
  images: z.array(z.string().trim().url().max(2048)).max(8).default([]),
});

export async function saveProductAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();
  if (!session) return { ok: false, message: "Your session expired — sign in again." };
  if (!isDatabaseConfigured()) return dbDownState();

  let sizes: unknown = [];
  let images: unknown = [];
  try {
    sizes = JSON.parse(String(formData.get("sizesJson") ?? "[]"));
    images = JSON.parse(String(formData.get("imagesJson") ?? "[]"));
  } catch {
    return { ok: false, message: "Could not read sizes or images — please try again." };
  }

  const parsed = productSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? ""),
    brand: String(formData.get("brand") ?? ""),
    category: String(formData.get("category") ?? ""),
    concentration: String(formData.get("concentration") ?? "Eau de Parfum"),
    description: String(formData.get("description") ?? ""),
    notesTop: String(formData.get("notesTop") ?? ""),
    notesHeart: String(formData.get("notesHeart") ?? ""),
    notesBase: String(formData.get("notesBase") ?? ""),
    stock: Number(formData.get("stock") ?? 0),
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
    sizes,
    images,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = parsed.data;
  try {
    await connectToDatabase();
    const baseSlug = slugify(data.name);
    const slugOwner = await Product.findOne({ slug: baseSlug }).select("_id").lean();
    const conflict = slugOwner && String(slugOwner._id) !== data.id;
    const slug = conflict ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug;

    const update = {
      name: data.name,
      slug,
      brand: data.brand,
      category: data.category,
      concentration: data.concentration,
      description: data.description,
      notesTop: data.notesTop,
      notesHeart: data.notesHeart,
      notesBase: data.notesBase,
      stock: data.stock,
      featured: data.featured,
      active: data.active,
      sizes: data.sizes,
      images: data.images,
    };

    if (data.id) {
      const updated = await Product.findByIdAndUpdate(data.id, { $set: update }, { new: true });
      if (!updated) return { ok: false, message: "That product no longer exists." };
    } else {
      await Product.create(update);
    }
  } catch (error) {
    console.error("[admin/saveProduct] failed:", error);
    return { ok: false, message: "Could not save the fragrance. Please try again." };
  }

  revalidatePath("/", "layout");
  redirect("/admin/products?saved=1");
}

export async function deleteProductAction(formData: FormData) {
  const session = await requireSession();
  if (!session) redirect("/admin/login");
  if (!isDatabaseConfigured()) redirect("/admin/products?error=db");

  const id = String(formData.get("id") ?? "");
  if (!/^[a-f0-9]{24}$/i.test(id)) redirect("/admin/products?error=id");

  let succeeded = false;
  try {
    await connectToDatabase();
    await Product.findByIdAndDelete(id);
    revalidatePath("/", "layout");
    succeeded = true;
  } catch (error) {
    console.error("[admin/deleteProduct] failed:", error);
  }
  redirect(succeeded ? "/admin/products?deleted=1" : "/admin/products?error=delete");
}

export async function toggleProductFlagAction(formData: FormData) {
  const session = await requireSession();
  if (!session) redirect("/admin/login");

  const id = String(formData.get("id") ?? "");
  const field = String(formData.get("field") ?? "");
  if (!/^[a-f0-9]{24}$/i.test(id) || !["featured", "active"].includes(field)) {
    redirect("/admin/products?error=toggle");
  }
  if (!isDatabaseConfigured()) redirect("/admin/products?error=db");
  try {
    await connectToDatabase();
    const product = await Product.findById(id).select(field).lean();
    if (product) {
      await Product.updateOne({ _id: id }, { $set: { [field]: !(product as unknown as Record<string, unknown>)[field] } });
    }
    revalidatePath("/", "layout");
  } catch (error) {
    console.error("[admin/toggleProduct] failed:", error);
  }
  redirect("/admin/products");
}

/* ------------------------------ CATEGORIES ---------------------------- */

const categorySchema = z.object({
  id: z.string().trim().max(60).optional().default(""),
  name: z.string().trim().min(2, "Name is required.").max(60),
  description: z.string().trim().max(300).default(""),
  image: z.string().trim().url("Enter a valid image URL.").max(2048).or(z.literal("")).default(""),
  order: z.number().int().min(0).max(999).default(0),
});

export async function saveCategoryAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();
  if (!session) return { ok: false, message: "Your session expired — sign in again." };
  if (!isDatabaseConfigured()) return dbDownState();

  const parsed = categorySchema.safeParse({
    id: String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    image: String(formData.get("image") ?? ""),
    order: Number(formData.get("order") ?? 0),
  });
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = parsed.data;
  try {
    await connectToDatabase();
    const slug = slugify(data.name);
    const update = { name: data.name, slug, description: data.description, image: data.image, order: data.order };
    if (data.id) {
      await Category.findByIdAndUpdate(data.id, { $set: update });
    } else {
      await Category.findOneAndUpdate({ slug }, { $setOnInsert: update }, { upsert: true });
    }
  } catch (error) {
    console.error("[admin/saveCategory] failed:", error);
    return { ok: false, message: "Could not save the category." };
  }
  revalidatePath("/", "layout");
  redirect("/admin/categories?saved=1");
}

export async function deleteCategoryAction(formData: FormData) {
  const session = await requireSession();
  if (!session) redirect("/admin/login");
  if (!isDatabaseConfigured()) redirect("/admin/categories?error=db");

  const id = String(formData.get("id") ?? "");
  if (!/^[a-f0-9]{24}$/i.test(id)) redirect("/admin/categories?error=id");

  let outcome: "deleted" | "missing" | "inuse" | "error" = "error";
  let inUseCount = 0;
  try {
    await connectToDatabase();
    const category = await Category.findById(id).lean();
    const inUse = category ? await Product.countDocuments({ category: category.slug }) : 0;
    if (!category) {
      outcome = "missing";
    } else if (inUse > 0) {
      outcome = "inuse";
      inUseCount = inUse;
    } else {
      await Category.findByIdAndDelete(id);
      revalidatePath("/", "layout");
      outcome = "deleted";
    }
  } catch (error) {
    console.error("[admin/deleteCategory] failed:", error);
  }
  if (outcome === "deleted") redirect("/admin/categories?deleted=1");
  if (outcome === "inuse") redirect(`/admin/categories?error=inuse&count=${inUseCount}`);
  redirect(`/admin/categories?error=${outcome}`);
}

/* ------------------------------ SETTINGS ------------------------------ */

const settingsSchema = z.object({
  businessName: z.string().trim().min(2).max(120),
  tagline: z.string().trim().max(120).default(""),
  announcement: z.string().trim().max(160).default(""),
  heroHeading: z.string().trim().min(2).max(160),
  heroSubheading: z.string().trim().min(2).max(300),
  aboutStory: z.string().trim().max(4000).default(""),
  whatsappNumber: z.string().trim().max(20).default(""),
  phone: z.string().trim().max(40).default(""),
  email: z.string().trim().max(120).default(""),
  address: z.string().trim().max(240).default(""),
  hours: z.string().trim().max(240).default(""),
  instagram: z.string().trim().max(200).default(""),
  facebook: z.string().trim().max(200).default(""),
  tiktok: z.string().trim().max(200).default(""),
  x: z.string().trim().max(200).default(""),
  currency: z.string().trim().min(1).max(8).default("GH₵"),
  deliveryInfo: z.string().trim().max(2000).default(""),
  returnsInfo: z.string().trim().max(2000).default(""),
});

export async function saveSettingsAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();
  if (!session) return { ok: false, message: "Your session expired — sign in again." };
  if (!isDatabaseConfigured()) return dbDownState();

  const raw: Record<string, string> = {};
  for (const key of Object.keys(settingsSchema.shape)) {
    raw[key] = String(formData.get(key) ?? "");
  }
  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = parsed.data;
  if (data.whatsappNumber && !normalizePhoneForWa(data.whatsappNumber)) {
    return {
      ok: false,
      message: "That WhatsApp number is not valid. Use international format, e.g. 233541234567.",
      fieldErrors: { whatsappNumber: ["Invalid number format."] },
    };
  }
  if (data.email && !z.email().safeParse(data.email).success) {
    return {
      ok: false,
      message: "That email address is not valid.",
      fieldErrors: { email: ["Invalid email address."] },
    };
  }

  try {
    await connectToDatabase();
    await Setting.findOneAndUpdate(
      { key: "site" },
      { $set: { ...data, key: "site" } },
      { upsert: true },
    );
  } catch (error) {
    console.error("[admin/saveSettings] failed:", error);
    return { ok: false, message: "Could not save settings. Try again." };
  }
  revalidatePath("/", "layout");
  return { ok: true, message: "Settings saved — changes are live." };
}

export async function changePasswordAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();
  if (!session) return { ok: false, message: "Your session expired — sign in again." };
  if (!isDatabaseConfigured()) return dbDownState();

  const current = String(formData.get("currentPassword") ?? "");
  const next = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (next.length < 10 || !/[A-Za-z]/.test(next) || !/[0-9]/.test(next)) {
    return { ok: false, message: "New password must be at least 10 characters and include letters and numbers." };
  }
  if (next !== confirm) {
    return { ok: false, message: "New passwords do not match." };
  }

  try {
    await connectToDatabase();
    const user = await AdminUser.findById(session.userId).select("+passwordHash");
    if (!user) return { ok: false, message: "Account not found." };
    const ok = await verifyPassword(current, user.passwordHash);
    if (!ok) return { ok: false, message: "Your current password is incorrect." };
    user.passwordHash = await hashPassword(next);
    await user.save();
  } catch (error) {
    console.error("[admin/changePassword] failed:", error);
    return { ok: false, message: "Could not update the password. Try again." };
  }
  return { ok: true, message: "Password updated. Use it next time you sign in." };
}

/* ------------------------------ ENQUIRIES ----------------------------- */

export async function setEnquiryStatusAction(formData: FormData) {
  const session = await requireSession();
  if (!session) redirect("/admin/login");
  if (!isDatabaseConfigured()) redirect("/admin/enquiries?error=db");

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!/^[a-f0-9]{24}$/i.test(id) || !["new", "handled"].includes(status)) {
    redirect("/admin/enquiries?error=input");
  }
  try {
    await connectToDatabase();
    await Enquiry.updateOne({ _id: id }, { $set: { status } });
  } catch (error) {
    console.error("[admin/setEnquiryStatus] failed:", error);
  }
  revalidatePath("/admin/enquiries");
  redirect("/admin/enquiries");
}

export async function deleteEnquiryAction(formData: FormData) {
  const session = await requireSession();
  if (!session) redirect("/admin/login");
  if (!isDatabaseConfigured()) redirect("/admin/enquiries?error=db");

  const id = String(formData.get("id") ?? "");
  if (!/^[a-f0-9]{24}$/i.test(id)) redirect("/admin/enquiries?error=input");
  try {
    await connectToDatabase();
    await Enquiry.findByIdAndDelete(id);
  } catch (error) {
    console.error("[admin/deleteEnquiry] failed:", error);
  }
  revalidatePath("/admin/enquiries");
  redirect("/admin/enquiries");
}

/* --------------------------- TEAM MANAGEMENT --------------------------- */

const teamSchema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(80),
  email: z.email("Enter a valid email address.").max(120),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters.")
    .max(200)
    .regex(/[A-Za-z]/, "Password must include letters.")
    .regex(/[0-9]/, "Password must include numbers."),
  role: z.enum(["admin", "superadmin"]),
});

const resetAccountSchema = z.object({
  id: z.string().trim().regex(/^[a-f0-9]{24}$/i, "Invalid account."),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters.")
    .max(200)
    .regex(/[A-Za-z]/, "Password must include letters.")
    .regex(/[0-9]/, "Password must include numbers."),
});

export async function createTeamAccountAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();
  if (!session) return { ok: false, message: "Your session expired — sign in again." };
  if (session.role !== "superadmin") {
    return { ok: false, message: "Only the SamTech Labs super admin can manage team accounts." };
  }
  if (!isDatabaseConfigured()) return dbDownState();

  const parsed = teamSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    role: String(formData.get("role") ?? "admin"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  try {
    await connectToDatabase();
    const email = parsed.data.email.toLowerCase();
    const exists = await AdminUser.findOne({ email }).select("_id").lean();
    if (exists) return { ok: false, message: "An account with that email already exists." };
    await AdminUser.create({
      name: parsed.data.name,
      email,
      passwordHash: await hashPassword(parsed.data.password),
      role: parsed.data.role,
    });
  } catch (error) {
    console.error("[admin/createTeamAccount] failed:", error);
    return { ok: false, message: "Could not create the account. Try again." };
  }
  revalidatePath("/admin/users");
  return { ok: true, message: "Account created — share the credentials securely." };
}

export async function resetTeamAccountPasswordAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();
  if (!session) return { ok: false, message: "Your session expired — sign in again." };
  if (session.role !== "superadmin") {
    return { ok: false, message: "Only the SamTech Labs super admin can manage team accounts." };
  }
  if (!isDatabaseConfigured()) return dbDownState();

  const parsed = resetAccountSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) {
    return { ok: false, message: "Password must be at least 10 characters with letters and numbers.", fieldErrors: {} };
  }
  try {
    await connectToDatabase();
    const result = await AdminUser.updateOne(
      { _id: parsed.data.id },
      { $set: { passwordHash: await hashPassword(parsed.data.password) } },
    );
    if (result.matchedCount === 0) return { ok: false, message: "That account no longer exists." };
  } catch (error) {
    console.error("[admin/resetTeamPassword] failed:", error);
    return { ok: false, message: "Could not reset the password. Try again." };
  }
  revalidatePath("/admin/users");
  return { ok: true, message: "Password updated." };
}

export async function removeTeamAccountAction(formData: FormData) {
  const session = await requireSession();
  if (!session) redirect("/admin/login");
  if (session.role !== "superadmin") redirect("/admin/users?error=role");
  if (!isDatabaseConfigured()) redirect("/admin/users?error=db");

  const id = String(formData.get("id") ?? "");
  if (!/^[a-f0-9]{24}$/i.test(id)) redirect("/admin/users?error=id");

  let outcome: "removed" | "self" | "last" | "error" | "missing" = "error";
  try {
    await connectToDatabase();
    const target = await AdminUser.findById(id).select("role").lean();
    if (!target) {
      outcome = "missing";
    } else if (String(target._id) === session.userId) {
      outcome = "self";
    } else if (target.role === "superadmin") {
      const superCount = await AdminUser.countDocuments({ role: "superadmin" });
      if (superCount <= 1) {
        outcome = "last";
      } else {
        await AdminUser.findByIdAndDelete(id);
        outcome = "removed";
      }
    } else {
      await AdminUser.findByIdAndDelete(id);
      outcome = "removed";
    }
    if (outcome === "removed") revalidatePath("/admin/users");
  } catch (error) {
    console.error("[admin/removeTeamAccount] failed:", error);
  }
  redirect(outcome === "removed" ? "/admin/users?removed=1" : `/admin/users?error=${outcome}`);
}
