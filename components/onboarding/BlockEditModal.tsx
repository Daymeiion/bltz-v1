"use client";

import { useState } from "react";
import { PrimaryButton, SecondaryButton } from "@/components/shared/Buttons";
import type { LockerBlockDraft } from "@/types/blocks";

export function BlockEditModal({
  block,
  suggestedBlock,
  onClose,
  onSave,
}: {
  block: LockerBlockDraft;
  suggestedBlock?: LockerBlockDraft;
  onClose: () => void;
  onSave: (updated: LockerBlockDraft) => void;
}) {
  const isSuggestedValue = (value?: string, suggested?: string) => {
    if (!suggested || !suggested.trim()) return false;
    return (value ?? "").trim() === suggested.trim();
  };

  const [title, setTitle] = useState(block.title ?? suggestedBlock?.title ?? "");
  const [url, setUrl] = useState(() =>
    isSuggestedValue(block.url, suggestedBlock?.url) ? "" : (block.url ?? "")
  );
  const [body, setBody] = useState(() =>
    isSuggestedValue(block.body, suggestedBlock?.body) ? "" : (block.body ?? "")
  );

  return (
    <div style={overlay}>
      <div style={{ width: "min(560px, 92vw)" }}>
        <div style={modalContainer}>
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontWeight: 900, fontSize: 20, textAlign: "center", textTransform: "uppercase" }}>Edit block</div>
            <button onClick={onClose} style={{ ...xBtn, position: "absolute", right: 0 }} aria-label="Close">✕</button>
          </div>

          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, opacity: 0.8 }}>Title</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                style={inputStyle}
              />
            </label>

            {block.type === "link" && (
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 13, opacity: 0.8 }}>URL</span>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={suggestedBlock?.url || "https://…"}
                  style={inputStyle}
                />
              </label>
            )}

            {block.type !== "link" && (
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 13, opacity: 0.8 }}>{block.type === "contact" ? "Contact details" : "Text"}</span>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={4}
                  placeholder={suggestedBlock?.body || (block.type === "contact" ? "Email / agent info…" : "Add text…")}
                  style={textareaStyle}
                />
              </label>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 14 }}>
            <SecondaryButton onClick={onClose} style={{ borderRadius: 8, padding: "12px 14px" }}>Cancel</SecondaryButton>
            <PrimaryButton
              onClick={() => {
                const nextUrl = url.trim() || block.url || suggestedBlock?.url || "";
                const urlChanged =
                  block.type === "link" &&
                  (block.url ?? "").trim() !== nextUrl.trim();

                onSave({
                  ...block,
                  title: title.trim() || block.title || suggestedBlock?.title || "",
                  url: nextUrl,
                  body: body.trim() || block.body || suggestedBlock?.body || "",
                  // Clear meta when URL changes so fresh metadata can be fetched
                  meta: urlChanged ? undefined : block.meta,
                });
              }}
              style={{ borderRadius: 8, padding: "12px 14px" }}
            >
              Save
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "grid",
  placeItems: "center",
  zIndex: 100,
};

const modalContainer: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#1a1d24",
  borderRadius: 10,
  padding: 16,
};

const xBtn: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.04)",
  color: "inherit",
  borderRadius: 10,
  width: 34,
  height: 34,
  cursor: "pointer",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 12px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  color: "inherit",
  outline: "none",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 12px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  color: "inherit",
  outline: "none",
  resize: "vertical",
};
