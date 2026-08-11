import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const homepage = readFileSync(new URL('../pages/index.astro', import.meta.url), 'utf8');
const calculator = readFileSync(new URL('../components/Calculator.astro', import.meta.url), 'utf8');

describe('homepage task path', () => {
  test('puts the live calculator immediately after the hero and before browse paths', () => {
    const heroEnd = homepage.indexOf('</section>');
    const calculatorSection = homepage.match(
      /<section id="calculator"[\s\S]*?<CalculatorSeedPreview \/>[\s\S]*?<\/section>/,
    )?.[0];
    const taskPath = homepage.match(
      /<nav[^>]+aria-label="Start with a Greedy Growers task"[\s\S]*?<\/nav>/,
    )?.[0];

    expect(calculatorSection).toBeTruthy();
    expect(taskPath).toBeTruthy();
    expect(homepage.indexOf(calculatorSection ?? '')).toBeGreaterThan(heroEnd);
    expect(homepage.indexOf(calculatorSection ?? '')).toBeLessThan(homepage.indexOf(taskPath ?? ''));
    expect(homepage.indexOf(taskPath ?? '')).toBeLessThan(homepage.indexOf('Update 1.2 · direct answer'));
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

  test('keeps secondary calculator modelling controls collapsed by default', () => {
    const disclosure = calculator.match(
      /<details[^>]+data-calculator-advanced[\s\S]*?<\/details>/,
    )?.[0];

    expect(disclosure).toBeTruthy();
    expect(disclosure?.match(/<details[^>]*>/)?.[0]).not.toContain(' open');
    expect(disclosure).toContain('Advanced run modelling');
    expect(disclosure).toContain('name="fertilizerPreset"');
    expect(disclosure).toContain('name="fertilizerCost"');
    expect(disclosure).toContain('name="plots"');
    expect(disclosure).toContain('name="sessionMinutes"');
    expect(disclosure).toContain('name="harvestMultiplier"');
    expect(disclosure).toContain('data-mutation-presets');
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
