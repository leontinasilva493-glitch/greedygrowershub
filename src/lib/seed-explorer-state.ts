export interface SeedExplorerState {
  query: string;
  rarity: string;
  verification: 'all' | 'community-lead' | 'verified' | 'needs-check';
  sort: 'name:asc' | 'costSortValue:asc' | 'costSortValue:desc' | 'spawnOneIn:asc' | 'spawnOneIn:desc';
  selected: string[];
}

export const defaultSeedExplorerState: SeedExplorerState = {
  query: '',
  rarity: 'all',
  verification: 'all',
  sort: 'name:asc',
  selected: [],
};

const verificationValues = new Set<SeedExplorerState['verification']>([
  'all',
  'community-lead',
  'verified',
  'needs-check',
]);
const sortValues = new Set<SeedExplorerState['sort']>([
  'name:asc',
  'costSortValue:asc',
  'costSortValue:desc',
  'spawnOneIn:asc',
  'spawnOneIn:desc',
]);

export const parseSeedExplorerState = (
  params: URLSearchParams,
  validSeedIds: ReadonlySet<string>,
): SeedExplorerState => {
  const verification = params.get('verification') as SeedExplorerState['verification'] | null;
  const sort = params.get('sort') as SeedExplorerState['sort'] | null;
  const selected = [...new Set((params.get('compare') ?? '').split(',').filter((id) => validSeedIds.has(id)))].slice(0, 2);

  return {
    query: (params.get('q') ?? '').trim().slice(0, 100),
    rarity: (params.get('rarity') ?? 'all').trim() || 'all',
    verification: verification && verificationValues.has(verification) ? verification : 'all',
    sort: sort && sortValues.has(sort) ? sort : 'name:asc',
    selected,
  };
};

export const serializeSeedExplorerState = (state: SeedExplorerState): URLSearchParams => {
  const params = new URLSearchParams();
  const query = state.query.trim().slice(0, 100);
  if (query) params.set('q', query);
  if (state.rarity !== 'all') params.set('rarity', state.rarity);
  if (state.verification !== 'all') params.set('verification', state.verification);
  if (state.sort !== 'name:asc') params.set('sort', state.sort);
  if (state.selected.length) params.set('compare', state.selected.slice(0, 2).join(','));
  return params;
};
