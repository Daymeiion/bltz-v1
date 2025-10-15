import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/team/search?q=search_query
 * Search for players by name
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json({ players: [] });
    }

    // Search for players with accounts
    const { data: players, error } = await supabase
      .from("players")
      .select("id, name, full_name, profile_image, position, team, slug, user_id")
      .or(`name.ilike.%${query}%,full_name.ilike.%${query}%`)
      .not("user_id", "is", null)
      .limit(20);

    if (error) {
      console.error("Error searching players:", error);
      return NextResponse.json({ error: "Failed to search players" }, { status: 500 });
    }

    return NextResponse.json({ players: players || [] });
  } catch (error) {
    console.error("Error in search route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

