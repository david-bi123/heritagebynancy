import mongoose, { Schema, models, model, type Model } from "mongoose";

/* ------------------------------ Product ------------------------------ */

export interface ProductSize {
  label: string;
  price: number;
}

export interface ProductDoc {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  brand: string;
  category: string; // category slug
  concentration: string;
  description: string;
  notesTop: string;
  notesHeart: string;
  notesBase: string;
  sizes: ProductSize[];
  stock: number;
  featured: boolean;
  active: boolean;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const sizeSchema = new Schema<ProductSize>(
  {
    label: { type: String, required: true, trim: true, maxlength: 40 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const productSchema = new Schema<ProductDoc>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    brand: { type: String, trim: true, maxlength: 80, default: "" },
    category: { type: String, required: true, trim: true, index: true },
    concentration: {
      type: String,
      enum: ["Eau de Parfum", "Eau de Toilette", "Eau de Cologne", "Parfum", "Extrait de Parfum"],
      default: "Eau de Parfum",
    },
    description: { type: String, trim: true, maxlength: 2000, default: "" },
    notesTop: { type: String, trim: true, maxlength: 200, default: "" },
    notesHeart: { type: String, trim: true, maxlength: 200, default: "" },
    notesBase: { type: String, trim: true, maxlength: 200, default: "" },
    sizes: {
      type: [sizeSchema],
      validate: {
        validator: (v: ProductSize[]) => Array.isArray(v) && v.length > 0,
        message: "At least one size with a price is required.",
      },
    },
    stock: { type: Number, min: 0, default: 0 },
    featured: { type: Boolean, default: false, index: true },
    active: { type: Boolean, default: true, index: true },
    images: { type: [String], default: [] },
  },
  { timestamps: true },
);

productSchema.index({ active: 1, featured: -1, createdAt: -1 });

/* ------------------------------ Category ----------------------------- */

export interface CategoryDoc {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
}

const categorySchema = new Schema<CategoryDoc>(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, trim: true, maxlength: 300, default: "" },
    image: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

/* ------------------------------ Settings ----------------------------- */

export interface SettingDoc {
  key: string;
  businessName: string;
  tagline: string;
  announcement: string;
  heroHeading: string;
  heroSubheading: string;
  aboutStory: string;
  whatsappNumber: string; // international format, digits only
  phone: string;
  email: string;
  address: string;
  hours: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  x: string;
  currency: string;
  deliveryInfo: string;
  returnsInfo: string;
  updatedAt: Date;
}

const settingSchema = new Schema<SettingDoc>(
  {
    key: { type: String, required: true, unique: true, default: "site", immutable: true },
    businessName: { type: String, trim: true, maxlength: 120, default: "Heritage By Nancy" },
    tagline: { type: String, trim: true, maxlength: 120, default: "Authentic Designer Perfumes" },
    announcement: { type: String, trim: true, maxlength: 160, default: "" },
    heroHeading: {
      type: String,
      trim: true,
      maxlength: 160,
      default: "Wear a signature, not just a scent.",
    },
    heroSubheading: {
      type: String,
      trim: true,
      maxlength: 300,
      default:
        "Authentic designer fragrances for men and women — curated in Ghana, ordered in seconds on WhatsApp.",
    },
    aboutStory: { type: String, maxlength: 4000, default: "" },
    whatsappNumber: { type: String, trim: true, maxlength: 20, default: "" },
    phone: { type: String, trim: true, maxlength: 40, default: "" },
    email: { type: String, trim: true, maxlength: 120, default: "" },
    address: { type: String, trim: true, maxlength: 240, default: "" },
    hours: { type: String, trim: true, maxlength: 240, default: "" },
    instagram: { type: String, trim: true, maxlength: 200, default: "" },
    facebook: { type: String, trim: true, maxlength: 200, default: "" },
    tiktok: { type: String, trim: true, maxlength: 200, default: "" },
    x: { type: String, trim: true, maxlength: 200, default: "" },
    currency: { type: String, trim: true, maxlength: 8, default: "GH₵" },
    deliveryInfo: { type: String, maxlength: 2000, default: "" },
    returnsInfo: { type: String, maxlength: 2000, default: "" },
  },
  { timestamps: true },
);

/* ------------------------------ AdminUser ---------------------------- */

export interface AdminUserDoc {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "superadmin";
  lastLoginAt: Date | null;
}

const adminUserSchema = new Schema<AdminUserDoc>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "superadmin"], default: "admin" },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true },
);

/* ------------------------------ Enquiry ------------------------------ */

export interface EnquiryDoc {
  _id: mongoose.Types.ObjectId;
  name: string;
  contact: string;
  message: string;
  source: "contact" | "order" | "other";
  status: "new" | "handled";
  createdAt: Date;
}

const enquirySchema = new Schema<EnquiryDoc>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    contact: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 3000 },
    source: { type: String, enum: ["contact", "order", "other"], default: "contact" },
    status: { type: String, enum: ["new", "handled"], default: "new", index: true },
  },
  { timestamps: true },
);

/* ------------------------------ Exports ------------------------------ */

export const Product: Model<ProductDoc> =
  (models.Product as Model<ProductDoc>) || model<ProductDoc>("Product", productSchema);
export const Category: Model<CategoryDoc> =
  (models.Category as Model<CategoryDoc>) || model<CategoryDoc>("Category", categorySchema);
export const Setting: Model<SettingDoc> =
  (models.Setting as Model<SettingDoc>) || model<SettingDoc>("Setting", settingSchema);
export const AdminUser: Model<AdminUserDoc> =
  (models.AdminUser as Model<AdminUserDoc>) || model<AdminUserDoc>("AdminUser", adminUserSchema);
export const Enquiry: Model<EnquiryDoc> =
  (models.Enquiry as Model<EnquiryDoc>) || model<EnquiryDoc>("Enquiry", enquirySchema);
