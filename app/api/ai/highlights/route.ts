import { NextRequest, NextResponse } from "next/server";

type YoutubeSearchResponse = {
  items?: Array<{
    id?: {
      videoId?: string;
    };
  }>;
};

type YoutubeVideosResponse = {
  items?: Array<{
    snippet?: {
      title?: string;
      thumbnails?: {
        default?: { url?: string };
        medium?: { url?: string };
        high?: { url?: string };
      };
    };
    contentDetails?: {
      duration?: string; // ISO 8601
    };
  }>;
};

function parseIsoDurationToSeconds(iso?: string | null): number | null {
  if (!iso) return null;
  // Very small ISO-8601 duration parser for patterns like PT4M32S, PT12M, PT45S
  const match = iso.match(
    /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/i
  );
  if (!match) return null;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const fullName = String(body?.fullName ?? "").trim();

    if (fullName.length < 2) {
      return NextResponse.json(
        { error: "Athlete name is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "YouTube AI search is not configured" },
        { status: 503 }
      );
    }

    const q = `${fullName} highlights`;
    const searchUrl =
      "https://www.googleapis.com/youtube/v3/search" +
      `?part=snippet&type=video&maxResults=1&safeSearch=strict&q=${encodeURIComponent(q)}&key=${encodeURIComponent(apiKey)}`;

    const searchResponse = await fetch(searchUrl, { method: "GET" });
    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      return NextResponse.json(
        { error: "Failed to search YouTube", details: errorText },
        { status: 502 }
      );
    }

    const searchData = (await searchResponse.json()) as YoutubeSearchResponse;
    const videoId = searchData?.items?.[0]?.id?.videoId;

    if (!videoId) {
      return NextResponse.json({ data: null });
    }

    // Fetch video details (title, thumbnails, duration)
    const videosUrl =
      "https://www.googleapis.com/youtube/v3/videos" +
      `?part=snippet,contentDetails&id=${encodeURIComponent(videoId)}&key=${encodeURIComponent(apiKey)}`;

    const videosResponse = await fetch(videosUrl, { method: "GET" });
    let title: string | undefined;
    let thumbnailUrl: string | undefined;
    let durationIso: string | undefined;
    let durationSeconds: number | null = null;

    if (videosResponse.ok) {
      const videosData = (await videosResponse.json()) as YoutubeVideosResponse;
      const video = videosData?.items?.[0];
      title = video?.snippet?.title;
      thumbnailUrl =
        video?.snippet?.thumbnails?.high?.url ||
        video?.snippet?.thumbnails?.medium?.url ||
        video?.snippet?.thumbnails?.default?.url;
      durationIso = video?.contentDetails?.duration;
      durationSeconds = parseIsoDurationToSeconds(durationIso ?? null);
    }

    return NextResponse.json({
      data: {
        url: `https://www.youtube.com/watch?v=${videoId}`,
        title: title ?? null,
        thumbnailUrl: thumbnailUrl ?? null,
        duration: {
          iso8601: durationIso ?? null,
          seconds: durationSeconds,
        },
      },
    });
  } catch (error) {
    console.error("Error in AI highlights search:", error);
    return NextResponse.json(
      { error: "Failed to search highlights" },
      { status: 500 }
    );
  }
}
