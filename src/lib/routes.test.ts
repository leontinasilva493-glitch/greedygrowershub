import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const root = new URL('../../', import.meta.url);
const readProjectFile = (path: string) => readFileSync(new URL(path, root), 'utf8');

describe('Seed route ownership', () => {
  test('publishes only the requested Seed List and Best Seeds page files', () => {
    expect(existsSync(new URL('src/pages/seeds/list.astro', root))).toBe(true);
    expect(existsSync(new URL('src/pages/seeds/best.astro', root))).toBe(true);
    expect(existsSync(new URL('src/pages/seeds.astro', root))).toBe(false);
    expect(existsSync(new URL('src/pages/seeds/best-seeds.astro', root))).toBe(false);
  });

  test('defines matching Astro and Cloudflare permanent redirects', () => {
    const astroConfig = readProjectFile('astro.config.mjs');
    const redirects = readProjectFile('public/_redirects');

    expect(astroConfig).toContain("'/seeds': '/seeds/list/'");
    expect(astroConfig).toContain("'/seeds/best-seeds': '/seeds/best/'");
    expect(redirects).toContain('/seeds /seeds/list/ 301');
    expect(redirects).toContain('/seeds/best-seeds /seeds/best/ 301');
  });
});
