# Mobile UX Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the verified production mobile interaction defects and shorten high-intent mobile paths without changing evidence boundaries or the site's visual system.

**Architecture:** Keep Astro server-rendered components and add only small DOM scripts for navigation and reading-rail behavior. Reorder existing calculator/homepage regions, provide CSS-responsive mobile card alternatives to wide tables, and use native disclosures for secondary evidence detail.

**Tech Stack:** Astro 7, TypeScript, Tailwind CSS 4, Vitest, native HTML controls.

## Global Constraints

- Work from `origin/main@0229d1a` in the isolated `codex/mobile-ux` worktree.
- Preserve all evidence labels, sources, unknown-value boundaries, canonical routes, and indexability decisions.
- Do not add a second Play on Roblox CTA, a mobile subdomain, or a custom select widget.
- Keep the current deep-green visual system and SVG icon language.
- Use 44px minimum standalone touch targets and verify 320/375/430px mobile layouts.

---

### Task 1: Mobile navigation and consent

**Files:**
- Modify: `src/components/Header.astro`
- Create: `src/scripts/mobile-navigation.ts`
- Modify: `src/components/AnalyticsConsent.astro`
- Modify: `src/components/Header.test.ts`
- Create: `src/components/AnalyticsConsent.test.ts`

**Interfaces:**
- Produces: `[data-mobile-navigation]`, `[data-mobile-nav-panel]`, and `[data-mobile-nav-backdrop]` hooks consumed by `setupMobileNavigation()`.

- [ ] Add failing tests for drawer hooks, explicit expanded state, compact consent controls, and safe-area treatment.
- [ ] Run the focused tests and confirm the missing contracts fail.
- [ ] Implement the drawer script and compact consent markup.
- [ ] Re-run focused tests and manually exercise outside click, Escape, focus return, and body scroll lock.

### Task 2: Sticky comparison and on-page navigation

**Files:**
- Modify: `src/components/SeedExplorer.astro`
- Modify: `src/components/OnThisPage.astro`
- Modify: `src/scripts/reading-progress.ts`
- Modify: `src/components/OnThisPage.test.ts`
- Create: `src/components/SeedExplorer.test.ts`
- Modify: `src/pages/seeds/list.astro`
- Modify: `src/pages/mechanics/mutations.astro`

**Interfaces:**
- Produces: distinct mobile sticky offsets and short page-specific anchor labels.

- [ ] Add failing tests for non-overlapping sticky offsets, narrow-phone tray stacking, Seed Table navigation, concise labels, and active-chip visibility behavior.
- [ ] Run focused tests and confirm failure.
- [ ] Implement offsets, labels, and active-chip scrolling.
- [ ] Re-run tests and verify the compare flow at 320/375/430px.

### Task 3: Single calculator result and homepage order

**Files:**
- Modify: `src/components/Calculator.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/lib/homepage-ux.test.ts`
- Modify: `src/lib/tdh-content.test.ts`

**Interfaces:**
- Preserves: `[data-calculator]` form and every existing calculator input/output hook.
- Produces: one visible result panel updated by the existing calculator script.

- [ ] Add failing tests requiring one result output set, result-before-advanced mobile order, and task path before seed preview.
- [ ] Run focused tests and confirm failure.
- [ ] Restructure the form grid, remove the duplicate preview, regroup seeds with native `optgroup`, and reorder homepage sections.
- [ ] Re-run calculator and homepage tests; exercise live recalculation and copy behavior.

### Task 4: Mobile tables and mutation density

**Files:**
- Modify: `src/pages/seeds/best.astro`
- Modify: `src/pages/mechanics/when-to-harvest.astro`
- Modify: `src/pages/updates.astro`
- Modify: `src/pages/mechanics/mutations.astro`
- Modify: `src/lib/tdh-content.test.ts`

**Interfaces:**
- Produces: `md:hidden` mobile card collections paired with `hidden md:block` desktop tables.

- [ ] Add failing tests for mobile card alternatives and collapsed mutation decision/trigger disclosures.
- [ ] Run focused tests and confirm failure.
- [ ] Implement cards with the same evidence-safe data and disclosures for repeated mutation detail.
- [ ] Re-run tests and inspect all four pages at mobile and desktop widths.

### Task 5: Touch targets and range controls

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/components/Calculator.astro`
- Modify: `src/components/Footer.astro`
- Modify: affected FAQ summaries in `src/pages/**/*.astro`
- Modify: relevant component/content tests.

**Interfaces:**
- Produces: `.calculator-range` with a 48px interaction area and 26px WebKit/Mozilla thumbs.

- [ ] Add failing contracts for 44px FAQ/preference targets and calculator range classes.
- [ ] Run focused tests and confirm failure.
- [ ] Implement the shared touch-target and range styling.
- [ ] Re-run focused and full tests.

### Task 6: Full verification and local review

**Files:**
- No production additions expected.

- [ ] Run `npm.cmd test -- --run`.
- [ ] Run `npm.cmd run check`.
- [ ] Run `npm.cmd run build`.
- [ ] Start the Astro server in background mode and run browser smoke checks at 320/375/430/768/1440px.
- [ ] Confirm no global horizontal overflow, sticky overlap, duplicate mobile result, console errors, or broken routes.
- [ ] Provide local review URLs and an exact Git/build status without pushing or deploying.

