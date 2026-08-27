import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const homepage = readFileSync(new URL('../pages/index.astro', import.meta.url), 'utf8');
const calculator = readFileSync(new URL('../components/Calculator.astro', import.meta.url), 'utf8');

describe('homepage task path', () => {
  test('puts the live calculator immediately after the hero and before browse paths', () => {
    const heroEnd = homepage.indexOf('</section>');
    const calculatorSection = homepage.match(
      /<section id="calculator"[\s\S]*?<Calculator \/>[\s\S]*?<\/section>/,
    )?.[0];
    const taskPath = homepage.match(
      /<nav[^>]+aria-label="Greedy Growers wiki directory"[\s\S]*?<\/nav>/,
    )?.[0];

    expect(calculatorSection).toBeTruthy();
    expect(taskPath).toBeTruthy();
    expect(homepage.indexOf(calculatorSection ?? '')).toBeGreaterThan(heroEnd);
    expect(homepage.indexOf(calculatorSection ?? '')).toBeLessThan(homepage.indexOf(taskPath ?? ''));
    expect(homepage.slice(heroEnd, homepage.indexOf(calculatorSection ?? ''))).not.toContain('<CurrentTasks />');
    expect(homepage).not.toContain('<CalculatorSeedPreview />');
    expect(homepage.indexOf(taskPath ?? '')).toBeLessThan(homepage.indexOf('Greedy Growers Update 1.2 Coverage'));
    expect(taskPath?.match(/<a /g)).toHaveLength(4);
    expect(taskPath).toContain('href="/codes/"');
    expect(taskPath).toContain('>Codes<');
    expect(taskPath).toContain('href="/seeds/list/"');
    expect(taskPath).toContain('>All Seeds<');
    expect(taskPath).toContain('href="/mechanics/mutations/"');
    expect(taskPath).toContain('>All Mutations<');
    expect(taskPath).toContain('href="/beginner-guide/"');
    expect(taskPath).toContain('>Beginner Guide<');
    expect(taskPath).not.toContain('href="#calculator"');
    expect(taskPath).not.toContain('href="/updates/"');
  });

  test('uses one mobile result region before optional advanced inputs', () => {
    expect(calculator.match(/data-session-output="profitPerMinute"/g)).toHaveLength(1);
    expect(calculator.match(/data-session-output="sessionProfit"/g)).toHaveLength(1);
    expect(calculator.match(/data-session-output="roi"/g)).toHaveLength(1);
    expect(calculator.match(/data-session-output="sessionRevenue"/g)).toHaveLength(1);
    expect(calculator.indexOf('data-calculator-result')).toBeLessThan(
      calculator.indexOf('data-calculator-advanced'),
    );
    expect(calculator).toContain('<optgroup');
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

  test('keeps concise calculator guidance instead of an incomplete seed leaderboard', () => {
    expect(calculator).toContain('data-calculator-guidance');
    expect(calculator).toContain('Keep one seed and wait target consistent');
    expect(calculator).toContain('Recheck after every game update');
    expect(calculator).not.toContain('data-seed-economy-leaderboard');
    expect(calculator).not.toContain('data-leaderboard-seed');
    expect(calculator).not.toContain('Seed economy leaderboard');
    expect(calculator).toContain('href="/seeds/list/"');
    expect(calculator).toContain('Open all reported seeds');
  });
});
