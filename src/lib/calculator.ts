export interface CalculatorInput {
  seedCost: number;
  harvestValue: number;
  waitMinutes: number;
  failedRuns: number;
}

export interface CalculatorResult {
  profitPerSuccess: number;
  profitPerMinute: number;
  breakEvenHarvest: number;
  riskAdjustedProfit: number;
  riskAdjustedProfitPerMinute: number;
}

export function validateCalculatorInput(input: CalculatorInput): void {
  for (const [label, value] of Object.entries(input)) {
    if (!Number.isFinite(value) || value < 0) {
      throw new Error(`${label} must be a non-negative number`);
    }
  }

  if (input.waitMinutes === 0) {
    throw new Error('Wait time must be greater than zero');
  }

  if (!Number.isInteger(input.failedRuns)) {
    throw new Error('Failed runs must be a whole number');
  }
}

export function calculateProfit(input: CalculatorInput): CalculatorResult {
  validateCalculatorInput(input);

  const profitPerSuccess = input.harvestValue - input.seedCost;
  const totalMinutes = input.waitMinutes * (input.failedRuns + 1);
  const riskAdjustedProfit = input.harvestValue - input.seedCost * (input.failedRuns + 1);

  return {
    profitPerSuccess,
    profitPerMinute: profitPerSuccess / input.waitMinutes,
    breakEvenHarvest: input.seedCost * (input.failedRuns + 1),
    riskAdjustedProfit,
    riskAdjustedProfitPerMinute: riskAdjustedProfit / totalMinutes,
  };
}
