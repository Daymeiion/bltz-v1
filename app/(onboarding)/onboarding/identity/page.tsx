"use client";

import { useRouter } from "next/navigation";
import { IdentityForm } from "@/components/onboarding/IdentityForm";
import { ProgressBar } from "@/components/onboarding/ProgressBar";
import { useOnboardingStore } from "@/lib/state/onboardingStore";

export default function IdentityPage() {
  const router = useRouter();
  const { setIdentity, pathSelected } = useOnboardingStore();

  return (
    <div style={{ textAlign: "center" }}>
      <ProgressBar step={2} />
      <h1 style={{ fontSize: 28, margin: "4px 0 10px", fontFamily: "var(--font-urban-shadow)", letterSpacing: "0.05em" }}>Athlete identity</h1>
      <p style={{ opacity: 0.8, marginTop: 0 }}>
        Keep it light — you can fill in the rest later. BLTZ AI can help in the background.
      </p>

      <div style={{ marginTop: 18 }}>
        <IdentityForm
          pathSelected={pathSelected}
          onSubmit={(values) => {
            setIdentity(values);
            // TODO: create locker draft + kick off AI enrichment here
            // Example:
            // await fetch("/api/locker/create", { method: "POST", body: JSON.stringify(values) })
            // await fetch("/api/ai/enrich", { method: "POST", body: JSON.stringify(values) })
            router.push("/onboarding/handle");
          }}
        />
      </div>
    </div>
  );
}
