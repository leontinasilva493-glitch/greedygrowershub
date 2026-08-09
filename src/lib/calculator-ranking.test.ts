import { describe, expect, it } from 'vitest';
import type { SeedRecord } from './content';
import { buildSeedComparison } from './calculator-ranking';

const seed = (overrides: Partial<SeedRecord>): SeedRecord => ({
  id: 'seed',
  name: 'Seed',
  type: 'River seed',
  rarity: 'Common',
  sourceId: 'source',
  sourceIds: ['source'],
  unlock: 'Reported',
  cost: 100,
  costDisplay: '$100',
  costSortValue: 100,
  spawnOneIn: 5,
  harvestValue: 160,
  growthMinutes: 3,
  multiHarvest: null,
  reportedProfitPerMinute: null,
  tier: null,
  bestUse: 'Test fixture',
  stage: 'all',
  verification: 'community-lead',
  verifiedAt: '2026-08-09',
  gameVersionClaim: 'Reported',
  availability: 'Reported',
  notes: 'Test fixture',
  ...overrides,
});

describe('buildSeedComparison', () => {
  it('sorts complete local records by a derived base profit pace', () => {
    const comparison = buildSeedComparison([
      seed({ id: 'slow', name: 'Slow Seed', cost: 10, harvestValue: 70, growthMinutes: 4 }),
      seed({ id: 'fast', name: 'Fast Seed', cost: 100, harvestValue: 160, growthMinutes: 3 }),
    ], 3);

    expect(comparison.ranked).toEqual([
      expect.objectContaining({ name: 'Fast Seed', rank: 1, profitPerMinute: 20 }),
      expect.objectContaining({ name: 'Slow Seed', rank: 2, profitPerMinute: 15 }),
    ]);
  });

  it('keeps incomplete records visible but unranked with their missing observation named', () => {
    const comparison = buildSeedComparison([
      seed({ id: 'unknown', name: 'Unknown Seed', harvestValue: null }),
    ], 3);

    expect(comparison.unrankable).toEqual([
      expect.objectContaining({ name: 'Unknown Seed', missing: ['harvest value'] }),
    ]);
  });
});
