# Evidence-Aware Profit Planner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the homepage Calculator into a responsive scenario dashboard with session metrics and an evidence-aware seed comparison.

**Architecture:** Keep calculation logic pure in `src/lib` and render the UI with the existing Astro component and browser-only script. Derive rankability from local SeedRecord fields rather than a copied or stored leaderboard value.

**Tech Stack:** Astro 7, TypeScript, Tailwind CSS 4, Vitest.

## Global Constraints

- Preserve `/` as the calculator canonical; add no route or dependency.
- Do not add unverified seed economics or claim a prediction of player outcomes.
- Keep existing failed-run logic and source/evidence labels.
- Use `npm.cmd` under PowerShell for validation.

---

### Task 1: Add testable session and ranking contracts

**Files:**
- Create: `src/lib/calculator-session.ts`
- Create: `src/lib/calculator-session.test.ts`
- Create: `src/lib/calculator-ranking.ts`
- Create: `src/lib/calculator-ranking.test.ts`

**Interfaces:**
- Consumes: `CalculatorResult` and `SeedRecord`.
- Produces: `calculateSessionScenario(input)` and `buildSeedComparison(records, limit)`.

- [ ] **Step 1: Write failing tests**

```ts
expect(calculateSessionScenario({ result, plots: 5, sessionMinutes: 60 })).toMatchObject({ completedCycles: 20, sessionProfit: 6000, roi: 60 });
expect(buildSeedComparison(records, 3).ranked[0].profitPerMinute).toBe(20);
expect(buildSeedComparison(records, 3).unrankable[0].missing).toEqual(['harvest value']);
```

- [ ] **Step 2: Run failing tests**

Run: `npm.cmd test -- src/lib/calculator-session.test.ts src/lib/calculator-ranking.test.ts`

Expected: FAIL because the new modules do not yet exist.

- [ ] **Step 3: Implement minimal pure helpers**

```ts
completedCycles = Math.floor(sessionMinutes / result.waitMinutes)
sessionProfit = result.profitPerSuccess * plots * completedCycles
profitPerMinute = sessionMinutes ? sessionProfit / sessionMinutes : 0
```

Rank only records with non-null `cost`, `harvestValue`, and `growthMinutes`; calculate base pace as `(harvestValue - cost) / growthMinutes` and record missing fields for all others.

- [ ] **Step 4: Run the focused tests**

Run: `npm.cmd test -- src/lib/calculator-session.test.ts src/lib/calculator-ranking.test.ts`

Expected: PASS.

### Task 2: Render the responsive dashboard and evidence-aware comparison

**Files:**
- Modify: `src/components/Calculator.astro`
- Modify: `src/scripts/calculator.ts`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `calculateSessionScenario()` and `buildSeedComparison()` from Task 1.
- Produces: named `data-output` values for four scenario metrics and a responsive table/card comparison.

- [ ] **Step 1: Add dashboard controls and outputs**

Add plots and session minutes as native range inputs. Add four labelled outputs for session profit/minute, session profit, ROI, and revenue. Preserve existing manual advanced inputs and risk decision panel.

- [ ] **Step 2: Build the server-rendered comparison**

Use `buildSeedComparison(seeds, 6)` to render ranked rows when complete local records exist and otherwise render missing-field, evidence-labelled rows. Render a table on medium screens and cards on mobile.

- [ ] **Step 3: Connect live browser updates**

Read plot/session controls alongside the existing form data. Update the four new outputs on every input event and leave the failed-run decision calculation untouched.

- [ ] **Step 4: Preserve explanatory copy**

State that session values are a scenario from entered observations and that unranked seeds need evidence, not copied values.

### Task 3: Verify the product contract and local review path

**Files:**
- Modify: `src/lib/calculator.test.ts` only if existing behavior needs a regression assertion.

- [ ] **Step 1: Run the entire unit suite**

Run: `npm.cmd test`

Expected: all Vitest files pass.

- [ ] **Step 2: Run Astro diagnostics and production build**

Run: `npm.cmd run check` then `npm.cmd run build`.

Expected: zero Astro diagnostics and a completed production build.

- [ ] **Step 3: Start a temporary local review server**

Run: `npx.cmd astro dev --background`, then verify `http://127.0.0.1:4321/` returns 200 and visually inspect desktop and mobile layouts.
