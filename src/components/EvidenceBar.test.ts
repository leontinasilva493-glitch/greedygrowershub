import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const root = new URL('../../', import.meta.url);
const componentUrl = new URL('src/components/EvidenceBar.astro', root);
const configUrl = new URL('src/data/evidence.ts', root);

function readIfPresent(url: URL) {
  return existsSync(url) ? readFileSync(url, 'utf8') : '';
}

function expectTextInOrder(source: string, fragments: string[]) {
  const positions = fragments.map((fragment) => source.indexOf(fragment));
  expect(positions.every((position) => position >= 0)).toBe(true);
  expect(positions).toEqual([...positions].sort((left, right) => left - right));
}

describe('page evidence summary', () => {
  test('provides one static component with all evidence fields and claim states', () => {
    expect(existsSync(componentUrl)).toBe(true);

    const component = readIfPresent(componentUrl);
    expect(component).toContain('Version:');
    expect(component).toContain('Sources:');
    expect(component).toContain('Last checked:');
    expect(component).toContain('Known gaps:');
    expect(component).toContain('Community-reported');
    expect(component).toContain('Unverified');
    expect(component).toContain('Conflict');
    expect(component).toContain('text-[#55ddf0]');
    expect(component).toContain('text-[#ffd338]');
    expect(component).toContain("new Date(`${lastChecked}T00:00:00Z`)");
    expect(component).toContain("tone?: 'default' | 'subtle'");
    expect(component).toContain("tone === 'subtle'");
    expect(component).not.toContain('<script');
  });

  test('centralizes audited page values instead of duplicating them in pages', () => {
    expect(existsSync(configUrl)).toBe(true);

    const config = readIfPresent(configUrl);
    expect(config).toContain("lastChecked: '2026-08-10'");
    expect(config).toMatch(/home:\s*{[\s\S]*?sourceCount:\s*6/);
    expect(config).toMatch(/seeds:\s*{[\s\S]*?sourceCount:\s*3/);
    expect(config).toMatch(/mutations:\s*{[\s\S]*?sourceCount:\s*2/);
    expect(config).toMatch(/codes:\s*{[\s\S]*?sourceCount:\s*3/);
    expect(config).toMatch(/beginner:\s*{[\s\S]*?sourceCount:\s*3/);
  });

  test.each([
    ['src/pages/index.astro', 'home'],
    ['src/pages/seeds/list.astro', 'seeds'],
    ['src/pages/mechanics/mutations.astro', 'mutations'],
    ['src/pages/codes.astro', 'codes'],
    ['src/pages/beginner-guide.astro', 'beginner'],
  ])('renders the centralized evidence bar on %s', (path, key) => {
    const page = readIfPresent(new URL(path, root));

    expect(page).toContain('EvidenceBar');
    expect(page).toContain('evidenceByPage');
    const usage = key === 'home'
      ? '<EvidenceBar {...evidenceByPage.home} tone="subtle" />'
      : `<EvidenceBar {...evidenceByPage.${key}} />`;
    expect(page).toContain(usage);
  });

  test('keeps the homepage value proposition and actions ahead of a subtle evidence note', () => {
    const page = readIfPresent(new URL('src/pages/index.astro', root));

    expectTextInOrder(page, [
      '<h1',
      'Calculate profit per minute',
      '>Start calculating<',
      '<EvidenceBar {...evidenceByPage.home} tone="subtle" />',
    ]);
  });

  test.each([
    ['src/pages/seeds/list.astro', 'Looking for every Greedy Growers seed?', '>Search all 20 seeds<', '<EvidenceBar {...evidenceByPage.seeds} />'],
    ['src/pages/mechanics/mutations.astro', 'Mutations are reported to change', '>Compare all multipliers<', '<EvidenceBar {...evidenceByPage.mutations} />'],
    ['src/pages/beginner-guide.astro', 'Learn the official loop first.', '>Start first harvest<', '<EvidenceBar {...evidenceByPage.beginner} />'],
  ])('places evidence after the introduction and hero actions on %s', (path, intro, action, evidence) => {
    const page = readIfPresent(new URL(path, root));
    expectTextInOrder(page, ['<h1', intro, action, evidence]);
  });

  test('keeps code freshness near the answer but after its short introduction', () => {
    const page = readIfPresent(new URL('src/pages/codes.astro', root));
    expectTextInOrder(page, [
      '<h1',
      'Check the current answer before you paste anything.',
      '<EvidenceBar {...evidenceByPage.codes} />',
      '>Check code status<',
    ]);
  });
});
