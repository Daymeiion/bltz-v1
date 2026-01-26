"use client";

import Link from "next/link";
import { PublishShareCard } from "@/components/onboarding/PublishShareCard";
import { ProgressBar } from "@/components/onboarding/ProgressBar";
import { PrimaryButton, SecondaryButton } from "@/components/shared/Buttons";
import { useOnboardingStore } from "@/lib/state/onboardingStore";

export default function PublishPage() {
  const { handle } = useOnboardingStore();
  const lockerUrl = handle ? `https://bltz.me/${handle}` : "https://bltz.me/your-handle";

  return (
    <div style={{ textAlign: "center" }}>
      <ProgressBar step={5} />
      <h1 style={{ fontSize: 28, margin: "4px 0 10px", fontFamily: "var(--font-urban-shadow)", letterSpacing: "0.05em" }}>Your locker is live</h1>
      <p style={{ opacity: 0.8, marginTop: 0 }}>
        Copy your link and share it everywhere. You can edit anytime.
      </p>

      <div style={{ marginTop: 18 }}>
        <PublishShareCard lockerUrl={lockerUrl} />
      </div>

      <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/locker/edit">
          <SecondaryButton>Edit locker</SecondaryButton>
        </Link>
        <Link href={handle ? `/${handle}` : "/your-handle"}>
          <PrimaryButton>Go to my locker</PrimaryButton>
        </Link>
      </div>
    </div>
  );
}
