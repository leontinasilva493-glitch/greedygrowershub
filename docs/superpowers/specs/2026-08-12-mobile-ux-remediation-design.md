# Greedy Growers Mobile UX Remediation Design

## Goal

Remove the production mobile interaction defects found in the August 12 audit, shorten the path from intent to result, and preserve the site's evidence-first content and existing dark tool-oriented visual language.

## Approved Scope

1. Prevent the Seeds comparison tray from overlapping the sticky on-page navigation.
2. Turn the mobile navigation into a complete drawer interaction: backdrop, scroll lock, outside/Escape close, accurate expanded state, and focus return.
3. Compress the optional analytics prompt so it no longer covers most of a small-phone first screen while keeping analytics opt-in and the privacy link.
4. Replace the two visible mobile calculator result summaries with one result region and move secondary modelling below the core result.
5. Place the homepage task path before the reported-seed preview and correct its copy.
6. Correct Seeds and Mutations on-page labels, include the actual Seed Table destination, and keep the active chip visible.
7. Replace mobile horizontal-scrolling decision tables on Best Seeds, Harvest Timing, and Updates with cards while retaining desktop tables.
8. Collapse repeated mutation decision/trigger detail behind explicit disclosures without deleting evidence.
9. Raise FAQ, preference, and calculator range targets to the mobile touch baseline.
10. Group the calculator seed picker by rarity with one native select and no mobile-only duplicate.

## Interaction Design

### Mobile navigation

The existing `<details>` trigger remains the progressive-enhancement base. A small client script manages the enhanced state. Opening the menu sets `aria-expanded`, changes the label to Close navigation, locks body scrolling, displays a scrim, and focuses the first menu destination. Backdrop click, Escape, a destination click, or the trigger closes it and restores focus and body overflow.

### Sticky comparison

The on-page rail remains at 64px below the global header. The comparison tray uses a second mobile sticky offset below that rail and stacks its copy/actions vertically on narrow phones. Desktop keeps the existing compact row.

### Consent

Optional analytics remains off until explicit consent. The prompt uses a short explanation, short button labels with full accessible labels, 44px controls, and safe-area-aware bottom spacing. It stays non-modal and visually subordinate to the page.

### Calculator and homepage order

The calculator form becomes one grid-owned form with three ordered regions: core inputs, the single result panel, then advanced modelling/evidence. Desktop places inputs and results side by side; mobile keeps the result directly after core inputs. The task-path section follows the calculator and precedes the five-seed catalog preview.

### Content pages

Desktop tables remain tables. Mobile receives semantic `<article>`/`<dl>` cards containing the same claims. Repeated mutation explanations move into closed disclosures with touch-sized summaries. No evidence labels, uncertainty notes, source links, canonicals, or indexability rules change.

## Accessibility and Performance

- All standalone controls touched by this work meet a 44px minimum target.
- Focus remains visible and returns to the mobile menu trigger after dismissal.
- Reduced-motion behavior remains respected.
- No new client framework or runtime dependency is added to production.
- Mobile/desktop content stays server-rendered; no claims are hidden behind client-only rendering.

## Verification

- Unit/source-contract tests cover hooks, ordering, labels, single result output, responsive card/table contracts, and disclosure/touch contracts.
- Browser checks cover 320, 375, 430, 768, and 1440 widths; menu dismissal/scroll lock; Seeds compare; calculator updates; anchors; overflow; and mobile table alternatives.
- Run `npm.cmd test -- --run`, `npm.cmd run check`, and `npm.cmd run build` before handoff.

