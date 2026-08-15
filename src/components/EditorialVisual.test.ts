import { existsSync } from 'node:fs';
import sharp from 'sharp';
import { describe, expect, test } from 'vitest';

describe('editorial visual', () => {
  test('builds the responsive source contract used by the picture component', async () => {
    let buildSources: ((slug: string, widthPreset?: 'wide' | 'narrow' | 'hero') => {
      avif: string;
      webp: string;
      fallback: string;
      sizes: string;
    }) | null = null;
    try {
      buildSources = (await import('../lib/editorial-visual')).getEditorialVisualSources;
    } catch {
      // The first TDD run intentionally reaches this branch before the helper exists.
    }

    expect(buildSources).not.toBeNull();

    expect(buildSources?.('greedy-growers-beginner-guide-first-harvest')).toEqual({
      avif: '/images/editorial/greedy-growers-beginner-guide-first-harvest-640.avif 640w, /images/editorial/greedy-growers-beginner-guide-first-harvest-960.avif 960w, /images/editorial/greedy-growers-beginner-guide-first-harvest-1440.avif 1440w',
      webp: '/images/editorial/greedy-growers-beginner-guide-first-harvest-640.webp 640w, /images/editorial/greedy-growers-beginner-guide-first-harvest-960.webp 960w, /images/editorial/greedy-growers-beginner-guide-first-harvest-1440.webp 1440w',
      fallback: '/images/editorial/greedy-growers-beginner-guide-first-harvest-960.webp',
      sizes: '(min-width: 1168px) 1120px, (min-width: 640px) calc(100vw - 3rem), calc(100vw - 2rem)',
    });

    expect(buildSources?.('greedy-growers-official-links-source-check', 'narrow').sizes).toBe(
      '(min-width: 944px) 896px, (min-width: 640px) calc(100vw - 3rem), calc(100vw - 2rem)',
    );

    expect(buildSources?.('greedy-growers-profit-calculator-farming-loop', 'hero').sizes).toBe(
      '(min-width: 800px) 560px, (min-width: 640px) calc(100vw - 3rem), calc(100vw - 2rem)',
    );
  });

  test.each([
    'greedy-growers-profit-calculator-farming-loop',
    'greedy-growers-beginner-guide-first-harvest',
    'greedy-growers-guides-seeds-money-progression',
    'greedy-growers-mechanics-lightning-mutations-harvest',
    'greedy-growers-official-links-source-check',
    'greedy-growers-beginner-mistakes-safe-harvest',
  ])('ships valid 3:2 AVIF and WebP variants for %s', async (slug) => {
    expect(existsSync(`output/imagegen/${slug}.png`), `output/imagegen/${slug}.png should exist`).toBe(true);
    for (const width of [640, 960, 1440]) {
      for (const format of ['avif', 'webp']) {
        const path = `public/images/editorial/${slug}-${width}.${format}`;
        expect(existsSync(path), `${path} should exist`).toBe(true);
        const metadata = await sharp(path).metadata();
        expect(metadata.width).toBe(width);
        expect(metadata.height).toBe(Math.round(width * 2 / 3));
        expect(metadata.format).toBe(format === 'avif' ? 'heif' : 'webp');
      }
    }
  });

  test.each([
    'home-greedy-growers-loop',
    'beginner-first-harvest',
    'guides-field-guide-hub',
    'mechanics-decision-loop',
    'official-links-source-check',
    'mistakes-safer-run',
  ])('does not ship the superseded generic filename %s', (slug) => {
    expect(existsSync(`output/imagegen/${slug}.png`)).toBe(false);
    for (const width of [640, 960, 1440]) {
      for (const format of ['avif', 'webp']) {
        expect(existsSync(`public/images/editorial/${slug}-${width}.${format}`)).toBe(false);
      }
    }
  });
});
