import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const source = readFileSync(new URL('./OnThisPage.astro', import.meta.url), 'utf8');
const script = readFileSync(new URL('../scripts/reading-progress.ts', import.meta.url), 'utf8');

describe('long-page navigation', () => {
  test('provides sticky progress and active-section hooks with touch-sized links', () => {
    expect(source).toContain('sticky top-16');
    expect(source).toContain('data-reading-navigation');
    expect(source).toContain('data-reading-progress');
    expect(source).toContain('data-reading-anchor');
    expect(source).toContain('min-h-11');
    expect(source).toContain("import '../scripts/reading-progress'");
  });

  test('keeps the active section chip visible in the horizontal rail', () => {
    expect(source).toContain('data-reading-strip');
    expect(script).toContain("scrollIntoView({ behavior, block: 'nearest', inline: 'center' })");
    expect(script).toContain("matchMedia('(prefers-reduced-motion: reduce)')");
  });
});
