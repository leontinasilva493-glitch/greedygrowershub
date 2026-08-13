import rawFreshnessRecords from '../data/freshness.json';

export type FreshnessState = 'confirmed' | 'reported' | 'conflict' | 'needs-check';
export type FreshnessId = 'codes' | 'seeds' | 'mutations' | 'roblox-listing';
export type FreshnessTrust = 'official' | 'reported' | 'community';

export interface FreshnessSource {
  name: string;
  url: string;
  trust: FreshnessTrust;
}

export interface FreshnessRecord {
  id: FreshnessId;
  checkedAt: string;
  state: FreshnessState;
  sources: FreshnessSource[];
  summary: string;
  conflicts: string[];
  nextCheck: string;
}

const states = new Set<FreshnessState>(['confirmed', 'reported', 'conflict', 'needs-check']);
const trusts = new Set<FreshnessTrust>(['official', 'reported', 'community']);
const isoCalendarDate = /^\d{4}-\d{2}-\d{2}$/;

const isRealIsoDate = (value: string) => {
  if (!isoCalendarDate.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const isNamedHttpsSource = (source: unknown): source is FreshnessSource => {
  if (!source || typeof source !== 'object') return false;
  const item = source as Partial<FreshnessSource>;
  if (!item.name?.trim() || !item.url || !item.trust || !trusts.has(item.trust)) return false;

  try {
    return new URL(item.url).protocol === 'https:';
  } catch {
    return false;
  }
};

export function validateFreshnessRecords(records: unknown): asserts records is FreshnessRecord[] {
  if (!Array.isArray(records)) throw new Error('Freshness registry must be an array');

  const ids = new Set<string>();
  for (const value of records) {
    if (!value || typeof value !== 'object') throw new Error('Freshness record must be an object');
    const record = value as Partial<FreshnessRecord>;

    if (!record.id?.trim()) throw new Error('Freshness record needs an id');
    if (ids.has(record.id)) throw new Error(`Duplicate freshness id: ${record.id}`);
    ids.add(record.id);

    if (!record.checkedAt || !isRealIsoDate(record.checkedAt)) {
      throw new Error(`Invalid freshness date for ${record.id}: ${record.checkedAt ?? ''}`);
    }
    if (!record.state || !states.has(record.state)) {
      throw new Error(`Unsupported freshness state for ${record.id}: ${record.state ?? ''}`);
    }
    if (!Array.isArray(record.sources) || record.sources.length === 0) {
      throw new Error(`Freshness ${record.id} needs at least one source`);
    }
    if (!record.sources.every(isNamedHttpsSource)) {
      throw new Error(`Freshness ${record.id} has an invalid source`);
    }
    if (!record.summary?.trim()) throw new Error(`Freshness ${record.id} needs a summary`);
    if (!Array.isArray(record.conflicts)) throw new Error(`Freshness ${record.id} needs a conflicts array`);
    if (record.state !== 'conflict' && record.conflicts.length > 0) {
      throw new Error(`Freshness ${record.id} has conflicts but state is ${record.state}`);
    }
    if (record.state === 'conflict' && record.conflicts.length === 0) {
      throw new Error(`Freshness ${record.id} is conflict but has no conflict details`);
    }
    if (!record.conflicts.every((conflict) => conflict.trim())) {
      throw new Error(`Freshness ${record.id} has an empty conflict`);
    }
    if (!record.nextCheck?.trim()) throw new Error(`Freshness ${record.id} needs a next check`);
  }
}

const registry: unknown = rawFreshnessRecords;
validateFreshnessRecords(registry);

export const freshnessRecords: readonly FreshnessRecord[] = registry;

export function getFreshness(id: FreshnessId): FreshnessRecord {
  const record = freshnessRecords.find((item) => item.id === id);
  if (!record) throw new Error(`Unknown freshness id: ${id}`);
  return record;
}
