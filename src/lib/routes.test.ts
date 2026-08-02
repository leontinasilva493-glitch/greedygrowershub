import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import astroConfig from '../../astro.config.mjs';

const root = new URL('../../', import.meta.url);
const readProjectFile = (path: string) => readFileSync(new URL(path, root), 'utf8');

function parseCloudflareRedirects(source: string) {
  return source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const [from, to, status = '302'] = line.split(/\s+/);
      return { from, to, status: Number(status) };
    });
}

function normalizeAstroRedirectSource(path: string) {
  if (astroConfig.trailingSlash !== 'always' || path === '/' || path.endsWith('/')) return path;
  return `${path}/`;
}

describe('Seed route ownership', () => {
  test('publishes only the requested Seed List and Best Seeds page files', () => {
    expect(existsSync(new URL('src/pages/seeds/list.astro', root))).toBe(true);
    expect(existsSync(new URL('src/pages/seeds/best.astro', root))).toBe(true);
    expect(existsSync(new URL('src/pages/seeds.astro', root))).toBe(false);
    expect(existsSync(new URL('src/pages/seeds/index.astro', root))).toBe(false);
    expect(existsSync(new URL('src/pages/seeds/best-seeds.astro', root))).toBe(false);
  });

  test('keeps each Cloudflare redirect source unique after Astro adapter output', () => {
    const cloudflareRedirects = parseCloudflareRedirects(readProjectFile('public/_redirects'));
    const astroRedirectSources = Object.keys(astroConfig.redirects ?? {}).map(normalizeAstroRedirectSource);
    const combinedSources = [...cloudflareRedirects.map(({ from }) => from), ...astroRedirectSources];

    expect(cloudflareRedirects).toEqual(expect.arrayContaining([
      { from: '/sitemap.xml', to: '/sitemap-index.xml', status: 301 },
      { from: '/seeds', to: '/seeds/list/', status: 301 },
      { from: '/seeds/', to: '/seeds/list/', status: 301 },
      { from: '/seeds/best-seeds', to: '/seeds/best/', status: 301 },
      { from: '/seeds/best-seeds/', to: '/seeds/best/', status: 301 },
    ]));
    expect(combinedSources).toHaveLength(new Set(combinedSources).size);
  });
});

describe('Guide route ownership', () => {
  test('publishes the beginner mistakes guide at its canonical route', () => {
    expect(existsSync(new URL('src/pages/guides/mistakes.astro', root))).toBe(true);
  });
});

describe('Mechanics route ownership', () => {
  test('publishes the mutation guide at its canonical route', () => {
    expect(existsSync(new URL('src/pages/mechanics/mutations.astro', root))).toBe(true);
  });
});
