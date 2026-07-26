# Truthful TDH Refresh Design

## Goal

Align the 13 current indexable pages with `自用/SEO相关TDH参考标准.txt` while keeping every title, description, and visible heading accurate to the feature and evidence actually present on the page.

## Chosen approach

Use the reference file for keyword ownership, page intent, and heading direction, but adapt copy to the current implementation.

- Keep `/` as the only Calculator canonical route.
- Keep `/seeds/` as the live sortable seed list and `/seeds/best-seeds/` as the current ranking route.
- Do not create `/seeds/list/` or `/seeds/best/` during a TDH-only pass because that would require canonical migrations and redirects.
- Do not add multilingual routes or hreflang in this pass.
- Do not claim plot-count support, lightning probability prediction, verified warning zones, daily code verification, active codes, or screenshots that the current site does not provide.
- Keep all TDH visible in generated HTML rather than client-only rendering.

## Metadata contract

| Page | Title | Description intent | H1 |
|---|---|---|---|
| `/` | Greedy Growers Calculator: Profit, ROI & Lightning Risk | Actual seed/fertilizer presets, ROI, break-even, failed-run cost, and risk-adjusted returns | Greedy Growers Calculator |
| `/seeds/` | Greedy Growers Seed List: Costs, Growth & Profit Data | Reported seed costs, growth, harvest, profit rate, tiers, and verification state | Greedy Growers Seed List — All Seeds Compared |
| `/seeds/best-seeds/` | Greedy Growers Best Seeds by Stage, Profit & Risk Guide | Stage, reported profit rate, investment cost, risk, and community ranking | Best Greedy Growers Seeds by Stage & Risk |
| `/guides/` | Greedy Growers Guides: Beginner, Money, Rebirth & Tickets | Four guide intents and evidence labels | Greedy Growers Guides |
| `/beginner-guide/` | Greedy Growers Beginner Guide: How to Play Roblox (2026) | Official game entry, first seed, planting, first harvest, and sale | Greedy Growers Beginner Guide: How to Play & First Harvest |
| `/guides/get-money-fast/` | Greedy Growers Money Guide: How to Get Money Fast (2026) | Capital protection, reported profit rates, upgrade order, and lightning-loss recovery | Greedy Growers Money Guide: How to Get Money Fast |
| `/guides/progression/` | Greedy Growers Progression Guide: Leveling & Rebirth | Early-to-late path, reported rebirth requirements/rewards, fertilizer, Tickets, and stages | Greedy Growers Progression Guide |
| `/guides/tickets/` | Greedy Growers Tickets Guide: Sources, Uses & Limits | Explicitly separate known information from unverified acquisition sources and limits | Greedy Growers Tickets Guide |
| `/mechanics/` | Greedy Growers Mechanics: Lightning & Harvest Timing | Confirmed facts, failed-run recovery, risk strategy, and community claims | Greedy Growers Game Mechanics |
| `/mechanics/when-to-harvest/` | Greedy Growers Harvest Timing: When to Harvest Guide | Conservative/balanced/high-risk strategy and failed-run break-even | Greedy Growers Harvest Timing Guide |
| `/mechanics/lightning/` | Greedy Growers Lightning Guide: Risk, Timing & Strategy | Confirmed lightning facts, unverified signals, exposure decisions, and test method | Greedy Growers Lightning Mechanics Guide |
| `/codes/` | Greedy Growers Codes: Active Status & Redeem Guide | Active/expired status, sources, redeem steps, verification notes, and fixes | Greedy Growers Codes |
| `/updates/` | Greedy Growers Updates: Codes, Game Changes & Site Log | Game signals, codes, seed data, calculator revisions, and recheck status | Greedy Growers Updates |

Every title remains 50–60 JavaScript characters. Every description remains 150–160 JavaScript characters and starts with an action verb.

## Heading contract

### Calculator homepage

Use exactly four H2 sections:

1. Profit and Failed-Run Risk Calculator
2. How to Record Clean Run Data
3. How the Math Works (Quick Summary)
4. Frequently Asked Questions

The run-data section uses the H3s `Pick One Seed and Keep the Wait Consistent` and `Recalculate After Every Game Update`. The former long “Continue” section becomes a compact three-link navigation inside the math section so it no longer adds a fifth H2.

### Seed pages

- `/seeds/`: Seed Table — Sort and Filter; Compare Two Greedy Growers Seeds; How to Read Seed Data and Verification Status.
- `/seeds/best-seeds/`: Early Game budget; fast-money reported profit; high-risk/high-reward picks; ranking methodology and community tiers.

### Hub pages

- `/guides/`: four H2 guide cards, one per owned guide intent. Supporting evidence information remains an aside rather than creating unrelated H2 competition.
- `/mechanics/`: two H2 destination cards, When to Harvest and Lightning. The facts-versus-strategy boundary and deferred multiplier note remain supporting callouts.

### Detail pages

Rename existing H2/H3 headings to lead with the page's specific long-tail intent while preserving evidence boundaries. Do not introduce numeric lightning zones, probability claims, ticket rewards, or active codes that are not verified.

## Internal linking

- Homepage links to the current Seed List (`/seeds/`), When to Harvest, and Codes using descriptive anchors.
- Detail pages keep current Calculator and sibling-page links.
- Current route names are preserved in header, footer, breadcrumbs, sitemap, and canonical output.

## Verification

- Metadata unit tests assert all exact titles, descriptions, H1s, length ranges, action-verb openings, unique canonicals, and absence of unsupported marketing claims.
- Heading contract tests assert required H2/H3 copy in the relevant Astro sources.
- Production-build audit checks all 13 pages for one H1, expected H2 counts, exact source-visible T/D/H, canonical, OG/Twitter tags, and structured data.
- Browser QA checks the homepage and representative hub/detail pages on desktop and mobile.
