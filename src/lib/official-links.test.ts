import { describe, expect, it } from 'vitest';
import { site } from './content';
import {
  getOfficialLink,
  officialLinkRecords,
  validateOfficialLinks,
  type OfficialLinkRecord,
} from './official-links';

const validRecords: OfficialLinkRecord[] = [
  {
    id: 'official-experience',
    label: 'Official Roblox experience',
    checkedAt: '2026-08-13',
    state: 'confirmed',
    url: 'https://www.roblox.com/games/74102906764176/Greedy-Growers',
    source: {
      name: 'Official Roblox experience page',
      url: 'https://www.roblox.com/games/74102906764176/Greedy-Growers',
    },
    safetyNote: 'Use the creator-owned Roblox listing before trusting copied off-platform invites or boards.',
  },
  {
    id: 'creator-group',
    label: 'Creator group',
    checkedAt: '2026-08-13',
    state: 'needs-check',
    url: null,
    source: {
      name: 'Current source registry has no exact confirmed creator group URL',
      url: null,
    },
    safetyNote: 'Do not trust copied Roblox group links until a creator-owned source confirms the exact destination.',
  },
  {
    id: 'discord',
    label: 'Discord',
    checkedAt: '2026-08-13',
    state: 'unverified',
    url: null,
    source: {
      name: 'No creator-owned Discord invite is confirmed in this project',
      url: null,
    },
    safetyNote: 'Treat copied Discord invites as unsafe until they are linked from an official Roblox or creator-owned page.',
  },
  {
    id: 'trello-wiki',
    label: 'Trello/wiki board',
    checkedAt: '2026-08-13',
    state: 'unverified',
    url: null,
    source: {
      name: 'No creator-owned Trello or wiki board is confirmed in this project',
      url: null,
    },
    safetyNote: 'Do not rely on Trello or wiki URLs unless the creator publishes the exact board from an official surface.',
  },
];

const cloneFixture = () => structuredClone(validRecords);

describe('official links validation', () => {
  it('rejects an official experience destination that does not match site.officialGameUrl', () => {
    const records = cloneFixture();
    records[0].url = 'https://www.roblox.com/games/1234567890/Wrong-Experience';

    expect(() => validateOfficialLinks(records)).toThrow(`Official link official-experience must match site.officialGameUrl: ${site.officialGameUrl}`);
  });

  it('rejects an official experience source URL that does not match site.officialGameUrl', () => {
    const records = cloneFixture();
    records[0].source.url = 'https://www.roblox.com/games/1234567890/Wrong-Experience';

    expect(() => validateOfficialLinks(records)).toThrow(`Official link official-experience source must match site.officialGameUrl: ${site.officialGameUrl}`);
  });

  it('rejects duplicate IDs', () => {
    const records = cloneFixture();
    records.push({ ...records[0] });

    expect(() => validateOfficialLinks(records)).toThrow('Duplicate official link id: official-experience');
  });

  it('rejects a registry missing an approved ID', () => {
    const records = cloneFixture();
    records.pop();

    expect(() => validateOfficialLinks(records)).toThrow('Missing official link id: trello-wiki');
  });

  it.each(['2026-8-13', '2026-02-30', 'not-a-date'])('rejects invalid checkedAt date %s', (checkedAt) => {
    const records = cloneFixture();
    records[0].checkedAt = checkedAt;

    expect(() => validateOfficialLinks(records)).toThrow(`Invalid official link date for official-experience: ${checkedAt}`);
  });

  it('rejects a future checkedAt date', () => {
    const records = cloneFixture();
    records[0].checkedAt = '2026-08-15';

    expect(() => validateOfficialLinks(records, { today: '2026-08-14' })).toThrow('Official link official-experience date cannot be in the future: 2026-08-15');
  });

  it('rejects an unsupported state', () => {
    const records = cloneFixture();
    records[0].state = 'reported' as OfficialLinkRecord['state'];

    expect(() => validateOfficialLinks(records)).toThrow('Unsupported official link state for official-experience: reported');
  });

  it('rejects any confirmed record outside the official experience slot', () => {
    const records = cloneFixture();
    records[1].state = 'confirmed';
    records[1].url = site.officialGameUrl;
    records[1].source.url = site.officialGameUrl;

    expect(() => validateOfficialLinks(records)).toThrow('Only official-experience may use the confirmed state');
  });

  it('rejects a confirmed record without an HTTPS destination URL', () => {
    const records = cloneFixture();
    records[0].url = 'http://www.roblox.com/games/74102906764176/Greedy-Growers';

    expect(() => validateOfficialLinks(records)).toThrow('Official link official-experience confirmed URL must use HTTPS');
  });

  it('rejects a confirmed record without an HTTPS source URL', () => {
    const records = cloneFixture();
    records[0].source.url = 'http://www.roblox.com/games/74102906764176/Greedy-Growers';

    expect(() => validateOfficialLinks(records)).toThrow('Official link official-experience confirmed source must use HTTPS');
  });

  it.each(['needs-check', 'unverified'] as const)('rejects a clickable %s record', (state) => {
    const records = cloneFixture();
    records[1].state = state;
    records[1].url = 'https://www.roblox.com/groups/123456/example';

    expect(() => validateOfficialLinks(records)).toThrow(`Official link creator-group must not contain a clickable URL while state is ${state}`);
  });

  it('rejects an empty safety note', () => {
    const records = cloneFixture();
    records[0].safetyNote = '   ';

    expect(() => validateOfficialLinks(records)).toThrow('Official link official-experience needs a safety note');
  });
});

describe('production official links registry', () => {
  it('contains exactly the four approved records in order', () => {
    expect(officialLinkRecords.map(({ id, label, state, checkedAt }) => ({ id, label, state, checkedAt }))).toEqual([
      {
        id: 'official-experience',
        label: 'Official Roblox experience',
        state: 'confirmed',
        checkedAt: '2026-08-13',
      },
      {
        id: 'creator-group',
        label: 'Creator group',
        state: 'needs-check',
        checkedAt: '2026-08-13',
      },
      {
        id: 'discord',
        label: 'Discord',
        state: 'unverified',
        checkedAt: '2026-08-13',
      },
      {
        id: 'trello-wiki',
        label: 'Trello/wiki board',
        state: 'unverified',
        checkedAt: '2026-08-13',
      },
    ]);
  });

  it('keeps the official Roblox experience as the only clickable destination', () => {
    expect(officialLinkRecords.filter((record) => record.url !== null)).toEqual([
      expect.objectContaining({
        id: 'official-experience',
        url: site.officialGameUrl,
        source: {
          name: 'Official Roblox experience page',
          url: site.officialGameUrl,
        },
      }),
    ]);
  });

  it('provides typed access to the unverified Discord entry', () => {
    expect(getOfficialLink('discord')).toMatchObject({
      id: 'discord',
      state: 'unverified',
      url: null,
    });
  });

  it('keeps official-experience as the only confirmed record', () => {
    expect(officialLinkRecords.filter((record) => record.state === 'confirmed').map((record) => record.id)).toEqual([
      'official-experience',
    ]);
  });
});
