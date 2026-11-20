/**
 * Idempotent seed: sample catalogue + settings defaults + first admin.
 *
 *   npm run seed            (uses MONGODB_URI from .env.local or the environment)
 *
 * - Categories and products are inserted only when missing (matched by slug) —
 *   it never overwrites edits you make in the admin dashboard.
 * - Settings are created with safe defaults on first run only.
 * - The first admin account is created from ADMIN_EMAIL / ADMIN_PASSWORD
 *   only when NO admin exists yet. It never resets an existing password.
 *
 * NOTE: the bundled catalogue is SAMPLE data (placeholder prices/photos).
 * Replace products, prices and images via Admin → Products.
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { loadEnvLocal } from "./load-env.mjs";

loadEnvLocal();

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/heritagebynancy";

const img = (id, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

const CATEGORIES = [
  { name: "Women's Fragrances", slug: "womens", description: "Timeless classics and modern signatures for her.", image: img("photo-1595425970377-c9703cf48b6d", 1400), order: 1 },
  { name: "Men's Fragrances", slug: "mens", description: "Bold woods, fresh aquatics and refined aromatics for him.", image: img("photo-1523293182086-7651a899d37f", 1400), order: 2 },
];

const PRODUCTS = [
  { name: "Chanel No.5 Eau de Parfum", slug: "chanel-no5-eau-de-parfum", brand: "Chanel", category: "womens", concentration: "Eau de Parfum", description: "The most famous perfume ever created — a sophisticated aldehydic floral bouquet of jasmine, rose and ylang-ylang over warm sandalwood. A timeless signature for the woman who defines her own elegance.", notesTop: "Aldehydes, Neroli, Ylang-Ylang", notesHeart: "Jasmine, May Rose, Iris", notesBase: "Sandalwood, Vetiver, Vanilla", sizes: [{ label: "50ml", price: 1450 }, { label: "100ml", price: 1950 }], stock: 12, featured: true, active: true, images: [img("photo-1541643600914-78b084683601")] },
  { name: "Chanel Coco Mademoiselle Eau de Parfum", slug: "chanel-coco-mademoiselle-eau-de-parfum", brand: "Chanel", category: "womens", concentration: "Eau de Parfum", description: "A modern, radiant oriental floral. Sparkling Sicilian orange and bergamot open into a heart of Turkish rose and jasmine, settled into an elegant base of patchouli and white musks.", notesTop: "Orange, Bergamot, Grapefruit", notesHeart: "Turkish Rose, Jasmine, Litchi", notesBase: "Patchouli, White Musk, Vanilla", sizes: [{ label: "50ml", price: 1650 }, { label: "100ml", price: 2400 }], stock: 9, featured: true, active: true, images: [img("photo-1592945403244-b3fbafd7f539")] },
  { name: "Chanel Coco Noir Eau de Parfum", slug: "chanel-coco-noir-eau-de-parfum", brand: "Chanel", category: "womens", concentration: "Eau de Parfum", description: "An intense, smoky and enveloping oriental. Bright grapefruit is wrapped in rose and jasmine, deepened with a powerful accord of sandalwood, tonka bean and white amber.", notesTop: "Grapefruit, Rose de Mai, Orange", notesHeart: "Jasmine, Rose, Coriander", notesBase: "Sandalwood, Tonka Bean, White Amber", sizes: [{ label: "50ml", price: 1600 }, { label: "100ml", price: 2350 }], stock: 8, featured: false, active: true, images: [img("photo-1594035910387-fea47794261f")] },
  { name: "Giorgio Armani Sun di Gioia Eau de Parfum", slug: "giorgio-armani-sun-di-gioia-eau-de-parfum", brand: "Giorgio Armani", category: "womens", concentration: "Eau de Parfum", description: "Pure joy in a bottle — a luminous, fruity floral. Italian bergamot and pear sparkle over a heart of jasmine and peony, finished with warm cedar and vanilla.", notesTop: "Italian Bergamot, Italian Pear, Calabrian Orange", notesHeart: "Jasmine, Red Peony", notesBase: "Cedarwood, Vanilla", sizes: [{ label: "30ml", price: 850 }, { label: "50ml", price: 1350 }, { label: "100ml", price: 1950 }], stock: 0, featured: false, active: true, images: [img("photo-1547887537-6158d64c35b3")] },
  { name: "Bleu de Chanel Eau de Parfum", slug: "bleu-de-chanel-eau-de-parfum", brand: "Chanel", category: "mens", concentration: "Eau de Parfum", description: "The definitive modern masculine signature — citrus brightness over an energetic heart of ginger and jasmine, grounded by noble sandalwood and incense. Effortlessly sophisticated.", notesTop: "Grapefruit, Lemon, Mint", notesHeart: "Ginger, Jasmine, Pink Pepper", notesBase: "Sandalwood, Incense, Amberwood", sizes: [{ label: "50ml", price: 1250 }, { label: "100ml", price: 1800 }, { label: "150ml", price: 2250 }], stock: 14, featured: true, active: true, images: [img("photo-1523293182086-7651a899d37f")] },
  { name: "Giorgio Armani Acqua di Giò Pour Homme Eau de Toilette", slug: "giorgio-armani-acqua-di-gio-pour-homme-eau-de-toilette", brand: "Giorgio Armani", category: "mens", concentration: "Eau de Toilette", description: "The legendary marine refreshment. Mediterranean citrus, rosemary and lavender over sensual marine and woody notes — pure coastal elegance for everyday wear.", notesTop: "Bergamot, Lemon, Lime, Mandarin", notesHeart: "Sea Notes, Jasmine, Rosemary, Lavender", notesBase: "Cedarwood, Sandalwood, Musk, Patchouli", sizes: [{ label: "50ml", price: 950 }, { label: "100ml", price: 1450 }], stock: 11, featured: false, active: true, images: [img("photo-1619994403073-2cec844b8e63")] },
  { name: "Versace Eros Eau de Toilette", slug: "versace-eros-eau-de-toilette", brand: "Versace", category: "mens", concentration: "Eau de Toilette", description: "A magnetic, passionate masculine — Sicilian mandarin, fresh mint and green apple over ambroxan, geranium and warm tonka bean. Bold, sensual and unforgettable.", notesTop: "Mint, Green Apple, Lemon, Italian Mandarin", notesHeart: "Tonka Bean, Ambroxan, Geranium, Flowers", notesBase: "Cedarwood, Vetiver, Vanilla, Oakmoss", sizes: [{ label: "50ml", price: 850 }, { label: "100ml", price: 1400 }], stock: 3, featured: true, active: true, images: [img("photo-1587017539504-67cfbddac569")] },
];

const DEFAULT_SETTINGS = {
  key: "site",
  businessName: "Heritage By Nancy",
  tagline: "Authentic Designer Perfumes",
  announcement: "Authentic designer fragrances • Delivered nationwide",
  heroHeading: "Wear a signature, not just a scent.",
  heroSubheading: "Authentic designer fragrances for men and women — curated in Ghana, ordered in seconds on WhatsApp.",
  aboutStory: "Heritage By Nancy was created for people who believe a fragrance is more than a grooming choice — it is a signature, a memory, a quiet confidence. We curate authentic designer perfumes for men and women, and help every customer find the scent that feels like them. Every order is handled personally over WhatsApp, from selection to delivery.",
  whatsappNumber: "", phone: "", email: "", address: "", hours: "",
  instagram: "", facebook: "", tiktok: "", x: "",
  currency: "GH₵",
  deliveryInfo: "Delivery is available nationwide. Delivery fees and timelines depend on your location — send us a WhatsApp message or the contact form below and we will confirm the exact cost before you pay.",
  returnsInfo: "Because fragrances are sealed personal-care products, we cannot accept returns once a seal is broken. If your bottle arrives damaged or incorrect, contact us within 48 hours of delivery and we will make it right.",
};

const sizeSchema = new mongoose.Schema({ label: String, price: Number }, { _id: false });
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  brand: String, category: String, concentration: String, description: String,
  notesTop: String, notesHeart: String, notesBase: String,
  sizes: [sizeSchema],
  stock: Number, featured: Boolean, active: Boolean, images: [String],
}, { timestamps: true });
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String, image: String, order: Number,
}, { timestamps: true });
const settingSchema = new mongoose.Schema({ key: { type: String, unique: true } }, { strict: false, timestamps: true });
const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: String,
  role: { type: String, default: "admin" },
  lastLoginAt: Date,
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
const Setting = mongoose.models.Setting || mongoose.model("Setting", settingSchema);
const AdminUser = mongoose.models.AdminUser || mongoose.model("AdminUser", adminSchema);

console.log(`Connecting to ${MONGODB_URI.replace(/\/\/[^@]*@/, "//<credentials>@")} …`);
await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });

let createdCategories = 0, createdProducts = 0;
for (const cat of CATEGORIES) {
  const result = await Category.updateOne({ slug: cat.slug }, { $setOnInsert: cat }, { upsert: true });
  if (result.upsertedCount) createdCategories += 1;
}
for (const product of PRODUCTS) {
  const result = await Product.updateOne({ slug: product.slug }, { $setOnInsert: product }, { upsert: true });
  if (result.upsertedCount) createdProducts += 1;
}

const settingsResult = await Setting.updateOne({ key: "site" }, { $setOnInsert: DEFAULT_SETTINGS }, { upsert: true });

const adminCount = await AdminUser.countDocuments();
let adminMessage = "admin already exists — left unchanged";
if (adminCount === 0) {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    if ((process.env.ADMIN_PASSWORD ?? "").length < 10) {
      console.error("ADMIN_PASSWORD must be at least 10 characters. No admin created.");
      process.exitCode = 1;
    } else {
      const passwordHash = await bcrypt.hash(password, 12);
      await AdminUser.create({
        name: process.env.ADMIN_NAME || "Store Owner",
        email,
        passwordHash,
        role: "superadmin", // the seed-created bootstrap account is the store owner
      });
      adminMessage = `admin account created for ${email}`;
    }
  } else {
    adminMessage = "NO ADMIN CREATED — set ADMIN_EMAIL and ADMIN_PASSWORD, then re-run npm run seed (or use npm run create-admin)";
  }
}

console.log("Seed complete:");
console.log(`  categories: +${createdCategories} new (${CATEGORIES.length} in catalogue)`);
console.log(`  products:   +${createdProducts} new (${PRODUCTS.length} in catalogue)`);
console.log(`  settings:   ${settingsResult.upsertedCount ? "created with defaults" : "already present — left unchanged"}`);
console.log(`  admin:      ${adminMessage}`);

await mongoose.disconnect();
