# Calculator-First Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the global navigation reflect the calculator-led product by ordering every primary entry as Calculator, Seeds, Guides, Mechanics, Codes, Updates, and Play on Roblox.

**Architecture:** Keep the existing Astro routes, header component, dropdowns, and footer. Add a small source-contract test for ordering, then make surgical markup and array-order changes in the shared navigation components so every page receives the same behavior.

**Tech Stack:** Astro 7, TypeScript, Tailwind CSS, Vitest

## Global Constraints

- Do not create, rename, or remove public routes.
- `/` remains the Calculator canonical page and `/calculator/` remains its redirect.
- Seeds contains Seed List and Best Seeds; Guides contains Beginner, Get Money Fast, Progression, and Tickets.
- Mechanics lists When to Harvest before Lightning.
- Codes and Updates remain direct links.
- Play on Roblox remains the visually prominent external button.

---

### Task 1: Align desktop, mobile, and footer navigation

**Files:**
- Create: `src/components/Header.test.ts`
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`

**Interfaces:**
- Consumes: existing routes and `site.officialGameUrl` from `src/lib/content.ts`
- Produces: a consistent calculator-first navigation contract shared by every Astro page

- [ ] **Step 1: Write the failing navigation-order test**

Read `Header.astro` and `Footer.astro` as UTF-8 source. Assert that the desktop primary navigation and mobile menu place Calculator before Seeds, Seeds before Guides, Guides before Mechanics, Mechanics before Codes, and Codes before Updates. Assert that the Mechanics dropdown places When to Harvest before Lightning, and that the footer places Tools & data before Guides.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- src/components/Header.test.ts`

Expected: FAIL because Calculator is currently after the three dropdowns, mobile Calculator is below the category groups, Mechanics lists Lightning first, and the footer lists Guides before Tools & data.

- [ ] **Step 3: Apply the minimal navigation changes**

Move the desktop Calculator link before the Seeds dropdown, place the Seeds dropdown before Guides, keep Mechanics after Guides, and retain Codes and Updates as direct links. Reorder the mobile menu to Calculator, Seeds, Guides, Mechanics, Codes, Updates, followed by Play on Roblox. Reorder the Mechanics children and footer columns without changing routes or copy outside navigation.

- [ ] **Step 4: Run focused and full verification**

Run: `npm test -- src/components/Header.test.ts`

Expected: PASS.

Run: `npm test && npm run check && npm run build`

Expected: all tests pass, Astro reports zero diagnostics, and the production build completes.

Run the Astro development server in background mode and verify desktop and mobile navigation with a browser. Confirm every link resolves, the active state works, Play on Roblox remains visible, and no horizontal overflow is introduced.

- [ ] **Step 5: Commit and publish**

Stage only the plan, test, header, and footer. Commit with `feat: prioritize calculator in site navigation`, push the verified commit to `origin/main`, and confirm the production header order on `https://greedygrowerhub.wiki/`.
