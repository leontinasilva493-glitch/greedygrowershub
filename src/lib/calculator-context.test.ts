import { describe, expect, it } from 'vitest';
import type { SeedRecord } from './content';
import {
  buildCalculatorContext,
  getMutationPreset,
  mutationPresets,
} from './calculator-context';

const cherrySeed = {
  id: 'cherry-seed',
  name: 'Cherry Seed',
  rarity: 'Legendary',
  costDisplay: '$2.50M',
  spawnOneIn: 120,
  harvestValue: null,
  growthMinutes: null,
} as SeedRecord;

describe('calculator mutation presets', () => {
  it('offers the Update 1.2 single-mutation values plus the neutral base', () => {
    expect(mutationPresets.map(({ id, name, multiplier }) => [id, name, multiplier])).toEqual([
      ['base', 'Base', 1],
      ['dewy', 'Dewy', 2],
      ['shocked', 'Shocked', 2.5],
      ['radioactive', 'Radioactive', 5],
      ['charged', 'Charged', 7.5],
      ['golden', 'Golden', 25],
      ['cosmic', 'Cosmic', 100],
    ]);
  });

  it('falls back to the neutral preset instead of inventing a mutation', () => {
    expect(getMutationPreset('missing')).toEqual({ id: 'base', name: 'Base', multiplier: 1 });
  });
});

describe('buildCalculatorContext', () => {
  it('summarizes the selected seed and mutation without unsupported economics', () => {
    const context = buildCalculatorContext(cherrySeed, getMutationPreset('golden'));

    expect(context).toEqual({
      selectedSeed: 'Cherry Seed',
      reportedCost: '$2.5M',
      rarity: 'Legendary',
      riverSpawn: '1 in 120',
      mutationPreset: 'Golden · reported 25x',
      evidence: 'community-matched, not developer-confirmed',
    });
    expect(context).not.toHaveProperty('harvestValue');
    expect(context).not.toHaveProperty('growthMinutes');
  });

  it('keeps manual seed values explicit when no catalog seed is selected', () => {
    expect(buildCalculatorContext(null, getMutationPreset('base'))).toMatchObject({
      selectedSeed: 'Manual values',
      reportedCost: 'Enter your own',
      rarity: 'Not selected',
      riverSpawn: 'Not selected',
      mutationPreset: 'Base · 1x',
    });
  });

  it('labels a typed multiplier as manual instead of claiming a reported preset', () => {
    expect(buildCalculatorContext(cherrySeed, { id: 'manual', name: 'Manual', multiplier: 3 })).toMatchObject({
      mutationPreset: 'Manual · entered 3x',
    });
  });
});
