import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/team/invites
 * Get invites (sent or received based on query param)
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
    const type = searchParams.get("type") || "sent"; // 'sent' or 'received'

    if (type === "sent") {
      // Get sent invites
      const { data: invites, error } = await supabase
        .from("team_invites")
        .select(`
          *,
          inviter:profiles!team_invites_inviter_user_id_fkey(
            display_name,
            avatar_url
          ),
          inviter_player:players!team_invites_inviter_player_id_fkey(
            name,
            full_name,
            profile_image
          )
        `)
        .eq("inviter_user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching sent invites:", error);
        return NextResponse.json({ error: "Failed to fetch invites" }, { status: 500 });
      }

      return NextResponse.json({ invites: invites || [] });
    } else {
      // Get received invites
      const { data: profile } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", user.id)
        .single();

      if (!profile?.email) {
        return NextResponse.json({ invites: [] });
      }

      const { data: invites, error } = await supabase
        .from("team_invites")
        .select(`
          *,
          inviter:profiles!team_invites_inviter_user_id_fkey(
            display_name,
            avatar_url
          ),
          inviter_player:players!team_invites_inviter_player_id_fkey(
            name,
            full_name,
            profile_image
          )
        `)
        .eq("invitee_email", profile.email)
        .eq("status", "pending")
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching received invites:", error);
        return NextResponse.json({ error: "Failed to fetch invites" }, { status: 500 });
      }

      return NextResponse.json({ invites: invites || [] });
    }
  } catch (error) {
    console.error("Error in invites route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/team/invites
 * Send a new invite
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
      .select("player_id")
      .eq("id", user.id)
      .single();

    // Parse request body
    const body = await request.json();
    const { invitee_email, invitee_name, message } = body;

    if (!invitee_email) {
      return NextResponse.json({ error: "invitee_email is required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(invitee_email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Check if user is already on bltz
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("email", invitee_email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "This user is already on bltz! You can add them as a teammate instead." },
        { status: 400 }
      );
    }

    // Create invite
    const { data, error } = await supabase
      .from("team_invites")
      .insert({
        inviter_user_id: user.id,
        inviter_player_id: profile?.player_id || null,
        invitee_email,
        invitee_name,
        message,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating invite:", error);
      return NextResponse.json({ error: "Failed to send invite" }, { status: 500 });
    }

    // TODO: Send email notification to invitee
    // This would typically use a service like SendGrid, Resend, etc.

    return NextResponse.json({ invite: data }, { status: 201 });
  } catch (error) {
    console.error("Error in invites route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/team/invites
 * Update invite status (accept/decline)
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { invite_id, status } = body;

    if (!invite_id || !status) {
      return NextResponse.json({ error: "invite_id and status are required" }, { status: 400 });
    }

    if (!["accepted", "declined"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Update invite status
    const { data, error } = await supabase
      .from("team_invites")
      .update({
        status,
        accepted_at: status === "accepted" ? new Date().toISOString() : null,
      })
      .eq("id", invite_id)
      .select()
      .single();

    if (error) {
      console.error("Error updating invite:", error);
      return NextResponse.json({ error: "Failed to update invite" }, { status: 500 });
    }

    return NextResponse.json({ invite: data });
  } catch (error) {
    console.error("Error in invites route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

