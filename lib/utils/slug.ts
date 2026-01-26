export function normalizeHandle(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/https?:\/\/[^/]+\//g, "")  // strip domain if pasted
    .replace(/[^a-z0-9\-\s_]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function makeHandleSuggestion(fullName: string): string {
  const h = normalizeHandle(fullName);
  if (!h) return "";
  return h;
}
