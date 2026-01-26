"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/shared/Card";
import { PrimaryButton } from "@/components/shared/Buttons";
import { normalizeHandle } from "@/lib/utils/slug";

export function HandlePicker({
  initialValue,
  suggestedFromName,
  onConfirm,
}: {
  initialValue: string;
  suggestedFromName: string;
  onConfirm: (handle: string) => void;
}) {
  const suggested = useMemo(() => normalizeHandle(suggestedFromName) || "my-locker", [suggestedFromName]);
  const [handle, setHandle] = useState(initialValue || suggested);
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");

  useEffect(() => {
    setHandle((prev) => prev || suggested);
  }, [suggested]);

  async function checkAvailability(h: string) {
    setStatus("checking");
    // TODO: replace with real availability check
    // e.g., const res = await fetch(`/api/locker/available?handle=${h}`)
    await new Promise((r) => setTimeout(r, 450));
    setStatus(h.endsWith("1") ? "taken" : "available"); // fake rule for now
  }

  const normalized = normalizeHandle(handle);

  return (
    <Card>
      <div style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 13, opacity: 0.8 }}>Your locker URL</span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ opacity: 0.75 }}>bltz.me/</span>
            <input
              value={handle}
              onChange={(e) => {
                setHandle(e.target.value);
                setStatus("idle");
              }}
              placeholder={suggested}
              style={inputStyle}
            />
          </div>
        </label>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => checkAvailability(normalized)}
            style={miniBtn}
            disabled={!normalized}
          >
            {status === "checking" ? "Checking…" : "Check availability"}
          </button>

          <StatusPill status={status} />
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <PrimaryButton
            disabled={!normalized || status === "taken" || status === "checking"}
            onClick={() => onConfirm(normalized)}
          >
            Continue
          </PrimaryButton>
        </div>

        <div style={{ fontSize: 12, opacity: 0.65 }}>
          Tip: keep it short and easy to say out loud.
        </div>
      </div>
    </Card>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; fg: string }> = {
    idle: { label: "Not checked", bg: "rgba(255,255,255,0.06)", fg: "rgba(231,234,240,0.75)" },
    checking: { label: "Checking…", bg: "rgba(255,255,255,0.06)", fg: "rgba(231,234,240,0.75)" },
    available: { label: "Available", bg: "rgba(60, 200, 120, 0.14)", fg: "rgba(160, 255, 200, 0.95)" },
    taken: { label: "Taken", bg: "rgba(255, 90, 90, 0.14)", fg: "rgba(255, 180, 180, 0.95)" },
  };
  const v = map[status] ?? map.idle;
  return (
    <span style={{ padding: "6px 10px", borderRadius: 999, background: v.bg, color: v.fg, fontSize: 12, fontWeight: 700 }}>
      {v.label}
    </span>
  );
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 160,
  padding: "12px 12px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  color: "inherit",
  outline: "none",
};

const miniBtn: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.04)",
  color: "inherit",
  cursor: "pointer",
  fontWeight: 700,
};
