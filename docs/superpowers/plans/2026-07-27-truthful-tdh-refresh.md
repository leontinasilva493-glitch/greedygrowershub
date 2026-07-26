# Truthful TDH Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh Title, Description, H1, H2, and H3 content across all 13 indexable routes using the local TDH reference without publishing unsupported claims or changing live URLs.

**Architecture:** Keep `src/lib/seo.ts` as the metadata authority and retain the existing Astro route/page structure. Lock exact metadata and heading phrases with Vitest source contracts, update the current page copy surgically, then audit generated HTML and representative responsive pages.

**Tech Stack:** Astro 7, TypeScript, Tailwind CSS, Vitest, Playwright

## Global Constraints

- `自用/SEO相关TDH参考标准.txt` is read-only reference material and must not be committed.
- Preserve all current canonical paths, including `/seeds/` and `/seeds/best-seeds/`.
- Preserve `/calculator/` as a redirect to `/` and keep it out of the sitemap.
- Do not add multilingual routes or hreflang.
- Titles must be 50–60 JavaScript characters; descriptions must be 150–160 characters and action-led.
- Do not claim plot-count support, lightning prediction/probability zones, verified warning signals, daily code verification, working codes, or screenshots that the site does not provide.

---

### Task 1: Lock and update exact page metadata

**Files:**
- Modify: `src/lib/seo.test.ts`
- Modify: `src/lib/seo.ts`

**Interfaces:**
- Consumes: `site.domain` from `src/lib/content.ts`
- Produces: `pageSeo` entries used by all page layouts, canonical tags, social tags, and schemas

- [ ] **Step 1: Write failing exact-metadata tests**

Replace the current homepage-only exact assertion with an `expectedMetadata` object covering all 13 keys. Include the exact titles, descriptions, canonical paths, and H1 values from `docs/superpowers/specs/2026-07-27-truthful-tdh-refresh-design.md`. Add an assertion that descriptions do not match `/plot count|probability curve|updated daily|in-game screenshots|predicts lightning|safe zone|danger zone/i`.

- [ ] **Step 2: Verify the metadata test fails**

Run: `npm test -- src/lib/seo.test.ts`

Expected: FAIL because the current titles, descriptions, and several H1 values differ from the approved contract.

- [ ] **Step 3: Update `pageSeo` with the exact approved metadata**

Set every `pageSeo` entry to the exact text in the design metadata table and keep the existing canonical paths. Extend the allowed description-opening regex with `Find`.

- [ ] **Step 4: Verify metadata tests pass**

Run: `npm test -- src/lib/seo.test.ts`

Expected: PASS with all 13 exact contracts and length checks green.

---

### Task 2: Simplify and align the Calculator homepage headings

**Files:**
- Create: `src/lib/tdh-content.test.ts`
- Modify: `src/components/Calculator.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `pageSeo.home` and the existing Calculator component
- Produces: exactly four source-visible homepage H2s and three descriptive internal links

- [ ] **Step 1: Write a failing homepage heading contract**

Read `src/components/Calculator.astro` and `src/pages/index.astro` as UTF-8. Assert the combined source contains `Profit and Failed-Run Risk Calculator`, `How to Record Clean Run Data`, `How the Math Works (Quick Summary)`, `Frequently Asked Questions`, `Pick One Seed and Keep the Wait Consistent`, and `Recalculate After Every Game Update`. Assert the old `Continue with Greedy Growers guides and data` heading is absent after implementation.

- [ ] **Step 2: Verify the heading test fails**

Run: `npm test -- src/lib/tdh-content.test.ts`

Expected: FAIL on the old homepage H2/H3 copy.

- [ ] **Step 3: Apply the homepage content contract**

Rename the Calculator H2 and the three supporting SectionHeading titles. Replace the three run-data cards with two cards using the approved H3s. Remove the separate “Continue” H2 section and move three descriptive links—Seed List, When to Harvest, Codes—beneath the quick math cards.

- [ ] **Step 4: Verify the homepage contract passes**

Run: `npm test -- src/lib/tdh-content.test.ts`

Expected: PASS.

---

### Task 3: Align Seed, Guides, and Mechanics directory headings

**Files:**
- Modify: `src/lib/tdh-content.test.ts`
- Modify: `src/pages/seeds.astro`
- Modify: `src/components/SeedExplorer.astro`
- Modify: `src/pages/seeds/best-seeds.astro`
- Modify: `src/pages/guides/index.astro`
- Modify: `src/pages/mechanics/index.astro`

**Interfaces:**
- Consumes: current route arrays and seed data
- Produces: distinct heading ownership for data, recommendations, guide intents, and mechanic intents

- [ ] **Step 1: Add failing directory heading assertions**

Assert the seed list contains the three approved data/comparison/methodology H2 phrases; Best Seeds contains four stage/risk/methodology phrases; Guides contains four H2 guide-card phrases; Mechanics contains two H2 destination phrases.

- [ ] **Step 2: Verify the directory assertions fail**

Run: `npm test -- src/lib/tdh-content.test.ts`

Expected: FAIL because current directory H2 copy is generic and hub cards use H3.

- [ ] **Step 3: Update the directory page headings**

Rename Seed and Best Seeds headings. Render the four Guide cards with H2 headings and descriptive link labels, moving evidence guidance into an aside. Render the two Mechanics destinations as H2 cards and keep facts-versus-strategy and multiplier caveats as supporting callouts without additional H2s.

- [ ] **Step 4: Verify directory heading assertions pass**

Run: `npm test -- src/lib/tdh-content.test.ts`

Expected: PASS.

---

### Task 4: Align detail-page long-tail headings

**Files:**
- Modify: `src/lib/tdh-content.test.ts`
- Modify: `src/pages/beginner-guide.astro`
- Modify: `src/pages/guides/get-money-fast.astro`
- Modify: `src/pages/guides/progression.astro`
- Modify: `src/pages/guides/tickets.astro`
- Modify: `src/pages/mechanics/when-to-harvest.astro`
- Modify: `src/pages/mechanics/lightning.astro`
- Modify: `src/pages/codes.astro`
- Modify: `src/pages/updates.astro`

**Interfaces:**
- Consumes: existing factual sections, status labels, and internal links
- Produces: search-intent-led H2/H3 copy that remains evidence-accurate

- [ ] **Step 1: Add failing detail-page heading assertions**

For each file, assert the approved long-tail heading phrases described in the design: first-harvest steps, money/capital/recovery, progression stages/rebirth, Ticket verification, harvest break-even, lightning evidence, code status/verification, and update rechecks.

- [ ] **Step 2: Verify detail assertions fail**

Run: `npm test -- src/lib/tdh-content.test.ts`

Expected: FAIL on the old generic headings.

- [ ] **Step 3: Rename only headings and directly dependent descriptions**

Keep factual body content, source labels, video embeds, routes, and data intact. Do not add the unverified numeric or reward claims from the reference file.

- [ ] **Step 4: Verify all TDH unit contracts pass**

Run: `npm test -- src/lib/seo.test.ts src/lib/tdh-content.test.ts`

Expected: PASS.

---

### Task 5: Audit generated HTML, responsive pages, and publish

**Files:**
- Verify: `dist/**/*.html`
- Verify: `dist/sitemap-0.xml`

**Interfaces:**
- Consumes: the complete committed Astro project
- Produces: verified source-visible TDH on production URLs

- [ ] **Step 1: Run full automated verification**

Run: `npm test`

Run: `npm run check`

Run: `npm run build`

Expected: all tests pass, Astro reports zero diagnostics, and the static build completes.

- [ ] **Step 2: Audit generated HTML**

For all 13 indexable pages, verify exact Title/Description/H1 output, one H1, expected H2 count, canonical, OG/Twitter tags, JSON-LD, valid internal routes, no `/calculator/` sitemap entry, and a working Calculator redirect.

- [ ] **Step 3: Run responsive browser QA**

Start Astro in background mode. Use Playwright to inspect the homepage, Seeds, Guides, Mechanics, Codes, and one detail page at 1440px and 390px widths. Confirm headings are visible, navigation works, and no horizontal overflow or browser-console errors appear.

- [ ] **Step 4: Commit and publish**

Stage only the design, plan, tests, and project TDH files. Do not stage `自用/`. Commit with `feat: align site tdh with search intent`, push `HEAD:main`, and verify exact live Title/H1 output on representative routes without cache-busting parameters.
