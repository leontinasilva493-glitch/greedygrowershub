import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const headerSource = readFileSync(new URL('./Header.astro', import.meta.url), 'utf8');
const footerSource = readFileSync(new URL('./Footer.astro', import.meta.url), 'utf8');

function expectLabelsInOrder(source: string, labels: string[]) {
  const indexes = labels.map((label) => source.indexOf(label));

  expect(indexes.every((index) => index >= 0)).toBe(true);
  expect(indexes).toEqual([...indexes].sort((left, right) => left - right));
}

describe('global navigation order', () => {
  test('prioritizes Calculator across the desktop primary navigation', () => {
    const desktopNavigation = headerSource.match(
      /<nav class="hidden items-center[\s\S]*?<\/nav>/,
    )?.[0];

    expect(desktopNavigation).toBeTruthy();
    expectLabelsInOrder(desktopNavigation ?? '', [
      '>Calculator<',
      '>Seeds ',
      '>Mutations<',
      '>Guides ',
      '>Mechanics ',
      '>Codes<',
      '>Updates<',
    ]);
  });

  test('uses the same task order in the mobile menu', () => {
    const mobileNavigation = headerSource.slice(
      headerSource.indexOf('<details class="relative lg:hidden">'),
    );

    expectLabelsInOrder(mobileNavigation, [
      '>Calculator<',
      '>Seeds<',
      '>Mutations<',
      '>Guides<',
      '>Mechanics<',
      '>Codes<',
      '>Updates<',
      '>Play on Roblox ',
    ]);
  });

  test('prioritizes harvest timing inside Mechanics and tools in the footer', () => {
    const mechanicLinks = headerSource.match(
      /const mechanicLinks = \[[\s\S]*?\];/,
    )?.[0];

    expect(mechanicLinks).toBeTruthy();
    expectLabelsInOrder(mechanicLinks ?? '', [
      "label: 'When to Harvest'",
      "label: 'Lightning'",
    ]);
    expect(mechanicLinks).not.toContain("label: 'Mutations'");
    expectLabelsInOrder(footerSource, ['>Tools & data<', '>Guides<']);
    expectLabelsInOrder(footerSource, [
      '>Profit Calculator<',
      '>Seed List<',
      '>Seed Tier List<',
      '>Codes Status<',
      '>Updates<',
    ]);
    expectLabelsInOrder(footerSource, [
      '>When to Harvest<',
      '>Lightning<',
      '>Mutations<',
    ]);
  });

  test('marks the current primary navigation item for assistive technology', () => {
    expect(headerSource).toContain("aria-current={isActive('/mechanics/mutations/') ? 'page' : undefined}");
  });

  test('keeps the mobile menu trigger touch-sized and mobile links state-aware', () => {
    const mobileNavigation = headerSource.slice(
      headerSource.indexOf('<details class="relative lg:hidden">'),
    );

    expect(mobileNavigation).toContain('size-11');
    expect(mobileNavigation).toContain("aria-current={isActive(item.href) ? 'page' : undefined}");
  });

  test('links only to the canonical Seed List and Best Seeds routes', () => {
    const combinedNavigation = `${headerSource}\n${footerSource}`;

    expect(combinedNavigation).toContain('href: \'/seeds/list/\'');
    expect(combinedNavigation).toContain('href: \'/seeds/best/\'');
    expect(combinedNavigation).toContain('href="/seeds/list/"');
    expect(combinedNavigation).toContain('href="/seeds/best/"');
    expect(combinedNavigation).toContain("label: 'Seed Tier List by Goal'");
    expect(combinedNavigation).not.toContain('href: \'/seeds/\'');
    expect(combinedNavigation).not.toContain('href: \'/seeds/best-seeds/\'');
    expect(combinedNavigation).not.toContain('href="/seeds/"');
    expect(combinedNavigation).not.toContain('href="/seeds/best-seeds/"');
  });
});
