"use client";

import { useState, type FormEvent } from "react";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm({ businessName }: { businessName: string }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorDetail, setErrorDetail] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrorDetail("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, message, website: honeypot }),
      });
      const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (response.ok && data?.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
        setErrorDetail(data?.error ?? "We could not send your message right now.");
      }
    } catch {
      setStatus("error");
      setErrorDetail("Network error — please check your connection and try again.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-wa-dark/30 bg-wa/10 p-8 text-center" role="status">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-wa text-white">
          <CheckIcon className="h-7 w-7" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold text-fig">Message received.</h2>
        <p className="mt-2 text-sm leading-7 text-fig/70">
          Thank you, {name.split(" ")[0] || "friend"}. {businessName} will get back to you shortly —
          usually within the day. For the fastest response, simply tap the WhatsApp button.
        </p>
        <button
          type="button"
          onClick={() => {
            setName(""); setContact(""); setMessage(""); setStatus("idle");
          }}
          className="mt-6 text-[11px] font-bold uppercase tracking-[0.24em] text-rose-deep underline-offset-4 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  const field =
    "h-12 w-full rounded-xl border border-fig/15 bg-porcelain px-4 text-sm outline-none transition focus:border-rose focus:ring-2 focus:ring-rose/25 focus:bg-white placeholder:text-fig/40";

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate={false}>
      {/* Honeypot — invisible to humans */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.24em] text-fig/60">
            Your name
          </label>
          <input id="name" name="name" required minLength={2} maxLength={120} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ama Serwaa" className={field} />
        </div>
        <div>
          <label htmlFor="contact" className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.24em] text-fig/60">
            Phone / WhatsApp / Email
          </label>
          <input id="contact" name="contact" required minLength={5} maxLength={120} value={contact} onChange={(e) => setContact(e.target.value)} placeholder="How should we reach you?" className={field} />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.24em] text-fig/60">
          Your message
        </label>
        <textarea id="message" name="message" required minLength={10} maxLength={3000} rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us the fragrance, size or budget you have in mind…" className={`${field} h-auto min-h-[120px] py-3`} />
      </div>

      {status === "error" ? (
        <p role="alert" className="rounded-xl border border-rose-deep/30 bg-rose-deep/5 px-4 py-3 text-sm text-rose-deep">
          {errorDetail}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-fig-lift to-rose-deep px-6 py-4 text-xs font-bold uppercase tracking-[0.24em] text-white shadow-[var(--shadow-card)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {status === "sending" ? "Sending…" : (<>Send message <ArrowRightIcon className="h-4 w-4" /></>)}
      </button>
    </form>
  );
}
