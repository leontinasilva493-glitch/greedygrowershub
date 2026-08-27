import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, test } from 'vitest';
import { pageSeo } from './seo';

const projectRoot = fileURLToPath(new URL('../../', import.meta.url));
const buildCommand = process.platform === 'win32'
  ? { file: 'cmd.exe', args: ['/d', '/s', '/c', 'npm.cmd run build'] }
  : { file: 'npm', args: ['run', 'build'] };

function renderedWordCount(html: string) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:[a-z]+|#\d+|#x[\da-f]+);/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return text ? text.split(' ').length : 0;
}

describe('GSC intent landing pages', () => {
  let homeHtml = '';
  let seedHtml = '';
  let mutationHtml = '';

  beforeAll(() => {
    execFileSync(buildCommand.file, buildCommand.args, {
      cwd: projectRoot,
      stdio: 'pipe',
      windowsHide: true,
    });
    homeHtml = readFileSync(new URL('../../dist/client/index.html', import.meta.url), 'utf8');
    seedHtml = readFileSync(new URL('../../dist/client/seeds/list/index.html', import.meta.url), 'utf8');
    mutationHtml = readFileSync(new URL('../../dist/client/mechanics/mutations/index.html', import.meta.url), 'utf8');
  }, 60_000);

  test('homepage answers wiki intent without creating a competing wiki route', () => {
    expect(pageSeo.home.title).toBe('Greedy Growers Calculator: Profit, ROI & Lightning Risk');
    expect(pageSeo.home.description).toContain('fan-made Greedy Growers wiki');
    expect(homeHtml).toContain('Greedy Growers Wiki: Seeds, Mutations, Codes & Calculator');
    expect(homeHtml).toContain('This fan-made Greedy Growers wiki points');
    expect(homeHtml).not.toContain('href="/wiki/"');
  });

  test('homepage wiki directory exposes four distinct search-intent destinations', () => {
    const directory = homeHtml.match(/<nav[^>]+aria-label="Greedy Growers wiki directory"[\s\S]*?<\/nav>/)?.[0];

    expect(directory).toBeDefined();
    expect(directory?.match(/<a /g)).toHaveLength(4);
    expect(directory).toContain('href="/seeds/list/"');
    expect(directory).toContain('href="/mechanics/mutations/"');
    expect(directory).toContain('href="/codes/"');
    expect(directory).toContain('href="/beginner-guide/"');
    expect(directory).not.toContain('href="/updates/"');
    expect(directory).not.toContain('href="#calculator"');
  });

  test('homepage HTML stays focused without duplicated seed catalog records', () => {
    const words = renderedWordCount(homeHtml);

    expect(words).toBeGreaterThanOrEqual(1350);
    expect(words).toBeLessThanOrEqual(1800);
    expect(homeHtml).not.toContain('Seed economy leaderboard');
    expect(homeHtml).not.toContain('Check lower-cost seeds before entering your own run');
    expect(homeHtml).not.toContain('Show the full 20-seed leaderboard');
    expect(homeHtml.match(/Community lead/g) ?? []).toHaveLength(0);
    expect(homeHtml.match(/Needs: seed cost, harvest value, growth time/g) ?? []).toHaveLength(0);
  });

  test('seed list gives an immediate answer before the full comparison tool', () => {
    expect(seedHtml).toContain('How many Greedy Growers seeds are there?');
    expect(seedHtml).toContain('Two current independent guides report <strong>20 Greedy Growers seeds</strong> for Update 1.2');
    expect(seedHtml.indexOf('How many Greedy Growers seeds are there?')).toBeLessThan(
      seedHtml.indexOf('Current Greedy Growers Seed Table'),
    );
  });

  test('mutation guide names all six reported mutations before the detailed table', () => {
    expect(mutationHtml).toContain('What mutations are in Greedy Growers?');
    expect(mutationHtml).toContain('aria-label="Six reported Greedy Growers mutations"');
    for (const mutation of ['Dewy', 'Shocked', 'Radioactive', 'Charged', 'Golden', 'Cosmic']) {
      expect(mutationHtml).toContain(`>${mutation}<`);
    }
    expect(mutationHtml.indexOf('What mutations are in Greedy Growers?')).toBeLessThan(
      mutationHtml.indexOf('Greedy Growers Mutation Multiplier Table'),
    );
  });
});
