export type LockerBlockType = "link" | "text" | "contact";

export type LockerBlockDraft = {
  type: LockerBlockType;
  title: string;
  url?: string;
  body?: string;
  isVisible: boolean;
  isFeatured?: boolean;
};
