export type OnboardingPath = "legacy" | "nil" | "recruiting" | "skip";

export type OnboardingPathOption = {
  value: OnboardingPath;
  label: string;
  description: string;
  emoji: string;
};

export const ONBOARDING_PATHS: OnboardingPathOption[] = [
  {
    value: "legacy",
    label: "Legacy (Pro / Alumni)",
    description: "Showcase your career, awards, and story — a home for your football legacy.",
    emoji: "🏈",
  },
  {
    value: "nil",
    label: "NIL (College)",
    description: "Make it easy for brands to find you, contact you, and support your journey.",
    emoji: "💰",
  },
  {
    value: "recruiting",
    label: "Recruiting (High School)",
    description: "Put your highlights, Hudl, stats, and coach contact in one clean link.",
    emoji: "🎓",
  },
  {
    value: "skip",
    label: "Skip for now",
    description: "Get a link up fast. Add details later.",
    emoji: "⚡",
  },
];
