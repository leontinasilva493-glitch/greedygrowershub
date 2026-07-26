import { describe, expect, it } from 'vitest';
import { validateContent, type ContentBundle } from './content';

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
      unlock: 'River purchase area',
      cost: null,
      harvestValue: null,
      growthMinutes: null,
      stage: 'all',
      verification: 'needs-check',
      verifiedAt: '2026-07-26',
      notes: 'The official loop confirms seed buying, not the full roster.',
    },
  ],
});

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
});
