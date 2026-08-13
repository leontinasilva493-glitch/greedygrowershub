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
];

const cloneFixture = () => structuredClone(validRecords);

describe('freshness registry validation', () => {
  it('rejects duplicate dataset IDs', () => {
    const records = cloneFixture();
    records.push({ ...records[0] });

    expect(() => validateFreshnessRecords(records)).toThrow('Duplicate freshness id: codes');
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
