const standardFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2,
});

export function formatCalculatorMetric(value: number): string {
  return Math.abs(value) >= 1_000_000
    ? compactFormatter.format(value)
    : standardFormatter.format(value);
}

export interface CalculatorShareSummary {
  seedName: string;
  seedCost: string;
  harvestValue: string;
  waitMinutes: string;
  failedRuns: string;
  multiplier: string;
  riskAdjustedProfit: string;
  profitPerMinute: string;
  url: string;
}

export function buildCalculatorShareText(summary: CalculatorShareSummary): string {
  return [
    'Greedy Growers observed run',
    `Seed reference: ${summary.seedName}`,
    `Seed cost: ${summary.seedCost}`,
    `Harvest value: ${summary.harvestValue}`,
    `Wait: ${summary.waitMinutes} min`,
    `Failed runs: ${summary.failedRuns}`,
    `Multiplier: ${summary.multiplier}x`,
    `Risk-adjusted profit: ${summary.riskAdjustedProfit}`,
    `Adjusted profit / min: ${summary.profitPerMinute}`,
    'Player-entered scenario, not a forecast.',
    summary.url,
  ].join('\n');
}
