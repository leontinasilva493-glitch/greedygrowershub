import { site } from './content';

export interface PageMetadata {
  title: string;
  description: string;
  canonicalPath: string;
  h1: string;
}

export const pageSeo = {
  home: {
    title: 'Greedy Growers Calculator: Profit, ROI & Lightning Risk',
    description: 'Calculate Greedy Growers profit per minute with observed seed and fertilizer inputs. Compare ROI, break-even value, failed-run cost, and risk-adjusted returns.',
    canonicalPath: '/',
    h1: 'Greedy Growers Calculator',
  },
  codes: {
    title: 'Greedy Growers Codes (August 2026): Any Working Codes?',
    description: 'No active Greedy Growers codes are verified as of August 11, 2026. Check active and expired codes, redemption steps, invalid-code fixes, and official sources.',
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
    title: 'All Greedy Growers Seeds (Update 1.2): Prices & Rarity',
    description: 'Explore all 20 Greedy Growers seeds reported for Update 1.2. Compare rarity, shop price, spawn chance, version notes, source agreement, and evidence status.',
    canonicalPath: '/seeds/list/',
    h1: 'All 20 Greedy Growers Seeds Reported for Update 1.2',
  },
  bestSeeds: {
    title: 'Greedy Growers Seed Tier List by Budget & Rarity (2026)',
    description: 'Compare Greedy Growers seeds in a goal-based tier list using reported buy-in, rarity, and spawn chance, without claiming unverified profit rankings today.',
    canonicalPath: '/seeds/best/',
    h1: 'Greedy Growers Seed Tier List by Player Goal',
  },
  guides: {
    title: 'Greedy Growers Guides: Beginner, Money, Rebirth & Tickets',
    description: 'Explore Greedy Growers guides for beginners, fast money, progression, rebirth, fertilizer, and Tickets, with evidence labels and links to the calculator.',
    canonicalPath: '/guides/',
    h1: 'Greedy Growers Guides',
  },
  mistakes: {
    title: 'Greedy Growers Beginner Mistakes: 5 Traps to Avoid',
    description: 'Learn five common Greedy Growers beginner mistakes, how to protect coins, choose safer harvest timing, check seed claims, and recover after lightning losses.',
    canonicalPath: '/guides/mistakes/',
    h1: '5 Greedy Growers Beginner Mistakes to Avoid',
  },
  getMoneyFast: {
    title: 'Greedy Growers Money Guide: How to Get Money Fast (2026)',
    description: 'Learn how to make money fast in Greedy Growers using capital reserves, low-buy-in seeds, repeatable harvest tests, upgrade priorities, and lightning recovery.',
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
    title: 'Greedy Growers Mechanics: Mutations, Lightning & Harvest',
    description: 'Explore Greedy Growers mutations, lightning, and harvest timing. Compare reported multipliers, weather triggers, decisions, evidence limits, and test methods.',
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
  mutations: {
    title: 'All Greedy Growers Mutations: Multipliers & How to Get',
    description: 'Compare all six Greedy Growers mutations reported for Update 1.2, 2x–100x multipliers, how to get them from weather or lightning, stacking notes, and sources.',
    canonicalPath: '/mechanics/mutations/',
    h1: 'All 6 Greedy Growers Mutations Reported for Update 1.2',
  },
  updates: {
    title: 'Greedy Growers Updates: Codes, Game Changes & Site Log',
    description: 'Track Greedy Growers game signals, codes status, seed data changes, calculator revisions, and affected guides. See what changed and what needs rechecking.',
    canonicalPath: '/updates/',
    h1: 'Greedy Growers Updates',
  },
  officialLinks: {
    title: 'Greedy Growers Official Links: Roblox & Discord Status',
    description: 'Find the official Greedy Growers Roblox experience, creator and API sources, plus the current verification status of Discord and other community links.',
    canonicalPath: '/official-links/',
    h1: 'Greedy Growers Official Links',
  },
} as const satisfies Record<string, PageMetadata>;

export const localizedPageSeo = {
  viCodes: {
    title: 'Code Greedy Growers mới nhất (Tháng 8/2026)',
    description: 'Kiểm tra code Greedy Growers mới nhất trong tháng 8/2026: code đang hoạt động, code hết hạn, cách nhập code, lỗi thường gặp và nguồn chính thức.',
    canonicalPath: '/vi/codes/',
    h1: 'Code Greedy Growers mới nhất',
  },
} as const satisfies Record<string, PageMetadata>;

export function normalizeCanonicalPath(path: string): string {
  if (path === '/' || path === '') return '/';
  return `/${path.replace(/^\/+|\/+$/g, '')}/`;
}

export function absoluteUrl(path: string): string {
  return new URL(normalizeCanonicalPath(path), `https://${site.domain}`).toString();
}

export const codeLanguageAlternates = [
  { hreflang: 'en', href: absoluteUrl('/codes/') },
  { hreflang: 'vi', href: absoluteUrl('/vi/codes/') },
  { hreflang: 'x-default', href: absoluteUrl('/codes/') },
];

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

export function buildItemListSchema(
  name: string,
  items: Array<{ name: string; description: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Thing',
        name: item.name,
        description: item.description,
      },
    })),
  };
}
