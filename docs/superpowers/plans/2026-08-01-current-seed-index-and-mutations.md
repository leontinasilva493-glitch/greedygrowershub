# Current Seed Index and Mutations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the conflicting 12-seed snapshot with a current 20-seed, source-labeled index, keep unsupported profit claims out of dependent pages, and publish a distinct mutations guide that completes the seed-intent cluster.

**Architecture:** Keep `/seeds/list/` as the sole canonical owner of “Greedy Growers all seeds” intent. Extend the existing content model with current-catalog fields (rarity, reported spawn denominator, display-safe price, version claim, multiple sources), while leaving harvest, growth, and profit fields null until they are independently verified. Reuse the existing Astro layout, evidence badges, navigation, and SEO helpers; add `/mechanics/mutations/` as an Article page and link it contextually from the seed list and mechanics hub.

**Tech Stack:** Astro 7, TypeScript, Tailwind CSS 4, Vitest, JSON content files, Schema.org JSON-LD.

## Global Constraints

- Use the 20-seed Update 1.2 catalog reported by Pro Game Guides and MrGuider on 2026-07-28.
- Label copied values as community-reported/current-publication matches, not official or in-game verified.
- Do not combine new seed costs with the old harvest values, growth times, or profit-per-minute figures.
- Keep `/seeds/list/` canonical; do not add `/all-seeds/` or 20 thin seed-detail routes.
- Store large prices such as `$1.75Qi` as display-safe value/unit data, not unsafe JavaScript integers.
- Preserve the existing visual language and responsive table/card behavior.
- Do not commit, push, or deploy unless separately requested.

---

### Task 1: Current seed catalog model

**Files:**
- Modify: `src/lib/content.ts`
- Modify: `src/data/sources.json`
- Replace: `src/data/seeds.json`
- Modify: `src/lib/content.test.ts`
- Modify: `src/lib/seeds.test.ts`

**Interfaces:**
- Produces: `SeedRecord` fields `sourceIds`, `spawnOneIn`, `costDisplay`, `costSortValue`, `gameVersionClaim`, and `availability`.
- Produces: exactly 20 unique current-catalog records with nullable unverified economics fields.

- [ ] Write failing validation tests for 20 records, eight rarity groups, multiple source IDs, positive spawn denominators, safe price display, and null unsupported economics.
- [ ] Run targeted content and seed tests and confirm expected failures.
- [ ] Extend `SeedRecord` and validation with the new catalog fields.
- [ ] Add Pro Game Guides and MrGuider source records.
- [ ] Replace the old 12 records with the reported 20-seed Update 1.2 catalog.
- [ ] Run targeted tests and confirm they pass.

### Task 2: Seed explorer behavior and all-seeds acquisition page

**Files:**
- Modify: `src/lib/seeds.ts`
- Modify: `src/scripts/seeds.ts`
- Modify: `src/components/SeedExplorer.astro`
- Modify: `src/pages/seeds/list.astro`
- Modify: `src/lib/seeds.test.ts`
- Modify: `src/lib/tdh-content.test.ts`

**Interfaces:**
- Consumes: current `SeedRecord` catalog fields from Task 1.
- Produces: filters for rarity and verification, sorts for cost/spawn/name, and a source-visible current catalog with two-seed comparison.

- [ ] Write failing tests for rarity filtering and current-catalog cost/spawn sorting.
- [ ] Add failing source-contract assertions for the new page answer, fields, conflict explanation, FAQs, sources, and mutations link.
- [ ] Run targeted tests and confirm expected failures.
- [ ] Implement the new filter/sort behavior and responsive table/cards.
- [ ] Rewrite `/seeds/list/` around the current 20-seed search intent, evidence notice, rarity summary, data conflict explanation, methodology, and FAQ.
- [ ] Run targeted tests and confirm they pass.

### Task 3: Remove stale ranking and calculator contradictions

**Files:**
- Modify: `src/lib/calculator-seeds.ts`
- Modify: `src/lib/calculator-seeds.test.ts`
- Modify: `src/components/CalculatorSeedPreview.astro`
- Modify: `src/pages/seeds/best.astro`
- Modify: `src/pages/guides/get-money-fast.astro`
- Modify: `src/lib/tdh-content.test.ts`

**Interfaces:**
- Consumes: current catalog records whose unsupported economics are null.
- Produces: cost/risk-oriented previews and guidance without old profit rankings.

- [ ] Write failing tests that order seed previews by reported rarity/cost rather than nonexistent profit.
- [ ] Add failing source-contract assertions that ban old seed IDs and stale profit-ranking headings.
- [ ] Run targeted tests and confirm expected failures.
- [ ] Rewrite calculator preview as current catalog discovery with manual-input guidance.
- [ ] Rewrite Best Seeds as budget, availability, rarity, and risk bands without permanent profit claims.
- [ ] Remove stale old-seed examples from Get Money Fast.
- [ ] Run targeted tests and confirm they pass.

### Task 4: Mutations mechanics page and cluster links

**Files:**
- Create: `src/pages/mechanics/mutations.astro`
- Modify: `src/lib/seo.ts`
- Modify: `src/lib/seo.test.ts`
- Modify: `src/pages/mechanics/index.astro`
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/components/Header.test.ts`
- Modify: `src/lib/routes.test.ts`
- Modify: `src/lib/tdh-content.test.ts`

**Interfaces:**
- Produces: canonical `/mechanics/mutations/` Article page with BreadcrumbList, evidence boundaries, six reported mutation names, weather acquisition explanation, seed-list link, and source citations.

- [ ] Add failing SEO, route, navigation, and content-contract tests for Mutations.
- [ ] Run targeted tests and confirm expected failures.
- [ ] Add unique keyword-first metadata and canonical ownership.
- [ ] Build the mutations guide using the existing layout, badges, sections, and source-list patterns.
- [ ] Add contextual links from the mechanics hub, header, footer, and seed list.
- [ ] Run targeted tests and confirm they pass.

### Task 5: Freshness, structured data, and final verification

**Files:**
- Modify: `src/data/site.json`
- Modify: `src/pages/updates.astro`
- Modify: `src/lib/tdh-content.test.ts`

**Interfaces:**
- Produces: editorial check date `2026-08-01`, current seed change log, 20-item ItemList, and a build containing the new canonical route.

- [ ] Add failing assertions for the current check date, 20-item catalog, and seed-catalog update note.
- [ ] Run targeted tests and confirm expected failures.
- [ ] Update freshness data and the player-facing update log.
- [ ] Run `npm.cmd test` and confirm all tests pass.
- [ ] Run `npm.cmd run check` and confirm Astro/TypeScript validation passes.
- [ ] Run `npm.cmd run build` and inspect the generated sitemap and HTML for `/seeds/list/` and `/mechanics/mutations/`.
- [ ] Run `git diff --check` and review the final diff for unsupported claims, duplicated canonical intents, and unrelated changes.
