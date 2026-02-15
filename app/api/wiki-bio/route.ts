import { NextResponse } from "next/server";

type WikiBioReq = {
  fullName: string;
  school?: string;
  charLimit?: number; // optional override
};

function safeTrim(s: string, limit: number) {
  const clean = (s || "").replace(/\s+/g, " ").trim();
  if (clean.length <= limit) return clean;
  const cut = clean.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 60 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

function makeQuery(fullName: string) {
  // Disambiguate by sport: e.g. "Dashon Goldson american football player"
  return `${fullName} american football player`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as WikiBioReq;
    const fullName = (body.fullName || "").trim();
    const charLimit = Math.min(Math.max(body.charLimit ?? 280, 120), 600);

    if (!fullName) {
      return NextResponse.json({ error: "fullName is required" }, { status: 400 });
    }

    // 1) Search best Wikipedia page title (e.g. "Dashon Goldson american football player")
    const queriesToTry = [makeQuery(fullName), fullName];
    const ua = "BLTZ/1.0 (contact: support@bltz.me)";
    let title: string | null = null;
    let qUsed = "";

    for (const q of queriesToTry) {
      qUsed = q;
      const searchUrl = new URL("https://en.wikipedia.org/w/rest.php/v1/search/title");
      searchUrl.searchParams.set("q", q);
      searchUrl.searchParams.set("limit", "5");

      const searchRes = await fetch(searchUrl.toString(), {
        headers: { "User-Agent": ua },
        cache: "no-store",
      });

      if (!searchRes.ok) continue;

      const searchJson: any = await searchRes.json();
      const top = searchJson?.pages?.[0];
      if (top?.title) {
        title = top.title as string;
        break;
      }
    }

    if (!title) {
      return NextResponse.json({
        ok: true,
        found: false,
        query: qUsed,
        bio: null,
      });
    }

    // 2) Fetch summary for that title
    const sumUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const sumRes = await fetch(sumUrl, {
      headers: { "User-Agent": "BLTZ/1.0 (contact: support@bltz.me)" },
      cache: "no-store",
    });

    if (!sumRes.ok) {
      const text = await sumRes.text();
      return NextResponse.json({ error: "Wikipedia summary failed", details: text }, { status: 502 });
    }

    const sumJson: any = await sumRes.json();

    const extract = sumJson?.extract || "";
    const bio = extract ? safeTrim(extract, charLimit) : null;

    return NextResponse.json({
      ok: true,
      found: Boolean(bio),
      query: qUsed,
      page: {
        title,
        url: sumJson?.content_urls?.desktop?.page ?? null,
        thumbnail: sumJson?.thumbnail ?? null,
      },
      bio,
      charLimit,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
