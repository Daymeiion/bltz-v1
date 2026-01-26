"use client";

import { Card } from "@/components/shared/Card";
import { SecondaryButton } from "@/components/shared/Buttons";

export function QRCodeCard({ value }: { value: string }) {
  function downloadPlaceholder() {
    // TODO: replace with real QR generation + download
    alert("QR download stub — replace with a QR library like 'qrcode' or 'react-qr-code'.");
  }

  return (
    <Card>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontWeight: 900 }}>QR code</div>
        <div style={{ opacity: 0.7, fontSize: 12, marginTop: 6 }}>Use at camps, games, or on merch.</div>
        <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
          <SecondaryButton onClick={downloadPlaceholder}>Download</SecondaryButton>
        </div>
      </div>

      <div style={{ marginTop: 12, display: "grid", placeItems: "center" }}>
        <FakeQr />
      </div>

      <div style={{ marginTop: 10, opacity: 0.55, fontSize: 11, wordBreak: "break-word", textAlign: "center" }}>
        {value}
      </div>
    </Card>
  );
}

function FakeQr() {
  // Placeholder “QR-like” SVG (not scannable)
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" aria-hidden="true">
      <rect x="0" y="0" width="160" height="160" rx="18" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)"/>
      <g fill="rgba(255,255,255,0.82)">
        <rect x="18" y="18" width="36" height="36" rx="6"/>
        <rect x="106" y="18" width="36" height="36" rx="6"/>
        <rect x="18" y="106" width="36" height="36" rx="6"/>
        <rect x="70" y="70" width="10" height="10" rx="2"/>
        <rect x="86" y="70" width="10" height="10" rx="2"/>
        <rect x="70" y="86" width="10" height="10" rx="2"/>
        <rect x="92" y="92" width="16" height="16" rx="3"/>
        <rect x="60" y="44" width="10" height="10" rx="2"/>
        <rect x="76" y="44" width="10" height="10" rx="2"/>
        <rect x="92" y="44" width="10" height="10" rx="2"/>
        <rect x="60" y="60" width="10" height="10" rx="2"/>
        <rect x="44" y="76" width="10" height="10" rx="2"/>
        <rect x="60" y="92" width="10" height="10" rx="2"/>
        <rect x="44" y="92" width="10" height="10" rx="2"/>
        <rect x="92" y="76" width="10" height="10" rx="2"/>
        <rect x="108" y="60" width="10" height="10" rx="2"/>
        <rect x="124" y="76" width="10" height="10" rx="2"/>
        <rect x="108" y="92" width="10" height="10" rx="2"/>
        <rect x="124" y="108" width="10" height="10" rx="2"/>
      </g>
    </svg>
  );
}
