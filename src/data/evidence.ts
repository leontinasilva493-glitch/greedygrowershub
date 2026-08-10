// Central evidence status for acquisition pages.
// Source counts and check dates must stay traceable to the page's cited material.

export type ClaimStrength = 'verified' | 'community-reported' | 'unverified' | 'conflict';

export interface Evidence {
  version: string;
  sourceCount: number;
  claimStrength: ClaimStrength;
  lastChecked: string;
  knownGaps?: string[];
}

export const evidenceByPage: Record<'home' | 'seeds' | 'mutations' | 'codes' | 'beginner', Evidence> = {
  home: {
    version: 'Update 1.2',
    sourceCount: 6,
    claimStrength: 'community-reported',
    lastChecked: '2026-08-10',
    knownGaps: ['spawn rates unverified', 'developer confirmation pending'],
  },
  seeds: {
    version: 'Update 1.2',
    sourceCount: 3,
    claimStrength: 'community-reported',
    lastChecked: '2026-08-10',
    knownGaps: ['spawn rates unverified'],
  },
  mutations: {
    version: 'Update 1.2',
    sourceCount: 2,
    claimStrength: 'community-reported',
    lastChecked: '2026-08-10',
    knownGaps: ['stacking formula unverified'],
  },
  codes: {
    version: 'Update 1.2',
    sourceCount: 3,
    claimStrength: 'unverified',
    lastChecked: '2026-08-10',
    knownGaps: ['no active codes confirmed', 'absence ≠ never existed'],
  },
  beginner: {
    version: 'Update 1.2',
    sourceCount: 3,
    claimStrength: 'community-reported',
    lastChecked: '2026-08-10',
    knownGaps: [],
  },
};
