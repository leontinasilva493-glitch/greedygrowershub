import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import gameStatus from '../data/game-status.json';

const component = readFileSync(new URL('../components/GameStatus.astro', import.meta.url), 'utf8');

describe('dated Roblox game-status fallback', () => {
  test('stores the public API values needed by the live-status fallback', () => {
    expect(gameStatus).toMatchObject({
      source: 'Roblox Games API',
      universeId: '10440833423',
      playing: expect.any(Number),
      visits: expect.any(Number),
      maxPlayers: expect.any(Number),
      updated: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
      checkedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
    });
    expect(gameStatus.playing).toBeGreaterThanOrEqual(0);
    expect(gameStatus.visits).toBeGreaterThanOrEqual(0);
    expect(gameStatus.maxPlayers).toBeGreaterThan(0);
    expect(Number.isNaN(Date.parse(gameStatus.updated))).toBe(false);
    expect(Number.isNaN(Date.parse(gameStatus.checkedAt))).toBe(false);
  });

  test('renders the fallback from the same snapshot used by Updates', () => {
    expect(component).toContain("import gameStatus from '../data/game-status.json'");
    expect(component).not.toContain('const fallback =');
    expect(component).toContain('gameStatus.playing.toLocaleString()');
    expect(component).toContain('formatCheckedAt(gameStatus.checkedAt)');
  });
});
