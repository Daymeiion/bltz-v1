"use client";

import { useState } from "react";
import Image from "next/image";

export type SocialPlatform = 
  | "instagram"
  | "twitter"
  | "tiktok"
  | "youtube"
  | "snapchat"
  | "facebook"
  | "linkedin"
  | "discord"
  | "twitch"
  | "spotify";

const SOCIAL_PLATFORMS: { id: SocialPlatform; name: string; logoPath: string }[] = [
  { id: "instagram", name: "Instagram", logoPath: "/logos/social/instagram.svg" },
  { id: "twitter", name: "Twitter", logoPath: "/logos/social/twitter.svg" },
  { id: "tiktok", name: "TikTok", logoPath: "/logos/social/tiktok.svg" },
  { id: "youtube", name: "YouTube", logoPath: "/logos/social/youtube.svg" },
  { id: "snapchat", name: "Snapchat", logoPath: "/logos/social/snapchat-logo.png" },
  { id: "facebook", name: "Facebook", logoPath: "/logos/social/facebook.svg" },
  { id: "linkedin", name: "LinkedIn", logoPath: "/logos/social/linkedin.svg" },
  { id: "discord", name: "Discord", logoPath: "/logos/social/discord.svg" },
  { id: "twitch", name: "Twitch", logoPath: "/logos/social/twitch.svg" },
  { id: "spotify", name: "Spotify", logoPath: "/logos/social/spotify.svg" },
];

export function SocialMediaSelector({
  selected,
  onChange,
}: {
  selected: SocialPlatform[];
  onChange: (platforms: SocialPlatform[]) => void;
}) {
  const togglePlatform = (platform: SocialPlatform) => {
    if (selected.includes(platform)) {
      onChange(selected.filter((p) => p !== platform));
    } else {
      onChange([...selected, platform]);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        marginTop: 20,
        maxWidth: 600,
        marginLeft: "30",
        marginRight: "30",
        padding: "0 10px",
        justifyContent: "center",
      }}
    >
      {SOCIAL_PLATFORMS.map((platform) => {
        const isSelected = selected.includes(platform.id);
        return (
          <SocialPlatformButton
            key={platform.id}
            platform={platform}
            isSelected={isSelected}
            onToggle={() => togglePlatform(platform.id)}
          />
        );
      })}
    </div>
  );
}

function SocialPlatformButton({
  platform,
  isSelected,
  onToggle,
}: {
  platform: { id: SocialPlatform; name: string; logoPath: string };
  isSelected: boolean;
  onToggle: () => void;
}) {
  const [imageError, setImageError] = useState(false);
  const logoSize = platform.id === "snapchat" ? 45 : 40;

  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        position: "relative",
        width: 80,
        height: 80,
        borderRadius: "50%",
        border: isSelected
          ? "2px solid #ffbb00"
          : "2px solid rgba(255,255,255,0.12)",
        background: isSelected
          ? "rgba(255,187,0,0.1)"
          : "rgba(255,255,255,0.04)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s",
        padding: 0,
        outline: "none",
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
        }
      }}
    >
      <div
        style={{
          width: logoSize,
          height: logoSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 4,
          position: "relative",
        }}
      >
        {!imageError ? (
          <Image
            src={platform.logoPath}
            alt={platform.name}
            width={logoSize}
            height={logoSize}
            style={{
              objectFit: "contain",
            }}
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              opacity: 0.8,
              color: "inherit",
            }}
          >
            {platform.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div
        style={{
          fontSize: 10,
          opacity: 0.8,
          textAlign: "center",
          fontWeight: 600,
        }}
      >
        {platform.name}
      </div>
      {isSelected && (
        <div
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "#ffbb00",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #1a1d24",
            fontSize: 14,
          }}
        >
          ✓
        </div>
      )}
    </button>
  );
}
