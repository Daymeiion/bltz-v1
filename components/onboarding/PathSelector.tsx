"use client";

import { Card } from "@/components/shared/Card";
import type { OnboardingPathOption, OnboardingPath } from "@/lib/constants/paths";

export function PathSelector({
  value,
  onChange,
  options,
}: {
  value?: OnboardingPath;
  onChange: (v: OnboardingPath) => void;
  options: OnboardingPathOption[];
}) {
  return (
    <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              textAlign: "left",
              padding: 0,
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                borderRadius: 18,
                outline: selected ? "2px solid rgba(255,187,0,0.9)" : "1px solid rgba(255,255,255,0.08)",
                boxShadow: selected 
                  ? "0 18px 40px rgba(255,187,0,0.08), 0 4px 12px rgba(0,0,0,0.15)" 
                  : "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <Card>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>{opt.label}</div>
                    <div style={{ opacity: 0.75, marginTop: 6, lineHeight: 1.5 }}>{opt.description}</div>
                  </div>
                  <div style={{ opacity: 0.9, fontSize: 20 }}>{opt.emoji}</div>
                </div>
              </Card>
            </div>
          </button>
        );
      })}
    </div>
  );
}
