# BLTZ V1

BLTZ is a digital athletic locker platform that allows football athletes to:

- Claim a verified handle
- Enrich their career data using AI
- Publish a public locker page
- Share their locker via bltz.me/[handle]

This repository contains the V1 foundation built with Next.js App Router and Supabase.

---

# 🚀 Tech Stack

- Next.js (App Router)
- TypeScript
- Supabase (Auth + Postgres + Storage)
- Tailwind CSS
- Zustand (onboarding state)
- OpenAI-powered enrichment APIs

---

# 📂 Project Structure

app/
  (public)/[handle]        → Public locker page
  (onboarding)/            → Athlete onboarding flow
  (app)/locker/edit        → Locker editing
  api/                     → AI + school + enrichment routes

components/
  onboarding/
  locker/
  shared/

lib/
  db/
  supabase/
  state/
  utils/
  constants/

types/
docs/

---

# 🧠 How BLTZ Works

1. Athlete signs up
2. Completes onboarding
3. Enrichment APIs gather bio + awards + highlights
4. Data is saved in Supabase
5. Public page becomes live at:

   bltz.me/[handle]

---

# 🛠 Local Development

Install dependencies:

    npm install

Run development server:

    npm run dev

Run quality checks:

    npm run lint
    npm run typecheck
    npm run build

---

# 🔐 Environment Variables

Create a `.env.local` file based on `.env.example`:

Required variables:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=

Never expose the service role key in client-side code.

---

# 🤖 Using Codex to Build Features

This repo is structured for Codex Agent-based development.

Codex workflow:

1. Open a GitHub issue (ticket)
2. Copy the "Codex Prompt" from the issue body
3. Run Codex in Agent Mode
4. Review the PLAN
5. Let Codex implement
6. Run verification commands
7. Manually test
8. Open PR
9. Close issue as Done (Verified)

Always ensure:

- npm run lint passes
- npm run typecheck passes
- Manual page test completed

---

# 📘 Documentation

All execution docs live inside `/docs`:

- BLTZ-PRD.md → Product Requirements Document
- BUILD-CHECKLIST.md → Master build tracking checklist
- DEPLOYMENT.md → Deployment guide (when created)
- QA-CHECKLIST.md → Release testing steps (when created)

Core repo operating rules:

- AGENTS.md → Codex working rules
- PLANS.md → Multi-step execution template

---

# 🧱 Database Overview (V1)

Core tables:

- profiles
- locker_blocks
- enrichment_results
- analytics_views

Security:

- Supabase RLS enabled
- Only published profiles are publicly readable
- Users can only edit their own data

---

# 📊 V1 Milestones

V1 Completion Includes:

- Onboarding fully DB-backed
- Public locker page stable
- Locker edit functional
- Enrichment pipeline integrated
- RLS secured
- Basic analytics
- Deployment documented

---

# 🏁 Deployment

Recommended:

- Deploy via Vercel
- Connect Supabase production project
- Set required environment variables
- Configure domain to bltz.me

---

# 🧠 Development Philosophy

Small diffs.
No unnecessary dependencies.
Reusable components first.
Plan → Implement → Verify → Ship.

---

BLTZ V1 is about stability, clarity, and execution velocity.
