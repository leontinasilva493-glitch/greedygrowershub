# Eight Search-Intent Pages Design

## Outcome

Upgrade the eight requested acquisition pages into useful MVP guides that answer one player question each, use source-visible SEO, and turn social-video demand into reproducible advice without presenting creator experience as official game data.

The work is an incremental expansion of the existing Astro pages. It does not create a second content system, add speculative game mechanics, or split thin subtopics into more routes.

## Research Signals

- The official Roblox description supports the first-session loop: buy a seed at the river, plant it in the player's plot, watch it grow, and harvest before lightning strikes.
- The current social-video set explicitly targets `GET MONEY FAST`, tallest-tree attempts, most-expensive-tree attempts, Tickets, big plants, and general tips and tricks.
- These videos prove player interest and show test ideas. They do not prove lightning probability, a universal harvest timer, stable Ticket limits, or permanent reward values.
- Seed, fertilizer, and rebirth numbers remain community snapshots. Every numeric surface keeps its evidence status and checked date.

## Route Ownership

| Priority | Canonical route | Search intent | Page job |
| --- | --- | --- | --- |
| 1 | `/beginner-guide/` | greedy growers beginner guide | Complete a first clean harvest |
| 1 | `/guides/get-money-fast/` | greedy growers how to make money | Protect capital and improve repeatable earnings |
| 1 | `/mechanics/lightning/` | greedy growers lightning | Separate confirmed consequences from unverified signals |
| 1 | `/mechanics/when-to-harvest/` | greedy growers when to harvest | Choose a risk strategy and calculate the recovery line |
| 2 | `/seeds/list/` | greedy growers seed list | Filter, compare, and interpret the current seed snapshot |
| 2 | `/seeds/best/` | greedy growers best seeds | Recommend seeds by player goal and explain the ranking basis |
| 2 | `/guides/progression/` | greedy growers progression | Map early, mid, and late-game decisions |
| 2 | `/guides/tickets/` | greedy growers tickets | Explain what is known and how to verify sources, uses, and limits |

`/seeds/` permanently redirects to `/seeds/list/`. `/seeds/best-seeds/` permanently redirects to `/seeds/best/`. All internal links, canonical tags, breadcrumbs, sitemap entries, Header links, and Footer links use the new canonical routes.

## Page Contracts

### First priority

#### Beginner Guide

- A five-step first-harvest route based on the official game loop.
- A first-run checklist covering seed, plot, visible growth state, harvest action, and result recording.
- Beginner mistakes with direct corrections.
- A clear handoff to Lightning, When to Harvest, Seed List, and Calculator.
- HowTo and Article structured data.

#### Get Money Fast

- Three capital-protection rules.
- A conservative investment order for seed, fertilizer, and Tickets.
- A stage-based money route using the existing seed snapshot, labeled community-reported.
- A failed-run break-even example and Calculator call to action.
- A `What Players Are Testing` module for the verified YouTube video title and author.

#### Lightning

- A confirmed-versus-unverified evidence matrix.
- Warning-signal cards that explicitly avoid probability claims.
- A repeatable lightning test protocol.
- A tallest-tree exposure video module labeled creator experience.
- Links to harvest timing and the Calculator.

#### When to Harvest

- Conservative, balanced, and maximum-greed strategy cards.
- A decision table mapping bankroll and failed-run state to a suggested strategy.
- Failed-run break-even math and stop conditions.
- A cautious explanation of the community `80/20 Rule` phrase.
- Tallest-tree and most-expensive-tree creator tests.

### Second priority

#### Seed List

- Existing sortable desktop table, mobile cards, filters, and two-record comparison.
- A concise data dictionary for cost, harvest value, growth time, profit per minute, and evidence state.
- Snapshot check date and source disclosure above the data.
- Links to Best Seeds, Calculator, and Beginner Guide.

#### Best Seeds

- Recommendations for budget beginners, reported fast money, high-risk capital, and stage fit.
- A visible ranking method that separates reported profit pace from lightning risk.
- Community tier groups as supporting evidence, not an official tier list.
- Links to Seed List, Calculator, Progression, and When to Harvest.

#### Progression

- Early, mid, and late-game checklists.
- Fertilizer and rebirth snapshot tables with evidence labels.
- A decision gate explaining when Tickets, fertilizer, rebirth, or Farmer's Market deserves a separate page.
- Links to Money, Tickets, Best Seeds, and Harvest Timing.

#### Tickets

- A known-versus-unverified summary.
- A four-step source/use/limit verification protocol.
- A creator video module for the current Tickets demand signal.
- A missing-evidence checklist instead of invented reward or reset values.
- Links to Progression, Updates, and official game sources.

## Evidence Model

Every game claim uses one of the existing labels:

- Official
- In-game verified
- Community-reported
- Creator experience
- Not verified

Official facts may be stated directly. Community numbers remain usable as leads but retain source and checked date. Creator videos are embedded as tests and include what was tested, what the creator concluded, what can be reproduced, and the current evidence state.

## SEO and Internal Linking

- Preserve the approved 50–60 character Titles and 150–160 character Descriptions, changing only the two Seeds canonical paths.
- Keep one source-visible H1 and two to five intent-led H2s per page.
- Each page has at least two descriptive contextual internal links.
- Article/HowTo/CollectionPage, breadcrumb, Organization, and WebSite schemas remain server-rendered.
- Redirect pages are not sitemap entries and do not own canonical content.

## Verification

- Exact metadata and route contracts in Vitest.
- Source heading/content contracts for all eight pages.
- Redirect, Header, Footer, sitemap, and internal-link tests for the Seeds migration.
- Full `npm test`, `npm run check`, and `npm run build`.
- Generated HTML audit for TDH, heading counts, canonical, social tags, Schema, and internal routes.
- Browser QA at desktop and mobile widths, including Seed filters/comparison and Calculator handoff.
- Push to GitHub `main`, then verify representative production routes and both redirects.
