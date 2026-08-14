import rawOfficialLinks from '../data/official-links.json';

export type OfficialLinkState = 'confirmed' | 'needs-check' | 'unverified';
const approvedOfficialLinkIds = [
  'official-experience',
  'creator-group',
  'discord',
  'trello-wiki',
] as const;
export type OfficialLinkId = (typeof approvedOfficialLinkIds)[number];

export interface OfficialLinkSource {
  name: string;
  url: string | null;
}

export interface OfficialLinkRecord {
  id: OfficialLinkId;
  label: string;
  checkedAt: string;
  state: OfficialLinkState;
  url: string | null;
  source: OfficialLinkSource;
  safetyNote: string;
}

const approvedIds = new Set<string>(approvedOfficialLinkIds);
const states = new Set<string>(['confirmed', 'needs-check', 'unverified']);
const isoCalendarDate = /^\d{4}-\d{2}-\d{2}$/;

const isRealIsoDate = (value: string) => {
  if (!isoCalendarDate.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const isHttpsUrl = (value: string) => {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
};

const isNamedSource = (value: unknown): value is OfficialLinkSource => {
  if (!value || typeof value !== 'object') return false;
  const source = value as Record<string, unknown>;
  if (typeof source.name !== 'string' || !source.name.trim()) return false;
  if (source.url === null) return true;
  return typeof source.url === 'string';
};

export function validateOfficialLinks(records: unknown): asserts records is OfficialLinkRecord[] {
  if (!Array.isArray(records)) throw new Error('Official links registry must be an array');

  const ids = new Set<string>();
  for (const value of records) {
    if (!value || typeof value !== 'object') throw new Error('Official link record must be an object');
    const record = value as Record<string, unknown>;

    if (typeof record.id !== 'string' || !record.id.trim()) {
      throw new Error('Official link needs a string id');
    }
    const id = record.id;
    if (!approvedIds.has(id)) throw new Error(`Unsupported official link id: ${id}`);
    if (ids.has(id)) throw new Error(`Duplicate official link id: ${id}`);
    ids.add(id);

    if (typeof record.label !== 'string' || !record.label.trim()) {
      throw new Error(`Official link ${id} needs a label`);
    }
    if (typeof record.checkedAt !== 'string' || !isRealIsoDate(record.checkedAt)) {
      throw new Error(`Invalid official link date for ${id}: ${record.checkedAt ?? ''}`);
    }
    if (typeof record.state !== 'string' || !states.has(record.state)) {
      throw new Error(`Unsupported official link state for ${id}: ${record.state ?? ''}`);
    }
    if (!isNamedSource(record.source)) {
      throw new Error(`Official link ${id} needs a named source`);
    }
    if (typeof record.safetyNote !== 'string' || !record.safetyNote.trim()) {
      throw new Error(`Official link ${id} needs a safety note`);
    }

    if (record.state === 'confirmed') {
      if (typeof record.url !== 'string' || !isHttpsUrl(record.url)) {
        throw new Error(`Official link ${id} confirmed URL must use HTTPS`);
      }
      if (typeof record.source.url !== 'string' || !isHttpsUrl(record.source.url)) {
        throw new Error(`Official link ${id} confirmed source must use HTTPS`);
      }
    } else {
      if (record.url !== null) {
        throw new Error(`Official link ${id} must not contain a clickable URL while state is ${record.state}`);
      }
    }
  }

  for (const id of approvedOfficialLinkIds) {
    if (!ids.has(id)) throw new Error(`Missing official link id: ${id}`);
  }
}

const registry: unknown = rawOfficialLinks;
validateOfficialLinks(registry);

export const officialLinkRecords: readonly OfficialLinkRecord[] = registry;
export const latestOfficialLinkCheck = [...officialLinkRecords]
  .map((record) => record.checkedAt)
  .sort((left, right) => right.localeCompare(left))[0];

export function getOfficialLink(id: OfficialLinkId): OfficialLinkRecord {
  const record = officialLinkRecords.find((item) => item.id === id);
  if (!record) throw new Error(`Unknown official link id: ${id}`);
  return record;
}
