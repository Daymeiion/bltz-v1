import type { LockerBlockDraft } from "@/types/blocks";
import type { OnboardingPath } from "@/lib/constants/paths";

export const DEFAULT_BLOCKS_BY_PATH: Record<OnboardingPath, LockerBlockDraft[]> = {
  legacy: [
    { type: "link", title: "Highlights", url: "", isVisible: true },
    { type: "text", title: "Career Bio", body: "Add a short career summary…", isVisible: true },
    { type: "text", title: "Awards / Honors", body: "Add notable awards and achievements…", isVisible: true },
    { type: "link", title: "Merch / Store", url: "", isVisible: true },
    { type: "contact", title: "Contact", body: "Email / agent info…", isVisible: true },
  ],
  nil: [
    { type: "contact", title: "Brand Inquiries", body: "Email / agent info…", isVisible: true },
    { type: "link", title: "Merch", url: "", isVisible: true },
    { type: "link", title: "Highlights", url: "", isVisible: true },
    { type: "link", title: "Instagram", url: "", isVisible: true },
    { type: "link", title: "Appearances", url: "", isVisible: true },
  ],
  recruiting: [
    { type: "link", title: "Highlights", url: "", isVisible: true },
    { type: "link", title: "Hudl / Profile", url: "", isVisible: true },
    { type: "link", title: "Stats", url: "", isVisible: true },
    { type: "contact", title: "Coach Contact", body: "Coach name + email + phone…", isVisible: true },
    { type: "text", title: "Academic Info", body: "GPA / test scores / interests…", isVisible: true },
  ],
  skip: [
    { type: "link", title: "Add your first link", url: "", isVisible: true },
  ],
};
