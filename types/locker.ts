export type IdentityDraft = {
  fullName: string;
  level: "pro" | "college" | "hs" | "alumni" | "unknown";
  schoolTeamName?: string;
  schoolId?: string;
  schoolMeta?: any;
  position?: string;
  classYear?: string;
  jerseyNumber?: string;
  suggestedHandle?: string;
};
