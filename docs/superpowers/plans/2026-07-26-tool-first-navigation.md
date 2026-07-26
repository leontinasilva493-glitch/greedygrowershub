# Greedy Growers Tool-First Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the current hub into a calculator-led multi-page site with Guides, Seeds, Mechanics, Codes, and Updates clusters plus clearly labeled competitor-reported gameplay data.

**Architecture:** Keep Astro static output and the existing JSON-driven content pattern. Add local snapshot datasets and pure TypeScript calculator/tier helpers, render new static Astro pages, and use Cloudflare `_redirects` plus Astro redirect configuration for the retired `/calculator/` route.

**Tech Stack:** Astro 7, TypeScript, Tailwind CSS 4, Vitest, Cloudflare Workers static assets

## Global Constraints

- Do not add dependencies or change the Astro/Cloudflare architecture.
- Do not fetch competitor data during build or runtime.
- Label all copied gameplay values as community-reported and pending in-game recheck.
- Keep privacy, disclaimer, and contact pages `noindex`.
- Do not add multilingual navigation, accounts, uploads, scripts, or seed detail routes.
- Preserve existing URLs except that `/calculator/` permanently redirects to `/`.

---

### Task 1: Extend and validate the local gameplay snapshot

**Files:**
- Modify: `src/lib/content.ts`
- Modify: `src/lib/content.test.ts`
- Modify: `src/data/sources.json`
- Replace: `src/data/seeds.json`
- Create: `src/data/fertilizers.json`
- Create: `src/data/rebirths.json`

**Interfaces:**
- Produces: `SeedRecord` with `multiHarvest`, `reportedProfitPerMinute`, `tier`, and `bestUse`.
- Produces: `FertilizerRecord`, `RebirthRecord`, `fertilizers`, and `rebirths` exports.
- Every new record references `sourceId: 'greedygrowers-codes'`.

- [ ] **Step 1: Write failing content validation tests**

Add a fertilizer and rebirth fixture to `makeBundle()`. Add tests that reject an unsupported seed tier, a fertilizer multiplier below 1, and duplicate rebirth levels.

```ts
expect(() => validateContent(bundleWithTier('Z' as never))).toThrow('Unsupported seed tier');
expect(() => validateContent(bundleWithFertilizerMultiplier(0.5))).toThrow('Fertilizer boost multiplier must be at least 1');
expect(() => validateContent(bundleWithDuplicateRebirth())).toThrow('Duplicate rebirth level: 1');
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/lib/content.test.ts`

Expected: FAIL because the bundle and validation logic do not yet support fertilizers, rebirths, or tiers.

- [ ] **Step 3: Add types, validation, sources, and data files**

Convert the competitor's growth seconds to minutes. Add the 12 seed rows, 3 fertilizers, 5 rebirth levels, and S-D assignments from the 2026-07-26 snapshot. Use `community-lead` for every copied record.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm test -- src/lib/content.test.ts`

Expected: all content validation tests pass.

---

### Task 2: Add seed and fertilizer calculator behavior

**Files:**
- Modify: `src/lib/calculator.ts`
- Modify: `src/lib/calculator.test.ts`
- Modify: `src/components/Calculator.astro`
- Modify: `src/scripts/calculator.ts`

**Interfaces:**
- Extends: `CalculatorInput` with `fertilizerCost` and `harvestMultiplier`.
- Produces: result fields `totalInvestment`, `boostedHarvestValue`, and the existing profit fields.
- Consumes: `seeds` and `fertilizers` from `src/lib/content.ts`.

- [ ] **Step 1: Write failing fertilizer calculation tests**

```ts
expect(calculateProfit({ seedCost: 100, harvestValue: 200, waitMinutes: 2, failedRuns: 0, fertilizerCost: 20, harvestMultiplier: 1.5 })).toMatchObject({
  totalInvestment: 120,
  boostedHarvestValue: 300,
  profitPerSuccess: 180,
  breakEvenHarvest: 120,
});
```

Also test that a multiplier below 1 is rejected.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/lib/calculator.test.ts`

Expected: FAIL because fertilizer inputs and outputs do not exist.

- [ ] **Step 3: Implement the minimal pure calculation changes**

Use one-run investment as `seedCost + fertilizerCost`, multiply the entered base harvest by `harvestMultiplier`, and include the fertilizer cost in every failed-run break-even cycle.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm test -- src/lib/calculator.test.ts`

- [ ] **Step 5: Add accessible seed and fertilizer selectors**

The seed selector writes source values into the cost, harvest, and wait inputs. The fertilizer selector writes cost and multiplier into hidden numeric inputs. A visible notice links to the competitor snapshot and states that manual edits remain authoritative.

- [ ] **Step 6: Re-run calculator and full tests**

Run: `npm test -- src/lib/calculator.test.ts && npm test`

---

### Task 3: Make the homepage the calculator canonical

**Files:**
- Replace: `src/pages/index.astro`
- Delete: `src/pages/calculator.astro`
- Modify: `src/lib/seo.ts`
- Modify: `src/lib/seo.test.ts`
- Modify: `astro.config.mjs`
- Create: `public/_redirects`

**Interfaces:**
- `/` renders the Calculator and owns its WebApplication schema.
- `/calculator/` redirects to `/` through Astro static redirect output and Cloudflare `_redirects`.

- [ ] **Step 1: Write failing SEO ownership tests**

Assert that `pageSeo.home` has canonical `/`, H1 `Greedy Growers Calculator`, and a calculator-led title. Assert that `pageSeo` has metadata for best seeds, guides, get money fast, progression, tickets, mechanics, lightning, when to harvest, and updates.

- [ ] **Step 2: Run SEO tests and verify RED**

Run: `npm test -- src/lib/seo.test.ts`

- [ ] **Step 3: Implement metadata and homepage content**

Render one H1, the Calculator immediately below the introduction, data-recording guidance, formula explanation, contextual links, and calculator FAQ. Use `WebApplication` plus `FAQPage` structured data.

- [ ] **Step 4: Add redirects and sitemap exclusion**

Add `redirects: { '/calculator': '/' }` to Astro config, add `/calculator/* / 301` to `public/_redirects`, delete the old page, and exclude `/calculator/` from sitemap generation.

- [ ] **Step 5: Run SEO tests and build**

Run: `npm test -- src/lib/seo.test.ts && npm run build`

Expected: homepage builds with calculator metadata and the redirect asset is present in `dist/_redirects`.

---

### Task 4: Publish seed list and goal-based Best Seeds page

**Files:**
- Modify: `src/components/SeedExplorer.astro`
- Modify: `src/lib/seeds.ts`
- Modify: `src/lib/seeds.test.ts`
- Modify: `src/pages/seeds.astro`
- Create: `src/pages/seeds/best-seeds.astro`

**Interfaces:**
- Produces: `groupSeedsByTier(records)` returning S-D groups in fixed order.
- `/seeds/` shows all 12 reported records and source status.
- `/seeds/best-seeds/` shows rankings by beginner fit, fast money, post-rebirth, risk, and reported profit per minute.

- [ ] **Step 1: Write a failing tier grouping test**

```ts
expect(groupSeedsByTier(fixtures).map((group) => group.tier)).toEqual(['S', 'A', 'B', 'C', 'D']);
```

- [ ] **Step 2: Run seed tests and verify RED**

Run: `npm test -- src/lib/seeds.test.ts`

- [ ] **Step 3: Implement grouping and page rendering**

Add profit-per-minute, tier, and multi-harvest information to desktop and mobile seed views. The Best Seeds page must include its ranking method, source link, and `Needs in-game recheck` notice above the recommendations.

- [ ] **Step 4: Run focused and full tests**

Run: `npm test -- src/lib/seeds.test.ts && npm test`

---

### Task 5: Add Guides, Mechanics, and Updates routes

**Files:**
- Create: `src/pages/guides/index.astro`
- Create: `src/pages/guides/get-money-fast.astro`
- Create: `src/pages/guides/progression.astro`
- Create: `src/pages/guides/tickets.astro`
- Create: `src/pages/mechanics/index.astro`
- Create: `src/pages/mechanics/lightning.astro`
- Create: `src/pages/mechanics/when-to-harvest.astro`
- Create: `src/pages/updates.astro`
- Create: `src/components/PlayerTestCard.astro`

**Interfaces:**
- `/guides/` links to Beginner, Get Money Fast, Progression, and Tickets.
- `/guides/progression/` contains Early, Mid, Late, Tickets, Fertilizer, Rebirth, and Farmer's Market sections.
- `/mechanics/lightning/` discusses mechanism facts without inventing odds.
- `/mechanics/when-to-harvest/` combines harvesting and greed/risk strategy.
- `PlayerTestCard` embeds a relevant YouTube video and labels the claim state.
- `/updates/` contains at least three dated entries: site launch baseline, competitor snapshot import, and navigation/tool expansion.

- [ ] **Step 1: Create the four static pages using existing layout components**

Every page gets one H1, three to five H2 sections, descriptive H3s, two to five contextual internal links, breadcrumbs, and schema. Videos appear only inside the page that answers the video's problem.

- [ ] **Step 2: Build and inspect generated headings and canonicals**

Run: `npm run build`

Expected routes: `/guides/`, `/guides/get-money-fast/`, `/guides/progression/`, `/guides/tickets/`, `/mechanics/`, `/mechanics/lightning/`, `/mechanics/when-to-harvest/`, and `/updates/`.

---

### Task 6: Replace flat navigation with the approved hierarchy

**Files:**
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`

**Interfaces:**
- Desktop navigation has Guides, Seeds, Mechanics, Calculator, Codes, Updates, and Play on Roblox.
- Mobile menu exposes the same destinations without hover-only behavior.
- Footer groups Tools, Guides, and Trust links.

- [ ] **Step 1: Implement desktop dropdown and active states**

Use native `<details>` for keyboard accessibility. Highlight Guides for all `/guides/*` routes and the existing `/beginner-guide/` route.

- [ ] **Step 2: Implement mobile hierarchy**

Keep all destinations visible inside the existing mobile `<details>` panel. Do not rely on JavaScript for navigation.

- [ ] **Step 3: Replace old `/calculator/` internal links**

Run: `rg -n 'href="/calculator/' src` and change every result to `/`.

---

### Task 7: Final verification and commit

**Files:**
- Review all changed files

- [ ] **Step 1: Run automated verification**

Run: `npm test`

Run: `npm run check`

Run: `npm run build`

- [ ] **Step 2: Inspect built routes and source-visible SEO**

Verify generated titles, descriptions, H1 counts, canonical links, JSON-LD, source labels, and internal links in `dist`.

- [ ] **Step 3: Run the site in Astro background mode and visually inspect**

Run: `npx astro dev --background`

Check desktop and mobile homepage, Guides dropdown, Calculator selectors, Seeds, Tier List, and Updates. Stop with `npx astro dev stop`.

- [ ] **Step 4: Review diff and commit one logical feature**

Stage only the planned files and commit with:

```text
feat: expand calculator-led site navigation
```
