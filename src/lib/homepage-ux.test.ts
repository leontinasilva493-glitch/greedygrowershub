import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const homepage = readFileSync(new URL('../pages/index.astro', import.meta.url), 'utf8');
const calculator = readFileSync(new URL('../components/Calculator.astro', import.meta.url), 'utf8');

describe('homepage task path', () => {
  test('offers five primary tasks immediately after the hero', () => {
    const heroEnd = homepage.indexOf('</section>');
    const taskPath = homepage.match(
      /<nav[^>]+aria-label="Start with a Greedy Growers task"[\s\S]*?<\/nav>/,
    )?.[0];

    expect(taskPath).toBeTruthy();
    expect(homepage.indexOf(taskPath ?? '')).toBeGreaterThan(heroEnd);
    expect(taskPath).toContain('href="/codes/"');
    expect(taskPath).toContain('>Check Codes<');
    expect(taskPath).toContain('href="/seeds/list/"');
    expect(taskPath).toContain('>Compare All Seeds<');
    expect(taskPath).toContain('href="/mechanics/mutations/"');
    expect(taskPath).toContain('>Understand Mutations<');
    expect(taskPath).toContain('href="#calculator"');
    expect(taskPath).toContain('>Calculate a Run<');
    expect(taskPath).toContain('href="/updates/"');
    expect(taskPath).toContain('>See What Changed<');
  });

  test('keeps the full seed economy leaderboard collapsed by default', () => {
    const disclosure = calculator.match(
      /<details[^>]+data-seed-economy-leaderboard[\s\S]*?<\/details>/,
    )?.[0];

    expect(disclosure).toBeTruthy();
    expect(disclosure?.match(/<details[^>]*>/)?.[0]).not.toContain(' open');
    expect(disclosure).toContain('Show the full 20-seed leaderboard');
    expect(disclosure).toContain('Evidence-aware Greedy Growers seed comparison');
    expect(disclosure).toContain('data-leaderboard-seed');
    expect(calculator).toContain('href="/seeds/list/"');
    expect(calculator).toContain('Open the full Seed List');
  });
});
