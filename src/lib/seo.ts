import { site } from './content';

export interface PageMetadata {
  title: string;
  description: string;
  canonicalPath: string;
  h1: string;
}

export const pageSeo = {
  home: {
    title: 'Greedy Growers Calculator: Profit, Break-Even & Risk',
    description: 'Calculate Greedy Growers profit per minute, break-even value, and risk-adjusted returns. Enter seed cost, harvest value, wait time, and failed runs for free.',
    canonicalPath: '/',
    h1: 'Greedy Growers Calculator',
  },
  codes: {
    title: 'Greedy Growers Codes - Current Status & Redeem Guide',
    description: 'Check Greedy Growers codes, active and expired status, trusted sources, redeem steps, and common fixes before you paste any code into the Roblox game.',
    canonicalPath: '/codes/',
    h1: 'Greedy Growers Codes',
  },
  beginnerGuide: {
    title: 'Greedy Growers Beginner Guide - First Harvest Route',
    description: 'Follow the Greedy Growers beginner route from the river to your plot, learn when to harvest, avoid early mistakes, and protect your first seed investment.',
    canonicalPath: '/beginner-guide/',
    h1: 'Greedy Growers Beginner Guide: First Harvest',
  },
  seeds: {
    title: 'Greedy Growers Seeds - Evidence, Stats & Comparison',
    description: 'Browse Greedy Growers seeds, filter records by evidence and player stage, compare known costs and growth times, and spot values that still need verification.',
    canonicalPath: '/seeds/',
    h1: 'Greedy Growers Seeds Comparison',
  },
  bestSeeds: {
    title: 'Greedy Growers Best Seeds by Stage, Profit, Risk & ROI',
    description: 'Compare Greedy Growers seeds by player stage, reported profit per minute, harvest risk, and community tier data before choosing where to invest your coins.',
    canonicalPath: '/seeds/best-seeds/',
    h1: 'Greedy Growers Best Seeds by Stage and Risk',
  },
  guides: {
    title: 'Greedy Growers Guides - Money, Progression & Tickets',
    description: 'Explore Greedy Growers guides for your first harvest, faster money, progression, tickets, fertilizer, rebirths, and safer decisions before every planting run.',
    canonicalPath: '/guides/',
    h1: 'Greedy Growers Guides',
  },
  getMoneyFast: {
    title: 'Greedy Growers Get Money Fast Guide - Safer Profit',
    description: 'Learn how to make money faster in Greedy Growers, protect your starting coins, recover after lightning losses, prioritize upgrades, and compare runs for free.',
    canonicalPath: '/guides/get-money-fast/',
    h1: 'Greedy Growers Get Money Fast Guide',
  },
  progression: {
    title: 'Greedy Growers Progression Guide - Early to Late Game',
    description: "Follow Greedy Growers progression from early to late game. Compare tickets, fertilizer, rebirth, and Farmer's Market priorities before spending your coins.",
    canonicalPath: '/guides/progression/',
    h1: 'Greedy Growers Progression Guide',
  },
  tickets: {
    title: 'Greedy Growers Tickets Guide - Sources, Uses & Limits',
    description: 'Check how Greedy Growers tickets work, where players look for them, what limits still need verification, and which sources to trust after every game update.',
    canonicalPath: '/guides/tickets/',
    h1: 'Greedy Growers Tickets Guide',
  },
  mechanics: {
    title: 'Greedy Growers Mechanics - Lightning & Harvest Timing',
    description: 'Explore Greedy Growers mechanics for lightning, harvest timing, failed-run recovery, and player-tested strategies without treating odds as official facts.',
    canonicalPath: '/mechanics/',
    h1: 'Greedy Growers Mechanics',
  },
  lightning: {
    title: 'Greedy Growers Lightning Guide - Facts, Risk & Signals',
    description: 'Check what lightning does in Greedy Growers, which warning signals are confirmed, what players are testing, and which timing or seed claims remain unverified.',
    canonicalPath: '/mechanics/lightning/',
    h1: 'Greedy Growers Lightning Guide',
  },
  whenToHarvest: {
    title: 'Greedy Growers When to Harvest - Risk Strategy Guide',
    description: 'Choose when to harvest in Greedy Growers with conservative, balanced, and high-risk strategies, failed-run break-even math, and community-tested challenges.',
    canonicalPath: '/mechanics/when-to-harvest/',
    h1: 'When to Harvest in Greedy Growers',
  },
  updates: {
    title: 'Greedy Growers Updates - Patch, Codes & Data Changes',
    description: 'Track Greedy Growers updates, codes status, calculator data changes, source checks, and affected guides so you can recheck strategies after every game patch.',
    canonicalPath: '/updates/',
    h1: 'Greedy Growers Updates',
  },
} as const satisfies Record<string, PageMetadata>;

export function normalizeCanonicalPath(path: string): string {
  if (path === '/' || path === '') return '/';
  return `/${path.replace(/^\/+|\/+$/g, '')}/`;
}

export function absoluteUrl(path: string): string {
  return new URL(normalizeCanonicalPath(path), `https://${site.domain}`).toString();
}

export function buildBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
