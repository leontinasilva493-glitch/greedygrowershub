export const MAX_RUNS = 5;

export interface RunRecord {
  label: string;
  riskAdjustedProfit: number;
  riskAdjustedProfitPerMinute: number;
  elapsedMinutes: number;
}

export interface CreateRunRecordInput {
  label: string;
  riskAdjustedProfit: number;
  riskAdjustedProfitPerMinute: number;
  waitMinutes: number;
  failedRuns: number;
}

export interface RunSummary {
  count: number;
  medianNetPerMinute: number | null;
  minNetPerMinute: number | null;
  maxNetPerMinute: number | null;
}

function assertFiniteNumber(label: string, value: number): void {
  if (!Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number`);
  }
}

export function createRunRecord(input: CreateRunRecordInput): RunRecord {
  const label = input.label.trim();
  if (!label) {
    throw new Error('Scenario label is required');
  }

  assertFiniteNumber('riskAdjustedProfit', input.riskAdjustedProfit);
  assertFiniteNumber('riskAdjustedProfitPerMinute', input.riskAdjustedProfitPerMinute);
  assertFiniteNumber('waitMinutes', input.waitMinutes);
  assertFiniteNumber('failedRuns', input.failedRuns);

  return {
    label,
    riskAdjustedProfit: input.riskAdjustedProfit,
    riskAdjustedProfitPerMinute: input.riskAdjustedProfitPerMinute,
    elapsedMinutes: input.waitMinutes * (input.failedRuns + 1),
  };
}

export function appendRunRecord(runs: RunRecord[], run: RunRecord): RunRecord[] {
  if (runs.length >= MAX_RUNS) {
    throw new Error('You can save at most five runs');
  }

  return [...runs, run];
}

export function summarizeRuns(runs: RunRecord[]): RunSummary {
  const count = runs.length;
  if (count < 2) {
    return {
      count,
      medianNetPerMinute: null,
      minNetPerMinute: null,
      maxNetPerMinute: null,
    };
  }

  const sorted = runs
    .map((run) => run.riskAdjustedProfitPerMinute)
    .sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  const medianNetPerMinute = sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];

  return {
    count,
    medianNetPerMinute,
    minNetPerMinute: sorted[0],
    maxNetPerMinute: sorted.at(-1) ?? null,
  };
}
