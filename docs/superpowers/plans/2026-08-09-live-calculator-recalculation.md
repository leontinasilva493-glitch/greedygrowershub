# Live Calculator Recalculation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every calculator control update the right-side profit scenario immediately while preserving clear evidence warnings for incomplete seed economics.

**Architecture:** Keep `calculateProfit()` and `calculateSessionScenario()` as the single formula source. The browser controller always calls `update()` after any left-side change; a selected seed supplies only its reported cost and context, while the current form values remain the active scenario. A non-blocking mismatch notice distinguishes a calculated input scenario from a verified seed economy record.

**Tech Stack:** Astro, TypeScript, Vitest, Tailwind CSS.

## Global Constraints

- Do not invent current-game sell values or growth times.
- Preserve the current source-matched seed cost, rarity, and spawn context.
- Keep all result numbers responsive and compact for large values.
- Keep browser-only calculations; do not add services or dependencies.

---

### Task 1: Preserve a live scenario across seed selections

**Files:**
- Modify: `src/scripts/calculator.ts`
- Test: `src/lib/calculator.test.ts`

**Interfaces:**
- Consumes: `calculateProfit(input: CalculatorInput): CalculatorResult`
- Produces: one `update()` path that runs for every left-side form control.

- [ ] **Step 1: Add a regression test for a cost-dominant scenario**

```ts
expect(calculateProfit({
  seedCost: 20_000,
  harvestValue: 160,
  waitMinutes: 3,
  failedRuns: 0,
  fertilizerCost: 100,
  harvestMultiplier: 1.25,
}).profitPerMinute).toBeLessThan(0);
```

- [ ] **Step 2: Run the test**

Run: `npm.cmd test -- src/lib/calculator.test.ts`

Expected: PASS; this documents that a loss is a real scenario result, not a reason to stop recalculation.

- [ ] **Step 3: Remove selection-time clearing of `harvestValue` and `waitMinutes`**

```ts
seedPreset?.addEventListener('change', () => {
  const option = seedPreset.selectedOptions[0];
  setNumberInput('seedCost', option?.dataset.seedCost);
  updateContext();
  updateObservationStatus();
  update();
});
```

- [ ] **Step 4: Make `update()` always calculate valid current form values**

```ts
const result = calculateProfit({
  seedCost: Number(data.get('seedCost')),
  harvestValue: Number(data.get('harvestValue')),
  waitMinutes: Number(data.get('waitMinutes')),
  failedRuns: Number(data.get('failedRuns')),
  fertilizerCost: Number(data.get('fertilizerCost')),
  harvestMultiplier: Number(data.get('harvestMultiplier')),
});
```

- [ ] **Step 5: Run the focused tests**

Run: `npm.cmd test -- src/lib/calculator.test.ts src/lib/calculator-session.test.ts`

Expected: PASS.

### Task 2: Keep profit cards stable and explain input quality

**Files:**
- Modify: `src/components/Calculator.astro`
- Modify: `src/scripts/calculator.ts`
- Test: `src/lib/tdh-content.test.ts`

**Interfaces:**
- Consumes: form values and `CalculatorResult`
- Produces: persistent Profit/min, Total profit, ROI, and Revenue card labels plus `data-scenario-notice` text.

- [ ] **Step 1: Add the source-visible contract test**

```ts
expectPhrases(calculator, [
  'data-scenario-notice',
  'Profit / min',
  'Total profit',
  'ROI',
  'Revenue',
]);
```

- [ ] **Step 2: Run it to verify the missing notice contract fails**

Run: `npm.cmd test -- src/lib/tdh-content.test.ts`

Expected: FAIL until the notice exists.

- [ ] **Step 3: Replace the seed-data card-mode branch with a non-blocking notice**

```ts
scenarioNotice.textContent = selectedSeedNeedsObservation
  ? 'Calculated from the current inputs. This seed still needs a recorded sell value and wait time for an evidence-complete result.'
  : 'Calculated from the current inputs and recorded run values.';
```

- [ ] **Step 4: Run the contract test**

Run: `npm.cmd test -- src/lib/tdh-content.test.ts`

Expected: PASS.

### Task 3: Verify every input path and ship a local build

**Files:**
- Modify only if verification exposes a defect: `src/scripts/calculator.ts`, `src/components/Calculator.astro`

- [ ] **Step 1: Verify browser behavior**

Run: select a seed, then change fertilizer, plots, session time, failed runs, harvest value, wait time, fertilizer cost, and multiplier. Confirm each change updates right-side cards immediately.

- [ ] **Step 2: Run full verification**

Run: `npm.cmd test && npm.cmd run check && npm.cmd run build && git diff --check`

Expected: all tests pass, Astro reports zero diagnostics, production build completes, and diff check has no whitespace errors.
