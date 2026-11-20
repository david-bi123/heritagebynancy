"use client";

import { useActionState } from "react";
import {
  createTeamAccountAction,
  resetTeamAccountPasswordAction,
  removeTeamAccountAction,
  type ActionState,
} from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const field =
  "h-11 w-full rounded-xl border border-fig/15 bg-porcelain px-4 text-sm outline-none placeholder:text-fig/40 focus:border-rose focus:bg-white";
const smallLabel = "mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.3em] text-fig/55";

export interface TeamUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "superadmin";
  lastLoginAt: string | null;
  createdAt: string;
}

function CreateAccountForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createTeamAccountAction, { ok: false });
  const err = (name: string) => state.fieldErrors?.[name]?.[0];

  return (
    <form action={formAction} className="rounded-2xl border border-fig/10 bg-white p-6 shadow-[var(--shadow-card)]">
      <h2 className="font-display text-lg font-semibold text-fig">Invite an account</h2>
      <p className="mt-1 text-[11px] leading-5 text-fig/55">
        Creates a console account immediately. Share the password over a private channel — it is never stored in plain text.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={smallLabel}>Full name *</label>
          <input id="name" name="name" required placeholder="Nancy Mensah" className={err("name") ? `${field} border-rose-deep/60` : field} />
          {err("name") ? <p className="mt-1.5 text-xs text-rose-deep">{err("name")}</p> : null}
        </div>
        <div>
          <label htmlFor="email" className={smallLabel}>Email *</label>
          <input id="email" name="email" type="email" required placeholder="nancy@heritagebynancy.com" className={err("email") ? `${field} border-rose-deep/60` : field} />
          {err("email") ? <p className="mt-1.5 text-xs text-rose-deep">{err("email")}</p> : null}
        </div>
        <div>
          <label htmlFor="password" className={smallLabel}>Temporary password *</label>
          <input id="password" name="password" type="text" required minLength={10} placeholder="Min 10 chars, letters + numbers" autoComplete="off" className={err("password") ? `${field} border-rose-deep/60` : field} />
          {err("password") ? <p className="mt-1.5 text-xs text-rose-deep">{err("password")}</p> : null}
        </div>
        <div>
          <label htmlFor="role" className={smallLabel}>Role</label>
          <select id="role" name="role" defaultValue="admin" className={field}>
            <option value="admin">Store Admin (owner/staff)</option>
            <option value="superadmin">SamTech Super Admin</option>
          </select>
        </div>
      </div>
      {state.message ? (
        <p role="alert" className={cn(
          "mt-4 rounded-xl border px-4 py-3 text-sm",
          state.ok ? "border-wa-dark/30 bg-wa/10 text-wa-dark" : "border-rose-deep/30 bg-rose-deep/5 text-rose-deep",
        )}>
          {state.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-5 h-12 rounded-xl bg-fig px-8 text-[10px] font-bold uppercase tracking-[0.26em] text-champagne-light hover:bg-fig-lift disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create account"}
      </button>
    </form>
  );
}

function ResetPasswordForm({ id, name }: { id: string; name: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(resetTeamAccountPasswordAction, { ok: false });

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        const password = new FormData(event.currentTarget).get("password");
        if (typeof password !== "string" || password.length < 10) return;
        if (!window.confirm(`Reset the password for ${name}?`)) event.preventDefault();
      }}
      className="flex items-center gap-2"
    >
      <input type="hidden" name="id" value={id} />
      <input
        name="password"
        type="text"
        required
        minLength={10}
        placeholder="New password"
        aria-label={`New password for ${name}`}
        autoComplete="off"
        className="h-10 w-40 rounded-lg border border-fig/15 bg-porcelain px-3 text-xs outline-none focus:border-rose"
      />
      <button
        type="submit"
        disabled={pending}
        className="h-10 rounded-lg border border-fig/20 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-fig/70 hover:border-rose hover:text-rose-deep disabled:opacity-60"
      >
        {pending ? "…" : "Reset"}
      </button>
      {state.message ? (
        <span className={cn("text-[10px]", state.ok ? "text-wa-dark" : "text-rose-deep")}>
          {state.ok ? "Done" : state.message}
        </span>
      ) : null}
    </form>
  );
}

export function TeamManager({ users, currentUserId }: { users: TeamUser[]; currentUserId: string }) {
  return (
    <div className="space-y-8">
      <CreateAccountForm />

      <section className="overflow-x-auto rounded-2xl border border-fig/10 bg-white shadow-[var(--shadow-card)]">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-fig/10 text-[9px] font-bold uppercase tracking-[0.28em] text-fig/50">
              <th className="px-5 py-4">Account</th>
              <th className="px-5 py-4">Role</th>
              <th className="px-5 py-4">Last sign-in</th>
              <th className="px-5 py-4">Reset password</th>
              <th className="px-5 py-4 text-right">Remove</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-fig/8">
            {users.map((user) => {
              const isSelf = user.id === currentUserId;
              return (
                <tr key={user.id} className="align-middle transition-colors hover:bg-porcelain/60">
                  <td className="px-5 py-4">
                    <p className="font-semibold leading-snug text-fig">
                      {user.name}
                      {isSelf ? <span className="ml-2 rounded-full bg-champagne/20 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.2em] text-rose-deep">You</span> : null}
                    </p>
                    <p className="mt-0.5 text-[11px] text-fig/55">{user.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn(
                      "inline-flex rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em]",
                      user.role === "superadmin" ? "bg-fig text-champagne-light" : "bg-petal text-fig/70",
                    )}>
                      {user.role === "superadmin" ? "Super Admin" : "Store Admin"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-fig/60">
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                      : "Never"}
                  </td>
                  <td className="px-5 py-4">
                    <ResetPasswordForm id={user.id} name={user.name} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      {isSelf ? (
                        <span className="text-[10px] uppercase tracking-[0.2em] text-fig/30">—</span>
                      ) : (
                        <form
                          action={removeTeamAccountAction}
                          onSubmit={(event) => {
                            if (!window.confirm(`Remove ${user.name} (${user.email})? They will lose access immediately.`)) {
                              event.preventDefault();
                            }
                          }}
                        >
                          <input type="hidden" name="id" value={user.id} />
                          <button
                            type="submit"
                            aria-label={`Remove ${user.name}`}
                            className="flex h-10 w-10 items-center justify-center rounded-lg border border-rose-deep/25 text-rose-deep transition-colors hover:bg-rose-deep hover:text-porcelain"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-4 w-4" aria-hidden>
                              <path d="M4 7h16" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M6.5 7l1.2 13a2 2 0 0 0 2 1.8h4.6a2 2 0 0 0 2-1.8L17.5 7" />
                            </svg>
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
