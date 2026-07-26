import { describe, expect, it } from 'vitest';
import type { SeedRecord } from './content';
import { compareSeeds, filterSeeds, sortSeeds } from './seeds';

const fixtures: SeedRecord[] = [
  { id: 'alpha', name: 'Alpha', type: 'Seed', rarity: 'Common', sourceId: 'source', unlock: 'River', cost: 40, harvestValue: 75, growthMinutes: 2, stage: 'starter', verification: 'verified', verifiedAt: '2026-07-26', notes: '' },
  { id: 'beta', name: 'Beta', type: 'Plant', rarity: 'Rare', sourceId: 'source', unlock: 'Quest', cost: null, harvestValue: null, growthMinutes: null, stage: 'all', verification: 'community-lead', verifiedAt: '2026-07-26', notes: '' },
  { id: 'gamma', name: 'Gamma', type: 'Tree', rarity: 'Epic', sourceId: 'source', unlock: 'Shop', cost: 120, harvestValue: 210, growthMinutes: 5, stage: 'late', verification: 'needs-check', verifiedAt: '2026-07-26', notes: '' },
];

describe('filterSeeds', () => {
  it('filters by verification', () => {
    expect(filterSeeds(fixtures, { verification: 'verified', stage: 'all' }).map((seed) => seed.id)).toEqual(['alpha']);
  });

  it('includes universal records in a stage filter', () => {
    expect(filterSeeds(fixtures, { verification: 'all', stage: 'starter' }).map((seed) => seed.id)).toEqual(['alpha', 'beta']);
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
});

describe('compareSeeds', () => {
  it('returns selected records in the requested order and ignores unknown ids', () => {
    expect(compareSeeds(fixtures, ['gamma', 'missing', 'alpha']).map((seed) => seed.id)).toEqual(['gamma', 'alpha']);
  });
});
