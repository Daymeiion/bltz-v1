"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/shared/Card";
import { SecondaryButton } from "@/components/shared/Buttons";
import { BlockEditModal } from "@/components/onboarding/BlockEditModal";
import type { LockerBlockDraft } from "@/types/blocks";

export function SetupBlocksList({
  blocks,
  suggestedBlocks,
  aiSearchingBlockIndex = null,
  aiErrorBlockIndex = null,
  aiErrorMessage = "",
  onClearLink,
   onClearBio,
  onChange,
}: {
  blocks: LockerBlockDraft[];
  suggestedBlocks?: LockerBlockDraft[];
  aiSearchingBlockIndex?: number | null;
  aiErrorBlockIndex?: number | null;
  aiErrorMessage?: string;
  onClearLink?: (index: number) => void;
  onClearBio?: (index: number) => void;
  onChange: (next: LockerBlockDraft[]) => void;
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const editingBlock = useMemo(() => (editingIndex === null ? null : blocks[editingIndex]), [blocks, editingIndex]);

  return (
    <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
      {blocks.map((b, idx) => (
        <Card key={`${b.type}-${idx}`}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
            <div style={{ minWidth: 0, textAlign: "left" }}>
              {(() => {
                const isHighlightsLink = b.type === "link" && /highlight/i.test(b.title);
                const isAiSearching = isHighlightsLink && aiSearchingBlockIndex === idx;
                const hasAiError = isHighlightsLink && aiErrorBlockIndex === idx && !!aiErrorMessage;
                const isCareerBio = b.type === "text" && /career bio/i.test(b.title);

                const durationLabel = (() => {
                  const seconds = b.meta?.videoDurationSeconds;
                  if (seconds == null || !Number.isFinite(seconds)) return null;
                  const total = Math.max(0, Math.floor(seconds));
                  const mins = Math.floor(total / 60);
                  const secs = total % 60;
                  const paddedSecs = secs.toString().padStart(2, "0");
                  return `${mins}:${paddedSecs}`;
                })();

                return (
                  <>
                    <div style={{ fontWeight: 800, textAlign: "left", fontSize: 18 }}>{b.title}</div>
                    <div style={{ marginTop: 6, textAlign: "left" }}>
                      {isAiSearching ? (
                        <div style={aiSkeletonStyle}>searching using ai</div>
                      ) : isHighlightsLink && b.url && (b.meta?.videoTitle || b.meta?.videoThumbnailUrl) ? (
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          {b.meta?.videoThumbnailUrl && (
                            <img
                              src={b.meta.videoThumbnailUrl}
                              alt={b.meta.videoTitle ?? "Video thumbnail"}
                              style={{
                                width: 80,
                                height: 45,
                                objectFit: "cover",
                                borderRadius: 6,
                                flexShrink: 0,
                              }}
                            />
                          )}
                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 6,
                                marginBottom: 2,
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {b.meta?.videoTitle ?? "Highlight video"}
                              </div>
                              {onClearLink && (
                                <button
                                  type="button"
                                  onClick={() => onClearLink(idx)}
                                  aria-label="Remove highlight video"
                                  style={{
                                    border: "none",
                                    background: "transparent",
                                    padding: 0,
                                    margin: 0,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <svg
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                  >
                                    <path
                                      fill="#ef4444"
                                      d="M9 3a1 1 0 0 0-.894.553L7.382 5H5a1 1 0 1 0 0 2h.154l.73 11.024A2 2 0 0 0 7.88 20h8.24a2 2 0 0 0 1.996-1.976L18.846 7H19a1 1 0 1 0 0-2h-2.382l-.724-1.447A1 1 0 0 0 15 3H9zm1.618 2h2.764l.5 1H10.12l.498-1zM9 9a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1zm6 1v6a1 1 0 1 1-2 0v-6a1 1 0 1 1 2 0z"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                            <div style={{ fontSize: 12, opacity: 0.75 }}>
                              {durationLabel ? `Duration: ${durationLabel}` : "Duration: —"}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{
                            opacity: 0.75,
                            fontSize: 13,
                            wordBreak: "break-word",
                            textAlign: "left",
                          }}
                        >
                          {isCareerBio && b.body ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                                gap: 8,
                              }}
                            >
                              <div style={{ flex: 1, minWidth: 0 }}>
                                {(
                                  b.body.length > 260
                                    ? `${b.body.slice(0, 260)}…`
                                    : b.body
                                )}
                              </div>
                              {onClearBio && (
                                <button
                                  type="button"
                                  onClick={() => onClearBio(idx)}
                                  aria-label="Remove bio"
                                  style={{
                                    border: "none",
                                    background: "transparent",
                                    padding: 0,
                                    margin: 0,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <svg
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                  >
                                    <path
                                      fill="#ef4444"
                                      d="M9 3a1 1 0 0 0-.894.553L7.382 5H5a1 1 0 1 0 0 2h.154l.73 11.024A2 2 0 0 0 7.88 20h8.24a2 2 0 0 0 1.996-1.976L18.846 7H19a1 1 0 1 0 0-2h-2.382l-.724-1.447A1 1 0 0 0 15 3H9zm1.618 2h2.764l.5 1H10.12l.498-1zM9 9a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1zm6 1v6a1 1 0 1 1-2 0v-6a1 1 0 1 1 2 0z"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          ) : b.type === "link" ? (
                            b.url || "Add a URL"
                          ) : b.type === "contact" ? (
                            b.body || "Add contact details"
                          ) : (
                            b.body || "Add text"
                          )}
                        </div>
                      )}
                    </div>
                    {hasAiError && (
                      <div style={{ marginTop: 6, fontSize: 12, color: "#fca5a5" }}>
                        {aiErrorMessage}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, opacity: 0.9 }}>
                <input
                  type="checkbox"
                  checked={b.isVisible}
                  onChange={(e) => {
                    const next = blocks.slice();
                    next[idx] = { ...b, isVisible: e.target.checked };
                    onChange(next);
                  }}
                />
                Visible
              </label>

              <SecondaryButton type="button" onClick={() => setEditingIndex(idx)} style={{ borderRadius: 8 }}>
                Edit
              </SecondaryButton>
            </div>
          </div>
        </Card>
      ))}

      <div style={{ display: "flex", justifyContent: "center" }}>
        <SecondaryButton
          type="button"
          onClick={() => onChange([...blocks, { type: "link", title: "New link", url: "", isVisible: true }])}
        >
          + Add block
        </SecondaryButton>
      </div>

      {editingBlock && editingIndex !== null && (
        <BlockEditModal
          block={editingBlock}
          suggestedBlock={suggestedBlocks?.[editingIndex]}
          onClose={() => setEditingIndex(null)}
          onSave={(updated) => {
            const next = blocks.slice();
            next[editingIndex] = updated;
            onChange(next);
            setEditingIndex(null);
          }}
        />
      )}
    </div>
  );
}

const aiSkeletonStyle: React.CSSProperties = {
  border: "1px dashed rgba(255,255,255,0.28)",
  borderRadius: 8,
  padding: "10px 12px",
  background: "rgba(255,255,255,0.05)",
  textTransform: "lowercase",
};
