import { NextRequest, NextResponse } from "next/server";

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
  const match = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/i);
  if (!match) return null;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

function extractVideoId(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // If it's already just an ID-like token
  if (/^[a-zA-Z0-9_-]{6,}$/.test(trimmed) && !trimmed.includes("://")) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const host = url.hostname.toLowerCase();

    if (host.includes("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v) return v;

      const parts = url.pathname.split("/").filter(Boolean);
      // /shorts/{id} or /embed/{id}
      if (parts.length >= 2 && (parts[0] === "shorts" || parts[0] === "embed")) {
        return parts[1];
      }
    }

    if (host === "youtu.be") {
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts[0]) return parts[0];
    }
  } catch {
    // not a URL, ignore
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawUrl = String(body?.url ?? "").trim();

    if (!rawUrl) {
      return NextResponse.json(
        { error: "URL is required" },
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

    const videoId = extractVideoId(rawUrl);
    if (!videoId) {
      return NextResponse.json(
        { error: "Could not extract YouTube video ID from URL" },
        { status: 400 }
      );
    }

    const videosUrl =
      "https://www.googleapis.com/youtube/v3/videos" +
      `?part=snippet,contentDetails&id=${encodeURIComponent(videoId)}&key=${encodeURIComponent(apiKey)}`;

    const videosResponse = await fetch(videosUrl, { method: "GET" });
    if (!videosResponse.ok) {
      const errorText = await videosResponse.text();
      return NextResponse.json(
        { error: "Failed to fetch YouTube metadata", details: errorText },
        { status: 502 }
      );
    }

    const videosData = (await videosResponse.json()) as YoutubeVideosResponse;
    const video = videosData?.items?.[0];
    if (!video) {
      return NextResponse.json({ data: null });
    }

    const title = video.snippet?.title ?? null;
    const thumbnailUrl =
      video.snippet?.thumbnails?.high?.url ||
      video.snippet?.thumbnails?.medium?.url ||
      video.snippet?.thumbnails?.default?.url ||
      null;

    const durationIso = video.contentDetails?.duration ?? null;
    const durationSeconds = parseIsoDurationToSeconds(durationIso);

    return NextResponse.json({
      data: {
        url: `https://www.youtube.com/watch?v=${videoId}`,
        title,
        thumbnailUrl,
        duration: {
          iso8601: durationIso,
          seconds: durationSeconds,
        },
      },
    });
  } catch (error) {
    console.error("Error in YouTube metadata fetch:", error);
    return NextResponse.json(
      { error: "Failed to fetch YouTube metadata" },
      { status: 500 }
    );
  }
}

