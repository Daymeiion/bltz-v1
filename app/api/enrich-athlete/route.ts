import { NextRequest, NextResponse } from "next/server";
import type { IdentityDraft } from "@/types/locker";

type EnrichAthleteRequestBody = {
  identity: IdentityDraft;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<EnrichAthleteRequestBody>;
    const identity = body.identity;

    if (!identity || !identity.fullName?.trim()) {
      return NextResponse.json(
        { error: "Missing or invalid identity (fullName required)" },
        { status: 400 }
      );
    }

    // TODO: Plug in AI enrichment here (highlights, bio, links, etc.)
    // Example shape of enriched data you might return:
    const enriched = {
      fullName: identity.fullName.trim(),
      level: identity.level,
      suggestions: {
        // e.g. pre-generated block content, social links, etc.
      },
    };

    return NextResponse.json({ data: enriched });
  } catch (error) {
    console.error("Error enriching athlete:", error);
    return NextResponse.json(
      { error: "Failed to enrich athlete" },
      { status: 500 }
    );
  }
}

