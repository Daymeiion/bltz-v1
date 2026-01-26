"use client";

import { useState } from "react";
import { Card } from "@/components/shared/Card";
import { PrimaryButton, SecondaryButton } from "@/components/shared/Buttons";
import type { LockerBlockDraft } from "@/types/blocks";

export function BlockEditModal({
  block,
  onClose,
  onSave,
}: {
  block: LockerBlockDraft;
  onClose: () => void;
  onSave: (updated: LockerBlockDraft) => void;
}) {
  const [title, setTitle] = useState(block.title ?? "");
  const [url, setUrl] = useState(block.url ?? "");
  const [body, setBody] = useState(block.body ?? "");

  return (
    <div style={overlay}>
      <div style={{ width: "min(560px, 92vw)" }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <div style={{ fontWeight: 900, fontSize: 16 }}>Edit block</div>
            <button onClick={onClose} style={xBtn} aria-label="Close">✕</button>
          </div>

          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, opacity: 0.8 }}>Title</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
            </label>

            {block.type === "link" && (
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 13, opacity: 0.8 }}>URL</span>
                <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" style={inputStyle} />
              </label>
            )}

            {block.type !== "link" && (
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 13, opacity: 0.8 }}>{block.type === "contact" ? "Contact details" : "Text"}</span>
                <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} style={textareaStyle} />
              </label>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 14 }}>
            <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
            <PrimaryButton
              onClick={() => onSave({ ...block, title: title.trim() || block.title, url: url.trim(), body: body.trim() })}
            >
              Save
            </PrimaryButton>
          </div>
        </Card>
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
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  color: "inherit",
  outline: "none",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 12px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  color: "inherit",
  outline: "none",
  resize: "vertical",
};
