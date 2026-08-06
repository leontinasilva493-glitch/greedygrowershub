import { describe, expect, it } from 'vitest';
import { mutations, seeds, validateContent, type ContentBundle, type SeedRecord } from './content';

const makeBundle = (): ContentBundle => ({
  site: {
    name: 'Greedy Growers Hub',
    description: 'Independent Greedy Growers tools and player guides.',
    domain: 'greedygrowerhub.wiki',
    officialGameUrl: 'https://www.roblox.com/games/74102906764176/Greedy-Growers',
    universeId: '10440833423',
    checkedAt: '2026-07-26',
  },
  sources: [
    {
      id: 'roblox-official',
      name: 'Official Roblox experience',
      url: 'https://www.roblox.com/games/74102906764176/Greedy-Growers',
      trust: 'official',
    },
  ],
  codes: [
    {
      code: 'SAMPLE',
      reward: 'Test reward',
      status: 'reported',
      sourceId: 'roblox-official',
      verifiedAt: '2026-07-26',
    },
  ],
  seeds: [
    {
      id: 'river-seed',
      name: 'River seed inventory',
      type: 'Seed',
      rarity: 'Not verified',
      sourceId: 'roblox-official',
      sourceIds: ['roblox-official'],
      unlock: 'River purchase area',
      cost: null,
      costDisplay: 'Not verified',
      costSortValue: null,
      spawnOneIn: null,
      harvestValue: null,
      growthMinutes: null,
      multiHarvest: false,
      reportedProfitPerMinute: null,
      tier: null,
      bestUse: 'Needs a verified seed record.',
      stage: 'all',
      verification: 'needs-check',
      verifiedAt: '2026-07-26',
      gameVersionClaim: 'Not verified',
      availability: 'Needs in-game check',
      notes: 'The official loop confirms seed buying, not the full roster.',
    },
  ],
  mutations: [
    {
      id: 'dewy',
      name: 'Dewy',
      valueMultiplier: 2,
      reportedTrigger: 'Misty Weather Event',
      reportedChance: '50%',
      appliesTo: ['Seeds', 'Plants', 'Fruits'],
      sourceIds: ['roblox-official'],
      verification: 'community-lead',
      verifiedAt: '2026-08-01',
      gameVersionClaim: 'Update 1.2',
      notes: 'Fixture.',
    },
  ],
  fertilizers: [
    {
      id: 'basic-fertilizer',
      name: 'Basic Fertilizer',
      cost: 100,
      boostMultiplier: 1.25,
      sourceId: 'roblox-official',
      verification: 'community-lead',
      verifiedAt: '2026-07-26',
      notes: 'Community-reported snapshot.',
    },
  ],
  rebirths: [
    {
      level: 1,
      requirement: 'Collect 10,000 coins',
      perks: ['Basic Fertilizer Unlock'],
      sourceId: 'roblox-official',
      verification: 'community-lead',
      verifiedAt: '2026-07-26',
    },
  ],
} as ContentBundle);

describe('validateContent', () => {
  it('accepts a complete conservative content bundle', () => {
    expect(() => validateContent(makeBundle())).not.toThrow();
  });

  it('rejects duplicate code strings', () => {
    const bundle = makeBundle();
    bundle.codes.push({ ...bundle.codes[0] });

    expect(() => validateContent(bundle)).toThrow('Duplicate code: SAMPLE');
  });

  it('rejects negative seed values', () => {
    const bundle = makeBundle();
    bundle.seeds[0].cost = -1;

    expect(() => validateContent(bundle)).toThrow('Seed cost must be non-negative');
  });

  it('rejects unsupported verification states', () => {
    const bundle = makeBundle();
    bundle.seeds[0].verification = 'guessed' as never;

    expect(() => validateContent(bundle)).toThrow('Unsupported verification state');
  });

  it('rejects records that point to an unknown source', () => {
    const bundle = makeBundle();
    bundle.codes[0].sourceId = 'missing-source';

    expect(() => validateContent(bundle)).toThrow('Unknown source: missing-source');
  });

  it('rejects unsupported seed tiers before they can power rankings', () => {
    const bundle = makeBundle();
    bundle.seeds[0].tier = 'Z' as never;

    expect(() => validateContent(bundle)).toThrow('Unsupported seed tier: Z');
  });

  it('rejects invalid current-catalog spawn denominators', () => {
    const bundle = makeBundle();
    (bundle.seeds[0] as SeedRecord & { spawnOneIn: number }).spawnOneIn = 0;

    expect(() => validateContent(bundle)).toThrow('Seed spawn denominator must be a positive whole number');
  });

  it('rejects a current-catalog record without traceable sources', () => {
    const bundle = makeBundle();
    (bundle.seeds[0] as SeedRecord & { sourceIds: string[] }).sourceIds = [];

    expect(() => validateContent(bundle)).toThrow('Seed river-seed needs at least one source');
  });

  it('rejects fertilizer multipliers below the neutral baseline', () => {
    const bundle = makeBundle();
    bundle.fertilizers[0].boostMultiplier = 0.5;

    expect(() => validateContent(bundle)).toThrow('Fertilizer boost multiplier must be at least 1');
  });

  it('rejects duplicate rebirth levels', () => {
    const bundle = makeBundle();
    bundle.rebirths.push({ ...bundle.rebirths[0] });

    expect(() => validateContent(bundle)).toThrow('Duplicate rebirth level: 1');
  });
});

describe('current seed catalog', () => {
  it('contains the 20 Update 1.2 seeds reported by both current publications', () => {
    expect(seeds).toHaveLength(20);
    expect(seeds.map((seed) => seed.id)).toEqual([
      'oak-seed',
      'pine-seed',
      'apple-seed',
      'peach-seed',
      'fig-seed',
      'orange-seed',
      'lemon-seed',
      'avocado-seed',
      'cherry-seed',
      'mango-seed',
      'coconut-seed',
      'banana-seed',
      'starfruit-seed',
      'dragon-fruit-seed',
      'glowing-seed',
      'blooming-seed',
      'magic-seed',
      'pizza-seed',
      'diamond-seed',
      'void-seed',
    ]);
  });

  it('keeps unsupported economics null while retaining source-safe catalog fields', () => {
    for (const seed of seeds as Array<SeedRecord & {
      sourceIds: string[];
      spawnOneIn: number;
      costDisplay: string;
      gameVersionClaim: string;
    }>) {
      expect(seed.sourceIds).toEqual(['pro-game-guides', 'mrguider']);
      expect(seed.spawnOneIn).toBeGreaterThan(0);
      expect(seed.costDisplay).toMatch(/^(Free|\$)/);
      expect(seed.gameVersionClaim).toBe('Update 1.2');
      expect(seed.harvestValue).toBeNull();
      expect(seed.growthMinutes).toBeNull();
      expect(seed.reportedProfitPerMinute).toBeNull();
      expect(seed.tier).toBeNull();
    }
  });

  it('covers all eight reported rarity groups in the expected counts', () => {
    const counts = Object.fromEntries(
      ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic', 'Celestial', 'Secret', 'Divine']
        .map((rarity) => [rarity, seeds.filter((seed) => seed.rarity === rarity).length]),
    );

    expect(counts).toEqual({
      Common: 2,
      Rare: 3,
      Epic: 3,
      Legendary: 3,
      Mythic: 3,
      Celestial: 2,
      Secret: 2,
      Divine: 2,
    });
  });
});

describe('current mutation catalog', () => {
  it('keeps the six matching Update 1.2 mutation reports in multiplier order', () => {
    expect(mutations.map(({ id, valueMultiplier }) => [id, valueMultiplier])).toEqual([
      ['dewy', 2],
      ['shocked', 2.5],
      ['radioactive', 5],
      ['charged', 7.5],
      ['golden', 25],
      ['cosmic', 100],
    ]);
    expect(mutations.every((mutation) => mutation.sourceIds.length === 2)).toBe(true);
    expect(mutations.every((mutation) => mutation.gameVersionClaim === 'Update 1.2')).toBe(true);
  });
});
