"use client";

import { useMemo, useState, useEffect } from "react";
import { PrimaryButton, SecondaryButton } from "@/components/shared/Buttons";
import { Card } from "@/components/shared/Card";
import { SchoolAutocomplete } from "@/components/onboarding/SchoolAutocomplete";
import { LevelSelect } from "@/components/onboarding/LevelSelect";
import { makeHandleSuggestion } from "@/lib/utils/slug";
import type { IdentityDraft } from "@/types/locker";
import type { OnboardingPath } from "@/lib/constants/paths";

function mapPathToLevel(path: OnboardingPath | null): IdentityDraft["level"] {
  switch (path) {
    case "legacy":
      return "pro";
    case "nil":
      return "college";
    case "recruiting":
      return "hs";
    case "skip":
    default:
      return "unknown";
  }
}

export function IdentityForm({ 
  onSubmit,
  pathSelected,
}: { 
  onSubmit: (values: IdentityDraft) => void;
  pathSelected?: OnboardingPath | null;
}) {
  const [fullName, setFullName] = useState("");
  const [level, setLevel] = useState<IdentityDraft["level"]>(() => mapPathToLevel(pathSelected ?? null));
  const [schoolTeamName, setSchoolTeamName] = useState("");
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [schoolMeta, setSchoolMeta] = useState<any>(null);
  const [position, setPosition] = useState("");
  const [classYear, setClassYear] = useState("");
  const [jerseyNumber, setJerseyNumber] = useState("");

  const suggestedHandle = useMemo(() => makeHandleSuggestion(fullName), [fullName]);

  useEffect(() => {
    if (pathSelected) {
      setLevel(mapPathToLevel(pathSelected));
    }
  }, [pathSelected]);

  const canContinue = fullName.trim().length >= 2;

  return (
    <Card>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!canContinue) return;

          onSubmit({
            fullName: fullName.trim(),
            level,
            schoolTeamName: schoolTeamName.trim(),
            position: position.trim(),
            classYear: classYear.trim() || undefined,
            jerseyNumber: jerseyNumber.trim() || undefined,
            suggestedHandle,
            schoolId: schoolId ?? undefined,
            schoolMeta: schoolMeta ?? undefined,
          });
        }}
        style={{ display: "grid", gap: 12, width: "100%", maxWidth: "100%", overflow: "hidden" }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 13, opacity: 0.8 }}>Full name</span>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g., Daymeion Hughes"
            style={inputStyle}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 13, opacity: 0.8 }}>Level</span>
          <LevelSelect value={level} onChange={(v) => setLevel(v)} />
        </label>

        <SchoolAutocomplete
          value={schoolTeamName}
          onSelect={(s) => {
            setSchoolTeamName(s.schoolName);
            setSchoolId(s.schoolId);
            setSchoolMeta(s);
          }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 13, opacity: 0.8 }}>Position (optional)</span>
            <input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="CB, WR, QB…" style={inputStyle} />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 13, opacity: 0.8 }}>Jersey # (optional)</span>
            <input value={jerseyNumber} onChange={(e) => setJerseyNumber(e.target.value)} placeholder="21" style={inputStyle} />
          </label>
        </div>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 13, opacity: 0.8 }}>Class year / Grad year (optional)</span>
          <input value={classYear} onChange={(e) => setClassYear(e.target.value)} placeholder="2027" style={inputStyle} />
        </label>

        <div style={{ opacity: 0.7, fontSize: 13 }}>
          Suggested handle: <span style={{ fontWeight: 700, opacity: 1 }}>{suggestedHandle || "—"}</span>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6, justifyContent: "center" }}>
          <PrimaryButton type="submit" disabled={!canContinue}>Continue</PrimaryButton>
          <SecondaryButton type="button" onClick={() => onSubmit({
            fullName: fullName.trim() || "Athlete",
            level: level ?? "unknown",
            schoolTeamName: "",
            position: "",
            suggestedHandle: suggestedHandle || "my-locker",
          })}>
            Skip details
          </SecondaryButton>
        </div>
      </form>
    </Card>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 12px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  color: "inherit",
  outline: "none",
};
