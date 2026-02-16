# BLTZ V1 – Product Requirements Document

## Vision
BLTZ is a digital athletic locker platform allowing football athletes to:
- Claim identity
- Enrich career data via AI
- Publish a public locker page
- Share via a unique handle (bltz.me/[handle])

V1 Focus:
- Athlete onboarding
- AI enrichment
- Public locker page
- Locker editing
- Foundational Supabase architecture

---

## Architecture

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Zustand (onboarding state)

### Backend
- Supabase (Auth + Postgres + Storage)
- Route Handlers in /app/api/*
- AI enrichment endpoints

---

## Core Modules

### 1. Onboarding Flow
Routes:
/onboarding/welcome
/onboarding/identity
/onboarding/path
/onboarding/setup
/onboarding/social
/onboarding/handle
/onboarding/publish

Requirements:
- Persist profile data
- Validate inputs
- Ensure handle uniqueness
- Trigger enrichment
- Publish profile

---

### 2. Public Locker Page
Route: /(public)/[handle]

Requirements:
- Server-side fetch profile + blocks
- 404 for unpublished
- Loading skeleton
- OpenGraph metadata

---

### 3. Locker Edit
Route: /(app)/locker/edit

Requirements:
- Load blocks from DB
- Edit and persist changes
- Preview public page

---

### 4. AI Enrichment
Endpoints:
- /api/wiki-bio
- /api/enrich-awards
- /api/enrich-athlete
- /api/ai/highlights
- /api/youtube-metadata

Requirements:
- Unified schema
- Save enrichment_results
- Store sources
- Retry + rate limit

---

## Database Tables (V1)

profiles
locker_blocks
enrichment_results
analytics_views

Each table includes timestamps and appropriate indexes.

---

## Definition of Done

For each feature:
- Code implemented via Codex
- npm run lint passes
- npm run typecheck passes
- Manual page test completed
- PR merged

---

## V1 Completion Checklist

- Onboarding complete
- Public page stable
- Locker edit functional
- Enrichment integrated
- RLS secured
- Analytics basic tracking
- Deployment documented
