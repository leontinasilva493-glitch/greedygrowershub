# Evidence-First Content Priority Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strengthen the highest-value Greedy Growers acquisition pages after the August 11 update signal, add a safe official-links destination, and avoid unsupported Rebirth, Discord, or profit claims.

**Architecture:** Keep the current Astro route and evidence-label patterns. Extend source-visible content contracts in Vitest first, then update page metadata and Astro pages. Reuse `StatusBadge`, `EvidenceBar`, `SourceList`, and existing JSON snapshots; do not add dependencies or invent gameplay data.

**Tech Stack:** Astro 7, TypeScript, Tailwind CSS 4, Vitest, Cloudflare adapter.

## Global Constraints

- Keep `/seeds/list/` as the only all-seeds route and `/seeds/best/` as the only ranking-oriented seed route.
- Do not publish a profit ranking, exact lightning odds, mutation stacking formula, Ticket route, Rebirth reset rule, or Discord invite without reproducible evidence.
- Treat the Roblox API timestamp as an update signal, not a changelog.
- Keep community data visibly labelled and dated.
- Do not create `/guides/rebirth/`, `/discord/`, `/wiki/`, or fertilizer pages until their evidence gates are satisfied.
- Keep new mobile content compact: direct-answer summaries, tables, and disclosure blocks instead of long repeated card grids.

---

### Task 1: Lock SEO and route ownership contracts

**Files:**
- Modify: `src/lib/seo.test.ts`
- Modify: `src/lib/routes.test.ts`
- Modify: `src/lib/tdh-content.test.ts`
- Modify: `src/lib/seo.ts`

**Interfaces:**
- Consumes: existing `PageMetadata`, `pageSeo`, and filesystem route tests.
- Produces: `pageSeo.officialLinks` and the revised goal-based tier-list metadata for `/seeds/best/`.

- [ ] **Step 1: Write failing metadata and route tests**

Add expectations for:

```ts
bestSeeds: {
  title: 'Greedy Growers Seed Tier List by Budget & Rarity (2026)',
  canonicalPath: '/seeds/best/',
  h1: 'Greedy Growers Seed Tier List by Player Goal',
}

officialLinks: {
  title: 'Greedy Growers Official Links: Roblox & Discord Status',
  canonicalPath: '/official-links/',
  h1: 'Greedy Growers Official Links',
}
```

Assert `src/pages/official-links.astro` exists and `/seeds/tier-list/`, `/guides/rebirth/`, and `/discord/` do not exist.

- [ ] **Step 2: Run the targeted tests and confirm the expected failure**

Run: `npm.cmd test -- src/lib/seo.test.ts src/lib/routes.test.ts src/lib/tdh-content.test.ts`

Expected: failures for missing `officialLinks`, missing route, and missing page phrases.

- [ ] **Step 3: Add the minimal metadata implementation**

Add `pageSeo.officialLinks`; revise only `pageSeo.bestSeeds` title, description, and H1. Keep the canonical URL unchanged.

- [ ] **Step 4: Re-run targeted tests**

Run: `npm.cmd test -- src/lib/seo.test.ts src/lib/routes.test.ts`

Expected: metadata passes; route remains red until Task 4 adds the page.

---

### Task 2: Enrich the update and seed decision pages

**Files:**
- Modify: `src/pages/updates.astro`
- Modify: `src/pages/seeds/best.astro`
- Test: `src/lib/tdh-content.test.ts`

**Interfaces:**
- Consumes: `game-status.json`, `site.checkedAt`, `seeds`, `sources`, `StatusBadge`.
- Produces: a patch recheck matrix and an evidence-bounded seed tier matrix.

- [ ] **Step 1: Add failing source-visible phrase tests**

Require these phrases:

```ts
'Post-Update Recheck Board'
'API signal only'
'Recheck required'
'Seed Tier List by Verified Dimension'
'Not a profit tier'
'Use the same seed and wait target'
```

- [ ] **Step 2: Run the content test and verify it fails**

Run: `npm.cmd test -- src/lib/tdh-content.test.ts`

- [ ] **Step 3: Implement the compact recheck board**

Add a four-row table to Updates for Codes, Seeds/Mutations, Tickets/Progression, and Lightning/Harvest. Show the source state and exact next evidence action; do not claim the patch changed gameplay values.

- [ ] **Step 4: Implement the goal-based tier matrix**

Add three evidence-bounded tiers to `/seeds/best/`: learning the loop, protecting capital, and rare-stock watch. Explain that the ordering uses reported buy-in or spawn denominator, not profit.

- [ ] **Step 5: Re-run the content test**

Run: `npm.cmd test -- src/lib/tdh-content.test.ts`

Expected: all Task 2 content contracts pass.

---

### Task 3: Strengthen Rebirth, Tickets, Lightning, and Mutations evidence gates

**Files:**
- Modify: `src/data/evidence.ts`
- Modify: `src/pages/guides/progression.astro`
- Modify: `src/pages/guides/tickets.astro`
- Modify: `src/pages/mechanics/lightning.astro`
- Modify: `src/pages/mechanics/mutations.astro`
- Test: `src/lib/tdh-content.test.ts`

**Interfaces:**
- Consumes: `EvidenceBar`, dated local snapshots, current page components.
- Produces: `evidenceByPage.progression`, `tickets`, and `lightning`; current-version evidence bars and explicit split-page gates.

- [ ] **Step 1: Add failing evidence contract tests**

Require evidence entries and page phrases:

```ts
'Rebirth Page Readiness'
'Keep Rebirth inside this progression pillar'
'Ticket Route Publication Gate'
'Lightning Evidence After the Latest Update Signal'
'Mutation Evidence After the Latest Update Signal'
```

- [ ] **Step 2: Run the content test and verify it fails**

Run: `npm.cmd test -- src/lib/tdh-content.test.ts`

- [ ] **Step 3: Extend the evidence registry**

Add dated `progression`, `tickets`, and `lightning` records with `community-reported` or `unverified` strength and precise known gaps.

- [ ] **Step 4: Add evidence bars and compact publication gates**

Progression must keep Rebirth in the pillar until reset, retained items, and perks are captured. Tickets must require grant screen, balance delta, spend UI, and reset behavior. Lightning and Mutations must disclose that their prior reports predate or coincide with the update signal and need controlled rechecks.

- [ ] **Step 5: Re-run the content test**

Run: `npm.cmd test -- src/lib/tdh-content.test.ts`

Expected: all Task 3 contracts pass without adding unsupported mechanics.

---

### Task 4: Add the Official Links trust page and cross-links

**Files:**
- Create: `src/pages/official-links.astro`
- Modify: `src/pages/updates.astro`
- Modify: `src/pages/codes.astro`
- Modify: `src/components/Footer.astro`
- Test: `src/lib/routes.test.ts`
- Test: `src/lib/tdh-content.test.ts`

**Interfaces:**
- Consumes: `site.officialGameUrl`, `game-status.json`, `community-links.json`, official source records.
- Produces: `/official-links/`, a single navigational destination for Roblox, API, creator, and Discord verification status.

- [ ] **Step 1: Add failing route and content tests**

Require:

```ts
'Official Roblox experience'
'Roblox Games API snapshot'
'Official Discord is not verified'
'How We Decide a Link Is Safe to Publish'
```

Also assert that Codes, Updates, and Footer link to `/official-links/`.

- [ ] **Step 2: Run route and content tests and verify failure**

Run: `npm.cmd test -- src/lib/routes.test.ts src/lib/tdh-content.test.ts`

- [ ] **Step 3: Create the page**

Build a compact page with: direct answer, official Roblox destination, official API snapshot, creator ownership explanation, Discord unverified status, safe-link publication checklist, and related navigation. Do not publish a candidate invite.

- [ ] **Step 4: Add contextual cross-links**

Link to the page from Codes, Updates, and Footer. Avoid adding another primary desktop navigation item.

- [ ] **Step 5: Re-run route and content tests**

Run: `npm.cmd test -- src/lib/routes.test.ts src/lib/tdh-content.test.ts`

Expected: all Task 4 contracts pass.

---

### Task 5: Verify and prepare local review

**Files:**
- Review only: all changed files

**Interfaces:**
- Consumes: completed implementation.
- Produces: passing verification and reachable local review URLs.

- [ ] **Step 1: Run all tests**

Run: `npm.cmd test`

Expected: 0 failed tests.

- [ ] **Step 2: Run Astro checks**

Run: `npm.cmd run check`

Expected: 0 errors, warnings, or hints.

- [ ] **Step 3: Run the production build**

Run: `npm.cmd run build`

Expected: exit code 0 and `/official-links/` in the generated route list.

- [ ] **Step 4: Check patch hygiene**

Run: `git diff --check` and `git status --short`

Expected: no whitespace errors and only task files changed.

- [ ] **Step 5: Start the Astro background server**

Run: `npm.cmd exec astro dev -- --background --host 127.0.0.1`

Expected: background server reports a local URL. Verify every changed page returns HTTP 200 and hand off the links for review.
