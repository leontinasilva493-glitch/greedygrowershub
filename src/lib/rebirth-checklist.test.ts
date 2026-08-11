import { describe, expect, test } from 'vitest';
import { parseSavedRebirthLevels, serializeRebirthLevels } from './rebirth-checklist';

const validLevels = [1, 2, 3, 4, 5];

describe('rebirth checklist storage helpers', () => {
  test('keeps only unique levels present in the current data set', () => {
    expect(parseSavedRebirthLevels('[1,3,3,9,"2"]', validLevels)).toEqual([1, 3]);
  });

  test('treats malformed or non-array local data as empty', () => {
    expect(parseSavedRebirthLevels('{bad json', validLevels)).toEqual([]);
    expect(parseSavedRebirthLevels('{"level":1}', validLevels)).toEqual([]);
    expect(parseSavedRebirthLevels(null, validLevels)).toEqual([]);
  });

  test('serializes levels in stable numeric order', () => {
    expect(serializeRebirthLevels([5, 2, 2, 1])).toBe('[1,2,5]');
  });
});
