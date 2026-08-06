import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

function readSource(relativePath: string) {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

function expectPhrases(source: string, phrases: string[]) {
  for (const phrase of phrases) expect(source).toContain(phrase);
}

describe('source-visible TDH heading contracts', () => {
  test('keeps the Calculator homepage focused on four truthful sections', () => {
    const homepage = readSource('../pages/index.astro');
    const calculator = readSource('../components/Calculator.astro');

    expectPhrases(`${homepage}\n${calculator}`, [
      'Profit and Failed-Run Risk Calculator',
      'How to Record Clean Run Data',
      'How the Math Works (Quick Summary)',
      'Frequently Asked Questions',
      'Pick One Seed and Keep the Wait Consistent',
      'Recalculate After Every Game Update',
    ]);
    expect(homepage).not.toContain('Continue with Greedy Growers guides and data');
  });

  test('answers Update 1.2 directly on the homepage without inventing mechanics', () => {
    const homepage = readSource('../pages/index.astro');

    expectPhrases(homepage, [
      'What Changed in Greedy Growers Update 1.2?',
      '20 reported seeds',
      '6 reported mutations',
      'href="/seeds/list/"',
      'href="/mechanics/mutations/"',
    ]);
  });

  test('gives Seeds pages distinct comparison and ranking headings', () => {
    const seedList = readSource('../pages/seeds/list.astro');
    const seedExplorer = readSource('../components/SeedExplorer.astro');
    const bestSeeds = readSource('../pages/seeds/best.astro');

    expectPhrases(`${seedList}\n${seedExplorer}`, [
      'Current Greedy Growers Seed Table',
      'Compare Two Greedy Growers Seeds',
      'How We Check Greedy Growers Seed Data',
    ]);
    expectPhrases(bestSeeds, [
      'Best Budget Seeds for Learning the Current Loop',
      'Rarest Reported Seeds to Watch in the River',
      'How to Find Your Best Seed',
      'No profit ranking yet',
    ]);
  });

  test('answers the current all-seeds intent with price, rarity, spawn chance, and source context', () => {
    const seedList = readSource('../pages/seeds/list.astro');
    const seedExplorer = readSource('../components/SeedExplorer.astro');
    const seedData = readSource('../data/seeds.json');

    expectPhrases(`${seedList}\n${seedExplorer}`, [
      '20 Greedy Growers Seeds Reported for Update 1.2',
      'Current Greedy Growers Seed Table',
      'Spawn chance',
      'Why This List Differs From Older Seed Guides',
      'How We Check Greedy Growers Seed Data',
      'Frequently Asked Questions About Greedy Growers Seeds',
      'href="/mechanics/mutations/"',
    ]);
    expectPhrases(seedData, [
      '"oak-seed"',
      '"void-seed"',
      '"spawnOneIn": 1000',
      '"costDisplay": "$1.75Qi"',
      '"gameVersionClaim": "Update 1.2"',
    ]);
  });

  test('uses four guide intents and three mechanics intents on directory pages', () => {
    const guides = readSource('../pages/guides/index.astro');
    const mechanics = readSource('../pages/mechanics/index.astro');

    expectPhrases(guides, [
      'Beginner Guide — Your First Harvest',
      'Get Money Fast — Safer Farming Strategies',
      'Progression Guide — Leveling and Rebirth',
      'Tickets Guide — Current Evidence and Open Questions',
    ]);
    expectPhrases(mechanics, [
      'When to Harvest — Strategy and Break-Even Timing',
      'Lightning — Confirmed Facts and Risk Signals',
      'Mutations — Multipliers, Weather, and Evidence',
    ]);
  });

  test('publishes a source-matched mutation guide without hiding evidence limits', () => {
    const mutations = readSource('../pages/mechanics/mutations.astro');
    expectPhrases(mutations, [
      'All 6 Greedy Growers Mutations Reported for Update 1.2',
      'Greedy Growers Mutation Multiplier Table',
      'How to Get Mutations from Weather and Lightning',
      'Do Greedy Growers Mutations Stack?',
      'How to Verify a Mutation in Your Server',
      'href="/seeds/list/"',
      'href="/mechanics/lightning/"',
      'href="/"',
      "'@type': 'FAQPage'",
    ]);
  });

  test('publishes a distinct five-mistake guide with corrective next steps', () => {
    const mistakes = readSource('../pages/guides/mistakes.astro');
    const guides = readSource('../pages/guides/index.astro');
    const beginner = readSource('../pages/beginner-guide.astro');

    expectPhrases(mistakes, [
      'Most beginner losses start before the first repeatable harvest',
      'Joining Through Unverified or Clone Links',
      'Waiting for Maximum Height on the First Run',
      'Spending Every Coin on One Attempt',
      'Trusting Unsourced Seed Rankings',
      'Ignoring Failed-Run Costs',
      'What happens',
      'Why it hurts',
      'What to do instead',
      "'@type': 'Article'",
      'buildBreadcrumbSchema',
      'href="/mechanics/when-to-harvest/"',
      'href="/guides/get-money-fast/"',
      'href="/seeds/list/"',
      'href="/beginner-guide/"',
    ]);
    expectPhrases(guides, [
      'Beginner Mistakes — 5 Traps to Avoid',
      "href: '/guides/mistakes/'",
    ]);
    expectPhrases(beginner, [
      'Read all 5 beginner mistakes',
      'href="/guides/mistakes/"',
    ]);
  });

  test('aligns beginner, money, progression, and Tickets headings to long-tail intent', () => {
    const beginner = readSource('../pages/beginner-guide.astro');
    const money = readSource('../pages/guides/get-money-fast.astro');
    const progression = readSource('../pages/guides/progression.astro');
    const tickets = readSource('../pages/guides/tickets.astro');

    expectPhrases(beginner, [
      'How to Complete Your First Greedy Growers Harvest',
      'Learn Harvest Timing After Your First Clean Run',
      'Greedy Growers Beginner Mistakes to Avoid',
      'Compare Seeds and Calculate Your Next Profit',
      'Enter the Game and Verify the Roblox Experience',
      'Buy Your First Seed at the River',
      'Plant the Seed in Your Plot',
      'Watch the Growth Bar and Keep the Tree Visible',
      'Harvest Before Lightning Strikes',
    ]);
    expectPhrases(money, [
      'Protect Starting Coins Before Chasing Profit',
      'Seed, Fertilizer, and Tickets Investment Order',
      'Harvest Recovery After a Lightning Loss',
      'How Players Test Get Money Fast Routes',
    ]);
    expectPhrases(progression, [
      'Early Game Progression — Build a Repeatable Economy',
      'Mid Game Progression — Fertilizer and Market Unlocks',
      'Rebirth Rewards — Reported Levels 1 to 5',
      'When Progression Topics Need Separate Guides',
    ]);
    expectPhrases(tickets, [
      'What Are Greedy Growers Tickets?',
      'How to Verify Ticket Sources, Uses, and Limits',
      'What Players Are Testing About Tickets',
      'What Remains Unverified About Ticket Rewards',
    ]);
  });

  test('aligns harvest, lightning, codes, and updates headings to search intent', () => {
    const harvest = readSource('../pages/mechanics/when-to-harvest.astro');
    const lightning = readSource('../pages/mechanics/lightning.astro');
    const codes = readSource('../pages/codes.astro');
    const updates = readSource('../pages/updates.astro');

    expectPhrases(harvest, [
      'The Harvest Decision — Wait or Cut?',
      'Failed-Run Break-Even — When to Protect Capital',
      'Greedy Growers 80/20 Rule — What Is Actually Known',
      'Maximum-Tree and Expensive-Tree Player Tests',
      'Who Should Avoid Maximum-Greed Harvesting?',
    ]);
    expectPhrases(lightning, [
      'How Lightning Works — Confirmed Facts',
      'Warning Signs — What Is and Is Not Verified',
      'Maximum-Tree Lightning Exposure Tests',
      'How to Test a Lightning Timing Claim',
    ]);
    expectPhrases(codes, [
      'Active Codes — Current Verified Status',
      'How to Redeem Codes in Greedy Growers',
      'Expired or Invalid Codes — Why They Fail',
      'Codes FAQ and Verification Method',
    ]);
    expectPhrases(updates, [
      'Latest Greedy Growers Game and Data Updates',
      'Site Data Revision History',
      'Codes Status After Game Updates',
      'Official Sources for Greedy Growers Updates',
      'What We Recheck After Every Patch',
      "href: '/seeds/list/'",
      "href: '/seeds/best/'",
      "href: '/mechanics/mutations/'",
      "href: '/mechanics/lightning/'",
    ]);
  });

  test('separates code claims into three auditable verification layers', () => {
    const codes = readSource('../pages/codes.astro');
    const codeStatus = readSource('../components/CodeStatus.astro');

    expectPhrases(`${codes}\n${codeStatus}`, [
      'Three-Step Code Status',
      'Confirmed by a current source',
      'Single-source report',
      'Verified in game',
    ]);
  });

  test('connects the Updates page to an official Roblox updated-time snapshot', () => {
    const updates = readSource('../pages/updates.astro');
    const gameStatus = readSource('../data/game-status.json');

    expectPhrases(updates, [
      "import gameStatus from '../data/game-status.json'",
      'Roblox official updated time',
      'Pages affected by the latest Roblox update signal',
    ]);
    expectPhrases(gameStatus, [
      '"source": "Roblox Games API"',
      '"updated": "2026-08-05T05:19:27.8636033Z"',
      '"checkedAt": "2026-08-06"',
    ]);
  });

  test('adds budget, interpretation, and conflict decisions to the Seed List', () => {
    const seedList = readSource('../pages/seeds/list.astro');

    expectPhrases(seedList, [
      'Choose a Seed Budget Stage',
      'Rarity Is a Label; Spawn Chance Is a Reported Denominator',
      'How Source Conflicts Change This Table',
    ]);
  });

  test('maps weather through mutation value to a risk decision', () => {
    const mutations = readSource('../pages/mechanics/mutations.astro');

    expectPhrases(mutations, [
      'Weather → Mutation → Multiplier → Risk Decision',
      'Event signal',
      'Reported mutation',
      'Reported value',
      'Risk decision',
    ]);
  });

  test('adds actionable decision support to the four first-priority pages', () => {
    const beginner = readSource('../pages/beginner-guide.astro');
    const money = readSource('../pages/guides/get-money-fast.astro');
    const seedData = readSource('../data/seeds.json');
    const lightning = readSource('../pages/mechanics/lightning.astro');
    const harvest = readSource('../pages/mechanics/when-to-harvest.astro');

    expectPhrases(beginner, [
      'First-Run Checklist',
      'Record the Result Before Buying Again',
    ]);
    expectPhrases(money, [
      'Money Route by Player Stage',
      'Reported Seed Pace Is Not Guaranteed Profit',
      "'oak-seed', 'pine-seed', 'apple-seed'",
    ]);
    expectPhrases(seedData, ['"oak-seed"', '"pine-seed"', '"apple-seed"']);
    expectPhrases(lightning, [
      'Confirmed',
      'Not Verified',
      'Use Exposure Time, Not Invented Odds',
    ]);
    expectPhrases(harvest, [
      'Choose a Harvest Strategy by Bankroll',
      'Two or More Failed Runs',
    ]);
  });

  test('adds evidence and decision support to the four second-priority pages', () => {
    const seedList = readSource('../pages/seeds/list.astro');
    const bestSeeds = readSource('../pages/seeds/best.astro');
    const progression = readSource('../pages/guides/progression.astro');
    const tickets = readSource('../pages/guides/tickets.astro');

    expectPhrases(seedList, [
      'Seed Data Dictionary',
      'Last checked',
    ]);
    expectPhrases(bestSeeds, [
      'Best Seeds by Player Goal',
      'Ranking Limits',
    ]);
    expectPhrases(progression, [
      'Early Game Checklist',
      'Mid Game Checklist',
      'Late Game Checklist',
    ]);
    expectPhrases(tickets, [
      'Ticket Evidence Checklist',
      'Do Not Assume a Daily Reset',
    ]);
  });
});
