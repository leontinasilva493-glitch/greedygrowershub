# Calculator P0 Quick Iteration Design

## Goal

Make the homepage Calculator faster to understand and easier to act on without changing the `/` canonical, publishing unverified game claims, or adding an unsupported session simulator.

## Chosen approach

Keep the existing evidence-aware per-attempt model and improve its information architecture:

- Preserve `/` as the only Calculator canonical route.
- Preserve `/calculator/` as a permanent redirect to `/` and keep it out of the sitemap.
- Default to seed and fertilizer presets for a low-friction first calculation.
- Move editable numeric fields into an optional advanced section.
- Keep every preset editable so players can replace community-reported values with observations from their own game.
- Lead results with the failed-run-aware decision, then explain the supporting profit and break-even numbers.
- Add a compact reported-seed preview that exposes growth time, initial cost, multi-harvest status, reported profit pace, and evidence status.
- Use contextual continuation links instead of copying the competitor's Rebirth content into the Calculator page.

## Calculator behavior

### Quick controls

The always-visible controls are:

1. Seed preset
2. Fertilizer preset
3. Failed runs before success

Changing a preset immediately recalculates the result. A visible `Edit inputs` disclosure opens the advanced values.

### Advanced controls

The advanced disclosure contains:

- Seed cost
- Harvest value
- Wait time in minutes
- Fertilizer cost
- Harvest multiplier

Seed cost, harvest value, and wait time remain editable after selecting a seed preset. Fertilizer cost and multiplier become editable too; changing the fertilizer preset replaces both values, after which the player can adjust them manually.

### Result model

The calculation contract remains:

```text
cost per attempt = seed cost + fertilizer cost
boosted harvest = harvest value * harvest multiplier
profit per success = boosted harvest - cost per attempt
profit per minute = profit per success / wait minutes
break-even harvest = cost per attempt * (failed runs + 1)
risk-adjusted profit = boosted harvest - break-even harvest
adjusted profit per minute = risk-adjusted profit / (wait minutes * (failed runs + 1))
```

Add a pure decision helper that returns one of three states:

- `profitable`: risk-adjusted profit is greater than zero.
- `break-even`: risk-adjusted profit equals zero.
- `loss`: risk-adjusted profit is less than zero.

Each state produces a short headline and action-oriented explanation. The helper does not infer hidden probabilities or future strikes.

## Content hierarchy

The homepage order becomes:

1. Hero and Calculator promise
2. Quick controls and live decision result
3. Advanced input disclosure and data-source warning
4. Reported Top Seeds preview
5. Clean-run data collection guidance
6. Transparent formula summary
7. Contextual links to Seed List, Harvest Timing, Money Guide, and Updates
8. FAQ

The seed preview is explicitly labeled `Community-reported snapshot`, not `Best Seeds`. Sorting uses the existing `reportedProfitPerMinute` value, places missing values last, and shows at most five rows. The full ranking intent remains owned by `/seeds/best/`.

## Analytics

Use the existing `data-event` convention and browser-only event dispatch. Track:

- `calculator_seed_selected`
- `calculator_fertilizer_selected`
- `calculator_advanced_opened`
- `calculator_continue_click`

Do not send seed costs, manual values, failure counts, or other entered numbers. Event payloads may contain only the selected preset ID or destination name.

## Visual direction

Retain the current dark, organic farming-tool aesthetic. Improve hierarchy with:

- One prominent decision panel rather than seven equally weighted result cards.
- A restrained green/amber/red state accent for profitable, break-even, and loss outcomes.
- Compact supporting metrics beneath the decision.
- Native `<details>` for progressive disclosure and keyboard accessibility.
- A responsive seed preview that uses a table on wide screens and stacked cards on small screens.

No new font, UI framework, chart dependency, or animation library is introduced.

## Accessibility and error handling

- All controls retain explicit labels.
- Live errors and results use polite announcements.
- Decision meaning is expressed in text as well as color.
- Invalid numbers preserve the previous result while showing the validation error.
- The advanced disclosure is reachable and operable by keyboard.
- The reported-seed preview has a caption and meaningful column headings.

## SEO boundaries

- Keep the existing unique homepage Title, Description, H1, canonical, WebApplication schema, and FAQ schema.
- Do not create a new Calculator route or index query-string states.
- Do not add Rebirth FAQ content merely to increase page length.
- Do not claim official values, verified probabilities, optimal seeds, or exact session earnings.

## Verification

- Pure unit tests cover all decision states and calculation regression behavior.
- Pure analytics tests prove Calculator event records contain only the event name, preset/destination label, and page path. Browser QA covers preset overwrite, manual editability, disclosure tracking, and contextual-link tracking with the real built page.
- Content validation tests cover deterministic top-five reported-seed selection with missing values placed last.
- Full Vitest, Astro check, and Astro production build must pass.
- Generated HTML must keep `/` canonical and exclude `/calculator/` from the sitemap.
