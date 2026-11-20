import { SignJWT, jwtVerify } from "jose";

/**
 * Edge-safe session token signing/verification (no next/headers imports),
 * shared by the root proxy (optimistic gate) and server-side auth helpers.
 */

export const SESSION_COOKIE = "hbn_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

export type AdminRole = "admin" | "superadmin";

export interface AdminSession {
  userId: string;
  email: string;
  name: string;
  role: AdminRole;
}

function sessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) return new TextEncoder().encode(secret);
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET is missing or shorter than 32 characters. Set it in your environment (see .env.example).",
    );
  }
  // Development-only fallback so `next dev` works out of the box. Never used in production.
  return new TextEncoder().encode("development-only-insecure-session-secret-change-me");
}

export async function createSessionToken(session: AdminSession): Promise<string> {
  return new SignJWT({ email: session.email, name: session.name, role: session.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(sessionSecret());
}

export async function verifySessionToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, sessionSecret());
    if (!payload.sub || typeof payload.email !== "string") return null;
    return {
      userId: payload.sub,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : "Admin",
      role: payload.role === "superadmin" ? "superadmin" : "admin",
    };
  } catch {
    return null;
  }
}
