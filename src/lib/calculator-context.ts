import type { SeedRecord } from './content';

export interface MutationPreset {
  id: string;
  name: string;
  multiplier: number;
}

export interface CalculatorContext {
  selectedSeed: string;
  reportedCost: string;
  rarity: string;
  riverSpawn: string;
  mutationPreset: string;
  evidence: string;
}

export const mutationPresets: MutationPreset[] = [
  { id: 'base', name: 'Base', multiplier: 1 },
  { id: 'dewy', name: 'Dewy', multiplier: 2 },
  { id: 'shocked', name: 'Shocked', multiplier: 2.5 },
  { id: 'radioactive', name: 'Radioactive', multiplier: 5 },
  { id: 'charged', name: 'Charged', multiplier: 7.5 },
  { id: 'golden', name: 'Golden', multiplier: 25 },
  { id: 'cosmic', name: 'Cosmic', multiplier: 100 },
];

export function getMutationPreset(id: string): MutationPreset {
  return mutationPresets.find((preset) => preset.id === id) ?? mutationPresets[0];
}

export function buildCalculatorContext(
  seed: Pick<SeedRecord, 'name' | 'costDisplay' | 'rarity' | 'spawnOneIn'> | null,
  mutation: MutationPreset,
): CalculatorContext {
  const mutationPreset = mutation.id === 'base'
    ? `${mutation.name} · ${mutation.multiplier}x`
    : mutation.id === 'manual'
      ? `${mutation.name} · entered ${mutation.multiplier}x`
      : `${mutation.name} · reported ${mutation.multiplier}x`;

  return {
    selectedSeed: seed?.name ?? 'Manual values',
    reportedCost: seed?.costDisplay
      .replace(/(\.\d*?[1-9])0+(?=[A-Za-z]+$)/, '$1')
      .replace(/\.0+(?=[A-Za-z]+$)/, '') ?? 'Enter your own',
    rarity: seed?.rarity ?? 'Not selected',
    riverSpawn: seed?.spawnOneIn ? `1 in ${seed.spawnOneIn.toLocaleString('en-US')}` : 'Not selected',
    mutationPreset,
    evidence: 'community-matched, not developer-confirmed',
  };
}
