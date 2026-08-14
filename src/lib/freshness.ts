import rawFreshnessRecords from '../data/freshness.json';

export type FreshnessState = 'confirmed' | 'reported' | 'conflict' | 'needs-check';
const approvedFreshnessIds = ['codes', 'seeds', 'mutations', 'roblox-listing'] as const;
export type FreshnessId = (typeof approvedFreshnessIds)[number];
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

const approvedIds = new Set<string>(approvedFreshnessIds);
const states = new Set<string>(['confirmed', 'reported', 'conflict', 'needs-check']);
const trusts = new Set<string>(['official', 'reported', 'community']);
const isoCalendarDate = /^\d{4}-\d{2}-\d{2}$/;

const isRealIsoDate = (value: string) => {
  if (!isoCalendarDate.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const isNamedHttpsSource = (source: unknown): source is FreshnessSource => {
  if (!source || typeof source !== 'object') return false;
  const item = source as Record<string, unknown>;
  if (
    typeof item.name !== 'string'
    || !item.name.trim()
    || typeof item.url !== 'string'
    || typeof item.trust !== 'string'
    || !trusts.has(item.trust)
  ) return false;

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
    const record = value as Record<string, unknown>;

    if (typeof record.id !== 'string' || !record.id.trim()) {
      throw new Error('Freshness record needs a string id');
    }
    const id = record.id;
    if (!approvedIds.has(id)) throw new Error(`Unsupported freshness id: ${id}`);
    if (ids.has(id)) throw new Error(`Duplicate freshness id: ${id}`);
    ids.add(id);

    if (typeof record.checkedAt !== 'string' || !isRealIsoDate(record.checkedAt)) {
      throw new Error(`Invalid freshness date for ${id}: ${record.checkedAt ?? ''}`);
    }
    if (typeof record.state !== 'string' || !states.has(record.state)) {
      throw new Error(`Unsupported freshness state for ${id}: ${record.state ?? ''}`);
    }
    if (!Array.isArray(record.sources) || record.sources.length === 0) {
      throw new Error(`Freshness ${id} needs at least one source`);
    }
    if (!record.sources.every(isNamedHttpsSource)) {
      throw new Error(`Freshness ${id} has an invalid source`);
    }
    if (typeof record.summary !== 'string' || !record.summary.trim()) {
      throw new Error(`Freshness ${id} needs a summary`);
    }
    if (!Array.isArray(record.conflicts)) throw new Error(`Freshness ${id} needs a conflicts array`);
    if (record.state !== 'conflict' && record.conflicts.length > 0) {
      throw new Error(`Freshness ${id} has conflicts but state is ${record.state}`);
    }
    if (record.state === 'conflict' && record.conflicts.length === 0) {
      throw new Error(`Freshness ${id} is conflict but has no conflict details`);
    }
    if (!record.conflicts.every((conflict) => typeof conflict === 'string' && conflict.trim())) {
      throw new Error(`Freshness ${id} has an invalid conflict`);
    }
    if (typeof record.nextCheck !== 'string' || !record.nextCheck.trim()) {
      throw new Error(`Freshness ${id} needs a next check`);
    }
  }

  for (const id of approvedFreshnessIds) {
    if (!ids.has(id)) throw new Error(`Missing freshness id: ${id}`);
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
