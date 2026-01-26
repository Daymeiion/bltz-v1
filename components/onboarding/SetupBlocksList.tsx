"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/shared/Card";
import { SecondaryButton } from "@/components/shared/Buttons";
import { BlockEditModal } from "@/components/onboarding/BlockEditModal";
import type { LockerBlockDraft } from "@/types/blocks";

export function SetupBlocksList({
  blocks,
  onChange,
}: {
  blocks: LockerBlockDraft[];
  onChange: (next: LockerBlockDraft[]) => void;
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const editingBlock = useMemo(() => (editingIndex === null ? null : blocks[editingIndex]), [blocks, editingIndex]);

  return (
    <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
      {blocks.map((b, idx) => (
        <Card key={`${b.type}-${idx}`}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800 }}>{b.title}</div>
              <div style={{ opacity: 0.75, fontSize: 13, marginTop: 6, wordBreak: "break-word" }}>
                {b.type === "link" ? (b.url || "Add a URL") : b.type === "contact" ? (b.body || "Add contact details") : (b.body || "Add text")}
              </div>
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

              <SecondaryButton type="button" onClick={() => setEditingIndex(idx)}>
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
