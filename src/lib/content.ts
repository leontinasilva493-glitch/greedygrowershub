import siteData from '../data/site.json';
import codeData from '../data/codes.json';
import seedData from '../data/seeds.json';
import sourceData from '../data/sources.json';

export type SourceTrust = 'official' | 'reported' | 'community';
export type CodeStatus = 'active' | 'expired' | 'reported';
export type VerificationState = 'verified' | 'community-lead' | 'needs-check';
export type PlayerStage = 'starter' | 'progression' | 'late' | 'all';

export interface SiteData {
  name: string;
  description: string;
  domain: string;
  officialGameUrl: string;
  universeId: string;
  checkedAt: string;
}

export interface SourceRecord {
  id: string;
  name: string;
  url: string;
  trust: SourceTrust;
}

export interface CodeRecord {
  code: string;
  reward: string;
  status: CodeStatus;
  sourceId: string;
  verifiedAt: string;
}

export interface SeedRecord {
  id: string;
  name: string;
  type: string;
  rarity: string;
  sourceId: string;
  unlock: string;
  cost: number | null;
  harvestValue: number | null;
  growthMinutes: number | null;
  stage: PlayerStage;
  verification: VerificationState;
  verifiedAt: string;
  notes: string;
}

export interface ContentBundle {
  site: SiteData;
  sources: SourceRecord[];
  codes: CodeRecord[];
  seeds: SeedRecord[];
}

const sourceTrusts = new Set<SourceTrust>(['official', 'reported', 'community']);
const codeStatuses = new Set<CodeStatus>(['active', 'expired', 'reported']);
const verificationStates = new Set<VerificationState>(['verified', 'community-lead', 'needs-check']);
const playerStages = new Set<PlayerStage>(['starter', 'progression', 'late', 'all']);

const assertUrl = (value: string, label: string) => {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') throw new Error();
  } catch {
    throw new Error(`Invalid URL for ${label}: ${value}`);
  }
};

export function validateContent(input: ContentBundle): void {
  assertUrl(input.site.officialGameUrl, 'official game');

  const sourceIds = new Set<string>();
  for (const source of input.sources) {
    if (sourceIds.has(source.id)) throw new Error(`Duplicate source: ${source.id}`);
    sourceIds.add(source.id);
    assertUrl(source.url, source.id);
    if (!sourceTrusts.has(source.trust)) throw new Error(`Unsupported source trust: ${source.trust}`);
  }

  const codeIds = new Set<string>();
  for (const code of input.codes) {
    if (codeIds.has(code.code)) throw new Error(`Duplicate code: ${code.code}`);
    codeIds.add(code.code);
    if (!codeStatuses.has(code.status)) throw new Error(`Unsupported code status: ${code.status}`);
    if (!sourceIds.has(code.sourceId)) throw new Error(`Unknown source: ${code.sourceId}`);
  }

  const seedIds = new Set<string>();
  for (const seed of input.seeds) {
    if (seedIds.has(seed.id)) throw new Error(`Duplicate seed: ${seed.id}`);
    seedIds.add(seed.id);
    if (!verificationStates.has(seed.verification)) throw new Error('Unsupported verification state');
    if (!playerStages.has(seed.stage)) throw new Error(`Unsupported player stage: ${seed.stage}`);
    if (!sourceIds.has(seed.sourceId)) throw new Error(`Unknown source: ${seed.sourceId}`);
    for (const [label, value] of [
      ['cost', seed.cost],
      ['harvest value', seed.harvestValue],
      ['growth minutes', seed.growthMinutes],
    ] as const) {
      if (value !== null && (!Number.isFinite(value) || value < 0)) {
        throw new Error(`Seed ${label} must be non-negative`);
      }
    }
  }
}

export const content: ContentBundle = {
  site: siteData as SiteData,
  sources: sourceData as SourceRecord[],
  codes: codeData as CodeRecord[],
  seeds: seedData as SeedRecord[],
};

validateContent(content);

export const { site, sources, codes, seeds } = content;

export function getSource(sourceId: string): SourceRecord {
  const source = sources.find((item) => item.id === sourceId);
  if (!source) throw new Error(`Unknown source: ${sourceId}`);
  return source;
}
