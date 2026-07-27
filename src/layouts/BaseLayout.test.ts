import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

function readSource(relativePath: string) {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('site-wide analytics contract', () => {
  test('loads the supplied Microsoft Clarity project from the shared head in production', () => {
    const layout = readSource('./BaseLayout.astro');
    const head = layout.match(/<head>[\s\S]*?<\/head>/)?.[0] ?? '';

    expect(head).toContain('import.meta.env.PROD');
    expect(head).toContain('https://www.clarity.ms/tag/');
    expect(head).toContain('xsvg1uhfom');
  });

  test('discloses the live Clarity integration on the privacy page', () => {
    const privacy = readSource('../pages/privacy.astro');

    expect(privacy).toContain('Microsoft Clarity');
    expect(privacy).toContain('Microsoft Privacy Statement');
    expect(privacy).not.toContain('does not configure a third-party analytics destination');
  });
});
