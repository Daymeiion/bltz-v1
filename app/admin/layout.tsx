import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/rbac";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentUserProfile();

  // Check if user is admin
  if (!profile || profile.role !== "admin") {
    redirect("/?error=admin_access_required");
  }

  return (
    <div className="flex min-h-screen w-full bg-black">
      <AdminSidebar />
      <main className="flex-1 md:pt-0 pt-16">
        {children}
      </main>
    </div>
  );
}
