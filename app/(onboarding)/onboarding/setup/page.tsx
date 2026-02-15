"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SetupBlocksList } from "@/components/onboarding/SetupBlocksList";
import { ProgressBar } from "@/components/onboarding/ProgressBar";
import { PrimaryButton, SecondaryButton } from "@/components/shared/Buttons";
import { DEFAULT_BLOCKS_BY_PATH } from "@/lib/constants/defaults";
import { useOnboardingStore } from "@/lib/state/onboardingStore";
import type { LockerBlockDraft } from "@/types/blocks";

export default function SetupPage() {
  const router = useRouter();
  const { pathSelected, identity, blocks, setBlocks } = useOnboardingStore();
  const [searchingHighlights, setSearchingHighlights] = useState(false);
  const [highlightsError, setHighlightsError] = useState("");
  const lastHighlightsQueryRef = useRef<string | null>(null);
  const lastHighlightsUrlRef = useRef<string | null>(null);

  const defaults = useMemo(() => {
    const p = pathSelected ?? "skip";
    return DEFAULT_BLOCKS_BY_PATH[p] as LockerBlockDraft[];
  }, [pathSelected]);

  const currentBlocks = blocks?.length ? blocks : defaults;
  const highlightsIndex = currentBlocks.findIndex(
    (b) => b.type === "link" && /highlight/i.test(b.title)
  );

  useEffect(() => {
    const fullName = identity?.fullName?.trim() ?? "";
    if (highlightsIndex < 0) return;

    const currentHighlight = currentBlocks[highlightsIndex];
    if (!currentHighlight) return;

    const url = currentHighlight.url?.trim() ?? "";
    const hasUrl = !!url;
    const hasMeta =
      !!currentHighlight?.meta?.videoTitle ||
      !!currentHighlight?.meta?.videoThumbnailUrl ||
      currentHighlight?.meta?.videoDurationSeconds != null;

    // If we already have both URL and meta, no need to re-enrich
    if (hasUrl && hasMeta) return;
    setHighlightsError("");
    setHighlightsError("");
    setSearchingHighlights(true);

    const run = async () => {
      try {
        let res: Response;

        if (!hasUrl) {
          // Auto-search mode based on identity name
          if (!fullName) {
            setSearchingHighlights(false);
            return;
          }
          if (lastHighlightsQueryRef.current === fullName) {
            setSearchingHighlights(false);
            return;
          }
          lastHighlightsQueryRef.current = fullName;

          res = await fetch("/api/ai/highlights", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullName }),
          });
        } else {
          // Enrich from custom YouTube URL entered by user
          if (lastHighlightsUrlRef.current === url) {
            setSearchingHighlights(false);
            return;
          }
          lastHighlightsUrlRef.current = url;

          res = await fetch("/api/ai/youtube-metadata", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
          });
        }

        const json = await res.json();
        if (!res.ok) {
          throw new Error(json?.error || "AI highlights search failed");
        }

        const foundUrl = json?.data?.url as string | undefined;
        if (!foundUrl) return;

        const videoTitle = json?.data?.title as string | undefined;
        const thumbnailUrl = json?.data?.thumbnailUrl as string | undefined;
        const durationSeconds = json?.data?.duration?.seconds as number | undefined;
        const durationIso = json?.data?.duration?.iso8601 as string | undefined;

        const next = currentBlocks.map((b, idx) =>
          idx === highlightsIndex
            ? {
                ...b,
                url: foundUrl,
                meta: {
                  ...(b.meta ?? {}),
                  videoTitle: videoTitle ?? null,
                  videoThumbnailUrl: thumbnailUrl ?? null,
                  videoDurationSeconds: Number.isFinite(durationSeconds as number)
                    ? (durationSeconds as number)
                    : null,
                  videoDurationIso8601: durationIso ?? null,
                },
              }
            : b
        );
        setBlocks(next);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to search highlights right now";
        setHighlightsError(message);
      } finally {
        setSearchingHighlights(false);
      }
    };

    void run();
  }, [identity?.fullName, highlightsIndex, currentBlocks, setBlocks]);

  // Auto-fill Career Bio from Wikipedia, based on identity
  useEffect(() => {
    const fullName = identity?.fullName?.trim() ?? "";
    const schoolTeamName = identity?.schoolTeamName?.trim() ?? "";
    if (!fullName) return;

    const careerIndex = currentBlocks.findIndex(
      (b) => b.type === "text" && /career bio/i.test(b.title)
    );
    if (careerIndex < 0) return;

    const careerBlock = currentBlocks[careerIndex];
    const body = careerBlock.body?.trim() ?? "";
    const isDefaultPlaceholder =
      body === "" ||
      /add a short career summary/i.test(body);

    // Don't overwrite user-entered bio
    if (!isDefaultPlaceholder) return;

    const run = async () => {
      try {
        const res = await fetch("/api/wiki-bio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, school: schoolTeamName }),
        });

        const json = await res.json();
        if (!res.ok) {
          // Silent fail for now; user can always type manually
          console.error("Wiki bio error:", json?.error || res.statusText);
          return;
        }

        const bio = (json?.bio as string | undefined)?.trim();
        if (!bio) return;

        const next = currentBlocks.map((b, idx) =>
          idx === careerIndex ? { ...b, body: bio } : b
        );
        setBlocks(next);
      } catch (error) {
        console.error("Error fetching wiki bio:", error);
      }
    };

    void run();
  }, [identity?.fullName, identity?.schoolTeamName, currentBlocks, setBlocks]);

  return (
    <div style={{ textAlign: "center" }}>
      <ProgressBar step={5} />
      <h1 style={{ fontSize: 28, margin: "4px 0 10px", fontFamily: "var(--font-urban-shadow)", letterSpacing: "0.05em" }}>Set up your locker</h1>
      <p style={{ opacity: 0.8, marginTop: 0 }}>
        Add the basics now — you can refine later.
      </p>

      <div style={{ marginTop: 16 }}>
        <SetupBlocksList
          blocks={currentBlocks}
          suggestedBlocks={defaults}
          aiSearchingBlockIndex={searchingHighlights ? highlightsIndex : null}
          aiErrorBlockIndex={highlightsError ? highlightsIndex : null}
          aiErrorMessage={highlightsError}
          onClearLink={(idx) => {
            const next = currentBlocks.map((b, i) =>
              i === idx ? { ...b, url: "", meta: undefined } : b
            );
            setBlocks(next);
          }}
          onClearBio={(idx) => {
            const next = currentBlocks.map((b, i) =>
              i === idx ? { ...b, body: "" } : b
            );
            setBlocks(next);
          }}
          onChange={(next) => setBlocks(next)}
        />
      </div>

      <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        <SecondaryButton onClick={() => router.push("/onboarding/social")}>
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
