import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const source = readFileSync(new URL('./SeedExplorer.astro', import.meta.url), 'utf8');

describe('mobile seed comparison tray', () => {
  test('stays below the mobile reading rail and stacks actions on narrow phones', () => {
    expect(source).toContain('top-[8.75rem]');
    expect(source).toContain('flex-col items-stretch');
    expect(source).toContain('sm:flex-row');
    expect(source).toContain('scroll-mt-52');
  });
});
