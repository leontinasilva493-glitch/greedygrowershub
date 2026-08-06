import siteData from '../data/site.json';
import codeData from '../data/codes.json';
import seedData from '../data/seeds.json';
import mutationData from '../data/mutations.json';
import fertilizerData from '../data/fertilizers.json';
import rebirthData from '../data/rebirths.json';
import sourceData from '../data/sources.json';

export type SourceTrust = 'official' | 'reported' | 'community';
export type CodeStatus = 'active' | 'expired' | 'reported';
export type VerificationState = 'verified' | 'community-lead' | 'needs-check';
export type PlayerStage = 'starter' | 'progression' | 'late' | 'all';
export type SeedTier = 'S' | 'A' | 'B' | 'C' | 'D';

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
  sourceIds: string[];
  unlock: string;
  cost: number | null;
  costDisplay: string;
  costSortValue: number | null;
  spawnOneIn: number | null;
  harvestValue: number | null;
  growthMinutes: number | null;
  multiHarvest: boolean | null;
  reportedProfitPerMinute: number | null;
  tier: SeedTier | null;
  bestUse: string;
  stage: PlayerStage;
  verification: VerificationState;
  verifiedAt: string;
  gameVersionClaim: string;
  availability: string;
  notes: string;
}

export interface FertilizerRecord {
  id: string;
  name: string;
  cost: number;
  boostMultiplier: number;
  sourceId: string;
  verification: VerificationState;
  verifiedAt: string;
  notes: string;
}

export interface MutationRecord {
  id: string;
  name: string;
  valueMultiplier: number;
  reportedTrigger: string;
  reportedChance: string;
  appliesTo: string[];
  sourceIds: string[];
  verification: VerificationState;
  verifiedAt: string;
  gameVersionClaim: string;
  notes: string;
}

export interface RebirthRecord {
  level: number;
  requirement: string;
  perks: string[];
  sourceId: string;
  verification: VerificationState;
  verifiedAt: string;
}

export interface ContentBundle {
  site: SiteData;
  sources: SourceRecord[];
  codes: CodeRecord[];
  seeds: SeedRecord[];
  mutations: MutationRecord[];
  fertilizers: FertilizerRecord[];
  rebirths: RebirthRecord[];
}

const sourceTrusts = new Set<SourceTrust>(['official', 'reported', 'community']);
const codeStatuses = new Set<CodeStatus>(['active', 'expired', 'reported']);
const verificationStates = new Set<VerificationState>(['verified', 'community-lead', 'needs-check']);
const playerStages = new Set<PlayerStage>(['starter', 'progression', 'late', 'all']);
const seedTiers = new Set<SeedTier>(['S', 'A', 'B', 'C', 'D']);

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
    if (seed.tier !== null && !seedTiers.has(seed.tier)) throw new Error(`Unsupported seed tier: ${seed.tier}`);
    if (!sourceIds.has(seed.sourceId)) throw new Error(`Unknown source: ${seed.sourceId}`);
    if (!seed.sourceIds.length) throw new Error(`Seed ${seed.id} needs at least one source`);
    for (const sourceId of seed.sourceIds) {
      if (!sourceIds.has(sourceId)) throw new Error(`Unknown source: ${sourceId}`);
    }
    if (!seed.sourceIds.includes(seed.sourceId)) throw new Error(`Seed ${seed.id} primary source must be traceable`);
    if (seed.spawnOneIn !== null && (!Number.isInteger(seed.spawnOneIn) || seed.spawnOneIn < 1)) {
      throw new Error('Seed spawn denominator must be a positive whole number');
    }
    if (!seed.costDisplay.trim()) throw new Error(`Seed ${seed.id} needs a display price`);
    if (seed.costSortValue !== null && (!Number.isFinite(seed.costSortValue) || seed.costSortValue < 0)) {
      throw new Error('Seed cost sort value must be non-negative');
    }
    if (!seed.gameVersionClaim.trim() || !seed.availability.trim()) {
      throw new Error(`Seed ${seed.id} needs version and availability context`);
    }
    for (const [label, value] of [
      ['cost', seed.cost],
      ['harvest value', seed.harvestValue],
      ['growth minutes', seed.growthMinutes],
      ['reported profit per minute', seed.reportedProfitPerMinute],
    ] as const) {
      if (value !== null && (!Number.isFinite(value) || value < 0)) {
        throw new Error(`Seed ${label} must be non-negative`);
      }
    }
  }

  const fertilizerIds = new Set<string>();
  const mutationIds = new Set<string>();
  for (const mutation of input.mutations) {
    if (mutationIds.has(mutation.id)) throw new Error(`Duplicate mutation: ${mutation.id}`);
    mutationIds.add(mutation.id);
    if (!Number.isFinite(mutation.valueMultiplier) || mutation.valueMultiplier <= 1) throw new Error('Mutation multiplier must be greater than 1');
    if (!verificationStates.has(mutation.verification)) throw new Error('Unsupported verification state');
    if (!mutation.sourceIds.length) throw new Error(`Mutation ${mutation.id} needs at least one source`);
    for (const sourceId of mutation.sourceIds) {
      if (!sourceIds.has(sourceId)) throw new Error(`Unknown source: ${sourceId}`);
    }
    if (!mutation.reportedTrigger.trim() || !mutation.reportedChance.trim() || !mutation.appliesTo.length || !mutation.gameVersionClaim.trim()) {
      throw new Error(`Mutation ${mutation.id} needs complete report context`);
    }
  }

  for (const fertilizer of input.fertilizers) {
    if (fertilizerIds.has(fertilizer.id)) throw new Error(`Duplicate fertilizer: ${fertilizer.id}`);
    fertilizerIds.add(fertilizer.id);
    if (!sourceIds.has(fertilizer.sourceId)) throw new Error(`Unknown source: ${fertilizer.sourceId}`);
    if (!verificationStates.has(fertilizer.verification)) throw new Error('Unsupported verification state');
    if (!Number.isFinite(fertilizer.cost) || fertilizer.cost < 0) throw new Error('Fertilizer cost must be non-negative');
    if (!Number.isFinite(fertilizer.boostMultiplier) || fertilizer.boostMultiplier < 1) {
      throw new Error('Fertilizer boost multiplier must be at least 1');
    }
  }

  const rebirthLevels = new Set<number>();
  for (const rebirth of input.rebirths) {
    if (rebirthLevels.has(rebirth.level)) throw new Error(`Duplicate rebirth level: ${rebirth.level}`);
    rebirthLevels.add(rebirth.level);
    if (!Number.isInteger(rebirth.level) || rebirth.level < 1) throw new Error('Rebirth level must be a positive whole number');
    if (!sourceIds.has(rebirth.sourceId)) throw new Error(`Unknown source: ${rebirth.sourceId}`);
    if (!verificationStates.has(rebirth.verification)) throw new Error('Unsupported verification state');
    if (!rebirth.requirement.trim() || !rebirth.perks.length) throw new Error(`Rebirth level ${rebirth.level} needs a requirement and perks`);
  }
}

export const content: ContentBundle = {
  site: siteData as SiteData,
  sources: sourceData as SourceRecord[],
  codes: codeData as CodeRecord[],
  seeds: seedData as SeedRecord[],
  mutations: mutationData as MutationRecord[],
  fertilizers: fertilizerData as FertilizerRecord[],
  rebirths: rebirthData as RebirthRecord[],
};

validateContent(content);

export const { site, sources, codes, seeds, mutations, fertilizers, rebirths } = content;

export function getSource(sourceId: string): SourceRecord {
  const source = sources.find((item) => item.id === sourceId);
  if (!source) throw new Error(`Unknown source: ${sourceId}`);
  return source;
}
