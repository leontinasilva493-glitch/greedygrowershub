import { describe, expect, test } from 'vitest';
import { formatRemainingTime, parseDurationSeconds } from './harvest-timer';

describe('manual harvest timer helpers', () => {
  test('requires a positive user-entered duration', () => {
    expect(parseDurationSeconds('', '')).toBeNull();
    expect(parseDurationSeconds('0', '0')).toBeNull();
    expect(parseDurationSeconds('-1', '30')).toBeNull();
    expect(parseDurationSeconds('1.5', '0')).toBeNull();
    expect(parseDurationSeconds('1', '60')).toBeNull();
  });

  test('converts valid whole minutes and seconds', () => {
    expect(parseDurationSeconds('2', '15')).toBe(135);
    expect(parseDurationSeconds('', '45')).toBe(45);
    expect(parseDurationSeconds('3', '')).toBe(180);
  });

  test('formats long durations without dropping hours', () => {
    expect(formatRemainingTime(0)).toBe('00:00');
    expect(formatRemainingTime(65)).toBe('01:05');
    expect(formatRemainingTime(3661)).toBe('1:01:01');
  });
});
