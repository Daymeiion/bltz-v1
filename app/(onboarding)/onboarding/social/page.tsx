"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressBar } from "@/components/onboarding/ProgressBar";
import { PrimaryButton, SecondaryButton } from "@/components/shared/Buttons";
import { SocialMediaSelector, type SocialPlatform } from "@/components/onboarding/SocialMediaSelector";

export default function SocialPage() {
  const router = useRouter();
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);

  return (
    <div style={{ textAlign: "center" }}>
      <ProgressBar step={4} />
      <h1 style={{ fontSize: 28, margin: "4px 0 10px", fontFamily: "var(--font-urban-shadow)", letterSpacing: "0.05em" }}>
        Connect your socials
      </h1>
      <p style={{ opacity: 0.8, marginTop: 0 }}>
        Select the platforms you're active on. You can add links later.
      </p>

      <SocialMediaSelector
        selected={selectedPlatforms}
        onChange={setSelectedPlatforms}
      />

      <div style={{ marginTop: 32, display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        <SecondaryButton onClick={() => router.push("/onboarding/handle")}>
          Back
        </SecondaryButton>
        <PrimaryButton
          onClick={() => {
            // TODO: persist selected platforms to backend
            router.push("/onboarding/setup");
          }}
        >
          Continue
        </PrimaryButton>
      </div>
    </div>
  );
}
