export interface GameStatus {
  name: string;
  playing: number;
  visits: number;
  maxPlayers: number;
  updated: string;
}

type Fetcher = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

function isGameStatus(value: unknown): value is GameStatus {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return typeof record.name === 'string'
    && typeof record.playing === 'number' && Number.isFinite(record.playing)
    && typeof record.visits === 'number' && Number.isFinite(record.visits)
    && typeof record.maxPlayers === 'number' && Number.isFinite(record.maxPlayers)
    && typeof record.updated === 'string';
}

export async function fetchGameStatus(fetcher: Fetcher, universeId: string): Promise<GameStatus> {
  const response = await fetcher(`https://games.roblox.com/v1/games?universeIds=${encodeURIComponent(universeId)}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) throw new Error(`Roblox API returned ${response.status}`);

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error('Invalid Roblox API response');
  }

  const records = payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown }).data)
    ? (payload as { data: unknown[] }).data
    : null;
  if (!records) throw new Error('Invalid Roblox API response');
  if (records.length === 0) throw new Error('No Roblox game data returned');

  const [record] = records;
  if (!isGameStatus(record)) throw new Error('Invalid Roblox API response');
  return {
    name: record.name,
    playing: record.playing,
    visits: record.visits,
    maxPlayers: record.maxPlayers,
    updated: record.updated,
  };
}
