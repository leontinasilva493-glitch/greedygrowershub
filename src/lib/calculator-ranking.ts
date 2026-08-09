import type { SeedRecord } from './content';

export interface RankedSeed {
  id: string;
  name: string;
  rarity: string;
  verification: SeedRecord['verification'];
  rank: number;
  cost: number;
  harvestValue: number;
  growthMinutes: number;
  profitPerMinute: number;
}

export interface UnrankableSeed {
  id: string;
  name: string;
  rarity: string;
  verification: SeedRecord['verification'];
  costDisplay: string;
  cost: number | null;
  harvestValue: number | null;
  growthMinutes: number | null;
  missing: string[];
}

export interface SeedComparison {
  ranked: RankedSeed[];
  unrankable: UnrankableSeed[];
}

const requiredEconomics: Array<[keyof Pick<SeedRecord, 'cost' | 'harvestValue' | 'growthMinutes'>, string]> = [
  ['cost', 'seed cost'],
  ['harvestValue', 'harvest value'],
  ['growthMinutes', 'growth time'],
];

export function buildSeedComparison(records: SeedRecord[], limit = 6): SeedComparison {
  const ranked: RankedSeed[] = [];
  const unrankable: UnrankableSeed[] = [];

  for (const record of records) {
    const missing = requiredEconomics
      .filter(([key]) => record[key] === null)
      .map(([, label]) => label);

    if (missing.length) {
      unrankable.push({
        id: record.id,
        name: record.name,
        rarity: record.rarity,
        verification: record.verification,
        costDisplay: record.costDisplay,
        cost: record.cost,
        harvestValue: record.harvestValue,
        growthMinutes: record.growthMinutes,
        missing,
      });
      continue;
    }

    const profitPerMinute = (record.harvestValue! - record.cost!) / record.growthMinutes!;
    ranked.push({
      id: record.id,
      name: record.name,
      rarity: record.rarity,
      verification: record.verification,
      rank: 0,
      cost: record.cost!,
      harvestValue: record.harvestValue!,
      growthMinutes: record.growthMinutes!,
      profitPerMinute,
    });
  }

  ranked.sort((left, right) => right.profitPerMinute - left.profitPerMinute || left.name.localeCompare(right.name));
  const limitedRanked = ranked.slice(0, Math.max(0, limit)).map((record, index) => ({ ...record, rank: index + 1 }));

  return {
    ranked: limitedRanked,
    unrankable: unrankable.slice(0, Math.max(0, limit)),
  };
}
