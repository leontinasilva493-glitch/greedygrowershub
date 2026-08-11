export function parseSavedRebirthLevels(raw: string | null, validLevels: number[]): number[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const valid = new Set(validLevels);
    return [...new Set(parsed.filter((level): level is number => typeof level === 'number' && valid.has(level)))].sort((a, b) => a - b);
  } catch {
    return [];
  }
}

export function serializeRebirthLevels(levels: number[]): string {
  return JSON.stringify([...new Set(levels)].sort((a, b) => a - b));
}
