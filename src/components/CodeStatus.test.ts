import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const component = readFileSync(new URL('./CodeStatus.astro', import.meta.url), 'utf8');

describe('localized code evidence lanes', () => {
  test('keeps one shared data implementation with English and Vietnamese copy', () => {
    expect(component).toContain("locale?: 'en' | 'vi'");
    expect(component).toContain('const copyByLocale');
    expect(component).toContain('Đã xác nhận qua nguồn hiện tại');
    expect(component).toContain('Chưa có code Greedy Growers nào vượt qua cả ba bước kiểm chứng');
    expect(component).toContain("const activeCodes = codes.filter((code) => code.status === 'active')");
  });
});
