import { redirect } from "next/navigation";
import { getCurrentUserProfile, hasRole } from "@/lib/rbac";
import { createClient } from "@/lib/supabase/server";
import DashboardLayoutClient from "./dashboard-layout-client";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication and role
  const profile = await getCurrentUserProfile();
  
  if (!profile) {
    redirect("/auth/login");
  }

  const hasDashboardAccess = await hasRole(["player", "admin"]);
  
  if (!hasDashboardAccess) {
    redirect("/?error=insufficient_permissions");
  }

  // Get player ID
  const supabase = await createClient();
  const { data: player } = await supabase
    .from('players')
    .select('id, slug')
    .eq('user_id', profile.id)
    .single();

  const playerId = player?.id || profile.player_id;
  const playerSlug = player?.slug;

  return (
    <DashboardLayoutClient profile={profile} playerId={playerId} playerSlug={playerSlug}>
      {children}
    </DashboardLayoutClient>
  );
}

