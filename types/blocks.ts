export type LockerBlockType = "link" | "text" | "contact";

export type LockerBlockDraft = {
  type: LockerBlockType;
  title: string;
  url?: string;
  body?: string;
  isVisible: boolean;
  isFeatured?: boolean;
  // Optional metadata used for AI-enriched blocks (e.g. YouTube highlights)
  meta?: {
    videoTitle?: string | null;
    videoThumbnailUrl?: string | null;
    videoDurationSeconds?: number | null;
    videoDurationIso8601?: string | null;
  };
};
