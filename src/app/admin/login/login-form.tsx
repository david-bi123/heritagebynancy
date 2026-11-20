"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction, type ActionState } from "@/app/admin/actions";
import {
  EyeIcon,
  EyeOffIcon,
  LoaderIcon,
  LockIcon,
  MailIcon,
} from "@/components/icons";

const initialState: ActionState = { ok: false };

const field =
  "h-13 w-full rounded-xl border border-blush bg-white pl-11 pr-4 text-sm text-fig outline-none transition placeholder:text-fig/35 focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20";

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const hasError = Boolean(state?.message);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      <div>
        <label htmlFor="email" className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.3em] text-fig/55">
          Email address
        </label>
        <div className="relative">
          <MailIcon
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-rose-deep/60"
          />
          <input
            ref={emailRef}
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="you@heritagebynancy.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={hasError || undefined}
            className={field}
          />
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="block text-[9px] font-semibold uppercase tracking-[0.3em] text-fig/55">
            Password
          </label>
          <span className="text-[9px] uppercase tracking-[0.18em] text-fig/35">Case sensitive</span>
        </div>
        <div className="relative">
          <LockIcon
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-rose-deep/60"
          />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={hasError || undefined}
            aria-describedby={capsLock ? "caps-lock-hint" : undefined}
            onKeyUp={(event) => setCapsLock(event.getModifierState?.("CapsLock") ?? false)}
            onKeyDown={(event) => setCapsLock(event.getModifierState?.("CapsLock") ?? false)}
            className={`${field} pr-21`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            title={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 flex h-9 -translate-y-1/2 items-center gap-1.5 rounded-lg px-2 text-[8.5px] font-bold uppercase tracking-[0.14em] text-fig/50 transition-colors hover:bg-petal hover:text-rose-deep focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-rose-deep"
          >
            {showPassword ? <EyeOffIcon className="h-[17px] w-[17px]" /> : <EyeIcon className="h-[17px] w-[17px]" />}
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {capsLock ? (
          <p id="caps-lock-hint" className="mt-1.5 text-[11px] font-medium text-rose-deep">
            Caps Lock is on.
          </p>
        ) : null}
      </div>

      {state?.message ? (
        <p
          role="alert"
          className="rise flex items-start gap-2.5 rounded-xl border border-rose-deep/25 bg-rose-soft/60 px-4 py-3 text-[13px] leading-5 text-rose-deep"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5M12 16.5v.01" />
          </svg>
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="group relative mt-2 flex h-13 w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-br from-rose to-rose-deep px-6 text-[11px] font-bold uppercase tracking-[0.26em] text-white shadow-[0_18px_40px_-14px_rgb(150_85_95/0.75)] ring-1 ring-rose-deep/20 transition-all hover:brightness-110 hover:shadow-[0_22px_50px_-12px_rgb(150_85_95/0.85)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span
          aria-hidden
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
        {pending ? <LoaderIcon className="relative h-4 w-4" /> : null}
        <span className="relative">{pending ? "Signing in…" : "Sign in to the atelier"}</span>
      </button>

      <p className="pt-1 text-center text-[10px] leading-5 text-fig/40">
        By continuing you agree to keep customer details confidential.
      </p>
    </form>
  );
}
