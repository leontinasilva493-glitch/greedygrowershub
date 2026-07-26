# Eight Search-Intent Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade eight Greedy Growers acquisition pages with actionable, evidence-labeled MVP content and migrate the Seed List and Best Seeds canonicals to the requested routes.

**Architecture:** Keep the existing Astro static site, content datasets, and evidence components. Expand the current pages in place, rename the two Seeds page files, update all route consumers, and use permanent redirects for the retired Seed URLs.

**Tech Stack:** Astro 7, TypeScript, Tailwind CSS, Vitest, Playwright

## Global Constraints

- Do not add dependencies or change the Astro architecture.
- Do not commit `自用/` or its reference files.
- Treat official Roblox text as official; treat YouTube outcomes as creator experience.
- Keep copied seed, fertilizer, and rebirth values labeled community-reported with a checked date.
- Do not claim lightning probability, universal warning timing, stable Ticket limits, or verified rewards without reproducible evidence.
- Keep every indexable Title at 50–60 characters and Description at 150–160 characters.
- Keep one source-visible H1 and two to five H2s per indexable page.

---

### Task 1: Lock the first-priority page contracts

**Files:**
- Modify: `src/lib/tdh-content.test.ts`
- Modify: `src/pages/beginner-guide.astro`
- Modify: `src/pages/guides/get-money-fast.astro`
- Modify: `src/pages/mechanics/lightning.astro`
- Modify: `src/pages/mechanics/when-to-harvest.astro`

**Interfaces:**
- Consumes: `SectionHeading`, `StatusBadge`, `PlayerTestCard`, `RouteSteps`, and current metadata.
- Produces: four complete first-priority pages with actionable decision support.

- [ ] **Step 1: Add failing content assertions**

Assert these new source-visible phrases:

```ts
expectPhrases(beginner, ['First-Run Checklist', 'Record the Result Before Buying Again']);
expectPhrases(money, ['Money Route by Player Stage', 'Reported Seed Pace Is Not Guaranteed Profit']);
expectPhrases(lightning, ['Confirmed', 'Not Verified', 'Use Exposure Time, Not Invented Odds']);
expectPhrases(harvest, ['Choose a Harvest Strategy by Bankroll', 'Two or More Failed Runs']);
```

- [ ] **Step 2: Run the test and confirm RED**

Run: `npm test -- src/lib/tdh-content.test.ts`

Expected: FAIL because the new sections and decision labels are absent.

- [ ] **Step 3: Implement the Beginner and Money additions**

Add a first-run checklist to Beginner Guide without changing the official five-step route. Add a stage-based money table derived from the current seed snapshot and label the figures community-reported.

- [ ] **Step 4: Implement the Lightning and Harvest decision aids**

Turn the first Lightning section into a clear confirmed-versus-unverified matrix. Add a bankroll/failure decision table to When to Harvest while keeping the existing three strategies and creator tests.

- [ ] **Step 5: Run focused tests and Astro diagnostics**

Run: `npm test -- src/lib/tdh-content.test.ts && npm run check`

Expected: PASS and zero Astro diagnostics.

---

### Task 2: Migrate Seed canonical routes without duplication

**Files:**
- Modify: `src/lib/seo.test.ts`
- Modify: `src/lib/seo.ts`
- Modify: `src/components/Header.test.ts`
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`
- Modify: `astro.config.mjs`
- Modify: `public/_redirects`
- Move: `src/pages/seeds.astro` to `src/pages/seeds/list.astro`
- Move: `src/pages/seeds/best-seeds.astro` to `src/pages/seeds/best.astro`

**Interfaces:**
- Produces: `/seeds/list/` and `/seeds/best/` as the only indexable Seed canonicals.
- Produces: 301 redirects from `/seeds/` and `/seeds/best-seeds/`.

- [ ] **Step 1: Write failing route assertions**

Update exact metadata expectations to:

```ts
expect(pageSeo.seeds.canonicalPath).toBe('/seeds/list/');
expect(pageSeo.bestSeeds.canonicalPath).toBe('/seeds/best/');
```

Assert Header and Footer contain the new hrefs and exclude the old hrefs. Assert Astro and Cloudflare redirect configuration contains both retired routes.

- [ ] **Step 2: Run route tests and confirm RED**

Run: `npm test -- src/lib/seo.test.ts src/components/Header.test.ts`

Expected: FAIL on old canonical and navigation paths.

- [ ] **Step 3: Move the page files and update route configuration**

Move the two files, change `pageSeo` canonical paths, add Astro redirects, add exact Cloudflare 301 rules, and extend the sitemap filter to exclude `/seeds/` and `/seeds/best-seeds/`.

- [ ] **Step 4: Replace every internal old Seed href**

Update Header, Footer, homepage, Guides, Mechanics, Beginner, Progression, and both Seed pages. Breadcrumbs continue to use `metadata.canonicalPath`.

- [ ] **Step 5: Run route tests and build**

Run: `npm test -- src/lib/seo.test.ts src/components/Header.test.ts src/lib/tdh-content.test.ts && npm run build`

Expected: PASS; new routes render; old routes render redirect outputs; sitemap contains only the new canonicals.

---

### Task 3: Upgrade the second-priority page contracts

**Files:**
- Modify: `src/lib/tdh-content.test.ts`
- Modify: `src/pages/seeds/list.astro`
- Modify: `src/pages/seeds/best.astro`
- Modify: `src/pages/guides/progression.astro`
- Modify: `src/pages/guides/tickets.astro`

**Interfaces:**
- Consumes: `seeds`, `fertilizers`, `rebirths`, `site.checkedAt`, and evidence components.
- Produces: complete data, ranking, progression, and Tickets MVP pages.

- [ ] **Step 1: Add failing second-priority assertions**

```ts
expectPhrases(seedList, ['Seed Data Dictionary', 'Last checked']);
expectPhrases(bestSeeds, ['Best Seeds by Player Goal', 'Ranking Limits']);
expectPhrases(progression, ['Early Game Checklist', 'Mid Game Checklist', 'Late Game Checklist']);
expectPhrases(tickets, ['Ticket Evidence Checklist', 'Do Not Assume a Daily Reset']);
```

- [ ] **Step 2: Run the content test and confirm RED**

Run: `npm test -- src/lib/tdh-content.test.ts`

Expected: FAIL on the new content contracts.

- [ ] **Step 3: Expand Seed List and Best Seeds**

Keep the existing explorer and tier data. Add a concise data dictionary, ranking-limit callout, and goal/stage recommendation summary without adding unsupported values.

- [ ] **Step 4: Expand Progression and Tickets**

Add explicit stage checklists to Progression. Add a Ticket evidence checklist and a warning against assuming daily/event limits.

- [ ] **Step 5: Run focused tests and diagnostics**

Run: `npm test -- src/lib/tdh-content.test.ts && npm run check`

Expected: PASS and zero Astro diagnostics.

---

### Task 4: Audit SEO, schemas, internal links, and generated HTML

**Files:**
- Verify: `src/layouts/BaseLayout.astro`
- Verify: `dist/**/*.html`
- Verify: `dist/sitemap-0.xml`
- Verify: `dist/_redirects`

**Interfaces:**
- Consumes: all completed page and route work.
- Produces: a deployable static build with one owner per search intent.

- [ ] **Step 1: Run the full automated suite**

Run: `npm test`

Run: `npm run check`

Run: `npm run build`

- [ ] **Step 2: Audit all eight generated pages**

Verify status, Title and Description lengths, one H1, expected H2 count, exact canonical, OG/Twitter tags, JSON-LD, and at least two contextual internal links.

- [ ] **Step 3: Audit redirects and sitemap ownership**

Verify the sitemap includes `/seeds/list/` and `/seeds/best/`, excludes both retired Seed routes, and `dist/_redirects` contains both 301 rules.

- [ ] **Step 4: Run browser QA**

At 1440px and 390px, load all eight pages, check heading visibility and horizontal overflow, test Seed filtering/comparison, and confirm no browser-console errors.

---

### Task 5: Review, commit, push, and verify production

**Files:**
- Stage: only the design, plan, tests, route configuration, components, and eight page files.
- Exclude: `自用/`.

- [ ] **Step 1: Review the complete diff**

Run: `git diff --check`

Run: `git status --short`

- [ ] **Step 2: Commit the implementation**

```text
feat: build eight search intent pages
```

- [ ] **Step 3: Push to GitHub main**

Run: `git push origin HEAD:main`

- [ ] **Step 4: Verify production**

Verify the eight canonical pages return 200 with exact Title/H1/canonical, and both retired Seed routes return a permanent redirect to their new canonical destinations.
