"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PathSelector } from "@/components/onboarding/PathSelector";
import { PrimaryButton } from "@/components/shared/Buttons";
import { ProgressBar } from "@/components/onboarding/ProgressBar";
import { useOnboardingStore } from "@/lib/state/onboardingStore";
import { ONBOARDING_PATHS, type OnboardingPath } from "@/lib/constants/paths";

export default function PathPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { pathSelected, setPathSelected } = useOnboardingStore();

  useEffect(() => {
    // If user clicked "Skip for now" on welcome, preselect skip.
    if (params.get("skip") === "1") setPathSelected("skip");
  }, [params, setPathSelected]);

  const canContinue = Boolean(pathSelected);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 200px)",
        textAlign: "center",
      }}
    >
      <ProgressBar step={1} />
      <div>
        <h1 style={{ fontSize: 28, margin: "40px 0 20px", fontFamily: "var(--font-urban-shadow)", letterSpacing: "0.05em" }}>Select your path</h1>
        <p style={{ opacity: 0.8, marginTop: 0 }}>You can change this later.</p>

        <div style={{ marginTop: 16 }}>
          <PathSelector
            value={pathSelected ?? undefined}
            onChange={(v: OnboardingPath) => setPathSelected(v)}
            options={ONBOARDING_PATHS}
          />
        </div>
      </div>

      <div style={{ marginTop: "auto", paddingTop: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div 
          style={{ 
            display: "flex",
            justifyContent: "center",
            marginLeft: "30px",
            marginRight: "30px"
          }}
        >
          <div style={{ display: "block", width: "100%", maxWidth: 500 }}>
            <PrimaryButton
              disabled={!canContinue}
              onClick={() => router.push("/onboarding/identity")}
              style={{ width: "100%", padding: "18px 54px", fontSize: 16, fontWeight: 600, textTransform: "uppercase" }}
            >
              Continue
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
