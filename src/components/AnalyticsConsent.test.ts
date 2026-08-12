import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const source = readFileSync(new URL('./AnalyticsConsent.astro', import.meta.url), 'utf8');

describe('mobile analytics consent prompt', () => {
  test('keeps the optional prompt compact, safe-area aware, and touch friendly', () => {
    expect(source).toContain('style="bottom: max(0.75rem, env(safe-area-inset-bottom));"');
    expect(source).toContain('grid grid-cols-2 gap-2');
    expect(source).toContain('>Allow analytics</button>');
    expect(source).toContain('>Keep off</button>');
    expect(source).toContain('aria-label="Allow optional analytics"');
    expect(source).toContain('aria-label="Keep optional analytics off"');
    expect(source).toContain('min-h-11');
    expect(source).toContain('Calculator inputs stay private');
    expect(source).not.toContain('sm:min-w-56');
  });
});
