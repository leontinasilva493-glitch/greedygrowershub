import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const source = readFileSync(new URL('./OnThisPage.astro', import.meta.url), 'utf8');

describe('long-page navigation', () => {
  test('provides sticky progress and active-section hooks with touch-sized links', () => {
    expect(source).toContain('sticky top-16');
    expect(source).toContain('data-reading-navigation');
    expect(source).toContain('data-reading-progress');
    expect(source).toContain('data-reading-anchor');
    expect(source).toContain('min-h-11');
    expect(source).toContain("import '../scripts/reading-progress'");
  });
});
