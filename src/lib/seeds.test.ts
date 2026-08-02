import { describe, expect, it } from 'vitest';
import type { SeedRecord } from './content';
import { compareSeeds, filterSeeds, groupSeedsByTier, sortSeeds } from './seeds';

const fixtures: SeedRecord[] = [
  { id: 'alpha', name: 'Alpha', type: 'Seed', rarity: 'Common', sourceId: 'source', sourceIds: ['source'], unlock: 'River', cost: 40, costDisplay: '$40', costSortValue: 40, spawnOneIn: 5, harvestValue: 75, growthMinutes: 2, multiHarvest: false, reportedProfitPerMinute: 17.5, tier: 'C', bestUse: 'Starter sample', stage: 'starter', verification: 'verified', verifiedAt: '2026-07-26', gameVersionClaim: 'Test', availability: 'Available', notes: '' },
  { id: 'beta', name: 'Beta', type: 'Plant', rarity: 'Rare', sourceId: 'source', sourceIds: ['source'], unlock: 'Quest', cost: null, costDisplay: 'Not verified', costSortValue: null, spawnOneIn: null, harvestValue: null, growthMinutes: null, multiHarvest: null, reportedProfitPerMinute: null, tier: null, bestUse: 'Unknown sample', stage: 'all', verification: 'community-lead', verifiedAt: '2026-07-26', gameVersionClaim: 'Test', availability: 'Unknown', notes: '' },
  { id: 'gamma', name: 'Gamma', type: 'Tree', rarity: 'Epic', sourceId: 'source', sourceIds: ['source'], unlock: 'Shop', cost: 120, costDisplay: '$120', costSortValue: 120, spawnOneIn: 15, harvestValue: 210, growthMinutes: 5, multiHarvest: true, reportedProfitPerMinute: 18, tier: 'S', bestUse: 'Late sample', stage: 'late', verification: 'needs-check', verifiedAt: '2026-07-26', gameVersionClaim: 'Test', availability: 'Available', notes: '' },
];

describe('filterSeeds', () => {
  it('filters by verification', () => {
    expect(filterSeeds(fixtures, { verification: 'verified', stage: 'all' }).map((seed) => seed.id)).toEqual(['alpha']);
  });

  it('includes universal records in a stage filter', () => {
    expect(filterSeeds(fixtures, { verification: 'all', stage: 'starter' }).map((seed) => seed.id)).toEqual(['alpha', 'beta']);
  });

  it('filters the current catalog by rarity', () => {
    expect(filterSeeds(fixtures, { verification: 'all', stage: 'all', rarity: 'Rare' }).map((seed) => seed.id)).toEqual(['beta']);
  });
});

describe('sortSeeds', () => {
  it('sorts alphabetically without changing the input', () => {
    const reversed = [...fixtures].reverse();
    expect(sortSeeds(reversed, 'name', 'asc').map((seed) => seed.id)).toEqual(['alpha', 'beta', 'gamma']);
    expect(reversed.map((seed) => seed.id)).toEqual(['gamma', 'beta', 'alpha']);
  });

  it('sorts numeric values and always places unknown values last', () => {
    expect(sortSeeds(fixtures, 'cost', 'asc').map((seed) => seed.id)).toEqual(['alpha', 'gamma', 'beta']);
    expect(sortSeeds(fixtures, 'cost', 'desc').map((seed) => seed.id)).toEqual(['gamma', 'alpha', 'beta']);
  });

  it('sorts display-safe catalog prices and reported spawn denominators', () => {
    expect(sortSeeds(fixtures, 'costSortValue', 'desc').map((seed) => seed.id)).toEqual(['gamma', 'alpha', 'beta']);
    expect(sortSeeds(fixtures, 'spawnOneIn', 'asc').map((seed) => seed.id)).toEqual(['alpha', 'gamma', 'beta']);
  });
});

describe('compareSeeds', () => {
  it('returns selected records in the requested order and ignores unknown ids', () => {
    expect(compareSeeds(fixtures, ['gamma', 'missing', 'alpha']).map((seed) => seed.id)).toEqual(['gamma', 'alpha']);
  });
});

describe('groupSeedsByTier', () => {
  it('returns non-empty groups in S-to-D ranking order', () => {
    const tierFixtures: SeedRecord[] = [
      { ...fixtures[0], id: 'tier-d', tier: 'D' },
      { ...fixtures[0], id: 'tier-b', tier: 'B' },
      { ...fixtures[0], id: 'tier-s', tier: 'S' },
      { ...fixtures[0], id: 'tier-c', tier: 'C' },
      { ...fixtures[0], id: 'tier-a', tier: 'A' },
    ];

    expect(groupSeedsByTier(tierFixtures).map((group) => group.tier)).toEqual(['S', 'A', 'B', 'C', 'D']);
  });
});
