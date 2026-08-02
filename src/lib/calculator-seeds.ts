import type { SeedRecord } from './content';

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
