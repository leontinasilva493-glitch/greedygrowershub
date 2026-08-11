import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const component = readFileSync(new URL('./FeedbackPrompt.astro', import.meta.url), 'utf8');
const script = readFileSync(new URL('../scripts/feedback.ts', import.meta.url), 'utf8');

describe('editorial feedback prompt', () => {
  test('is consent-bound, count-free, and limited to two choices', () => {
    expect(component).toContain('data-feedback-prompt');
    expect(component).toContain('hidden');
    expect(component).toContain('Helpful');
    expect(component).toContain('Needs work');
    expect(component).not.toContain('type="text"');
    expect(component).not.toContain('vote count');
    expect(script).toContain("analytics-consent-change");
    expect(script).toContain("greedy-growers-analytics-consent");
    expect(script).not.toContain('selected_seed');
    expect(script).not.toContain('calculator_value');
  });
});
