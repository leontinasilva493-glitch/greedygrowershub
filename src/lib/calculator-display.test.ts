import { describe, expect, it } from 'vitest';
import { formatCalculatorMetric } from './calculator-display';

describe('formatCalculatorMetric', () => {
  it('keeps ordinary calculator values fully readable', () => {
    expect(formatCalculatorMetric(16_000)).toBe('16,000');
  });

  it('compacts large losses so a result card does not overflow', () => {
    expect(formatCalculatorMetric(-999_984_000)).toBe('-999.98M');
  });
});
