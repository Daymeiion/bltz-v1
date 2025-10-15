import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/rbac";

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
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
