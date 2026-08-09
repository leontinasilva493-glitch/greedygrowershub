import { describe, expect, it } from 'vitest';
import { calculateProfit } from './calculator';
import { calculateSessionScenario } from './calculator-session';

describe('calculateSessionScenario', () => {
  const observedRun = calculateProfit({
    seedCost: 100,
    harvestValue: 160,
    waitMinutes: 3,
    failedRuns: 0,
    fertilizerCost: 0,
    harvestMultiplier: 1,
  });

  it('multiplies a completed observed run across plots and completed session cycles', () => {
    expect(calculateSessionScenario({
      result: observedRun,
      waitMinutes: 3,
      plots: 5,
      sessionMinutes: 60,
    })).toEqual({
      completedCycles: 20,
      sessionInvestment: 10000,
      sessionRevenue: 16000,
      sessionProfit: 6000,
      profitPerMinute: 100,
      roi: 60,
    });
  });

  it('rejects a session that cannot complete the observed run', () => {
    expect(() => calculateSessionScenario({
      result: observedRun,
      waitMinutes: 3,
      plots: 1,
      sessionMinutes: 2,
    })).toThrow('Session time must allow at least one completed run');
  });
});
