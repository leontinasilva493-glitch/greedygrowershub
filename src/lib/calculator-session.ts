import type { CalculatorResult } from './calculator';

export interface SessionScenarioInput {
  result: CalculatorResult;
  waitMinutes: number;
  plots: number;
  sessionMinutes: number;
}

export interface SessionScenario {
  completedCycles: number;
  sessionInvestment: number;
  sessionRevenue: number;
  sessionProfit: number;
  profitPerMinute: number;
  roi: number;
}

export function calculateSessionScenario(input: SessionScenarioInput): SessionScenario {
  if (!Number.isFinite(input.waitMinutes) || input.waitMinutes <= 0) {
    throw new Error('Wait time must be greater than zero');
  }
  if (!Number.isInteger(input.plots) || input.plots < 1) {
    throw new Error('Garden plots must be a whole number of at least one');
  }
  if (!Number.isFinite(input.sessionMinutes) || input.sessionMinutes <= 0) {
    throw new Error('Session time must be greater than zero');
  }

  const completedCycles = Math.floor(input.sessionMinutes / input.waitMinutes);
  if (completedCycles < 1) {
    throw new Error('Session time must allow at least one completed run');
  }

  const sessionInvestment = input.result.totalInvestment * input.plots * completedCycles;
  const sessionRevenue = input.result.boostedHarvestValue * input.plots * completedCycles;
  const sessionProfit = input.result.profitPerSuccess * input.plots * completedCycles;

  return {
    completedCycles,
    sessionInvestment,
    sessionRevenue,
    sessionProfit,
    profitPerMinute: sessionProfit / input.sessionMinutes,
    roi: sessionInvestment === 0 ? 0 : (sessionProfit / sessionInvestment) * 100,
  };
}
