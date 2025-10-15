import { NextResponse } from "next/server";
import { getLocationBreakdown } from "@/lib/queries/analytics";
import { getCurrentUserProfile } from "@/lib/rbac";

export async function GET() {
  try {
    const profile = await getCurrentUserProfile();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const data = await getLocationBreakdown();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching location data:", error);
    return NextResponse.json(
      { error: "Failed to fetch location data" },
      { status: 500 }
    );
  }
}

