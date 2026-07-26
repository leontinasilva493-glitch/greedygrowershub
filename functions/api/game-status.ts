import { fetchGameStatus } from '../../src/lib/game-status';

const universeId = '10440833423';

export const onRequestGet = async (): Promise<Response> => {
  try {
    const status = await fetchGameStatus(fetch, universeId);
    return Response.json(status, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Roblox game status request failed', error);
    return Response.json({ error: 'Live Roblox status is temporarily unavailable.' }, {
      status: 502,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
};
