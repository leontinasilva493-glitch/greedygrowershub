import type { SeedRecord } from './content';

export function getReportedSeedPreview(records: SeedRecord[], limit = 5): SeedRecord[] {
  return [...records]
    .sort((left, right) => {
      const leftPace = left.reportedProfitPerMinute ?? Number.NEGATIVE_INFINITY;
      const rightPace = right.reportedProfitPerMinute ?? Number.NEGATIVE_INFINITY;
      return rightPace - leftPace || left.name.localeCompare(right.name);
    })
    .slice(0, Math.max(0, limit));
}
