import { NextResponse } from "next/server";
import { getCurrentUserProfile } from "@/lib/rbac";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const profile = await getCurrentUserProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();
    const { data: users, error } = await supabase
      .from("profiles")
      .select("id, username, full_name, avatar_url, role")
      .in("role", ["player", "publisher", "fan", "admin"])
      .neq("id", profile.id) // Exclude current user
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    return NextResponse.json({ users: users || [] });
  } catch (error) {
    console.error("Error in users GET:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
