# Calculator P0 Quick Iteration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the homepage Calculator with preset-first controls, progressive disclosure, failed-run decision guidance, a reported-seed preview, and privacy-safe analytics while preserving the current evidence and route contracts.

**Architecture:** Keep `src/lib/calculator.ts` as the pure arithmetic and decision authority, keep `src/scripts/calculator.ts` as the browser adapter, and keep `src/components/Calculator.astro` as the accessible UI. Add one focused seed-preview component that consumes validated content records and never changes the underlying community data.

**Tech Stack:** Astro 7, TypeScript, Tailwind CSS 4, Vitest

## Global Constraints

- Keep `/` as the only Calculator canonical route.
- Keep `/calculator/` redirected to `/` and excluded from the sitemap.
- Do not add dependencies, session-profit simulation, lightning probability, or official-data claims.
- Every preset must remain replaceable with player-entered values.
- Analytics must not include manually entered values, failure counts, or costs.
- Preserve the untracked `自用/` directory and all unrelated user changes.

---

### Task 1: Add failed-run decision semantics

**Files:**
- Modify: `src/lib/calculator.test.ts`
- Modify: `src/lib/calculator.ts`

**Interfaces:**
- Consumes: `CalculatorResult`
- Produces: `CalculatorDecision`, `CalculatorDecisionState`, and `getCalculatorDecision(result)`

- [ ] **Step 1: Write failing decision tests**

Add literal expectations for positive, zero, and negative risk-adjusted profit:

```ts
expect(getCalculatorDecision({ ...result, riskAdjustedProfit: 20 }).state).toBe('profitable');
expect(getCalculatorDecision({ ...result, riskAdjustedProfit: 0 }).state).toBe('break-even');
expect(getCalculatorDecision({ ...result, riskAdjustedProfit: -20 }).state).toBe('loss');
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/lib/calculator.test.ts`

Expected: FAIL because `getCalculatorDecision` is not exported.

- [ ] **Step 3: Implement the minimal pure decision helper**

Return a stable state, headline, and explanation for each branch. Do not inspect inputs or invent probability.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm test -- src/lib/calculator.test.ts`

Expected: PASS.

---

### Task 2: Add deterministic reported-seed preview selection

**Files:**
- Create: `src/lib/calculator-seeds.test.ts`
- Create: `src/lib/calculator-seeds.ts`
- Create: `src/components/CalculatorSeedPreview.astro`

**Interfaces:**
- Consumes: `SeedRecord[]` from `src/lib/content.ts`
- Produces: `getReportedSeedPreview(records, limit = 5): SeedRecord[]`

- [ ] **Step 1: Write a failing selection test**

Use complete literal `SeedRecord` fixtures and assert descending reported profit pace, stable name tie-breaking, no input mutation, and missing values last.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/lib/calculator-seeds.test.ts`

Expected: FAIL because the selector module does not exist.

- [ ] **Step 3: Implement the selector and preview component**

Implement a copied-array sort, slice it to five, and render growth time, cost, multi-harvest status, reported pace, and evidence state with a link to `/seeds/list/`.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm test -- src/lib/calculator-seeds.test.ts`

Expected: PASS.

---

### Task 3: Build preset-first Calculator UI and privacy-safe events

**Files:**
- Create: `src/lib/calculator-analytics.test.ts`
- Create: `src/lib/calculator-analytics.ts`
- Modify: `src/scripts/calculator.ts`
- Modify: `src/components/Calculator.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `calculateProfit`, `getCalculatorDecision`, preset option data attributes, and the existing global `dataLayer`
- Produces: `createCalculatorAnalyticsEvent(name, label, pagePath)` and the browser bindings that apply presets, render decisions, and push privacy-safe events

- [ ] **Step 1: Write failing analytics-record tests**

Assert literal event records for seed selection, fertilizer selection, and advanced disclosure. Assert that the returned object contains exactly `event`, `event_label`, and `page_path`, with no numeric calculator values.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/lib/calculator-analytics.test.ts`

Expected: FAIL because the analytics module does not exist.

- [ ] **Step 3: Implement the event factory, browser bindings, and component structure**

Keep the three quick controls visible, place five numeric controls inside native `<details>`, render one decision hero plus supporting metrics, and push only factory-created events. Preset changes overwrite the matching advanced inputs; removing `readonly` keeps fertilizer cost and multiplier manually editable after that overwrite.

- [ ] **Step 4: Add the preview and contextual continuation links**

Render `CalculatorSeedPreview` after the Calculator. Add links to Seed List, Harvest Timing, Money Guide, and Updates with `data-event="calculator_continue_click"` and destination-only details.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run: `npm test -- src/lib/calculator.test.ts src/lib/calculator-seeds.test.ts src/lib/calculator-analytics.test.ts`

Expected: PASS.

---

### Task 4: Verify content, routes, and production output

**Files:**
- Verify: `src/lib/tdh-content.test.ts`
- Verify: `src/lib/routes.test.ts`
- Verify: `dist/index.html`
- Verify: `dist/sitemap-0.xml`

**Interfaces:**
- Consumes: completed Calculator UI and route configuration
- Produces: a locally reviewable production build

- [ ] **Step 1: Run all unit and source contracts**

Run: `npm test`

Expected: all Vitest files pass with zero failures.

- [ ] **Step 2: Run Astro diagnostics**

Run: `npm run check`

Expected: zero errors, warnings, and hints.

- [ ] **Step 3: Build production output**

Run: `npm run build`

Expected: exit code 0 and all static pages generated.

- [ ] **Step 4: Audit generated Calculator output**

Verify `dist/index.html` contains one Calculator H1, the decision panel, advanced disclosure, seed preview, source warning, homepage canonical, and contextual links. Verify the sitemap excludes `/calculator/` and includes `/`.

- [ ] **Step 5: Start a local background preview for user review**

Run: `npm run dev -- --background`

Expected: Astro reports the background dev server URL and status without blocking the terminal.
