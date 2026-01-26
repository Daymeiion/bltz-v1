# BLTZ Onboarding Stubs (Next.js App Router)

These are **starter stubs** for BLTZ v1 onboarding + shared layouts/components.

## How to use
1. Copy the folders into your existing Next.js repo (App Router).
2. Ensure Tailwind is set up (recommended). If not, the UI still renders—just less pretty.
3. Start dev server: `npm run dev`

## Routes included
- /onboarding/welcome
- /onboarding/path
- /onboarding/identity
- /onboarding/handle
- /onboarding/setup
- /onboarding/publish

## Notes
- Data persistence is mocked with `localStorage` (see `lib/state/onboardingStore.ts`).
- Replace mocked calls with Supabase/API routes later.
