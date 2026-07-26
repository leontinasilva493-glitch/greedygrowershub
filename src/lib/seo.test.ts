import { describe, expect, it } from 'vitest';
import {
  absoluteUrl,
  buildBreadcrumbSchema,
  normalizeCanonicalPath,
  pageSeo,
} from './seo';

describe('indexable page metadata', () => {
  it.each(Object.entries(pageSeo))('%s has concise, keyword-first metadata', (_key, metadata) => {
    expect(metadata.title.length).toBeGreaterThanOrEqual(50);
    expect(metadata.title.length).toBeLessThanOrEqual(60);
    expect(metadata.title.startsWith('Greedy Growers')).toBe(true);
    expect(metadata.description.length).toBeGreaterThanOrEqual(150);
    expect(metadata.description.length).toBeLessThanOrEqual(160);
    expect(metadata.description).toMatch(/^(Explore|Check|Follow|Browse|Calculate|Learn|Choose|Track|Compare)\b/);
    expect(metadata.h1).toContain('Greedy Growers');
  });

  it('assigns the calculator intent exclusively to the homepage', () => {
    expect(pageSeo.home).toMatchObject({
      title: 'Greedy Growers Calculator: Profit, Break-Even & Risk',
      canonicalPath: '/',
      h1: 'Greedy Growers Calculator',
    });
    expect('calculator' in pageSeo).toBe(false);
  });

  it('defines unique metadata for every approved acquisition route', () => {
    const expectedKeys = [
      'home',
      'codes',
      'beginnerGuide',
      'seeds',
      'bestSeeds',
      'guides',
      'getMoneyFast',
      'progression',
      'tickets',
      'mechanics',
      'lightning',
      'whenToHarvest',
      'updates',
    ];

    expect(Object.keys(pageSeo)).toEqual(expectedKeys);
    expect(new Set(Object.values(pageSeo).map((metadata) => metadata.canonicalPath)).size).toBe(expectedKeys.length);
  });
});

describe('canonical helpers', () => {
  it('normalizes indexable routes to the sitemap trailing-slash format', () => {
    expect(normalizeCanonicalPath('/')).toBe('/');
    expect(normalizeCanonicalPath('/codes')).toBe('/codes/');
    expect(normalizeCanonicalPath('/codes/')).toBe('/codes/');
    expect(absoluteUrl('/codes')).toBe('https://greedygrowerhub.wiki/codes/');
  });

  it('builds ordered, absolute breadcrumb items', () => {
    expect(buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Codes', path: '/codes' },
    ])).toMatchObject({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://greedygrowerhub.wiki/' },
        { '@type': 'ListItem', position: 2, name: 'Codes', item: 'https://greedygrowerhub.wiki/codes/' },
      ],
    });
  });
});
