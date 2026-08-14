import { describe, expect, it } from 'vitest';
import codes from '../data/codes.json';
import {
  freshnessRecords,
  getFreshness,
  validateFreshnessRecords,
  type FreshnessRecord,
} from './freshness';

const validRecords: FreshnessRecord[] = [
  {
    id: 'codes',
    checkedAt: '2026-08-13',
    state: 'conflict',
    sources: [
      {
        name: 'Official Roblox experience',
        url: 'https://www.roblox.com/games/74102906764176/Greedy-Growers',
        trust: 'official',
      },
    ],
    summary: 'No code has creator-owned confirmation.',
    conflicts: ['A third-party guide reports a code that another guide does not list.'],
    nextCheck: 'Test the reported code in the current redeem UI.',
  },
  {
    id: 'seeds',
    checkedAt: '2026-08-01',
    state: 'reported',
    sources: [
      {
        name: 'Pro Game Guides Update 1.2 seed index',
        url: 'https://progameguides.com/roblox/all-greedy-growers-seeds-costs-rarities-spawn-chances/',
        trust: 'reported',
      },
    ],
    summary: 'Two third-party publications report the same 20-seed catalog.',
    conflicts: [],
    nextCheck: 'Compare all 20 entries with the live river stock after the next patch.',
  },
  {
    id: 'mutations',
    checkedAt: '2026-08-01',
    state: 'reported',
    sources: [
      {
        name: 'Pro Game Guides Update 1.2 mutation guide',
        url: 'https://progameguides.com/roblox/greedy-growers-mutations-multipliers-how-to-get/',
        trust: 'reported',
      },
    ],
    summary: 'Two third-party publications report the same six-mutation catalog.',
    conflicts: [],
    nextCheck: 'Reproduce each mutation trigger and multiplier in game.',
  },
  {
    id: 'roblox-listing',
    checkedAt: '2026-08-13',
    state: 'confirmed',
    sources: [
      {
        name: 'Official Roblox experience',
        url: 'https://www.roblox.com/games/74102906764176/Greedy-Growers',
        trust: 'official',
      },
    ],
    summary: 'The official experience listing confirms the game identity.',
    conflicts: [],
    nextCheck: 'Recheck the official listing after the next experience update.',
  },
];

const cloneFixture = () => structuredClone(validRecords);

describe('freshness registry validation', () => {
  it('rejects duplicate dataset IDs', () => {
    const records = cloneFixture();
    records.push({ ...records[0] });

    expect(() => validateFreshnessRecords(records)).toThrow('Duplicate freshness id: codes');
  });

  it('rejects a registry missing an approved dataset', () => {
    const records = cloneFixture();
    records.pop();

    expect(() => validateFreshnessRecords(records)).toThrow('Missing freshness id: roblox-listing');
  });

  it('rejects an unknown dataset ID', () => {
    const records = cloneFixture();
    records[3].id = 'fertilizers' as FreshnessRecord['id'];

    expect(() => validateFreshnessRecords(records)).toThrow('Unsupported freshness id: fertilizers');
  });

  it('rejects a non-string dataset ID with an explicit validation error', () => {
    const records = cloneFixture() as unknown as Array<Record<string, unknown>>;
    records[0].id = 123;

    expect(() => validateFreshnessRecords(records)).toThrow('Freshness record needs a string id');
  });

  it.each(['2026-8-13', '2026-02-30', 'not-a-date'])('rejects invalid checkedAt date %s', (checkedAt) => {
    const records = cloneFixture();
    records[0].checkedAt = checkedAt;

    expect(() => validateFreshnessRecords(records)).toThrow(`Invalid freshness date for codes: ${checkedAt}`);
  });

  it('rejects a dataset without a source', () => {
    const records = cloneFixture();
    records[0].sources = [];

    expect(() => validateFreshnessRecords(records)).toThrow('Freshness codes needs at least one source');
  });

  it('rejects a wrong-typed source field with an explicit validation error', () => {
    const records = cloneFixture() as unknown as Array<Record<string, unknown>>;
    records[0].sources = [{
      name: 123,
      url: 'https://example.com/codes',
      trust: 'reported',
    }];

    expect(() => validateFreshnessRecords(records)).toThrow('Freshness codes has an invalid source');
  });

  it('rejects an empty next verification action', () => {
    const records = cloneFixture();
    records[0].nextCheck = '   ';

    expect(() => validateFreshnessRecords(records)).toThrow('Freshness codes needs a next check');
  });

  it('rejects conflicts attached to a non-conflict record', () => {
    const records = cloneFixture();
    records[1].conflicts = ['An old catalog differs.'];

    expect(() => validateFreshnessRecords(records)).toThrow('Freshness seeds has conflicts but state is reported');
  });

  it('rejects a wrong-typed conflict with an explicit validation error', () => {
    const records = cloneFixture() as unknown as Array<Record<string, unknown>>;
    records[0].conflicts = [123];

    expect(() => validateFreshnessRecords(records)).toThrow('Freshness codes has an invalid conflict');
  });
});

describe('production freshness registry', () => {
  it('contains exactly the four approved datasets', () => {
    expect(freshnessRecords.map(({ id }) => id)).toEqual([
      'codes',
      'seeds',
      'mutations',
      'roblox-listing',
    ]);
  });

  it('provides typed access to the codes conflict', () => {
    expect(getFreshness('codes')).toMatchObject({ id: 'codes', state: 'conflict' });
  });

  it('keeps ILOVECATS out of the active-code dataset', () => {
    expect(codes).toEqual([]);
    expect(JSON.stringify(codes)).not.toContain('ILOVECATS');
  });
});
