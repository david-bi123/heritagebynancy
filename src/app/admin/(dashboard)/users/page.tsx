import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { isDatabaseConfigured, connectToDatabase } from "@/lib/db";
import { AdminUser } from "@/lib/models";
import { TeamManager, type TeamUser } from "@/components/team-manager";
import { AdminPageHeader } from "@/components/admin-page-header";
import { UsersIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ removed?: string; error?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (session.role !== "superadmin") redirect("/admin?error=team");

  const params = await searchParams;

  if (!isDatabaseConfigured()) {
    return (
      <p className="mx-auto max-w-xl rounded-2xl border border-champagne/40 bg-white p-8 text-sm text-fig/75">
        Team accounts live in MongoDB. Set <code className="rounded bg-petal px-1">MONGODB_URI</code> first.
      </p>
    );
  }

  let users: TeamUser[] = [];
  try {
    await connectToDatabase();
    const docs = await AdminUser.find().sort({ role: -1, name: 1 }).lean();
    users = docs.map((doc) => ({
      id: String(doc._id),
      name: doc.name,
      email: doc.email,
      role: doc.role === "superadmin" ? "superadmin" : "admin",
      lastLoginAt: doc.lastLoginAt ? new Date(doc.lastLoginAt).toISOString() : null,
      createdAt: new Date((doc as unknown as { createdAt?: Date }).createdAt ?? Date.now()).toISOString(),
    }));
  } catch (error) {
    console.error("[admin/users] failed:", error);
  }

  const errorMessages: Record<string, string> = {
    self: "You cannot remove your own account.",
    last: "This is the last super admin account — the site would lose its recovery access. Remove another super admin first.",
    role: "Only the SamTech Labs super admin can manage team accounts.",
    missing: "That account no longer exists.",
    db: "The database is not reachable.",
    id: "Invalid account reference.",
  };
  const banner = params.removed
    ? "Account removed — their access is revoked immediately."
    : params.error
      ? errorMessages[params.error] ?? `Something went wrong (${params.error}).`
      : null;

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        eyebrow="Access control"
        title="Team"
        description="SamTech Labs super admins hold recovery access and can manage these accounts. Store admins run the shop — products, categories, enquiries, settings and orders."
        action={
          <div className="flex items-center gap-2 rounded-full border border-fig/10 bg-white px-4 py-2.5 shadow-sm">
            <UsersIcon aria-hidden className="h-4 w-4 text-rose-deep" />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-fig/60">
              {users.length} {users.length === 1 ? "account" : "accounts"}
            </span>
          </div>
        }
      />

      {banner ? (
        <p role="status" className={cn(
          "mt-5 flex items-center gap-2.5 rounded-xl border px-5 py-3.5 text-[13px]",
          params.error ? "border-rose-deep/30 bg-rose-deep/5 text-rose-deep" : "border-wa-dark/30 bg-wa/10 text-wa-dark",
        )}>
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
          {banner}
        </p>
      ) : null}

      <div className="mt-7">
        <TeamManager users={users} currentUserId={session.userId} />
      </div>
    </div>
  );
}
