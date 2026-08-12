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
  });
});
