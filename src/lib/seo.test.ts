import { describe, expect, it } from 'vitest';
import {
  absoluteUrl,
  buildBreadcrumbSchema,
  normalizeCanonicalPath,
  pageSeo,
} from './seo';

const expectedMetadata = {
  home: {
    title: 'Greedy Growers Calculator: Profit, ROI & Lightning Risk',
    description: 'Calculate Greedy Growers profit per minute with seed and fertilizer presets. Compare ROI, break-even value, failed-run cost, and risk-adjusted returns for free.',
    canonicalPath: '/',
    h1: 'Greedy Growers Calculator',
  },
  codes: {
    title: 'Greedy Growers Codes: Active Status & Redeem Guide',
    description: 'Check Greedy Growers codes, active and expired status, trusted sources, redeem steps, verification notes, and common fixes before trying any reported code.',
    canonicalPath: '/codes/',
    h1: 'Greedy Growers Codes',
  },
  beginnerGuide: {
    title: 'Greedy Growers Beginner Guide: How to Play Roblox (2026)',
    description: 'Follow this Greedy Growers beginner walkthrough to enter the right Roblox game, buy your first seed, plant it, harvest before lightning, and sell for profit.',
    canonicalPath: '/beginner-guide/',
    h1: 'Greedy Growers Beginner Guide: How to Play & First Harvest',
  },
  seeds: {
    title: 'Greedy Growers Seed List: Costs, Growth & Profit Data',
    description: 'Explore the Greedy Growers seed list with reported costs, growth times, harvest values, profit per minute, tiers, and verification status for current seeds.',
    canonicalPath: '/seeds/',
    h1: 'Greedy Growers Seed List — All Seeds Compared',
  },
  bestSeeds: {
    title: 'Greedy Growers Best Seeds by Stage, Profit & Risk Guide',
    description: 'Find the best Greedy Growers seeds by game stage, reported profit per minute, investment cost, and risk. Compare community-ranked picks before spending coins.',
    canonicalPath: '/seeds/best-seeds/',
    h1: 'Best Greedy Growers Seeds by Stage & Risk',
  },
  guides: {
    title: 'Greedy Growers Guides: Beginner, Money, Rebirth & Tickets',
    description: 'Explore Greedy Growers guides for beginners, fast money, progression, rebirth, fertilizer, and Tickets, with evidence labels and links to the calculator.',
    canonicalPath: '/guides/',
    h1: 'Greedy Growers Guides',
  },
  getMoneyFast: {
    title: 'Greedy Growers Money Guide: How to Get Money Fast (2026)',
    description: 'Learn how to make money fast in Greedy Growers. Protect your coins, compare seed profit rates, prioritize upgrades, and recover after lightning losses.',
    canonicalPath: '/guides/get-money-fast/',
    h1: 'Greedy Growers Money Guide: How to Get Money Fast',
  },
  progression: {
    title: 'Greedy Growers Progression Guide: Leveling & Rebirth',
    description: 'Follow the Greedy Growers progression path from early to late game. Compare rebirth requirements, reported rewards, fertilizer, Tickets, and stage priorities.',
    canonicalPath: '/guides/progression/',
    h1: 'Greedy Growers Progression Guide',
  },
  tickets: {
    title: 'Greedy Growers Tickets Guide: Sources, Uses & Limits',
    description: 'Check what is known about Greedy Growers Tickets, which acquisition sources and limits remain unverified, and how to reproduce claims after every game update.',
    canonicalPath: '/guides/tickets/',
    h1: 'Greedy Growers Tickets Guide',
  },
  mechanics: {
    title: 'Greedy Growers Mechanics: Lightning & Harvest Timing',
    description: 'Explore Greedy Growers mechanics for lightning and harvest timing. Compare confirmed facts, failed-run recovery, risk strategies, and community-tested claims.',
    canonicalPath: '/mechanics/',
    h1: 'Greedy Growers Game Mechanics',
  },
  lightning: {
    title: 'Greedy Growers Lightning Guide: Risk, Timing & Strategy',
    description: 'Learn what is confirmed about Greedy Growers lightning, which warning signals remain unverified, how exposure affects decisions, and how to test player claims.',
    canonicalPath: '/mechanics/lightning/',
    h1: 'Greedy Growers Lightning Mechanics Guide',
  },
  whenToHarvest: {
    title: 'Greedy Growers Harvest Timing: When to Harvest Guide',
    description: 'Learn when to harvest in Greedy Growers using conservative, balanced, and high-risk strategies, failed-run break-even math, capital protection, and tests.',
    canonicalPath: '/mechanics/when-to-harvest/',
    h1: 'Greedy Growers Harvest Timing Guide',
  },
  updates: {
    title: 'Greedy Growers Updates: Codes, Game Changes & Site Log',
    description: 'Track Greedy Growers game signals, codes status, seed data changes, calculator revisions, and affected guides. See what changed and what needs rechecking.',
    canonicalPath: '/updates/',
    h1: 'Greedy Growers Updates',
  },
} as const;

describe('indexable page metadata', () => {
  it.each(Object.entries(pageSeo))('%s has concise, keyword-first metadata', (_key, metadata) => {
    expect(metadata.title.length).toBeGreaterThanOrEqual(50);
    expect(metadata.title.length).toBeLessThanOrEqual(60);
    expect(metadata.title.startsWith('Greedy Growers')).toBe(true);
    expect(metadata.description.length).toBeGreaterThanOrEqual(150);
    expect(metadata.description.length).toBeLessThanOrEqual(160);
    expect(metadata.description).toMatch(/^(Explore|Check|Follow|Browse|Calculate|Learn|Choose|Track|Compare|Find)\b/);
    expect(metadata.h1).toContain('Greedy Growers');
  });

  it('matches the approved truthful TDH contract for every route', () => {
    expect(pageSeo).toEqual(expectedMetadata);
  });

  it('assigns the calculator intent exclusively to the homepage', () => {
    expect('calculator' in pageSeo).toBe(false);
  });

  it('does not advertise unsupported features or evidence', () => {
    const descriptions = Object.values(pageSeo).map(({ description }) => description).join(' ');

    expect(descriptions).not.toMatch(/plot count|probability curve|updated daily|in-game screenshots|predicts lightning|safe zone|danger zone/i);
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
