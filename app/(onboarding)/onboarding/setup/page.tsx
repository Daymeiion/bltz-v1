"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SetupBlocksList } from "@/components/onboarding/SetupBlocksList";
import { EnrichmentStatusRow } from "@/components/onboarding/EnrichmentStatusRow";
import { ProgressBar } from "@/components/onboarding/ProgressBar";
import { PrimaryButton, SecondaryButton } from "@/components/shared/Buttons";
import { DEFAULT_BLOCKS_BY_PATH } from "@/lib/constants/defaults";
import { useOnboardingStore } from "@/lib/state/onboardingStore";
import type { LockerBlockDraft } from "@/types/blocks";

export default function SetupPage() {
  const router = useRouter();
  const { pathSelected, blocks, setBlocks } = useOnboardingStore();
  const [showEnrichment, setShowEnrichment] = useState(true);

  const defaults = useMemo(() => {
    const p = pathSelected ?? "skip";
    return DEFAULT_BLOCKS_BY_PATH[p] as LockerBlockDraft[];
  }, [pathSelected]);

  const currentBlocks = blocks?.length ? blocks : defaults;

  return (
    <div style={{ textAlign: "center" }}>
      <ProgressBar step={4} />
      <h1 style={{ fontSize: 28, margin: "4px 0 10px", fontFamily: "var(--font-urban-shadow)", letterSpacing: "0.05em" }}>Set up your locker</h1>
      <p style={{ opacity: 0.8, marginTop: 0 }}>
        Add the basics now — you can refine later.
      </p>

      <div style={{ marginTop: 16 }}>
        {showEnrichment && (
          <EnrichmentStatusRow
            label="Blitzy is finding school colors & jersey number…"
            onDismiss={() => setShowEnrichment(false)}
          />
        )}

        <div style={{ marginTop: showEnrichment ? 16 : 0 }}>
          <SetupBlocksList
            blocks={currentBlocks}
            onChange={(next) => setBlocks(next)}
          />
        </div>
      </div>

      <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        <SecondaryButton onClick={() => router.push("/onboarding/handle")}>
          Back
        </SecondaryButton>
        <PrimaryButton
          onClick={() => {
            // TODO: persist blocks to backend
            router.push("/onboarding/publish");
          }}
        >
          Next: Publish
        </PrimaryButton>
      </div>
    </div>
  );
}
