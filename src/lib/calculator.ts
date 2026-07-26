export interface CalculatorInput {
  seedCost: number;
  harvestValue: number;
  waitMinutes: number;
  failedRuns: number;
  fertilizerCost: number;
  harvestMultiplier: number;
}

export interface CalculatorResult {
  totalInvestment: number;
  boostedHarvestValue: number;
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

  if (input.harvestMultiplier < 1) {
    throw new Error('Harvest multiplier must be at least one');
  }
}

export function calculateProfit(input: CalculatorInput): CalculatorResult {
  validateCalculatorInput(input);

  const totalInvestment = input.seedCost + input.fertilizerCost;
  const boostedHarvestValue = input.harvestValue * input.harvestMultiplier;
  const profitPerSuccess = boostedHarvestValue - totalInvestment;
  const totalMinutes = input.waitMinutes * (input.failedRuns + 1);
  const breakEvenHarvest = totalInvestment * (input.failedRuns + 1);
  const riskAdjustedProfit = boostedHarvestValue - breakEvenHarvest;

  return {
    totalInvestment,
    boostedHarvestValue,
    profitPerSuccess,
    profitPerMinute: profitPerSuccess / input.waitMinutes,
    breakEvenHarvest,
    riskAdjustedProfit,
    riskAdjustedProfitPerMinute: riskAdjustedProfit / totalMinutes,
  };
}
