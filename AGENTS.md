# AGENTS.md – BLTZ Codex Working Rules

This file defines how Codex should operate inside this repository.

---

## Core Rules

1. Always scan the repository before implementing.
2. Reuse existing components before creating new ones.
3. Do not introduce new libraries unless absolutely necessary.
4. Keep diffs small and modular.
5. Follow dark gradient UI with accent color #ffbb00.
6. Prefer Tailwind for styling.
7. Always output:
   - Plan
   - Implementation
   - Files Changed
   - Verification steps

---

## Commands

Before marking a task complete:

- npm run lint
- npm run typecheck
- npm run build (if relevant)

---

## Folder Conventions

app/
  (public)/
  (onboarding)/
  (app)/

components/
lib/
types/
docs/

---

## Security Rules

- Never expose service role key in client.
- Respect Supabase RLS policies.
- Only allow public read of published profiles.

---

## Development Flow

Plan → Implement → Verify → Summarize → Commit

---
