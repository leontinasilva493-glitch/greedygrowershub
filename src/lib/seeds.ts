import type { PlayerStage, SeedRecord, VerificationState } from './content';

export interface SeedFilters {
  verification: VerificationState | 'all';
  stage: PlayerStage | 'all';
}

export type SeedSortKey = 'name' | 'cost' | 'harvestValue' | 'growthMinutes';
export type SortDirection = 'asc' | 'desc';

export function filterSeeds(records: SeedRecord[], filters: SeedFilters): SeedRecord[] {
  return records.filter((seed) => {
    const verificationMatches = filters.verification === 'all' || seed.verification === filters.verification;
    const stageMatches = filters.stage === 'all' || seed.stage === 'all' || seed.stage === filters.stage;
    return verificationMatches && stageMatches;
  });
}

export function sortSeeds(records: SeedRecord[], key: SeedSortKey, direction: SortDirection): SeedRecord[] {
  return [...records].sort((left, right) => {
    const a = left[key];
    const b = right[key];

    if (a === null && b === null) return left.name.localeCompare(right.name);
    if (a === null) return 1;
    if (b === null) return -1;

    const comparison = typeof a === 'string'
      ? a.localeCompare(String(b))
      : a - Number(b);
    return direction === 'asc' ? comparison : -comparison;
  });
}

export function compareSeeds(records: SeedRecord[], ids: string[]): SeedRecord[] {
  const byId = new Map(records.map((seed) => [seed.id, seed]));
  return ids.flatMap((id) => {
    const seed = byId.get(id);
    return seed ? [seed] : [];
  });
}
