import { site } from './content';

export interface PageMetadata {
  title: string;
  description: string;
  canonicalPath: string;
  h1: string;
}

export const pageSeo = {
  home: {
    title: 'Greedy Growers Guide, Codes, Seeds & Profit Calculator',
    description: 'Explore Greedy Growers codes, verified seed records, a profit calculator, and a first-harvest guide built to help you plan safer, smarter planting runs.',
    canonicalPath: '/',
    h1: 'Greedy Growers Tools Hub',
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
  calculator: {
    title: 'Greedy Growers Profit Calculator - Plan Every Planting Run',
    description: 'Calculate Greedy Growers profit per harvest and minute, compare seed costs with harvest values, account for failed runs, and find a reliable break-even target.',
    canonicalPath: '/calculator/',
    h1: 'Greedy Growers Profit Calculator',
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
