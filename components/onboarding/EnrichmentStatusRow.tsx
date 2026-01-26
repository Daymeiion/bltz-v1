"use client";

import { Card } from "@/components/shared/Card";

export function EnrichmentStatusRow({
  label,
  onDismiss,
}: {
  label: string;
  onDismiss?: () => void;
}) {
  return (
    <div style={{ marginTop: 16 }}>
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Spinner />
            <div style={{ fontWeight: 700, opacity: 0.9 }}>{label}</div>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
                color: "inherit",
                borderRadius: 12,
                padding: "8px 10px",
                cursor: "pointer",
                fontWeight: 800,
                fontSize: 12,
              }}
            >
              Hide
            </button>
          )}
        </div>
        <div style={{ opacity: 0.65, fontSize: 12, marginTop: 8 }}>
          This won’t block you — you can publish anytime.
        </div>
      </Card>
    </div>
  );
}

function Spinner() {
  return (
    <div
      style={{
        width: 16,
        height: 16,
        borderRadius: 999,
        border: "2px solid rgba(255,255,255,0.2)",
        borderTopColor: "rgba(255,187,0,0.95)",
        animation: "spin 0.9s linear infinite",
      }}
    />
  );
}
