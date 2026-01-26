"use client";

import { useRouter } from "next/navigation";
import { HandlePicker } from "@/components/onboarding/HandlePicker";
import { ProgressBar } from "@/components/onboarding/ProgressBar";
import { useOnboardingStore } from "@/lib/state/onboardingStore";

export default function HandlePage() {
  const router = useRouter();
  const { handle, setHandle, identity } = useOnboardingStore();

  return (
    <div style={{ textAlign: "center" }}>
      <ProgressBar step={3} />
      <h1 style={{ fontSize: 28, margin: "4px 0 10px", fontFamily: "var(--font-urban-shadow)", letterSpacing: "0.05em" }}>Claim your locker link</h1>
      <p style={{ opacity: 0.8, marginTop: 0 }}>
        This is what you'll share: <span style={{ opacity: 1 }}>bltz.me/your-handle</span>
      </p>

      <div style={{ marginTop: 18 }}>
        <HandlePicker
          initialValue={handle ?? ""}
          suggestedFromName={identity?.fullName ?? ""}
          onConfirm={(newHandle) => {
            setHandle(newHandle);
            // TODO: call /api/locker/update (handle)
            router.push("/onboarding/setup");
          }}
        />
      </div>
    </div>
  );
}
