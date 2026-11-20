import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getSession } from "@/lib/auth";
import { clientIpFromHeaders, rateLimit } from "@/lib/rate-limit";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES: Record<string, "jpg" | "png" | "webp" | "avif"> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

function magicBytesMatch(buffer: Buffer, mime: string): boolean {
  if (mime === "image/jpeg") return buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (mime === "image/png")
    return buffer.length > 8 && buffer.readUInt32BE(0) === 0x89504e47 && buffer.readUInt32BE(4) === 0x0d0a1a0a;
  if (mime === "image/webp")
    return buffer.length > 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
  if (mime === "image/avif")
    return buffer.length > 12 && buffer.toString("ascii", 4, 8) === "ftyp";
  return false;
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Not authorised." }, { status: 401 });
  }

  const ip = clientIpFromHeaders(request.headers);
  const limit = rateLimit(`upload:${ip}`, 30, 60 * 60 * 1000);
  if (!limit.success) {
    return NextResponse.json({ ok: false, error: "Upload limit reached. Try again later." }, { status: 429 });
  }

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  const cloudinaryConfigured = Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);
  if (!cloudinaryConfigured) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Image uploads are not configured yet. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET — or paste an image URL instead.",
      },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Expected multipart form data." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file provided." }, { status: 400 });
  }
  if (file.size <= 0 || file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "Image must be between 1 byte and 5 MB." }, { status: 400 });
  }
  const mime = file.type.toLowerCase();
  if (!ALLOWED_TYPES[mime]) {
    return NextResponse.json({ ok: false, error: "Only JPEG, PNG, WebP or AVIF images are allowed." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!magicBytesMatch(buffer, mime)) {
    return NextResponse.json({ ok: false, error: "File content does not match an image format." }, { status: 400 });
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });

  try {
    const result = await new Promise<{ secure_url: string; width: number; height: number }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "heritage-by-nancy/products",
          resource_type: "image",
          overwrite: false,
          transformation: [{ width: 2000, height: 2500, crop: "limit", quality: "auto", fetch_format: "auto" }],
        },
        (error, uploadResult) => {
          if (error || !uploadResult) reject(error ?? new Error("Upload failed"));
          else resolve(uploadResult as { secure_url: string; width: number; height: number });
        },
      );
      stream.end(buffer);
    });

    return NextResponse.json({ ok: true, url: result.secure_url });
  } catch (error) {
    console.error("[api/admin/upload] Cloudinary upload failed:", error);
    return NextResponse.json(
      { ok: false, error: "The image host rejected the upload. Check Cloudinary credentials." },
      { status: 502 },
    );
  }
}
