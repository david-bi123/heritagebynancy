import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/db";
import { Enquiry } from "@/lib/models";
import { clientIpFromHeaders, rateLimit } from "@/lib/rate-limit";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  contact: z.string().trim().min(5).max(120),
  message: z.string().trim().min(10).max(3000),
  website: z.string().max(200).optional().default(""), // honeypot
});

export async function POST(request: Request) {
  // Honeypot: silently accept so bots think they succeeded.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please fill in your name, a reachable contact, and a message of at least 10 characters." },
      { status: 400 },
    );
  }
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const ip = clientIpFromHeaders(request.headers);
  const limit = rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000);
  if (!limit.success) {
    return NextResponse.json(
      { ok: false, error: "Too many messages from your connection. Please try again later or use WhatsApp." },
      { status: 429 },
    );
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "The contact service is not configured yet — please reach us on WhatsApp instead." },
      { status: 503 },
    );
  }

  try {
    await connectToDatabase();
    await Enquiry.create({
      name: parsed.data.name,
      contact: parsed.data.contact,
      message: parsed.data.message,
      source: "contact",
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/contact] failed to store enquiry:", error);
    return NextResponse.json(
      { ok: false, error: "We could not save your message right now. Please use WhatsApp — it always works." },
      { status: 500 },
    );
  }
}
