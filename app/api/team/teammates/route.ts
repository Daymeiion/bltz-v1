import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/team/teammates
 * Get all teammates for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("player_id")
      .eq("id", user.id)
      .single();

    if (!profile?.player_id) {
      return NextResponse.json({ teammates: [] });
    }

    // Get teammates with player details
    const { data: teammates, error } = await supabase
      .from("player_teammates")
      .select(`
        id,
        player_id,
        teammate_player_id,
        games_played_together,
        last_played_together,
        teammate:players!player_teammates_teammate_player_id_fkey(
          id,
          name,
          full_name,
          profile_image,
          position,
          team,
          slug,
          user_id
        )
      `)
      .eq("player_id", profile.player_id)
      .order("last_played_together", { ascending: false, nullsFirst: false });

    if (error) {
      console.error("Error fetching teammates:", error);
      return NextResponse.json({ error: "Failed to fetch teammates" }, { status: 500 });
    }

    return NextResponse.json({ teammates: teammates || [] });
  } catch (error) {
    console.error("Error in teammates route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/team/teammates
 * Add a new teammate
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("player_id, role")
      .eq("id", user.id)
      .single();

    if (!profile?.player_id || profile.role !== "player") {
      return NextResponse.json({ error: "Only players can add teammates" }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { teammate_player_id, games_played_together, last_played_together } = body;

    if (!teammate_player_id) {
      return NextResponse.json({ error: "teammate_player_id is required" }, { status: 400 });
    }

    // Add teammate relationship
    const { data, error } = await supabase
      .from("player_teammates")
      .insert({
        player_id: profile.player_id,
        teammate_player_id,
        games_played_together: games_played_together || 0,
        last_played_together: last_played_together || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding teammate:", error);
      return NextResponse.json({ error: "Failed to add teammate" }, { status: 500 });
    }

    return NextResponse.json({ teammate: data }, { status: 201 });
  } catch (error) {
    console.error("Error in teammates route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/team/teammates
 * Remove a teammate
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get teammate_id from query params
    const { searchParams } = new URL(request.url);
    const teammateId = searchParams.get("id");

    if (!teammateId) {
      return NextResponse.json({ error: "teammate id is required" }, { status: 400 });
    }

    // Delete the teammate relationship
    const { error } = await supabase
      .from("player_teammates")
      .delete()
      .eq("id", teammateId);

    if (error) {
      console.error("Error removing teammate:", error);
      return NextResponse.json({ error: "Failed to remove teammate" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in teammates route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

