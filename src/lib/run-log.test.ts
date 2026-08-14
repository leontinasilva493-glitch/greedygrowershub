import { describe, expect, it } from 'vitest';
import { MAX_RUNS, appendRunRecord, createRunRecord, summarizeRuns } from './run-log';

describe('createRunRecord', () => {
  it('stores the explicit label, current risk-adjusted values, and elapsed minutes', () => {
    expect(createRunRecord({
      label: 'River corn',
      riskAdjustedProfit: 120,
      riskAdjustedProfitPerMinute: 15,
      waitMinutes: 4,
      failedRuns: 1,
    })).toEqual({
      label: 'River corn',
      riskAdjustedProfit: 120,
      riskAdjustedProfitPerMinute: 15,
      elapsedMinutes: 8,
    });
  });

  it('rejects a blank label', () => {
    expect(() => createRunRecord({
      label: '   ',
      riskAdjustedProfit: 120,
      riskAdjustedProfitPerMinute: 15,
      waitMinutes: 4,
      failedRuns: 1,
    })).toThrow('Scenario label is required');
  });

  it.each([
    ['riskAdjustedProfit', Number.NaN],
    ['riskAdjustedProfitPerMinute', Number.POSITIVE_INFINITY],
  ])('rejects non-finite %s values', (field, value) => {
    expect(() => createRunRecord({
      label: 'Storm retry',
      riskAdjustedProfit: field === 'riskAdjustedProfit' ? value : 120,
      riskAdjustedProfitPerMinute: field === 'riskAdjustedProfitPerMinute' ? value : 15,
      waitMinutes: 4,
      failedRuns: 1,
    })).toThrow('must be a finite number');
  });
});

describe('appendRunRecord', () => {
  const run = createRunRecord({
    label: 'Safe run',
    riskAdjustedProfit: 30,
    riskAdjustedProfitPerMinute: 10,
    waitMinutes: 3,
    failedRuns: 0,
  });

  it('accepts exactly five runs', () => {
    const runs = Array.from({ length: MAX_RUNS - 1 }, (_, index) => ({
      ...run,
      label: `Run ${index + 1}`,
    }));

    expect(appendRunRecord(runs, run)).toHaveLength(MAX_RUNS);
  });

  it('rejects a sixth run', () => {
    const runs = Array.from({ length: MAX_RUNS }, (_, index) => ({
      ...run,
      label: `Run ${index + 1}`,
    }));

    expect(() => appendRunRecord(runs, run)).toThrow('You can save at most five runs');
  });
});

describe('summarizeRuns', () => {
  it('returns count with no stats for zero runs', () => {
    expect(summarizeRuns([])).toEqual({
      count: 0,
      medianNetPerMinute: null,
      minNetPerMinute: null,
      maxNetPerMinute: null,
    });
  });

  it('returns count with no stats for one run', () => {
    expect(summarizeRuns([
      createRunRecord({
        label: 'Only run',
        riskAdjustedProfit: 40,
        riskAdjustedProfitPerMinute: 10,
        waitMinutes: 4,
        failedRuns: 0,
      }),
    ])).toEqual({
      count: 1,
      medianNetPerMinute: null,
      minNetPerMinute: null,
      maxNetPerMinute: null,
    });
  });

  it('calculates odd-count median and range from net per minute', () => {
    const runs = [
      createRunRecord({ label: 'Run 1', riskAdjustedProfit: 20, riskAdjustedProfitPerMinute: 5, waitMinutes: 4, failedRuns: 0 }),
      createRunRecord({ label: 'Run 2', riskAdjustedProfit: 36, riskAdjustedProfitPerMinute: 9, waitMinutes: 4, failedRuns: 0 }),
      createRunRecord({ label: 'Run 3', riskAdjustedProfit: 28, riskAdjustedProfitPerMinute: 7, waitMinutes: 4, failedRuns: 0 }),
    ];

    expect(summarizeRuns(runs)).toEqual({
      count: 3,
      medianNetPerMinute: 7,
      minNetPerMinute: 5,
      maxNetPerMinute: 9,
    });
  });

  it('calculates even-count median as the midpoint between the two middle values', () => {
    const runs = [
      createRunRecord({ label: 'Run 1', riskAdjustedProfit: 24, riskAdjustedProfitPerMinute: 6, waitMinutes: 4, failedRuns: 0 }),
      createRunRecord({ label: 'Run 2', riskAdjustedProfit: 40, riskAdjustedProfitPerMinute: 10, waitMinutes: 4, failedRuns: 0 }),
      createRunRecord({ label: 'Run 3', riskAdjustedProfit: 32, riskAdjustedProfitPerMinute: 8, waitMinutes: 4, failedRuns: 0 }),
      createRunRecord({ label: 'Run 4', riskAdjustedProfit: 16, riskAdjustedProfitPerMinute: 4, waitMinutes: 4, failedRuns: 0 }),
    ];

    expect(summarizeRuns(runs)).toEqual({
      count: 4,
      medianNetPerMinute: 7,
      minNetPerMinute: 4,
      maxNetPerMinute: 10,
    });
  });
});
