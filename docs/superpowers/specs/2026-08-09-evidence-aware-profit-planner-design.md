# Evidence-Aware Profit Planner Design

## Goal

Adapt the useful interaction pattern from the reference calculator—seed and fertilizer setup, plots, session duration, result metrics, and a comparison view—without importing unsupported game economics or presenting a static competitor-style leaderboard as current fact.

## Chosen design

The homepage Calculator remains the canonical tool and uses Astro-rendered HTML plus the existing browser-only script. Its desktop layout is a left setup column and right calculation column; on narrow screens it becomes a single column with the headline metric first. The existing dark greenhouse palette remains the visual system.

The setup column adds Garden plots and Session minutes alongside the existing seed, fertilizer, failed-run, and mutation controls. The calculation column adds four scenario metrics: profit per minute, session profit, ROI, and revenue. The current risk-adjusted decision panel remains below these metrics because recorded losses are observable whereas future failure rates are not.

## Data and ranking boundary

Session metrics derive only from numbers entered by the player. A session is a repeatable scenario, not a prediction: completed cycles are `floor(sessionMinutes / waitMinutes)`. The tool shows this explicitly and continues to keep observed failed runs separate.

The comparison area computes a base profit pace only when a seed has a cost, harvest value, and growth duration. Every row displays its evidence state. Seeds missing any required economic field are shown as `Not rankable` with the missing fields named. Existing source-matched catalog records will therefore remain unranked until their economic observations are collected; no reference-site values may be copied into `src/data/seeds.json`.

## Acceptance criteria

- Desktop has an always-visible setup panel, four metric cards, risk decision, and comparison table.
- Mobile reorders to a readable single column with an early profit metric and compact comparison cards.
- Plots and session minutes update all scenario metrics without page reload.
- Existing failed-run-aware decision behavior remains intact.
- Ranking formula is computed from complete local records, never a copied static rate field.
- Incomplete current records visibly remain unrankable.
- No new dependency, route, SEO claim, or unverified game value is added.
