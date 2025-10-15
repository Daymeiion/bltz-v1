import { NextResponse } from "next/server";
import { getCurrentUserProfile } from "@/lib/rbac";
import { getPlayerVideos, createVideo } from "@/lib/queries/videos";
import { getTeamVideosCount } from "@/lib/queries/revenue";
import { createClient } from "@/lib/supabase/server";

// GET - Fetch all videos for the player
export async function GET() {
  try {
    const profile = await getCurrentUserProfile();
    
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get player ID
    const supabase = await createClient();
    const { data: player } = await supabase
      .from('players')
      .select('id')
      .eq('user_id', profile.id)
      .single();

    const playerId = player?.id || profile.player_id;

    if (!playerId) {
      return NextResponse.json({ 
        videos: [], 
        playerId: '', 
        userId: profile.id 
      });
    }

    const videos = await getPlayerVideos(playerId);

    // Get team videos count (videos from same school/years where player is tagged)
    const teamVideosCount = await getTeamVideosCount(playerId);

    return NextResponse.json({
      videos,
      playerId,
      userId: profile.id,
      teamVideosCount,
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

// POST - Create a new video
export async function POST(request: Request) {
  try {
    const profile = await getCurrentUserProfile();
    
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    const video = await createVideo({
      player_id: body.player_id,
      owner_user_id: body.owner_user_id,
      title: body.title,
      description: body.description,
      thumbnail_url: body.thumbnail_url,
      playback_url: body.playback_url,
      duration_seconds: body.duration_seconds,
      tags: body.tags,
      visibility: body.visibility,
    });

    return NextResponse.json({ video });
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}

