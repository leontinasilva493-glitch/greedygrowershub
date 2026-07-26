# Greedy Growers Tool-First Expansion Design

**Date:** 2026-07-26

**Status:** Approved by the user in conversation

## Problem

The deployed site has several routes, but the homepage and flat navigation still feel like a thin hub. The next release must give the calculator a clear acquisition role, expose a scalable Guides structure, and add useful competitor-reported seed, fertilizer, tier, and rebirth data without presenting that data as officially verified.

## Smallest acceptable outcome

- `/` becomes the Greedy Growers Calculator landing page.
- `/calculator/` redirects permanently to `/` and is excluded from the sitemap.
- Primary navigation becomes `Guides / Seeds / Mechanics / Calculator / Codes / Updates / Play on Roblox`.
- Guides contains `Beginner Guide / Get Money Fast / Progression / Tickets`.
- Mechanics contains `Lightning / When to Harvest`; Multipliers stays deferred until its formula is verified.
- A separate `/seeds/best-seeds/` page owns stage, risk, and profit-per-minute recommendations instead of publishing a generic Tier List.
- Seed, fertilizer, tier, and rebirth data copied from `greedygrowers.codes` is stored locally and labeled as a community snapshot that needs an in-game recheck.
- Existing Codes, Seeds, Beginner Guide, privacy, disclaimer, and contact routes remain usable.

## Chosen implementation approach

Use a static local data snapshot. Do not scrape the competitor during builds and do not add a database or dependency.

This approach is preferred because it is the fastest reliable MVP implementation, keeps Cloudflare builds deterministic, and lets every copied record carry a source and verification state. A build-time scraper would make deployment depend on another site and a backend would add unnecessary architecture.

## Information architecture

### Primary navigation

1. `Guides` -> `/guides/`
2. `Seeds` -> `/seeds/`
3. `Mechanics` -> `/mechanics/`
4. `Calculator` -> `/`
5. `Codes` -> `/codes/`
6. `Updates` -> `/updates/`
7. `Play on Roblox` -> the existing official Roblox URL

### Secondary routes

- `/beginner-guide/`
- `/guides/get-money-fast/`
- `/guides/progression/`
- `/guides/tickets/`
- `/seeds/best-seeds/`
- `/mechanics/`
- `/mechanics/lightning/`
- `/mechanics/when-to-harvest/`

### Footer-only routes

- `/privacy/`
- `/disclaimer/`
- `/contact/`

## Data model

### Seed snapshot

Each seed keeps the existing cost, harvest value, growth time, stage, source, and verification fields. It also gains:

- `multiHarvest: boolean`
- `reportedProfitPerMinute: number`
- `tier: 'S' | 'A' | 'B' | 'C' | 'D'`
- `bestUse: string`

All twelve copied seeds use source `greedygrowers-codes`, verification `community-lead`, and snapshot date `2026-07-26`. `growthTime` from the source is in seconds and is converted to `growthMinutes` for this project.

### Fertilizer snapshot

Each record contains `id`, `name`, `cost`, `boostMultiplier`, `sourceId`, `verification`, `verifiedAt`, and a short neutral note. The copied multipliers are 1.25, 1.5, and 2.

### Rebirth snapshot

Each record contains `level`, `requirement`, `perks`, `sourceId`, `verification`, and `verifiedAt`. These records are displayed as reported progression data, not official facts.

## Calculator behavior

- A seed selector auto-fills seed cost, harvest value, and growth time.
- A fertilizer selector offers none plus the three copied fertilizer records.
- Selecting a fertilizer adds its cost and applies its reported multiplier to harvest value.
- Manual editing remains available after auto-fill.
- The calculator keeps failed-run break-even and risk-adjusted results.
- The UI always displays a visible source/verification notice.

The calculator does not claim official lightning odds or predict the next strike.

## Best Seeds behavior

The `/seeds/best-seeds/` page uses the copied S-D snapshot as supporting evidence but presents recommendations by player goal: beginner, fast money, after rebirth, high risk, and reported profit per minute. It explains the ranking basis and links back to the Calculator and factual Seeds list. Copied rankings remain pending in-game revalidation.

## Mechanics behavior

- `/mechanics/lightning/` separates official facts, community reports, creator experience, and unverified claims.
- `/mechanics/when-to-harvest/` combines harvesting and greed/risk intent. It covers conservative, balanced, and maximum-greed strategies plus failed-run break-even math.
- A reusable `What Players Are Testing` module embeds problem-specific creator videos and labels each conclusion by evidence state.
- `/mechanics/multipliers/` is not published until x-multiplier calculations can be reproduced.

## Progression behavior

`/guides/progression/` is the initial pillar for Early Game, Mid Game, Late Game, Tickets, Fertilizer, Rebirth, and Farmer's Market. Fertilizer, Rebirth, and Farmer's Market only become standalone routes after they have enough verified data and independent search intent.

## Page content and SEO ownership

- `/` owns calculator, profit, ROI, break-even, and run-risk intent.
- `/codes/` owns codes, redeem, active, and expired intent.
- `/seeds/` owns seed list, cost, harvest value, and growth-time intent.
- `/seeds/best-seeds/` owns best seeds, player-stage rankings, risk rankings, and tier-list intent.
- `/guides/` owns the guides-hub intent.
- `/beginner-guide/` owns first-session intent.
- `/guides/get-money-fast/` owns immediate money-making intent.
- `/guides/progression/` owns unlock order and early/mid/late progression intent.
- `/guides/tickets/` owns ticket acquisition intent while clearly marking unknown limits and sources.
- `/mechanics/lightning/` owns factual lightning-mechanic intent.
- `/mechanics/when-to-harvest/` owns harvesting, greed/risk, and harvest-strategy intent.
- `/updates/` owns dated site and game-change notes.

Every indexable page must have a unique title, description, H1, canonical URL, Open Graph/Twitter metadata through `BaseLayout`, structured data, and contextual internal links. Footer-only utility pages remain `noindex`.

## Error and trust handling

- Invalid numeric inputs show the existing inline calculator error.
- Copied values are never labeled `verified` or `official`.
- Every copied-data page links to the competitor source.
- Missing or changed data can be corrected by editing local JSON without changing components.
- No automated external request runs during page rendering or Cloudflare build.

## Verification

- New data validation tests fail before implementation and pass afterward.
- Calculator tests cover fertilizer cost and multiplier behavior.
- SEO tests cover every new indexable route and the homepage canonical.
- `npm test`, `npm run check`, and `npm run build` exit successfully.
- Built HTML contains distinct titles, H1s, canonicals, internal links, and the copied-data disclaimer.
- Desktop and mobile navigation are visually checked from the built site.

## Non-goals

- No multilingual navigation.
- No live competitor scraping.
- No database, account system, comments, or uploads.
- No official-odds claim or lightning prediction.
- No seed detail routes until a seed has enough verified data and original evidence.
- No standalone Fertilizer, Rebirth, Farmer's Market, or Multipliers pages in this release.
- No Scripts, Players, Status, Routes, or Official Links top-level navigation.
