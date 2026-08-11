# Greedy Growers UX Retention Design

Date: 2026-08-11

## Goal

Turn existing search visits into useful multi-page sessions without weakening the site's evidence standards. The work should shorten the path to the calculator and verified seed data, make long reference pages easier to scan, and create clear next steps after the user's current task is complete.

## Product constraints

- Preserve the existing dark green, sand, and gold visual language and Space Grotesk typography.
- Keep `/seeds/list/` as the single canonical seed list route.
- Do not invent gameplay screenshots, values, mechanics, or economic claims.
- Keep community-reported values visibly labelled and separate from official facts.
- Do not expose analytics or feedback before optional analytics consent.
- Helpful votes are editorial signals only. Do not publish counts or automatically change rankings.
- Keep the site statically exportable; add only small, route-scoped client scripts.

## Information architecture

### Homepage

The live calculator moves directly below the hero. It is the highest-value interactive task and should be available before update notes or browse paths. The existing task-path cards remain immediately after the calculator to route users who came for lookup rather than calculation.

The calculator shows only the minimum inputs required for a first answer. Fertilizer, plot/session modelling, multipliers, and mutation presets move into an optional advanced section. Results remain visible on desktop and receive a compact live preview on mobile.

### Seeds

The first comparison click must work even when the user has just typed into search. Mobile rows become compact expandable summaries rather than twenty equally prominent cards. Comparison controls use 44-pixel targets, and selected comparisons remain available in a sticky tray.

Search, filter, sort, and comparison state are encoded in the URL so a useful view can be copied and shared. Query parameters do not create new canonical pages.

### Mutations

The wide desktop table remains for efficient comparison. Mobile uses stacked compact cards instead of horizontal table scrolling. The page keeps its text-based evidence presentation; no decorative or fabricated game imagery is added.

### Long-page navigation

The existing table of contents becomes sticky and includes a reading-progress indicator. The currently visible section is marked with `aria-current`. Anchor destinations preserve an appropriate header offset.

### Related next steps

Related links are hand-authored by route and explain why the destination is useful. The module appears after the core answer, before the user reaches the page footer. It is not a generic recommendation carousel.

## Sharing

- General share controls use the Web Share API when available and clipboard fallback otherwise.
- The calculator can copy a compact, labelled scenario summary without copying hidden analytics data.
- The seed explorer copies its current canonical URL plus filter and comparison state.
- Copy actions provide visible status text and remain keyboard accessible.

## Privacy and feedback

Microsoft Clarity is optional and loads only after explicit consent. A non-modal banner offers “Allow optional analytics” and “Keep optional analytics off”; the footer provides a persistent way to change the choice.

Helpful feedback is shown only when optional analytics is allowed. It records only page identity and helpful/not-helpful intent. It does not collect free text, calculator values, seed selections, or public vote counts.

## Accessibility and visual quality

- Add a keyboard-visible skip link and focusable main content target.
- Use at least 44 by 44 pixels for primary touch controls and maintain spacing between adjacent targets.
- Respect `prefers-reduced-motion` and avoid motion-dependent meaning.
- Raise low-contrast footer copy and preserve visible focus rings.
- Reduce repeated card framing by using dividers and compact disclosure rows where content is homogeneous.

## Verification

- Unit and contract tests cover calculator ordering/disclosure, shareable state, consent state, layout accessibility, and route integrity.
- A production build must complete successfully.
- Browser QA covers 375-pixel mobile and desktop widths, including first-click seed comparison, URL state, calculator disclosure/copy, sticky navigation, consent preferences, and mobile mutation cards.
- A local static preview remains running and exposes direct links for review.
