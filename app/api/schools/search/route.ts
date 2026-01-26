import { NextRequest, NextResponse } from "next/server";
import { searchSchoolsAutocomplete } from "@/lib/db/schools";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const limit = searchParams.get("limit");
    const league = searchParams.get("league");
    const orgType = searchParams.get("orgType");
    const division = searchParams.get("division");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    const results = await searchSchoolsAutocomplete(query, {
      limit: limit ? parseInt(limit, 10) : undefined,
      league: league as "NCAA" | "NFL" | "CFL" | null | undefined,
      orgType: orgType as "college" | "pro" | null | undefined,
      division: division || null,
    });

    return NextResponse.json({ data: results });
  } catch (error) {
    console.error("Error searching schools:", error);
    return NextResponse.json(
      { error: "Failed to search schools" },
      { status: 500 }
    );
  }
}
