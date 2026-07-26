import { describe, expect, it } from 'vitest';
import { calculateProfit, validateCalculatorInput } from './calculator';

describe('calculateProfit', () => {
  it('calculates success, break-even, and failed-run costs', () => {
    expect(calculateProfit({
      seedCost: 100,
      harvestValue: 160,
      waitMinutes: 3,
      failedRuns: 1,
      fertilizerCost: 0,
      harvestMultiplier: 1,
    })).toEqual({
      totalInvestment: 100,
      boostedHarvestValue: 160,
      profitPerSuccess: 60,
      profitPerMinute: 20,
      breakEvenHarvest: 200,
      riskAdjustedProfit: -40,
      riskAdjustedProfitPerMinute: -6.666666666666667,
    });
  });

  it('includes fertilizer cost and reported boost in every run', () => {
    expect(calculateProfit({
      seedCost: 100,
      harvestValue: 200,
      waitMinutes: 2,
      failedRuns: 1,
      fertilizerCost: 20,
      harvestMultiplier: 1.5,
    })).toEqual({
      totalInvestment: 120,
      boostedHarvestValue: 300,
      profitPerSuccess: 180,
      profitPerMinute: 90,
      breakEvenHarvest: 240,
      riskAdjustedProfit: 60,
      riskAdjustedProfitPerMinute: 15,
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
      fertilizerCost: 0,
      harvestMultiplier: 1,
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
        fertilizerCost: 0,
        harvestMultiplier: 1,
      })).toThrow();
    },
  );

  it('rejects a harvest multiplier below one', () => {
    expect(() => validateCalculatorInput({
      seedCost: 100,
      harvestValue: 160,
      waitMinutes: 3,
      failedRuns: 0,
      fertilizerCost: 0,
      harvestMultiplier: 0.5,
    })).toThrow('Harvest multiplier must be at least one');
  });
});
