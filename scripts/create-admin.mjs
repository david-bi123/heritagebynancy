/**
 * Create or reset the admin account (bootstrap / password recovery).
 *
 *   node scripts/create-admin.mjs admin@example.com "NewStrongPassword" "Nancy"
 *   # or via environment: ADMIN_EMAIL=… ADMIN_PASSWORD=… ADMIN_NAME=… npm run create-admin
 *
 * - If the account does not exist, it is created.
 * - If it exists, its password is reset to the one given (use for recovery).
 * Password must be ≥ 10 chars with letters and numbers.
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { loadEnvLocal } from "./load-env.mjs";

loadEnvLocal();

const [, , argEmail, argPassword, argName, argRole] = process.argv;
const email = (argEmail ?? process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
const password = argPassword ?? process.env.ADMIN_PASSWORD ?? "";
const name = (argName ?? process.env.ADMIN_NAME ?? "Store Admin").trim();
const roleArg = (argRole ?? process.env.ADMIN_ROLE ?? "").trim().toLowerCase();

if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
  console.error("Provide a valid email: node scripts/create-admin.mjs admin@example.com \"Password\" [\"Name\"]");
  process.exit(1);
}
if (password.length < 10 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
  console.error("Password must be at least 10 characters and include letters and numbers.");
  process.exit(1);
}

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/heritagebynancy";

const adminSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: String,
    role: { type: String, default: "admin" },
    lastLoginAt: Date,
  },
  { timestamps: true },
);
const AdminUser = mongoose.models.AdminUser || mongoose.model("AdminUser", adminSchema);

console.log(`Connecting to ${MONGODB_URI.replace(/\/\/[^@]*@/, "//<credentials>@")} …`);
await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });

const adminCount = await AdminUser.countDocuments();
// First-ever account becomes the super admin (store owner); later ones default
// to staff (admin). Override with the role argument: admin | superadmin.
const role = roleArg === "superadmin" ? "superadmin" : roleArg === "admin" ? "admin" : adminCount === 0 ? "superadmin" : "admin";
if (roleArg && !["admin", "superadmin"].includes(roleArg)) {
  console.error("Role must be 'admin' or 'superadmin'.");
  process.exit(1);
}

const passwordHash = await bcrypt.hash(password, 12);
const existing = await AdminUser.findOne({ email });
if (existing) {
  existing.passwordHash = passwordHash;
  existing.name = name;
  if (roleArg) existing.role = role;
  await existing.save();
  console.log(`Password reset for existing admin ${email} (role: ${existing.role}).`);
} else {
  await AdminUser.create({ name, email, passwordHash, role });
  console.log(`Admin account created for ${email} (role: ${role}).`);
}

await mongoose.disconnect();
