# Greedy Growers MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify an English five-page Greedy Growers Roblox tools MVP by recreating the proven page structures and interactions from the three approved reference sites.

**Architecture:** Astro statically renders all public content and shared navigation. Versioned JSON files are the single source of truth; small TypeScript modules power calculator math, seed filtering/comparison, analytics, and a Cloudflare Pages Function that proxies the Roblox Games API. Client JavaScript enhances already-readable HTML rather than supplying the primary content.

**Tech Stack:** Node.js 24, Astro 7, TypeScript, Tailwind CSS 4, Vitest 4, Astro Sitemap, Cloudflare Pages Functions.

## Global Constraints

- Implement only `/`, `/codes`, `/beginner-guide`, `/seeds`, `/calculator`, `/privacy`, `/disclaimer`, and `/contact`.
- English only; no Tier List, dark/light switch, accounts, community voting, Discord Bot, probability model, or best-harvest recommendation.
- Recreate layouts and interaction patterns; do not copy competitor source code, prose, logos, screenshots, ad code, or unsupported game data.
- Main text, navigation, and initial seed rows must be present in static HTML.
- Unknown seed values remain `null` and render as `Not verified`.
- Use native TypeScript client scripts; do not add Preact or a state library.
- Every implementation task ends with focused verification and a Git commit.

---

### Task 1: Scaffold the Astro application and verification commands

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/styles/global.css`
- Create: `src/env.d.ts`
- Create: `public/robots.txt`
- Modify: `.gitignore`

**Interfaces:**
- Produces npm scripts `dev`, `build`, `check`, and `test` used by every later task.
- Produces the global Tailwind theme and base utility classes consumed by all pages.

- [ ] **Step 1: Scaffold the minimal project**

Run:

```powershell
npm create astro@5.2.2 . -- --template minimal --install --no-git --yes
```

Expected: create-astro 5.2.2 creates an Astro 7 project without replacing the existing `docs` or `.git` directories; the framework itself is pinned to Astro 7.1.3 in the next step.

- [ ] **Step 2: Install the fixed MVP dependencies**

Run:

```powershell
npm install @astrojs/sitemap@3.7.3 tailwindcss@4.3.3 @tailwindcss/vite@4.3.3
npm install -D @astrojs/check@0.9.9 vitest@4.1.10 @cloudflare/workers-types
```

Expected: installation exits 0 and `package-lock.json` is created.

- [ ] **Step 3: Configure build, type-check, Tailwind, and sitemap**

Set `package.json` scripts to:

```json
{
  "dev": "astro dev",
  "build": "astro build",
  "check": "astro check",
  "test": "vitest run"
}
```

Configure `astro.config.mjs` with `site: 'https://greedygrowershub.com'`, the sitemap integration, and `tailwindcss()` in Vite plugins. Add `@import "tailwindcss";` plus the approved green/ink design tokens to `src/styles/global.css`.

- [ ] **Step 4: Verify the empty shell**

Run:

```powershell
npm run check
npm run build
```

Expected: both commands exit 0 and `dist/index.html` exists.

- [ ] **Step 5: Commit**

```powershell
git add package.json package-lock.json astro.config.mjs tsconfig.json src public .gitignore
git commit -m "chore: scaffold greedy growers astro site"
```

### Task 2: Add validated content data and trust labels

**Files:**
- Create: `src/data/site.json`
- Create: `src/data/codes.json`
- Create: `src/data/seeds.json`
- Create: `src/data/sources.json`
- Create: `src/lib/content.ts`
- Test: `src/lib/content.test.ts`

**Interfaces:**
- Produces `site`, `codes`, `seeds`, and `sources` exports.
- Produces `validateContent()` that throws on duplicate codes, unsupported statuses, invalid URLs, negative numeric values, or missing source IDs.

- [ ] **Step 1: Write failing content-validation tests**

Cover valid starter data, a duplicate code, a negative seed cost, an unsupported verification state, and an unknown source ID. Use the exact public type:

```ts
export type VerificationState = 'verified' | 'community-lead' | 'needs-check';
export function validateContent(input: ContentBundle): void;
```

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `npx vitest run src/lib/content.test.ts`

Expected: FAIL because `src/lib/content.ts` does not exist.

- [ ] **Step 3: Implement the minimal types, loader, and validation**

Use nullable number fields for `cost`, `harvestValue`, and `growthMinutes`. Seed records must include `id`, `name`, `type`, `rarity`, `sourceId`, `unlock`, `stage`, `verification`, `verifiedAt`, and `notes`.

Starter content contains no active codes and only conservative seed records drawn from approved public sources; unsupported values are `null`.

- [ ] **Step 4: Run validation tests**

Run: `npx vitest run src/lib/content.test.ts`

Expected: PASS with all validation cases passing.

- [ ] **Step 5: Commit**

```powershell
git add src/data src/lib/content.ts src/lib/content.test.ts
git commit -m "feat: add verified content data model"
```

### Task 3: Build the shared competitor-inspired shell

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/StatusBadge.astro`
- Create: `src/components/SourceList.astro`
- Create: `src/components/SectionHeading.astro`
- Create: `src/components/Icon.astro`
- Create: `src/scripts/analytics.ts`
- Modify: `src/styles/global.css`

**Interfaces:**
- `BaseLayout` accepts `title`, `description`, `canonicalPath`, and optional JSON-LD.
- Analytics pushes `{ event: string, ...detail }` to `window.dataLayer` without requiring an analytics vendor.

- [ ] **Step 1: Implement the static document shell**

Recreate the compact dark-green visual hierarchy from `greedygrowers.com`: sticky header, high-contrast green accents, bordered cards, small uppercase section labels, readable content width, and multi-column footer. Keep all naming and copy original to this project.

- [ ] **Step 2: Add crawlable navigation and metadata**

Header links exactly to Home, Codes, New Player, Seeds, Calculator, and Roblox. Footer links to all core and auxiliary pages. BaseLayout emits canonical, description, Open Graph, WebSite, Organization, and per-page breadcrumb data.

- [ ] **Step 3: Add vendor-neutral analytics events**

Elements with `data-event` attributes push events into `window.dataLayer`. Confirm `play_roblox_click` works without `gtag` being installed.

- [ ] **Step 4: Verify the shell**

Run:

```powershell
npm run check
npm run build
```

Expected: exit 0; built HTML contains `<nav>`, canonical metadata, and links to every core route.

- [ ] **Step 5: Commit**

```powershell
git add src/layouts src/components src/scripts src/styles
git commit -m "feat: add shared greedy growers site shell"
```

### Task 4: Recreate the approved homepage, Codes, and beginner route

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/codes.astro`
- Create: `src/pages/beginner-guide.astro`
- Create: `src/components/GameStatus.astro`
- Create: `src/components/RouteSteps.astro`
- Create: `src/components/CodeStatus.astro`

**Interfaces:**
- `GameStatus` renders a static fallback snapshot and uses `/api/game-status` only as enhancement.
- `CodeStatus` consumes validated `codes` data and separates active and expired states.

- [ ] **Step 1: Recreate the `.com` homepage hierarchy**

Implement Hero + game snapshot, five task cards, current code status, first-harvest preview, source boundary, FAQ, and Roblox CTA. Use original concise copy grounded in the official river → plot → growth → lightning → harvest loop.

- [ ] **Step 2: Recreate the `.com` Codes information flow with `.wiki` cards**

Render current answer, active state, expired state, reported redemption steps, failure reasons, source list, checked date, related links, and FAQ. With starter data, the active list must visibly say no verified active codes.

- [ ] **Step 3: Recreate the `.com` beginner guide**

Render five numbered route cards, what to watch before harvesting, first-session mistakes, next choices, and claim-strength labels. Link directly to Seeds, Calculator, and Roblox.

- [ ] **Step 4: Verify static content and routes**

Run `npm run build`, then search built HTML for `No verified active codes`, `First Harvest Route`, and all five core hrefs.

Expected: build exits 0 and each phrase exists in its route's HTML.

- [ ] **Step 5: Commit**

```powershell
git add src/pages src/components
git commit -m "feat: add homepage codes and beginner guide"
```

### Task 5: Implement the manual ROI calculator with TDD

**Files:**
- Create: `src/lib/calculator.ts`
- Test: `src/lib/calculator.test.ts`
- Create: `src/components/Calculator.astro`
- Create: `src/scripts/calculator.ts`
- Create: `src/pages/calculator.astro`

**Interfaces:**
- Produces `calculateProfit(input: CalculatorInput): CalculatorResult`.
- Produces `validateCalculatorInput(input): Record<keyof CalculatorInput, string | null>`.

- [ ] **Step 1: Write failing formula and validation tests**

Test the approved sample `{ seedCost: 100, harvestValue: 160, waitMinutes: 3, failedRuns: 1 }` and expect:

```ts
{
  profitPerSuccess: 60,
  profitPerMinute: 20,
  breakEvenHarvest: 200,
  riskAdjustedProfit: -40,
  riskAdjustedProfitPerMinute: -6.666666666666667
}
```

Also test zero wait, negative values, `NaN`, and infinity.

- [ ] **Step 2: Run tests and confirm failure**

Run: `npx vitest run src/lib/calculator.test.ts`

Expected: FAIL because calculator exports do not exist.

- [ ] **Step 3: Implement the minimal pure calculation module**

Reject invalid input before calculating. Do not introduce a probability, risk preference, preset seed, or optimal waiting recommendation.

- [ ] **Step 4: Run tests and confirm pass**

Run: `npx vitest run src/lib/calculator.test.ts`

Expected: PASS for formulas and invalid inputs.

- [ ] **Step 5: Recreate the `.com` calculator interface**

Use four labeled inputs, sample/reset controls, five result cards, formula explanations, data-boundary notes, sources, and FAQ. The page is readable before hydration; the client script handles submit, reset, formatted output, field errors, and `calculator_run`.

- [ ] **Step 6: Verify and commit**

Run `npm run test`, `npm run check`, and `npm run build`; all must exit 0.

```powershell
git add src/lib/calculator* src/components/Calculator.astro src/scripts/calculator.ts src/pages/calculator.astro
git commit -m "feat: add manual profit calculator"
```

### Task 6: Implement the Seeds list, filters, sorting, and comparison with TDD

**Files:**
- Create: `src/lib/seeds.ts`
- Test: `src/lib/seeds.test.ts`
- Create: `src/components/SeedExplorer.astro`
- Create: `src/scripts/seeds.ts`
- Create: `src/pages/seeds.astro`

**Interfaces:**
- Produces `filterSeeds(seeds, filters)` and `sortSeeds(seeds, key, direction)`.
- Produces `compareSeeds(left, right)` whose numeric differences are `number | null`.

- [ ] **Step 1: Write failing seed utility tests**

Cover verification and stage filtering, ascending/descending numeric sorting with nulls last, alphabetical sorting, numeric comparison, and null comparison output.

- [ ] **Step 2: Run tests and confirm failure**

Run: `npx vitest run src/lib/seeds.test.ts`

Expected: FAIL because seed utility exports do not exist.

- [ ] **Step 3: Implement pure filtering, sorting, and comparison**

Functions must not mutate the source array. Unknown numeric values remain last in either sort direction and compare as `null`.

- [ ] **Step 4: Run tests and confirm pass**

Run: `npx vitest run src/lib/seeds.test.ts`

Expected: PASS for all sort, filter, and compare cases.

- [ ] **Step 5: Recreate the `wiki.wiki` Seeds experience**

Render an indexable desktop table and mobile cards, verification legend, filters, sort controls, two selectors, comparison output, capture checklist, sources, and checked date. The client script updates visible rows and emits `seed_filter_change` and `seed_compare`.

- [ ] **Step 6: Verify and commit**

Run `npm run test`, `npm run check`, and `npm run build`; all must exit 0.

```powershell
git add src/lib/seeds* src/components/SeedExplorer.astro src/scripts/seeds.ts src/pages/seeds.astro
git commit -m "feat: add seed explorer and comparison"
```

### Task 7: Add Roblox status proxy and safe fallback behavior

**Files:**
- Create: `src/lib/game-status.ts`
- Test: `src/lib/game-status.test.ts`
- Create: `functions/api/game-status.ts`
- Create: `src/scripts/game-status.ts`
- Modify: `src/components/GameStatus.astro`

**Interfaces:**
- Produces `fetchGameStatus(fetcher, universeId)` returning normalized status or throwing `GameStatusError`.
- Pages Function returns normalized JSON with `Cache-Control: public, max-age=300, s-maxage=300`.

- [ ] **Step 1: Write failing proxy tests**

Mock a valid Roblox response, an empty `data` array, HTTP 429, malformed JSON, and fetch rejection. Verify only `playing`, `visits`, `favoritedCount`, `maxPlayers`, and `updated` are exposed.

- [ ] **Step 2: Run tests and confirm failure**

Run: `npx vitest run src/lib/game-status.test.ts`

Expected: FAIL because game-status exports do not exist.

- [ ] **Step 3: Implement normalization and Pages Function wrapper**

Use universe ID `10440833423`. Function errors return `{ "error": "Game status temporarily unavailable" }` with status 502; they never return fabricated zero values.

- [ ] **Step 4: Enhance the static status component**

The static fallback remains visible. On successful fetch, replace values and checked time. On failure, retain fallback and add `Live refresh unavailable`.

- [ ] **Step 5: Verify and commit**

Run `npm run test`, `npm run check`, and `npm run build`; all must exit 0.

```powershell
git add src/lib/game-status* functions src/scripts/game-status.ts src/components/GameStatus.astro
git commit -m "feat: add cached roblox game status"
```

### Task 8: Add legal pages, finish SEO, and complete release verification

**Files:**
- Create: `src/pages/privacy.astro`
- Create: `src/pages/disclaimer.astro`
- Create: `src/pages/contact.astro`
- Create: `public/favicon.svg`
- Create: `public/og-image.svg`
- Modify: `public/robots.txt`
- Modify: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Produces complete crawlable auxiliary pages and public search assets.

- [ ] **Step 1: Add concise original legal and contact copy**

State fan-made status, Roblox non-affiliation, analytics/data behavior, correction policy, and contact instructions without inventing an email address.

- [ ] **Step 2: Finalize sitemap, robots, favicon, and Open Graph image**

Robots allows public crawling and references the generated sitemap. Every page uses the same brand icon and a descriptive default social image.

- [ ] **Step 3: Run the full automated verification**

Run:

```powershell
npm run test
npm run check
npm run build
git diff --check
```

Expected: all commands exit 0 with no test, type, build, or whitespace failures.

- [ ] **Step 4: Run local route and link checks**

Start Astro preview on port 4321. Confirm all eight routes return 200, sitemap URLs return 200, core links have real hrefs, and `/api/game-status` failure leaves a readable fallback when not running under Cloudflare.

- [ ] **Step 5: Run desktop and mobile visual checks**

Inspect `/`, `/codes`, `/beginner-guide`, `/seeds`, and `/calculator` at 1440×1000 and 375×812. Confirm no horizontal overflow, overlapping controls, inaccessible contrast, clipped tables, or hidden primary actions.

- [ ] **Step 6: Commit the release candidate**

```powershell
git add src public astro.config.mjs
git commit -m "feat: complete greedy growers mvp"
```

- [ ] **Step 7: Report deployment boundary**

If Cloudflare credentials or domain ownership are not available locally, provide the verified local URL, build output directory `dist`, required Pages build command `npm run build`, and output directory `dist` without attempting an unauthorized external deployment.
