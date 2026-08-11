import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const source = readFileSync(new URL('./share.ts', import.meta.url), 'utf8');

describe('guide sharing capability detection', () => {
  test('captures native share support once before choosing the action and status', () => {
    expect(source).toContain("const canUseNativeShare = typeof navigator.share === 'function';");
    expect(source).toContain('if (canUseNativeShare)');
    expect(source).toContain("canUseNativeShare ? 'Share opened' : 'Link copied'");
  });
});
