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

export type CalculatorDecisionState = 'profitable' | 'break-even' | 'loss';

export interface CalculatorDecision {
  state: CalculatorDecisionState;
  headline: string;
  explanation: string;
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

export function getCalculatorDecision(result: CalculatorResult): CalculatorDecision {
  if (result.riskAdjustedProfit > 0) {
    return {
      state: 'profitable',
      headline: 'Recorded losses are covered',
      explanation: 'This result stays profitable after the failed attempts you entered.',
    };
  }

  if (result.riskAdjustedProfit === 0) {
    return {
      state: 'break-even',
      headline: 'This setup only breaks even',
      explanation: 'The next successful harvest recovers the entered costs but leaves no profit.',
    };
  }

  return {
    state: 'loss',
    headline: 'This setup does not recover its costs',
    explanation: 'Lower the cost, shorten the wait, or enter a higher observed harvest before repeating it.',
  };
}
