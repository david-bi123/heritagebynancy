import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { isDatabaseConfigured, connectToDatabase } from "@/lib/db";
import { Enquiry } from "@/lib/models";
import { AdminShell } from "@/components/admin-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Console",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  let newEnquiries = 0;
  if (isDatabaseConfigured()) {
    try {
      await connectToDatabase();
      newEnquiries = await Enquiry.countDocuments({ status: "new" });
    } catch {
      newEnquiries = 0;
    }
  }

  return (
    <AdminShell userName={session.name || session.email} newEnquiries={newEnquiries} role={session.role}>
      {children}
    </AdminShell>
  );
}
