import type { SeedRecord } from './content';

/**
 * Only the reported numeric river price is safe to prefill from the current
 * catalog. Harvest value and wait time remain player observations.
 */
export function getCalculatorSeedCost(seed: Pick<SeedRecord, 'costSortValue'>): number | null {
  return seed.costSortValue !== null && Number.isSafeInteger(seed.costSortValue)
    ? seed.costSortValue
    : null;
}

export function getReportedSeedPreview(records: SeedRecord[], limit = 5): SeedRecord[] {
  return [...records]
    .sort((left, right) => {
      if (left.costSortValue === null && right.costSortValue === null) return left.name.localeCompare(right.name);
      if (left.costSortValue === null) return 1;
      if (right.costSortValue === null) return -1;
      return left.costSortValue - right.costSortValue || left.name.localeCompare(right.name);
    })
    .slice(0, Math.max(0, limit));
}
