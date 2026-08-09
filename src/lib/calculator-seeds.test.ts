import { describe, expect, it } from 'vitest';
import type { SeedRecord } from './content';
import { getCalculatorSeedCost, getReportedSeedPreview } from './calculator-seeds';

function makeRecord(overrides: Partial<SeedRecord> & Pick<SeedRecord, 'id' | 'name'>): SeedRecord {
  const { id, name, ...rest } = overrides;
  return {
    id,
    name,
    type: 'River seed',
    rarity: 'Common',
    sourceId: 'community-source',
    sourceIds: ['community-source'],
    unlock: 'Reported river stock',
    cost: null,
    costDisplay: 'Not reported',
    costSortValue: null,
    spawnOneIn: null,
    harvestValue: null,
    growthMinutes: null,
    multiHarvest: null,
    reportedProfitPerMinute: null,
    tier: null,
    bestUse: 'Needs testing',
    stage: 'all',
    verification: 'community-lead',
    verifiedAt: '2026-08-01',
    gameVersionClaim: 'Update 1.2',
    availability: 'Reported current',
    notes: 'Test fixture.',
    ...rest,
  };
}

const records: SeedRecord[] = [
  makeRecord({ id: 'unknown-seed', name: 'Unknown Seed' }),
  makeRecord({ id: 'alpha-seed', name: 'Alpha Seed', rarity: 'Rare', costDisplay: '$200', costSortValue: 200, spawnOneIn: 9 }),
  makeRecord({ id: 'gamma-seed', name: 'Gamma Seed', costDisplay: '$50', costSortValue: 50, spawnOneIn: 5 }),
  makeRecord({ id: 'beta-seed', name: 'Beta Seed', rarity: 'Legendary', costDisplay: '$500', costSortValue: 500, spawnOneIn: 120 }),
];

describe('getReportedSeedPreview', () => {
  it('sorts the current catalog by reported buy-in and places unknown values last', () => {
    expect(getReportedSeedPreview(records).map((seed) => seed.id)).toEqual([
      'gamma-seed',
      'alpha-seed',
      'beta-seed',
      'unknown-seed',
    ]);
  });

  it('limits the preview without mutating the source records', () => {
    const originalOrder = records.map((seed) => seed.id);
    expect(getReportedSeedPreview(records, 2).map((seed) => seed.id)).toEqual(['gamma-seed', 'alpha-seed']);
    expect(records.map((seed) => seed.id)).toEqual(originalOrder);
  });
});

describe('getCalculatorSeedCost', () => {
  it('returns the reported numeric buy-in so selecting a seed can immediately refresh the scenario', () => {
    expect(getCalculatorSeedCost(records[1])).toBe(200);
  });

  it('does not invent a buy-in when the catalog has no numeric price', () => {
    expect(getCalculatorSeedCost(records[0])).toBeNull();
  });

  it('does not silently round an amount beyond safe JavaScript integer precision', () => {
    expect(getCalculatorSeedCost(makeRecord({ id: 'huge-seed', name: 'Huge Seed', costSortValue: Number.MAX_SAFE_INTEGER + 1 }))).toBeNull();
  });
});
