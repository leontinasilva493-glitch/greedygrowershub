import type { PlayerStage, SeedRecord, SeedTier, VerificationState } from './content';

export interface SeedFilters {
  verification: VerificationState | 'all';
  stage: PlayerStage | 'all';
  rarity?: string | 'all';
}

export type SeedSortKey = 'name' | 'rarity' | 'cost' | 'costSortValue' | 'spawnOneIn' | 'harvestValue' | 'growthMinutes' | 'reportedProfitPerMinute';
export type SortDirection = 'asc' | 'desc';

export interface SeedTierGroup {
  tier: SeedTier;
  items: SeedRecord[];
}

export function filterSeeds(records: SeedRecord[], filters: SeedFilters): SeedRecord[] {
  return records.filter((seed) => {
    const verificationMatches = filters.verification === 'all' || seed.verification === filters.verification;
    const stageMatches = filters.stage === 'all' || seed.stage === 'all' || seed.stage === filters.stage;
    const rarityMatches = !filters.rarity || filters.rarity === 'all' || seed.rarity === filters.rarity;
    return verificationMatches && stageMatches && rarityMatches;
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

export function groupSeedsByTier(records: SeedRecord[]): SeedTierGroup[] {
  const tierOrder: SeedTier[] = ['S', 'A', 'B', 'C', 'D'];

  return tierOrder.flatMap((tier) => {
    const items = records
      .filter((seed) => seed.tier === tier)
      .sort((left, right) => (right.reportedProfitPerMinute ?? -1) - (left.reportedProfitPerMinute ?? -1));
    return items.length ? [{ tier, items }] : [];
  });
}
