"use client";

import { useOnboardingStore } from "@/lib/state/onboardingStore";
import { SetupBlocksList } from "@/components/onboarding/SetupBlocksList";
import { Card } from "@/components/shared/Card";

export default function LockerEditPage() {
  const { blocks, setBlocks, handle } = useOnboardingStore();

  return (
    <div style={{ maxWidth: 560 }}>
      <h1 style={{ fontSize: 28, margin: "4px 0 10px" }}>Edit locker</h1>
      <p style={{ opacity: 0.8, marginTop: 0 }}>
        {handle ? `bltz.me/${handle}` : "No handle yet"}
      </p>

      <Card>
        <div style={{ fontWeight: 900 }}>Blocks</div>
        <div style={{ opacity: 0.7, fontSize: 12, marginTop: 6 }}>
          This edit screen is a placeholder — we’re reusing the onboarding block list for now.
        </div>
      </Card>

      <SetupBlocksList blocks={blocks ?? []} onChange={setBlocks} />
    </div>
  );
}
