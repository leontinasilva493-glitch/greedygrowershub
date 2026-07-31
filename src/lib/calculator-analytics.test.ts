import { describe, expect, it } from 'vitest';
import { createCalculatorAnalyticsEvent } from './calculator-analytics';

describe('createCalculatorAnalyticsEvent', () => {
  it('creates a preset-selection event with only an allow-listed label and page path', () => {
    const event = createCalculatorAnalyticsEvent('calculator_seed_selected', 'mango-seed', '/');

    expect(event).toEqual({
      event: 'calculator_seed_selected',
      event_label: 'mango-seed',
      page_path: '/',
    });
    expect(Object.keys(event)).toEqual(['event', 'event_label', 'page_path']);
  });

  it('supports fertilizer and advanced-disclosure events without calculator inputs', () => {
    expect(createCalculatorAnalyticsEvent('calculator_fertilizer_selected', 'basic-fertilizer', '/')).toEqual({
      event: 'calculator_fertilizer_selected',
      event_label: 'basic-fertilizer',
      page_path: '/',
    });
    expect(createCalculatorAnalyticsEvent('calculator_advanced_opened', 'advanced-inputs', '/')).toEqual({
      event: 'calculator_advanced_opened',
      event_label: 'advanced-inputs',
      page_path: '/',
    });
  });
});
