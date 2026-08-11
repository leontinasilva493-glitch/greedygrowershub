# Greedy Growers UX Retention Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve the site's task completion, mobile usability, session depth, accessibility, sharing, and privacy-aware feedback while preserving evidence quality and static-export performance.

**Architecture:** Keep Astro pages server-rendered as static HTML. Reuse existing components and introduce small framework-free TypeScript modules for URL state, sharing, reading progress, consent, and feedback. Related recommendations remain a typed, hand-authored content map rather than an automatic ranking engine.

**Tech Stack:** Astro 5, TypeScript, Tailwind CSS 4, Vitest, static production build, browser QA with Playwright.

**Execution constraint:** Keep all work local for review. Do not commit, push, deploy, or add unverified gameplay content.

---

### Task 1: Lock the homepage task order and calculator disclosure

**Files:**
- Modify: `src/lib/homepage-ux.test.ts`
- Modify: `src/pages/index.astro`
- Modify: `src/components/Calculator.astro`

1. Add failing assertions that the calculator follows the hero and precedes browse/update content, and that secondary calculator inputs live in a labelled advanced disclosure.
2. Run the focused test and confirm the new assertions fail for the expected DOM order/disclosure reason.
3. Move the calculator section without removing the existing task-path cards.
4. Group fertilizer, plots/session, multiplier, and mutation presets under an accessible `<details>` block while retaining existing names and data hooks.
5. Re-run the focused test.

### Task 2: Fix seed comparison and add shareable explorer state

**Files:**
- Create: `src/lib/seed-explorer-state.ts`
- Create: `src/lib/seed-explorer-state.test.ts`
- Modify: `src/scripts/seeds.ts`
- Modify: `src/components/SeedExplorer.astro`

1. Write failing tests for normalizing, parsing, and serializing seed search/filter/sort/comparison state.
2. Implement the pure state helpers and make the tests pass.
3. Prevent delegated `change` handling from rebuilding the list when a search input blur precedes a compare click.
4. Hydrate controls from the URL and update the URL with `history.replaceState` after meaningful changes.
5. Add a copy-current-view control and a sticky comparison summary.
6. Replace full mobile cards with compact expandable rows and 44-pixel compare controls.
7. Verify the first comparison click and URL restoration in a real browser.

### Task 3: Improve mutation mobile scanning

**Files:**
- Modify: `src/pages/mechanics/mutations.astro`

1. Preserve the desktop comparison table at medium widths and above.
2. Render the same evidence-labelled fields as compact cards below medium width.
3. Keep source links and uncertainty labels visible in both presentations.
4. Verify there is no horizontal page overflow at 375 pixels.

### Task 4: Add reading progress and active section navigation

**Files:**
- Modify: `src/components/OnThisPage.astro`
- Create: `src/scripts/reading-progress.ts`
- Modify: `src/styles/global.css`

1. Add stable hooks for the progress bar and anchor links.
2. Implement a small scroll/IntersectionObserver controller that updates progress and `aria-current`.
3. Make the navigation sticky, keep touch targets at least 44 pixels high, and preserve anchor scroll offset.
4. Disable non-essential smooth scrolling when reduced motion is requested.

### Task 5: Add semantic next steps and route-safe sharing

**Files:**
- Create: `src/data/related.ts`
- Create: `src/data/related.test.ts`
- Create: `src/components/RelatedNextSteps.astro`
- Create: `src/components/ShareActions.astro`
- Create: `src/scripts/share.ts`
- Modify: `src/pages/seeds/list.astro`
- Modify: `src/pages/mechanics/mutations.astro`
- Modify: `src/pages/guides/progression.astro`
- Modify: `src/pages/updates.astro`

1. Write failing tests that every recommendation target is an existing canonical route and includes a semantic reason.
2. Add a small typed recommendation map and make the tests pass.
3. Create restrained next-step and share components with clipboard/Web Share fallbacks and live status text.
4. Place next steps after each route's core answer rather than at the footer only.

### Task 6: Add accessible global shell and optional analytics consent

**Files:**
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/layouts/BaseLayout.test.ts`
- Modify: `src/components/Header.test.ts`
- Create: `src/lib/analytics-consent.ts`
- Create: `src/lib/analytics-consent.test.ts`
- Create: `src/components/AnalyticsConsent.astro`
- Create: `src/scripts/analytics-consent.ts`
- Modify: `src/pages/privacy.astro`
- Modify: `src/styles/global.css`

1. Add failing tests for the skip link, focusable main target, 44-pixel mobile controls, and consent-gated analytics hook.
2. Add failing unit tests for consent value parsing.
3. Implement the skip link, main target, touch sizing, contrast, and reduced-motion rules.
4. Replace unconditional Clarity loading with an explicit allowed/declined preference component and dynamic loader.
5. Add a footer preference button and update the privacy page with the exact opt-in/change path.
6. Re-run focused tests.

### Task 7: Add consent-bound editorial feedback and calculator sharing

**Files:**
- Create: `src/components/FeedbackPrompt.astro`
- Create: `src/scripts/feedback.ts`
- Modify: `src/components/Calculator.astro`
- Modify: `src/scripts/calculator.ts`
- Modify: `src/pages/seeds/list.astro`
- Modify: `src/pages/mechanics/mutations.astro`

1. Add a copy-scenario action that exports labelled inputs/results but no hidden identifiers.
2. Add a Helpful/Needs work prompt that remains hidden unless optional analytics is allowed.
3. Record only page path and feedback choice, show a local acknowledgement, and publish no counts.
4. Verify keyboard operation and consent gating in the browser.

### Task 8: Verify production output and hand off review links

**Files:**
- Create temporarily: `.artifact-work/ux-qa/*`

1. Run the complete Vitest suite.
2. Run `npm.cmd run build` and inspect the generated routes.
3. Serve the static output locally on `127.0.0.1:4321`.
4. Run desktop and 375-pixel Playwright checks for key routes and interactions; capture screenshots outside source directories.
5. Remove temporary QA scripts while keeping review screenshots and the preview server available.
6. Report build/test results, material assumptions, and direct local review URLs. Do not imply deployment.
