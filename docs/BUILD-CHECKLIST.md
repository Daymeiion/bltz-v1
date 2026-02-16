# BUILD-CHECKLIST.md (BLTZ V1)

Place this file at: **/docs/BUILD-CHECKLIST.md**  
(Then add a link to it in your root **README.md** under a “Docs” section.)

---

## Purpose

This checklist is your **single source of truth** for shipping BLTZ V1 using the GitHub ticket system generated from the CSV import.

It helps you track:
- **Which tickets are done / in progress / blocked**
- **Which pages/features are complete**
- **What “Done (Verified)” means for every ticket**
- A repeatable **Codex build loop** that keeps quality consistent

---

## How this ties to GitHub Issues

### Your ticket naming convention
Each issue title starts with a ticket ID like:
- `T3.5 Publish step: set published=true + show share card + QR`

### Labels
Each issue has labels like:
- `Epic 3: Onboarding Ready`
- `P0` / `P1` / `P2`

### Milestones
If you used the github-csv-tools import version, the **milestone** equals the Epic:
- `Epic 3: Onboarding Ready`

---

## Status workflow (use these exact statuses)

Use **one** of these per issue (GitHub Projects status field OR issue comments):
- **Backlog**
- **In Progress (Codex)**
- **Needs Review**
- **Blocked**
- **Done (Verified)**

> Rule: Only mark **Done (Verified)** when verification commands pass AND you complete the manual QA checklist.

---

## The Codex Build Loop (run this for every ticket)

For each ticket (example: `T4.1 Public handle page...`):

1. **Open the GitHub Issue**
2. **Copy the “Codex Prompt”** from the issue body
3. In Cursor/VS Code **Codex Agent Mode**, paste the prompt
4. Ensure Codex outputs a **PLAN first**
5. Review the plan quickly (files + approach)
6. Let Codex implement the change set
7. Run verification commands:
   - `npm run lint`
   - `npm run typecheck`
   - `npm run build` (if relevant to routing/server changes)
8. Do the manual QA checklist (below)
9. Commit + push + open PR
10. Close issue + paste verification results + PR link

---

## Manual QA Checklist (minimum)

Check these in the browser (2–5 minutes total):
- [ ] Page loads without crashing
- [ ] Happy path works
- [ ] Error state displays correctly
- [ ] No obvious layout break on mobile width
- [ ] No console errors (quick check)

---

## Verification commands (definition of “Verified”)

For every ticket:
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes (required for routing/server/API changes)

---

# EPIC CHECKLISTS (tie directly to GitHub milestones)

> Tip: Work **P0 first**, then P1, then P2.

---

## Epic 0: Codex OS (Milestone: Epic 0: Codex OS)

**Goal:** Codex can operate safely/consistently in this repo.

- [ ] **T0.1** Add AGENTS.md + PLANS.md (Codex working agreements) — Status: ☐ Backlog ☐ In Progress ☐ Needs Review ☐ Blocked ☐ Done
- [ ] **T0.2** Create docs/ scaffolding + link PRD & tickets — Status: ☐ Backlog ☐ In Progress ☐ Needs Review ☐ Blocked ☐ Done

**Exit Criteria (Epic 0):**
- [ ] AGENTS.md exists at repo root
- [ ] PLANS.md exists at repo root
- [ ] README links to docs

---

## Epic 1: DX & Quality (Milestone: Epic 1: DX & Quality)

**Goal:** Repeatable commands + environment setup.

- [ ] **T1.1** Add consistent quality scripts (lint/typecheck/test/build) — Status: ☐ Backlog ☐ In Progress ☐ Needs Review ☐ Blocked ☐ Done
- [ ] **T1.2** Add .env.example + runtime env validation — Status: ☐ Backlog ☐ In Progress ☐ Needs Review ☐ Blocked ☐ Done
- [ ] **T1.3** Add minimal toast + global error handling pattern — Status: ☐ Backlog ☐ In Progress ☐ Needs Review ☐ Blocked ☐ Done

**Exit Criteria (Epic 1):**
- [ ] `npm run lint` + `npm run typecheck` are reliable
- [ ] `.env.example` is accurate and complete

---

## Epic 2: Data & RLS (Milestone: Epic 2: Data & RLS)

**Goal:** Real persistence + security for profiles/blocks/enrichment.

- [ ] **T2.1** Create Supabase migrations for core tables — Status: ☐ Backlog ☐ In Progress ☐ Needs Review ☐ Blocked ☐ Done
- [ ] **T2.2** Implement RLS policies — Status: ☐ Backlog ☐ In Progress ☐ Needs Review ☐ Blocked ☐ Done
- [ ] **T2.3** Add typed DB access layer — Status: ☐ Backlog ☐ In Progress ☐ Needs Review ☐ Blocked ☐ Done

**Exit Criteria (Epic 2):**
- [ ] Tables exist in Supabase (profiles, locker_blocks, enrichment_results, analytics_views)
- [ ] RLS prevents unauthorized writes
- [ ] Public reads only allowed for `published=true`

---

## Epic 3: Onboarding Ready (Milestone: Epic 3: Onboarding Ready)

**Goal:** Onboarding is production-grade and DB-backed.

- [ ] **T3.1** Identity step: validation + persist — Status: ☐ Backlog ☐ In Progress ☐ Needs Review ☐ Blocked ☐ Done
- [ ] **T3.2** School autocomplete: caching + logo fallback + normalize — Status: ☐ Backlog ☐ In Progress ☐ Needs Review ☐ Blocked ☐ Done
- [ ] **T3.3** Handle picker: uniqueness + reserved + slug rules — Status: ☐ Backlog ☐ In Progress ☐ Needs Review ☐ Blocked ☐ Done
- [ ] **T3.4** Setup blocks: persist to locker_blocks — Status: ☐ Backlog ☐ In Progress ☐ Needs Review ☐ Blocked ☐ Done
- [ ] **T3.5** Publish step: set published=true + share + QR — Status: ☐ Backlog ☐ In Progress ☐ Needs Review ☐ Blocked ☐ Done

**Exit Criteria (Epic 3):**
- [ ] User can complete onboarding end-to-end
- [ ] Data is stored in Supabase and reload-safe
- [ ] Publish enables public handle page

---

## Epic 4: Public Locker (Milestone: Epic 4: Public Locker)

**Goal:** Public locker is fast, clean, and stable.

- [ ] **T4.1** Public handle page: DB fetch + loading + 404 — Status: ☐ Backlog ☐ In Progress ☐ Needs Review ☐ Blocked ☐ Done
- [ ] **T4.2** PublicLockerView component (clean UI) — Status: ☐ Backlog ☐ In Progress ☐ Needs Review ☐ Blocked ☐ Done
- [ ] **T4.3** OpenGraph metadata — Status: ☐ Backlog ☐ In Progress ☐ Needs Review ☐ Blocked ☐ Done

**Exit Criteria (Epic 4):**
- [ ] `/[handle]` works for published profiles
- [ ] Unpublished/missing handles show 404
- [ ] Page has good mobile UX

---

## Epic 5: Locker Edit (Milestone: Epic 5: Locker Edit)

**Goal:** Players can edit their locker content safely.

- [ ] **T5.1** Locker edit: load blocks + save updates — Status: ☐ Backlog ☐ In Progress ☐ Needs Review ☐ Blocked ☐ Done
- [ ] **T5.2** Locker edit: preview + copy link — Status: ☐ Backlog ☐ In Progress ☐ Needs Review ☐ Blocked ☐ Done

**Exit Criteria (Epic 5):**
- [ ] Blocks edits persist and reflect on public page
- [ ] Player can preview and share link easily

---

## Epic 6: AI Enrichment (Milestone: Epic 6: AI Enrichment)

**Goal:** Enrichment is consistent, auditable, and integrated.

- [ ] **T6.1** Standardize enrichment schema + validation — Status: ☐ Backlog ☐ In Progress ☐ Needs Review ☐ Blocked ☐ Done
- [ ] **T6.2** Wire EnrichmentStatusRow to pipeline + save results — Status: ☐ Backlog ☐ In Progress ☐ Needs Review ☐ Blocked ☐ Done
- [ ] **T6.3** Add rate limiting + retries — Status: ☐ Backlog ☐ In Progress ☐ Needs Review ☐ Blocked ☐ Done
- [ ] **T6.4** Store sources/citations + optional display — Status: ☐ Backlog ☐ In Progress ☐ Needs Review ☐ Blocked ☐ Done

**Exit Criteria (Epic 6):**
- [ ] Enrichment runs reliably
- [ ] Results saved to DB with sources
- [ ] Errors are visible and retryable

---

## Epic 7: Analytics (Milestone: Epic 7: Analytics)

**Goal:** Minimal view tracking for locker pages.

- [ ] **T7.1** Track public locker views per day — Status: ☐ Backlog ☐ In Progress ☐ Needs Review ☐ Blocked ☐ Done
- [ ] **T7.2** Show view count in locker edit — Status: ☐ Backlog ☐ In Progress ☐ Needs Review ☐ Blocked ☐ Done

**Exit Criteria (Epic 7):**
- [ ] Views increment correctly
- [ ] Owner sees view count

---

## Epic 8: Release (Milestone: Epic 8: Release)

**Goal:** V1 can be deployed and QA’d consistently.

- [ ] **T8.1** Deployment guide — Status: ☐ Backlog ☐ In Progress ☐ Needs Review ☐ Blocked ☐ Done
- [ ] **T8.2** Release QA checklist doc — Status: ☐ Backlog ☐ In Progress ☐ Needs Review ☐ Blocked ☐ Done

**Exit Criteria (Epic 8):**
- [ ] Deploy instructions complete and accurate
- [ ] QA checklist used before release

---

# Page Status Tracker (V1)

Mark each as complete when its related tickets are Done (Verified).

## Onboarding Pages
- [ ] `/onboarding/welcome` (exists) — Verified: [ ]
- [ ] `/onboarding/identity` (T3.1) — Verified: [ ]
- [ ] `/onboarding/path` — Verified: [ ]
- [ ] `/onboarding/setup` (T3.4) — Verified: [ ]
- [ ] `/onboarding/social` — Verified: [ ]
- [ ] `/onboarding/handle` (T3.3) — Verified: [ ]
- [ ] `/onboarding/publish` (T3.5) — Verified: [ ]

## Public
- [ ] `/(public)/[handle]` (T4.1–T4.3) — Verified: [ ]

## App
- [ ] `/(app)/locker/edit` (T5.1–T5.2) — Verified: [ ]

---

# Build Log (optional)

Use this to keep a running record of what shipped and when.

## {date}
- Tickets completed:
  - 
- PR links:
  - 
- Notes / blockers:
  - 
