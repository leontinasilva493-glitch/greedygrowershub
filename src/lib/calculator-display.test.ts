import { describe, expect, it } from 'vitest';
import { buildCalculatorShareText, formatCalculatorMetric } from './calculator-display';

describe('formatCalculatorMetric', () => {
  it('keeps ordinary calculator values fully readable', () => {
    expect(formatCalculatorMetric(16_000)).toBe('16,000');
  });

  it('compacts large losses so a result card does not overflow', () => {
    expect(formatCalculatorMetric(-999_984_000)).toBe('-999.98M');
  });
});

describe('buildCalculatorShareText', () => {
  it('exports labelled observed inputs and results without claiming a forecast', () => {
    expect(buildCalculatorShareText({
      seedName: 'Void Seed',
      seedCost: '1.75Qi',
      harvestValue: '2Qi',
      waitMinutes: '8',
      failedRuns: '1',
      multiplier: '1',
      riskAdjustedProfit: '-1.5Qi',
      profitPerMinute: '-187.5T',
      url: 'https://greedygrowers.com/',
    })).toBe([
      'Greedy Growers observed run',
      'Seed reference: Void Seed',
      'Seed cost: 1.75Qi',
      'Harvest value: 2Qi',
      'Wait: 8 min',
      'Failed runs: 1',
      'Multiplier: 1x',
      'Risk-adjusted profit: -1.5Qi',
      'Adjusted profit / min: -187.5T',
      'Player-entered scenario, not a forecast.',
      'https://greedygrowers.com/',
    ].join('\n'));
  });
});
