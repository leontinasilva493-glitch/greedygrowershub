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

  test('gives Seeds pages distinct comparison and ranking headings', () => {
    const seedList = readSource('../pages/seeds.astro');
    const seedExplorer = readSource('../components/SeedExplorer.astro');
    const bestSeeds = readSource('../pages/seeds/best-seeds.astro');

    expectPhrases(`${seedList}\n${seedExplorer}`, [
      'Greedy Growers Seed Table — Sort and Filter',
      'Compare Two Greedy Growers Seeds',
      'How to Read Seed Data and Verification Status',
    ]);
    expectPhrases(bestSeeds, [
      'Early Game — Best Budget Seeds',
      'Fast Money — Best Reported Profit Seeds',
      'High Risk — High-Reward Seed Picks',
      'How We Rank Seeds and Use Community Tiers',
    ]);
  });

  test('uses four guide intents and two mechanics intents on directory pages', () => {
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
      'Latest Greedy Growers Updates and Site Changes',
      'Codes Status After Game Updates',
      'Official Sources for Greedy Growers Updates',
      'What We Recheck After Every Patch',
    ]);
  });
});
