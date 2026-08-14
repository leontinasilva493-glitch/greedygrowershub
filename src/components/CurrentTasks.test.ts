import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const readSource = (relativePath: string) => readFileSync(new URL(relativePath, import.meta.url), 'utf8');

describe('homepage current-task rail', () => {
  test('declares exactly four task cards with the approved destinations and status models', () => {
    const component = readSource('./CurrentTasks.astro');

    expect(component).toContain("href: '/codes/'");
    expect(component).toContain("href: '/seeds/list/'");
    expect(component).toContain("href: '/mechanics/mutations/'");
    expect(component).toContain("href: '/beginner-guide/'");
    expect(component.match(/href: '\//g)).toHaveLength(4);

    expect(component).toContain('Check code status');
    expect(component).toContain('Compare seed records');
    expect(component).toContain('Review mutation evidence');
    expect(component).toContain('Follow the first harvest route');

    expect(component).toContain("getFreshness('codes')");
    expect(component).toContain("getFreshness('seeds')");
    expect(component).toContain("getFreshness('mutations')");
    expect(component.match(/getFreshness\('/g)).toHaveLength(4);
    expect(component).toContain("getFreshness('roblox-listing').checkedAt");
    expect(component).toContain("label={card.title === 'Beginner' ? 'Official loop' : undefined}");
    expect(component).toContain('Use the official Roblox listing, buy one seed at the river, plant it in your plot, and finish one first harvest before changing the plan.');
    expect(component).toContain('Complete one clean first harvest, then move to seeds or harvest timing with your own notes.');
  });

  test('keeps beginner outside the freshness registry and places the rail below the hero', () => {
    const component = readSource('./CurrentTasks.astro');
    const home = readSource('../pages/index.astro');

    expect(component).toContain("import FreshnessBadge from './FreshnessBadge.astro';");
    expect(component).toContain("getFreshness('codes')");
    expect(component).toContain("getFreshness('seeds')");
    expect(component).toContain("getFreshness('mutations')");
    expect(component.match(/getFreshness\('(codes|seeds|mutations)'\)/g)).toHaveLength(3);
    expect(component).toContain('<FreshnessBadge');
    expect(component).toContain('sm:grid-cols-2 xl:grid-cols-4');
    expect(component).toContain('min-h-11');

    expect(home).toContain("import CurrentTasks from '../components/CurrentTasks.astro';");
    const heroEnd = home.indexOf('</section>');
    const currentTasksIndex = home.indexOf('<CurrentTasks />');
    const calculatorIndex = home.indexOf('<section id="calculator"');

    expect(heroEnd).toBeGreaterThan(-1);
    expect(currentTasksIndex).toBeGreaterThan(heroEnd);
    expect(calculatorIndex).toBeGreaterThan(currentTasksIndex);
    expect(home).toContain('Start calculating');
  });
});
