import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

function readSource(relativePath: string) {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

function readPngDimensions(relativePath: string) {
  const image = readFileSync(new URL(relativePath, import.meta.url));

  return {
    width: image.readUInt32BE(16),
    height: image.readUInt32BE(20),
  };
}

describe('site-wide analytics contract', () => {
  test('delegates optional analytics to the consent component instead of loading Clarity in the head', () => {
    const layout = readSource('./BaseLayout.astro');
    const head = layout.match(/<head>[\s\S]*?<\/head>/)?.[0] ?? '';

    expect(layout).toContain("import AnalyticsConsent from '../components/AnalyticsConsent.astro'");
    expect(layout).toContain('<AnalyticsConsent');
    expect(head).not.toContain('https://www.clarity.ms/tag/');
  });

  test('discloses the live Clarity integration on the privacy page', () => {
    const privacy = readSource('../pages/privacy.astro');

    expect(privacy).toContain('Microsoft Clarity');
    expect(privacy).toContain('Microsoft Privacy Statement');
    expect(privacy).toContain('Allow optional analytics');
    expect(privacy).toContain('Analytics preferences');
    expect(privacy).not.toContain('does not configure a third-party analytics destination');
  });
});

describe('site-wide accessibility shell', () => {
  test('provides a skip link and focusable main landmark', () => {
    const layout = readSource('./BaseLayout.astro');

    expect(layout).toContain('href="#main-content"');
    expect(layout).toContain('id="main-content"');
    expect(layout).toContain('tabindex="-1"');
    expect(layout).toContain('width=device-width, initial-scale=1');
  });

  test('supports localized document language and reciprocal hreflang links', () => {
    const layout = readSource('./BaseLayout.astro');

    expect(layout).toContain("lang?: 'en' | 'vi'");
    expect(layout).toContain('alternates?: Array<{ hreflang: string; href: string }>');
    expect(layout).toContain('<html lang={lang}>');
    expect(layout).toContain('rel="alternate"');
    expect(layout).toContain('hreflang={alternate.hreflang}');
  });
});

describe('site-wide favicon contract', () => {
  test('publishes a branded square icon set for search, browsers, and saved apps', () => {
    const layout = readSource('./BaseLayout.astro');
    const head = layout.match(/<head>[\s\S]*?<\/head>/)?.[0] ?? '';

    const ico = readFileSync(new URL('../../public/favicon.ico', import.meta.url));
    expect([...ico.subarray(0, 4)]).toEqual([0, 0, 1, 0]);
    expect(ico.readUInt16LE(4)).toBeGreaterThanOrEqual(3);

    expect(head).toContain('rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48"');
    expect(head).toContain('rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"');
    expect(head).toContain('rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png"');
    expect(head).toContain('rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"');
    expect(head).toContain('rel="manifest" href="/site.webmanifest"');

    expect(readPngDimensions('../../public/favicon-16x16.png')).toEqual({ width: 16, height: 16 });
    expect(readPngDimensions('../../public/favicon-32x32.png')).toEqual({ width: 32, height: 32 });
    expect(readPngDimensions('../../public/favicon-48x48.png')).toEqual({ width: 48, height: 48 });
    expect(readPngDimensions('../../public/apple-touch-icon.png')).toEqual({ width: 180, height: 180 });
    expect(readPngDimensions('../../public/android-chrome-192x192.png')).toEqual({ width: 192, height: 192 });
    expect(readPngDimensions('../../public/android-chrome-512x512.png')).toEqual({ width: 512, height: 512 });

    const manifest = JSON.parse(readSource('../../public/site.webmanifest'));
    expect(manifest.icons).toEqual([
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ]);
  });
});
