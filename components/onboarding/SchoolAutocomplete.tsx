"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SchoolResult = {
  id: string;
  canonical_name: string;
  short_name: string | null;
  division: string | null;
  conference: string | null;
  city: string | null;
  state: string | null;
  primary_color_hex: string | null;
  secondary_color_hex: string | null;
  logo_url: string | null;
};

function getFullLogoUrl(logoUrl: string | null, schoolName?: string): string | null {
  if (!logoUrl) return null;
  
  // If it's already a full URL, return as is
  if (logoUrl.startsWith("http://") || logoUrl.startsWith("https://")) {
    return logoUrl;
  }
  
  // Handle paths like /v1/AUTH_mw/wikipedia-en-local-public.f1/f/f1/Utah_Utes_logo.svg
  // Extract the filename and construct Wikipedia URL
  if (logoUrl.includes(".svg") || logoUrl.includes(".png") || logoUrl.includes(".jpg")) {
    // Extract filename from path (e.g., "Utah_Utes_logo.svg" from "/v1/AUTH_mw/.../Utah_Utes_logo.svg")
    const filenameMatch = logoUrl.match(/([^/]+\.(svg|png|jpg|jpeg))$/i);
    if (filenameMatch) {
      const filename = filenameMatch[1];
      // Construct Wikipedia URL: https://en.wikipedia.org/wiki/[School]_football#/media/File:[Logo]
      // Try to extract school name from filename or use provided schoolName
      let schoolSlug = schoolName?.replace(/\s+/g, "_") || filename.replace(/_logo\.(svg|png|jpg|jpeg)$/i, "").replace(/_/g, "_");
      // Clean up the school slug (remove common suffixes)
      schoolSlug = schoolSlug.replace(/_logo$/, "").replace(/_football$/, "");
      return `https://en.wikipedia.org/wiki/${schoolSlug}_football#/media/File:${filename}`;
    }
  }
  
  // Fallback: try Supabase storage URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ihjeerskfllrliggqias.supabase.co";
  
  if (logoUrl.startsWith("/v1/AUTH_mw/")) {
    const bucketAndPath = logoUrl.slice(12);
    return `${supabaseUrl}/storage/v1/object/public/${bucketAndPath}`;
  }
  
  if (logoUrl.startsWith("/")) {
    const path = logoUrl.slice(1);
    return `${supabaseUrl}/storage/v1/object/public/${path}`;
  }
  
  return `${supabaseUrl}/storage/v1/object/public/${logoUrl}`;
}

export function SchoolAutocomplete({
  value,
  onSelect,
  placeholder = "Search your school (e.g., Oregon State)…",
}: {
  value: string;
  onSelect: (school: {
    schoolId: string;
    schoolName: string;
    city?: string | null;
    state?: string | null;
    conference?: string | null;
    division?: string | null;
    logoUrl?: string | null;
    primaryColorHex?: string | null;
    secondaryColorHex?: string | null;
  }) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<SchoolResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string>("");

  const activeReq = useRef(0);

  useEffect(() => setQuery(value), [value]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    const reqId = ++activeReq.current;
    setLoading(true);
    setSearchError("");

    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/schools/search?q=${encodeURIComponent(q)}&limit=10`, {
          method: "GET",
        });
        if (!res.ok) {
          let errorMessage = `Search failed: ${res.status}`;
          try {
            const json = await res.json();
            if (json?.error) errorMessage = json.error;
          } catch {
            // Ignore JSON parse errors and keep status-based fallback message.
          }
          throw new Error(errorMessage);
        }
        const json = await res.json();
        if (reqId !== activeReq.current) return;

        const results = json.data || [];
        console.log("Search results:", results);
        // Log logo URLs for debugging
        results.forEach((r: SchoolResult, idx: number) => {
          if (r.logo_url) {
            console.log(`School ${idx} logo_url:`, r.logo_url);
          }
        });
        setResults(results);
        setOpen(results.length > 0);
      } catch (error) {
        if (reqId !== activeReq.current) return;
        console.error("Error in school search:", error);
        const message = error instanceof Error ? error.message : "Search unavailable";
        setSearchError(message);
        setResults([]);
        setOpen(false);
      } finally {
        if (reqId === activeReq.current) setLoading(false);
      }
    }, 180);

    return () => clearTimeout(t);
  }, [query]);

  const hint = useMemo(() => {
    if (!query.trim()) return "Start typing to search.";
    if (query.trim().length < 2) return "Type at least 2 characters.";
    if (searchError) return "School search is temporarily unavailable. You can type it manually.";
    if (loading) return "Searching…";
    if (open && results.length === 0) return "No matches. You can still type it manually.";
    return "";
  }, [query, searchError, loading, open, results.length]);

  return (
    <div style={{ position: "relative" }}>
      <label style={{ display: "grid", gap: 6 }}>
        <span style={{ fontSize: 13, opacity: 0.8 }}>School / Team (optional)</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          style={inputStyle}
          onFocus={() => {
            if (results.length) setOpen(true);
          }}
          onBlur={() => {
            // slight delay to allow click selection
            setTimeout(() => setOpen(false), 120);
          }}
        />
      </label>

      {hint && <div style={{ marginTop: 6, fontSize: 12, opacity: 0.65 }}>{hint}</div>}

      {open && results.length > 0 && (
        <div style={dropdownStyle}>
          {results.map((r) => {
            const meta = [r.city, r.state].filter(Boolean).join(", ");
            const sub = [meta, r.conference, r.division].filter(Boolean).join(" • ");
            return (
              <button
                key={r.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setQuery(r.canonical_name);
                  setOpen(false);
                  onSelect({
                    schoolId: r.id,
                    schoolName: r.canonical_name,
                    city: r.city,
                    state: r.state,
                    conference: r.conference,
                    division: r.division,
                    logoUrl: r.logo_url,
                    primaryColorHex: r.primary_color_hex,
                    secondaryColorHex: r.secondary_color_hex,
                  });
                }}
                style={rowStyle}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={logoWrap}>
                    {(() => {
                      const fullLogoUrl = getFullLogoUrl(r.logo_url, r.canonical_name);
                      return fullLogoUrl ? (
                        <img
                          src={fullLogoUrl}
                          alt={r.canonical_name}
                          width={22}
                          height={22}
                          style={{ 
                            objectFit: "contain",
                            width: "22px",
                            height: "22px",
                            maxWidth: "22px",
                            maxHeight: "22px",
                            display: "block",
                          }}
                          onError={(e) => {
                            console.error("Failed to load logo for", r.canonical_name, "Original URL:", r.logo_url, "Full URL:", fullLogoUrl);
                            // Hide broken image and show placeholder
                            e.currentTarget.style.display = "none";
                            const placeholder = e.currentTarget.parentElement?.querySelector(".logo-placeholder") as HTMLElement;
                            if (placeholder) placeholder.style.display = "block";
                          }}
                          onLoad={() => {
                            // Hide placeholder when image loads successfully
                            const placeholder = document.querySelector(`[data-school-id="${r.id}"] .logo-placeholder`) as HTMLElement;
                            if (placeholder) placeholder.style.display = "none";
                          }}
                        />
                      ) : null;
                    })()}
                    <div 
                      className="logo-placeholder"
                      data-school-id={r.id}
                      style={{ 
                        width: 22, 
                        height: 22, 
                        borderRadius: 6, 
                        background: "rgba(255,255,255,0.08)",
                        display: getFullLogoUrl(r.logo_url, r.canonical_name) ? "none" : "block",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }} 
                    />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {r.canonical_name}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.7, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {sub}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {r.primary_color_hex && (
                    <span style={{ ...swatch, background: r.primary_color_hex }} />
                  )}
                  {r.secondary_color_hex && (
                    <span style={{ ...swatch, background: r.secondary_color_hex }} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 12px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  color: "inherit",
  outline: "none",
};

const dropdownStyle: React.CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  marginTop: 8,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(13,17,26,0.98)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
  overflow: "hidden",
  zIndex: 50,
};

const rowStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 10px",
  border: "none",
  background: "transparent",
  color: "inherit",
  textAlign: "left",
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const logoWrap: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.03)",
  display: "grid",
  placeItems: "center",
  flex: "0 0 auto",
  position: "relative",
};

const swatch: React.CSSProperties = {
  width: 12,
  height: 12,
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.25)",
};
