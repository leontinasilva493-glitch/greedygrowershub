import { existsSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { relatedNextSteps } from './related';

const routeFile = (href: string) => new URL(
  href === '/' ? '../pages/index.astro' : `../pages${href.replace(/\/$/, '')}.astro`,
  import.meta.url,
);

describe('semantic next-step map', () => {
  test('points only to existing canonical routes with a useful reason', () => {
    for (const [route, items] of Object.entries(relatedNextSteps)) {
      expect(items.length, route).toBeGreaterThanOrEqual(3);
      expect(items.length, route).toBeLessThanOrEqual(4);
      for (const item of items) {
        expect(item.href.endsWith('/'), item.href).toBe(true);
        expect(item.reason.trim().length, item.href).toBeGreaterThan(24);
        expect(existsSync(routeFile(item.href)), item.href).toBe(true);
      }
    }
  });
});
