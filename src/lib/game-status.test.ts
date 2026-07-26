import { describe, expect, it, vi } from 'vitest';
import { fetchGameStatus } from './game-status';

describe('fetchGameStatus', () => {
  it('normalizes the public Roblox game response', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: [{
      id: 10440833423,
      name: 'Greedy Growers',
      description: 'ignored',
      playing: 9510,
      visits: 2629512,
      maxPlayers: 4,
      updated: '2026-07-26T10:00:00.000Z',
    }] }), { status: 200 }));

    await expect(fetchGameStatus(fetcher, '10440833423')).resolves.toEqual({
      name: 'Greedy Growers',
      playing: 9510,
      visits: 2629512,
      maxPlayers: 4,
      updated: '2026-07-26T10:00:00.000Z',
    });
  });

  it('rejects an empty Roblox result', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: [] }), { status: 200 }));
    await expect(fetchGameStatus(fetcher, '10440833423')).rejects.toThrow('No Roblox game data returned');
  });

  it('rejects rate limiting', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('slow down', { status: 429 }));
    await expect(fetchGameStatus(fetcher, '10440833423')).rejects.toThrow('Roblox API returned 429');
  });

  it('rejects malformed JSON', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('{', { status: 200 }));
    await expect(fetchGameStatus(fetcher, '10440833423')).rejects.toThrow('Invalid Roblox API response');
  });

  it('preserves network failures', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('network unavailable'));
    await expect(fetchGameStatus(fetcher, '10440833423')).rejects.toThrow('network unavailable');
  });
});
