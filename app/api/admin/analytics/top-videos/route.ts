import { NextRequest, NextResponse } from "next/server";
import { getTopVideos } from "@/lib/queries/analytics";
import { getCurrentUserProfile } from "@/lib/rbac";

export async function GET(request: NextRequest) {
  try {
    const profile = await getCurrentUserProfile();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "5");

    const data = await getTopVideos(limit);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching top videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch top videos" },
      { status: 500 }
    );
  }
}

