import { describe, expect, it } from 'vitest';
import { calculateProfit, validateCalculatorInput } from './calculator';

describe('calculateProfit', () => {
  it('calculates success, break-even, and failed-run costs', () => {
    expect(calculateProfit({
      seedCost: 100,
      harvestValue: 160,
      waitMinutes: 3,
      failedRuns: 1,
    })).toEqual({
      profitPerSuccess: 60,
      profitPerMinute: 20,
      breakEvenHarvest: 200,
      riskAdjustedProfit: -40,
      riskAdjustedProfitPerMinute: -6.666666666666667,
    });
  });
});

describe('validateCalculatorInput', () => {
  it('rejects zero wait time', () => {
    expect(() => validateCalculatorInput({
      seedCost: 100,
      harvestValue: 160,
      waitMinutes: 0,
      failedRuns: 0,
    })).toThrow('Wait time must be greater than zero');
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects invalid values: %s',
    (seedCost) => {
      expect(() => validateCalculatorInput({
        seedCost,
        harvestValue: 160,
        waitMinutes: 3,
        failedRuns: 0,
      })).toThrow();
    },
  );
});
