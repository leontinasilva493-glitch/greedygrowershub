import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

function readSource(relativePath: string) {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
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
