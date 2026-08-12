import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const read = (relativePath: string) => readFileSync(new URL(relativePath, import.meta.url), 'utf8');

describe('mobile long-page navigation labels', () => {
  test('links the Seed List rail to the actual catalog with concise labels', () => {
    const source = read('../pages/seeds/list.astro');

    expect(source).toContain("{ label: 'Budget stages', href: '#budget-table' }");
    expect(source).toContain("{ label: 'Seed table', href: '#current-seed-table' }");
    expect(source).not.toContain("{ label: 'Budget / multiplier table'");
  });

  test('uses mutation-specific rail labels', () => {
    const source = read('../pages/mechanics/mutations.astro');

    expect(source).toContain("{ label: 'Multipliers', href: '#mutation-table' }");
    expect(source).toContain("{ label: 'Decisions', href: '#how-to-interpret' }");
    expect(source).not.toContain("{ label: 'Budget / multiplier table'");
    expect(source).not.toContain('scroll-mt-24');
  });

  test('replaces wide mobile comparison tables with stacked decision cards', () => {
    const bestSeeds = read('../pages/seeds/best.astro');
    const harvest = read('../pages/mechanics/when-to-harvest.astro');
    const updates = read('../pages/updates.astro');

    expect(bestSeeds).toContain('data-mobile-goal-tiers');
    expect(bestSeeds).toContain('data-mobile-rare-seeds');
    expect(harvest).toContain('data-mobile-harvest-strategies');
    expect(updates).toContain('data-mobile-recheck-board');
    for (const source of [bestSeeds, harvest, updates]) {
      expect(source).toMatch(/class="[^"]*hidden[^"]*md:block/);
      expect(source).toMatch(/class="[^"]*md:hidden/);
    }
  });

  test('keeps secondary mutation explanations in touch-sized disclosures', () => {
    const source = read('../pages/mechanics/mutations.astro');

    expect(source).toContain('data-mutation-decision-details');
    expect(source).toContain('data-mutation-trigger-details');
    expect(source.match(/<summary[^>]+min-h-11/g)?.length).toBeGreaterThanOrEqual(2);
  });

  test('keeps range thumbs and common mobile actions easy to touch', () => {
    const styles = read('../styles/global.css');
    const calculator = read('../components/Calculator.astro');
    const footer = read('../components/Footer.astro');
    const homepage = read('../pages/index.astro');
    const seedList = read('../pages/seeds/list.astro');
    const mutations = read('../pages/mechanics/mutations.astro');

    expect(styles).toContain('.calculator-range::-webkit-slider-thumb');
    expect(styles).toContain('.calculator-range::-moz-range-thumb');
    expect(calculator.match(/calculator-range/g)).toHaveLength(2);
    expect(footer).toMatch(/min-h-11[^>]+data-open-analytics-preferences/);
    for (const source of [homepage, seedList, mutations]) {
      expect(source).toMatch(/<summary[^>]+min-h-11/);
    }
  });
});
