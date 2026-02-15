import { NextRequest, NextResponse } from "next/server";

type EnrichAwardsReq = {
  fullName: string;
  school?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<EnrichAwardsReq>;
    const fullName = (body.fullName ?? "").trim();

    if (!fullName) {
      return NextResponse.json(
        { error: "fullName is required" },
        { status: 400 }
      );
    }

    // TODO: Plug in awards/honors source (e.g. Wikipedia infobox, sports DB, or AI)
    // Return structured text for the "Awards / Honors" block.
    const awards: string | null = null;

    return NextResponse.json({
      ok: true,
      found: Boolean(awards),
      awards,
    });
  } catch (error) {
    console.error("Error enriching awards:", error);
    return NextResponse.json(
      { error: "Failed to enrich awards" },
      { status: 500 }
    );
  }
}
