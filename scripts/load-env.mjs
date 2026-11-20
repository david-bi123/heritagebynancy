/**
 * Minimal .env.local loader shared by the CLI scripts (no dotenv dependency).
 *
 * Precedence mirrors Next.js:
 *  - variables already present in the real environment always win;
 *  - inside the file, the last definition of a key wins (so overriding an
 *    earlier line lower down, as you would in Next, behaves the same here).
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

export function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  const inherited = new Set(Object.keys(process.env));
  try {
    for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
      if (!line.trim() || line.trim().startsWith("#")) continue;
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!match) continue;
      const [, key, raw] = match;
      if (inherited.has(key)) continue;
      process.env[key] = raw.replace(/^["']|["']$/g, "").trim();
    }
  } catch (error) {
    console.warn("Could not parse .env.local:", error?.message ?? error);
  }
}
