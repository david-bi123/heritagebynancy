import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface Cache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var _mongooseCache: Cache | undefined;
}

const cache: Cache = global._mongooseCache ?? { conn: null, promise: null };
if (process.env.NODE_ENV !== "production") {
  global._mongooseCache = cache;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(MONGODB_URI && MONGODB_URI.trim().length > 0);
}

/**
 * Connect to MongoDB (Atlas in production, local mongod for development).
 * Throws when MONGODB_URI is missing — callers that can operate without a
 * database should use isDatabaseConfigured() and fall back gracefully.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Add it to your environment (see .env.example).",
    );
  }
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
    });
  }
  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null;
    throw error;
  }
  return cache.conn;
}
