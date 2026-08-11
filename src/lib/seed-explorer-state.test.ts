import { describe, expect, test } from 'vitest';
import {
  defaultSeedExplorerState,
  parseSeedExplorerState,
  serializeSeedExplorerState,
} from './seed-explorer-state';

const validSeedIds = new Set(['carrot', 'void', 'mango']);

describe('seed explorer URL state', () => {
  test('returns safe defaults for empty or unsupported values', () => {
    const state = parseSeedExplorerState(
      new URLSearchParams('sort=javascript%3Aalert(1)&verification=official&compare=unknown,void,void,mango,carrot'),
      validSeedIds,
    );

    expect(state).toEqual({
      ...defaultSeedExplorerState,
      selected: ['void', 'mango'],
    });
  });

  test('parses a useful shared view without losing readable search text', () => {
    const state = parseSeedExplorerState(
      new URLSearchParams('q=Void+seed&rarity=Legendary&verification=community-lead&sort=costSortValue%3Adesc&compare=void,mango'),
      validSeedIds,
    );

    expect(state).toEqual({
      query: 'Void seed',
      rarity: 'Legendary',
      verification: 'community-lead',
      sort: 'costSortValue:desc',
      selected: ['void', 'mango'],
    });
  });

  test('serializes only meaningful state and keeps comparison order', () => {
    const params = serializeSeedExplorerState({
      query: '  Mango  ',
      rarity: 'all',
      verification: 'needs-check',
      sort: 'name:asc',
      selected: ['mango', 'void'],
    });

    expect(params.toString()).toBe('q=Mango&verification=needs-check&compare=mango%2Cvoid');
  });
});
