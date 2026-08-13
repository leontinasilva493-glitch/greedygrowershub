import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const read = (relativePath: string) => readFileSync(new URL(relativePath, import.meta.url), 'utf8');

describe('mobile layout contracts', () => {
  test('keeps sticky reading navigation inside a full-page scope with offset targets', () => {
    for (const path of ['../pages/seeds/list.astro', '../pages/mechanics/mutations.astro']) {
      const source = read(path);
      expect(source).toContain('data-reading-scope');
      const hrefs = [...source.matchAll(/href: '(#[^']+)'/g)].map((match) => match[1]);
      expect(hrefs.length).toBeGreaterThan(0);
      for (const href of hrefs) {
        expect(source).toMatch(new RegExp(`id=["']${href.slice(1)}["'][^>]*scroll-mt-40`));
      }
    }
  });

  test('uses mobile cards and desktop tables for both wide decision tables', () => {
    const harvest = read('../pages/mechanics/when-to-harvest.astro');
    const progression = read('../pages/guides/progression.astro');

    expect(harvest).toContain('data-mobile-harvest-strategies');
    expect(harvest).toContain('data-desktop-harvest-strategies');
    expect(progression).toContain('data-mobile-fertilizer-list');
    expect(progression).toContain('data-desktop-fertilizer-table');
  });

  test('uses bounded fluid titles and no max-width media queries', () => {
    const styles = read('../styles/global.css');
    const pages = [
      '../pages/index.astro',
      '../pages/seeds/list.astro',
      '../pages/mechanics/mutations.astro',
      '../pages/guides/progression.astro',
    ].map(read);

    expect(styles).toContain('font-size: clamp(2.75rem, 9vw, 4.5rem)');
    expect(styles).toContain('font-size: clamp(2.25rem, 7vw, 3.75rem)');
    expect(styles).not.toMatch(/@media\s*\(max-width/);
    expect(pages[0]).toContain('title-home');
    for (const source of pages.slice(1)) expect(source).toContain('title-page');
  });

  test('keeps the mobile drawer dismissible with focus restoration', () => {
    const script = read('../scripts/mobile-navigation.ts');

    expect(script).toContain("event.key === 'Escape'");
    expect(script).toContain("backdrop?.addEventListener('click'");
    expect(script).toContain('trigger?.focus()');
  });
});
