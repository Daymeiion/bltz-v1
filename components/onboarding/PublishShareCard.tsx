"use client";

import { useState } from "react";
import { Card } from "@/components/shared/Card";
import { PrimaryButton, SecondaryButton } from "@/components/shared/Buttons";
import { QRCodeCard } from "@/components/locker/QRCodeCard";

export function PublishShareCard({ lockerUrl }: { lockerUrl: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(lockerUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore
    }
  }

  return (
    <div style={{ display: "grid", gap: 14, marginTop: 16 }}>
      <Card>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 900, wordBreak: "break-word" }}>{lockerUrl}</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 12 }}>
            <SecondaryButton onClick={copy}>{copied ? "Copied" : "Copy link"}</SecondaryButton>
          </div>
        </div>
        <div style={{ opacity: 0.7, fontSize: 12, marginTop: 8, textAlign: "center" }}>
          Tip: put this in your Instagram/TikTok bio.
        </div>
      </Card>

      <QRCodeCard value={lockerUrl} />

      <Card>
        <div style={{ fontWeight: 900, marginBottom: 10, textAlign: "center" }}>Quick share</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
          <PrimaryButton onClick={copy}>Copy link</PrimaryButton>
          <SecondaryButton onClick={() => window.open(`sms:&body=${encodeURIComponent(lockerUrl)}`, "_self")}>
            Text
          </SecondaryButton>
          <SecondaryButton onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(lockerUrl)}`, "_blank")}>
            X / Twitter
          </SecondaryButton>
        </div>
      </Card>
    </div>
  );
}
