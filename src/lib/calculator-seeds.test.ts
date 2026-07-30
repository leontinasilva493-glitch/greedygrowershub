import { describe, expect, it } from 'vitest';
import type { SeedRecord } from './content';
import { getReportedSeedPreview } from './calculator-seeds';

const records: SeedRecord[] = [
  {
    id: 'unknown-seed',
    name: 'Unknown Seed',
    type: 'Seed',
    rarity: 'Common',
    sourceId: 'community-source',
    unlock: 'Unknown',
    cost: null,
    harvestValue: null,
    growthMinutes: null,
    multiHarvest: false,
    reportedProfitPerMinute: null,
    tier: null,
    bestUse: 'Needs testing',
    stage: 'all',
    verification: 'needs-check',
    verifiedAt: '2026-07-29',
    notes: 'No reported profit pace.',
  },
  {
    id: 'alpha-seed',
    name: 'Alpha Seed',
    type: 'Multi-harvest plant',
    rarity: 'Rare',
    sourceId: 'community-source',
    unlock: 'Reported shop purchase',
    cost: 200,
    harvestValue: 400,
    growthMinutes: 2,
    multiHarvest: true,
    reportedProfitPerMinute: 200,
    tier: 'B',
    bestUse: 'Tie-break fixture',
    stage: 'progression',
    verification: 'community-lead',
    verifiedAt: '2026-07-29',
    notes: 'Community-reported fixture.',
  },
  {
    id: 'gamma-seed',
    name: 'Gamma Seed',
    type: 'Seed',
    rarity: 'Uncommon',
    sourceId: 'community-source',
    unlock: 'Reported shop purchase',
    cost: 50,
    harvestValue: 100,
    growthMinutes: 1,
    multiHarvest: false,
    reportedProfitPerMinute: 50,
    tier: 'C',
    bestUse: 'Lower reported pace',
    stage: 'starter',
    verification: 'community-lead',
    verifiedAt: '2026-07-29',
    notes: 'Community-reported fixture.',
  },
  {
    id: 'beta-seed',
    name: 'Beta Seed',
    type: 'Multi-harvest tree',
    rarity: 'Legendary',
    sourceId: 'community-source',
    unlock: 'Reported shop purchase',
    cost: 500,
    harvestValue: 1000,
    growthMinutes: 5,
    multiHarvest: true,
    reportedProfitPerMinute: 200,
    tier: 'A',
    bestUse: 'Tie-break fixture',
    stage: 'late',
    verification: 'community-lead',
    verifiedAt: '2026-07-29',
    notes: 'Community-reported fixture.',
  },
];

describe('getReportedSeedPreview', () => {
  it('sorts reported pace descending, resolves ties by name, and places missing values last', () => {
    expect(getReportedSeedPreview(records).map((seed) => seed.id)).toEqual([
      'alpha-seed',
      'beta-seed',
      'gamma-seed',
      'unknown-seed',
    ]);
  });

  it('limits the preview without mutating the source records', () => {
    const originalOrder = records.map((seed) => seed.id);

    expect(getReportedSeedPreview(records, 2).map((seed) => seed.id)).toEqual([
      'alpha-seed',
      'beta-seed',
    ]);
    expect(records.map((seed) => seed.id)).toEqual(originalOrder);
  });
});
