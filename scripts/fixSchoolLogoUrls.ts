import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role for bulk updates
);

function extractFileName(url: string) {
  // matches ...#/media/File:Oregon_Ducks_logo.svg
  const m = url.match(/#\/media\/File:([^?#]+)/i);
  if (!m) return null;
  return decodeURIComponent(m[1]);
}

async function resolveWikipediaFileToDirectUrl(filename: string) {
  // Wikipedia API for file info (direct URL lives under imageinfo[0].url)
  const api = `https://en.wikipedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(
    filename
  )}&prop=imageinfo&iiprop=url&format=json&origin=*`;

  const res = await fetch(api);
  if (!res.ok) throw new Error(`Wikipedia API failed: ${res.status}`);

  const json: any = await res.json();
  const pages = json?.query?.pages;
  const page = pages ? pages[Object.keys(pages)[0]] : null;
  const directUrl = page?.imageinfo?.[0]?.url as string | undefined;
  return directUrl || null;
}

function toWikimediaPngThumb(url: string, width = 256) {
  try {
    const u = new URL(url);
    const isWikimedia = u.hostname.includes("upload.wikimedia.org");
    const isSvg = u.pathname.toLowerCase().endsWith(".svg");
    if (!isWikimedia || !isSvg) return url;

    const parts = u.pathname.split("/").filter(Boolean); // wikipedia/en/4/4e/File.svg
    const fileName = parts[parts.length - 1];
    const wikipediaIdx = parts.indexOf("wikipedia");
    if (wikipediaIdx === -1) return url;

    const lang = parts[wikipediaIdx + 1];
    const hashPath = parts.slice(wikipediaIdx + 2, parts.length - 1).join("/");

    return `https://upload.wikimedia.org/wikipedia/${lang}/thumb/${hashPath}/${fileName}/${width}px-${fileName}.png`;
  } catch {
    return url;
  }
}

async function main() {
  const { data: rows, error } = await supabase
    .from("schools")
    .select("id, canonical_name, logo_url")
    .ilike("logo_url", "%wikipedia.org/%#/media/File:%")
    .limit(1000);

  if (error) throw error;

  console.log(`Found ${rows?.length ?? 0} rows to fix`);

  for (const row of rows || []) {
    const badUrl = row.logo_url as string;
    const filename = extractFileName(badUrl);
    if (!filename) continue;

    try {
      const direct = await resolveWikipediaFileToDirectUrl(filename);
      if (!direct) {
        console.warn(`No direct URL for ${row.canonical_name} (${filename})`);
        continue;
      }

      // Optional: convert svg to png thumb for easier display
      const finalUrl = toWikimediaPngThumb(direct, 256);

      const { error: upErr } = await supabase
        .from("schools")
        .update({ logo_url: finalUrl })
        .eq("id", row.id);

      if (upErr) throw upErr;

      console.log(`✅ ${row.canonical_name}: ${finalUrl}`);
    } catch (e: any) {
      console.error(`❌ ${row.canonical_name}: ${e.message}`);
    }
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
