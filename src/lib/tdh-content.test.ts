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

  test('keeps live calculator inputs visible and exposes the economy leaderboard columns', () => {
    const calculator = readSource('../components/Calculator.astro');

    expectPhrases(calculator, [
      'Current run record',
      'Your observed harvest inputs',
      'data-session-output="profitPerMinute"',
      'data-session-output="sessionProfit"',
      'data-session-output="roi"',
      'data-session-output="sessionRevenue"',
      'data-session-label="profitPerMinute"',
      'data-session-suffix="roi"',
      'data-scenario-notice',
      'Decision after recorded losses',
      'Seed economy leaderboard',
      'Sell value',
      'Profit/min',
      'data-leaderboard-seed',
    ]);
    expect(calculator.match(/data-session-output="profitPerMinute"/g)).toHaveLength(1);
    expect(calculator).not.toContain('Enter calculator inputs');
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
      'Are There Any Working Greedy Growers Codes?',
      'All Active Greedy Growers Codes',
      'Expired Greedy Growers Codes',
      'How to Redeem Codes in Greedy Growers',
      'Why Is My Greedy Growers Code Not Working?',
      'Where Are New Greedy Growers Codes Released?',
      'Settings (reported, not in-game verified)',
      'Active: {activeCodes.length}',
      'Expired: {expiredCodes.length}',
      'dateModified: evidenceByPage.codes.lastChecked',
    ]);
    expect(codes).not.toContain('dateModified: site.checkedAt');
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
      'API snapshot refreshed on August 11, 2026',
      'snapshotCheckedLabel',
    ]);
    expectPhrases(gameStatus, [
      '"source": "Roblox Games API"',
      '"playing": 14076',
      '"visits": 12912448',
      '"updated": "2026-08-10T22:22:01.3136194Z"',
      '"checkedAt": "2026-08-11T12:35:25+08:00"',
    ]);
  });

  test('publishes a Vietnamese Codes page from the shared evidence and code data', () => {
    const vietnameseCodes = readSource('../pages/vi/codes.astro');
    const englishCodes = readSource('../pages/codes.astro');

    expectPhrases(vietnameseCodes, [
      "import { codes, site, sources } from '../../lib/content'",
      '<CodeStatus locale="vi" />',
      'Có code Greedy Growers nào đang hoạt động không?',
      'Tất cả code Greedy Growers đang hoạt động',
      'Code Greedy Growers đã hết hạn',
      'Cách nhập code trong Greedy Growers',
      'Tại sao code Greedy Growers không hoạt động?',
      'Code Greedy Growers mới được phát hành ở đâu?',
      '"Nhà trồng tham lam" có phải là Greedy Growers không?',
      '"Những người trồng tham lam" có phải cùng một trò chơi không?',
      'canonicalPath={metadata.canonicalPath}',
      'lang="vi"',
      'alternates={codeLanguageAlternates}',
      "inLanguage: 'vi'",
    ]);
    expect(englishCodes).toContain('alternates={codeLanguageAlternates}');
  });

  test('keeps the unverified Discord lead dated and out of published routes', () => {
    const englishCodes = readSource('../pages/codes.astro');
    const vietnameseCodes = readSource('../pages/vi/codes.astro');
    const updates = readSource('../pages/updates.astro');
    const communityLinks = readSource('../data/community-links.json');

    expectPhrases(`${englishCodes}\n${updates}`, [
      'Official Discord: Unverified as of {discordCheckedLabel}',
      "import communityLinks from '../data/community-links.json'",
    ]);
    expectPhrases(vietnameseCodes, [
      'Discord chính thức: Chưa xác minh vào ngày {discordCheckedLabel}',
      "import communityLinks from '../../data/community-links.json'",
    ]);
    expectPhrases(communityLinks, [
      '"status": "unverified"',
      '"checkedAt": "2026-08-11"',
      '"candidateUrl": null',
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
      'Seed Tier List by Verified Dimension',
      'Not a profit tier',
      'Use the same seed and wait target',
      'Ranking Limits',
    ]);
    expectPhrases(progression, [
      'Early Game Checklist',
      'Mid Game Checklist',
      'Late Game Checklist',
      'Rebirth Page Readiness',
      'Keep Rebirth inside this progression pillar',
    ]);
    expectPhrases(tickets, [
      'Ticket Evidence Checklist',
      'Ticket Route Publication Gate',
      'Do Not Assume a Daily Reset',
    ]);
  });

  test('turns the latest update signal into explicit recheck work', () => {
    const updates = readSource('../pages/updates.astro');
    const lightning = readSource('../pages/mechanics/lightning.astro');
    const mutations = readSource('../pages/mechanics/mutations.astro');

    expectPhrases(updates, [
      'Post-Update Recheck Board',
      'API signal only',
      'Recheck required',
    ]);
    expectPhrases(lightning, ['Lightning Evidence After the Latest Update Signal']);
    expectPhrases(mutations, ['Mutation Evidence After the Latest Update Signal']);
  });

  test('registers evidence boundaries for progression, Tickets, and lightning', () => {
    const evidence = readSource('../data/evidence.ts');

    expectPhrases(evidence, [
      "'progression'",
      "'tickets'",
      "'lightning'",
      'reset behavior unverified',
      'Ticket grant and spend route unverified',
      'strike odds and warning cues unverified',
    ]);
  });

  test('publishes one official-links trust destination and links to it contextually', () => {
    const officialLinks = readSource('../pages/official-links.astro');
    const codes = readSource('../pages/codes.astro');
    const updates = readSource('../pages/updates.astro');
    const footer = readSource('../components/Footer.astro');

    expectPhrases(officialLinks, [
      'Official Roblox experience',
      'Roblox Games API snapshot',
      'Official Discord is not verified',
      'How We Decide a Link Is Safe to Publish',
      'No candidate invite is published',
    ]);
    for (const source of [codes, updates, footer]) {
      expect(source).toContain('href="/official-links/"');
    }
  });

  test('embeds evidence-safe local tools without inventing a harvest target', () => {
    const harvest = readSource('../pages/mechanics/when-to-harvest.astro');
    const harvestTimer = readSource('../components/HarvestTimer.astro');
    const progression = readSource('../pages/guides/progression.astro');
    const rebirthChecklist = readSource('../components/RebirthChecklist.astro');

    expectPhrases(`${harvest}\n${harvestTimer}`, [
      '<HarvestTimer />',
      'Set Your Own Harvest Timer',
      'No value is prefilled because the project has no verified universal target.',
      'data-harvest-timer',
    ]);
    expect(harvestTimer).not.toMatch(/name="(?:minutes|seconds)"[^>]+value=/);
    expectPhrases(`${progression}\n${rebirthChecklist}`, [
      '<RebirthChecklist />',
      'Track the Rebirth Levels You Verified',
      'Community-reported data',
      'data-rebirth-checklist',
      'stays in this browser',
    ]);
  });
});
