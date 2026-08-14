import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { chromium } from 'playwright';

const root = resolve('dist/client');
const desktopHomepageOnly = process.argv.includes('--homepage-desktop-only');
const routes = [
  '/',
  '/beginner-guide/',
  '/codes/',
  '/contact/',
  '/disclaimer/',
  '/guides/',
  '/guides/get-money-fast/',
  '/guides/mistakes/',
  '/guides/progression/',
  '/guides/tickets/',
  '/mechanics/',
  '/mechanics/lightning/',
  '/mechanics/mutations/',
  '/mechanics/when-to-harvest/',
  '/official-links/',
  '/privacy/',
  '/seeds/best/',
  '/seeds/list/',
  '/updates/',
  '/vi/codes/',
];
const viewports = [
  { label: '320 portrait', width: 320, height: 780 },
  { label: '360 portrait', width: 360, height: 780 },
  { label: '375 portrait', width: 375, height: 812 },
  { label: '390 portrait', width: 390, height: 844 },
  { label: '412 portrait', width: 412, height: 915 },
  { label: '430 portrait', width: 430, height: 932 },
  { label: '768 tablet', width: 768, height: 1024 },
  { label: '812 landscape', width: 812, height: 375 },
  { label: '1024 desktop', width: 1024, height: 768 },
];
const desktopHomepageViewport = { label: '1440 desktop', width: 1440, height: 900, touch: false };

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};
const runLogOwnedFiles = [
  'src/components/RunLog.astro',
  'src/lib/run-log.ts',
  'src/scripts/calculator.ts',
];
const forbiddenRunLogNetworkPatterns = [
  { label: 'fetch', pattern: /\bfetch\s*\(/ },
  { label: 'XMLHttpRequest', pattern: /\bXMLHttpRequest\b/ },
  { label: 'sendBeacon', pattern: /\bsendBeacon\s*\(/ },
  { label: 'WebSocket', pattern: /\bWebSocket\b/ },
  { label: 'EventSource', pattern: /\bEventSource\b/ },
  { label: 'new Image', pattern: /\bnew\s+Image\s*\(/ },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function assertRunLogSourceContract() {
  for (const relativePath of runLogOwnedFiles) {
    const source = await readFile(resolve(relativePath), 'utf8');
    for (const { label, pattern } of forbiddenRunLogNetworkPatterns) {
      assert(!pattern.test(source), `Run-log source contract failed: ${relativePath} contains ${label}`);
    }
  }
}

async function resolveRequest(pathname) {
  const decoded = decodeURIComponent(pathname);
  const requested = decoded.endsWith('/') ? `${decoded}index.html` : decoded;
  const candidate = resolve(root, `.${requested}`);
  assert(candidate === root || candidate.startsWith(`${root}${sep}`), `Unsafe path: ${pathname}`);

  try {
    const info = await stat(candidate);
    return info.isDirectory() ? resolve(candidate, 'index.html') : candidate;
  } catch {
    if (!extname(candidate)) return resolve(candidate, 'index.html');
    return candidate;
  }
}

function startStaticServer() {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? '/', 'http://127.0.0.1');
      const file = await resolveRequest(url.pathname);
      const body = await readFile(file);
      response.writeHead(200, { 'content-type': mimeTypes[extname(file)] ?? 'application/octet-stream' });
      response.end(body);
    } catch {
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Not found');
    }
  });

  return new Promise((resolveServer, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      assert(address && typeof address === 'object', 'Static server did not expose a port');
      resolveServer({ server, baseUrl: `http://127.0.0.1:${address.port}` });
    });
  });
}

async function assertPageWidth(page, viewport, route) {
  const metrics = await page.evaluate(() => {
    const rootElement = document.documentElement;
    const body = document.body;
    const main = document.querySelector('main');
    return {
      innerWidth,
      rootClientWidth: rootElement.clientWidth,
      rootScrollWidth: rootElement.scrollWidth,
      bodyClientWidth: body.clientWidth,
      bodyScrollWidth: body.scrollWidth,
      mainWidth: main?.getBoundingClientRect().width ?? 0,
    };
  });

  const context = `${viewport.label} ${route}`;
  assert(metrics.innerWidth === viewport.width, `${context}: viewport width changed`);
  assert(metrics.rootClientWidth === viewport.width, `${context}: root is not viewport width`);
  assert(metrics.bodyClientWidth === viewport.width, `${context}: body is not viewport width`);
  assert(Math.abs(metrics.mainWidth - viewport.width) <= 1, `${context}: main is not full width`);
  assert(metrics.rootScrollWidth <= viewport.width, `${context}: root overflows horizontally`);
  assert(metrics.bodyScrollWidth <= viewport.width, `${context}: body overflows horizontally`);
}

async function assertCurrentTaskRail(page, viewport, route) {
  if (route !== '/') return;

  const section = page.locator('[data-current-tasks]');
  assert(await section.isVisible(), `${viewport.label} ${route}: current task rail is not visible`);

  const cards = section.locator('[data-current-task-card]');
  assert(await cards.count() === 4, `${viewport.label} ${route}: current task rail does not have four cards`);

  const titles = await cards.locator('h3').evaluateAll((elements) => elements.map((element) => element.textContent?.trim()));
  const hrefs = await cards.locator('[data-current-task-action]').evaluateAll((elements) => elements.map((element) => element.getAttribute('href')));
  assert(
    JSON.stringify(titles) === JSON.stringify(['Codes', 'Seeds', 'Mutations', 'Beginner']),
    `${viewport.label} ${route}: current task titles are out of order`,
  );
  assert(
    JSON.stringify(hrefs) === JSON.stringify(['/codes/', '/seeds/list/', '/mechanics/mutations/', '/beginner-guide/']),
    `${viewport.label} ${route}: current task actions are out of order`,
  );

  const metrics = await section.evaluate((element) => {
    const cards = [...element.querySelectorAll('[data-current-task-card]')].map((card) => {
      const box = card.getBoundingClientRect();
      return {
        left: Math.round(box.left),
        top: Math.round(box.top),
      };
    });

    return {
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      cards,
    };
  });

  assert(metrics.scrollWidth <= metrics.clientWidth, `${viewport.label} ${route}: current task rail overflows horizontally`);

  const columnCount = new Set(metrics.cards.map((card) => card.left)).size;
  if (viewport.width < 640) {
    assert(columnCount === 1, `${viewport.label} ${route}: current task rail should stack to one column`);
  } else if (viewport.width < 1280) {
    assert(columnCount === 2, `${viewport.label} ${route}: current task rail should use two columns`);
  } else {
    assert(columnCount === 4, `${viewport.label} ${route}: current task rail should use four columns`);
    assert(
      new Set(metrics.cards.map((card) => card.top)).size === 1,
      `${viewport.label} ${route}: current task rail cards should stay on one row`,
    );
  }

  const topPositions = metrics.cards.map((card) => card.top);
  assert(topPositions[0] <= topPositions[1], `${viewport.label} ${route}: current task card order is unstable`);
  assert(topPositions[1] <= topPositions[2] || columnCount > 1, `${viewport.label} ${route}: current task card order is unstable`);

  const actions = cards.locator('[data-current-task-action]');
  for (let index = 0; index < await actions.count(); index += 1) {
    const box = await actions.nth(index).boundingBox();
    assert(box, `${viewport.label} ${route}: current task action ${index + 1} has no box`);
    assert(box.height >= 44, `${viewport.label} ${route}: current task action ${index + 1} is shorter than 44px`);
    assert(box.width >= 44, `${viewport.label} ${route}: current task action ${index + 1} is narrower than 44px`);
  }
}

async function assertOfficialLinksPage(page, viewport, route) {
  if (route !== '/official-links/') return;

  const section = page.locator('[data-official-links]');
  assert(await section.isVisible(), `${viewport.label} ${route}: official links section is not visible`);

  const rows = section.locator('[data-official-link-row]');
  assert(await rows.count() === 4, `${viewport.label} ${route}: official links page does not show four records`);

  const labels = await rows.locator('h2, h3').evaluateAll((elements) => elements.map((element) => element.textContent?.trim()));
  assert(
    JSON.stringify(labels) === JSON.stringify([
      'Official Roblox experience',
      'Creator group',
      'Discord',
      'Trello/wiki board',
    ]),
    `${viewport.label} ${route}: official links labels are out of order`,
  );

  const actionLinks = rows.locator('[data-official-link-action]');
  assert(await actionLinks.count() === 1, `${viewport.label} ${route}: official links page should expose exactly one confirmed external link`);
  const href = await actionLinks.first().getAttribute('href');
  const target = await actionLinks.first().getAttribute('target');
  const rel = await actionLinks.first().getAttribute('rel');
  assert(
    href === 'https://www.roblox.com/games/74102906764176/Greedy-Growers',
    `${viewport.label} ${route}: confirmed official link href is incorrect`,
  );
  assert(target === '_blank', `${viewport.label} ${route}: confirmed official link should open in a new tab`);
  assert(rel === 'noopener noreferrer', `${viewport.label} ${route}: confirmed official link rel is incorrect`);

  const linkBox = await actionLinks.first().boundingBox();
  assert(linkBox, `${viewport.label} ${route}: confirmed official link has no box`);
  assert(linkBox.height >= 44, `${viewport.label} ${route}: confirmed official link is shorter than 44px`);
  assert(linkBox.width >= 44, `${viewport.label} ${route}: confirmed official link is narrower than 44px`);

  const expectedNotes = [
    'Not linked - needs verification',
    'Not linked - unverified',
    'Not linked - unverified',
  ];

  for (let index = 1; index < 4; index += 1) {
    const row = rows.nth(index);
    assert(await row.locator('a[href]').count() === 0, `${viewport.label} ${route}: row ${index + 1} should not contain a clickable href`);
    await expectText(
      row,
      '[data-official-link-status-note]',
      expectedNotes[index - 1],
      `${viewport.label} ${route}: row ${index + 1} has the wrong non-link status note`,
    );
  }

  const pageText = await section.textContent() ?? '';
  assert(!pageText.includes('鈥?'), `${viewport.label} ${route}: official links page still contains mojibake text`);
  assert(!pageText.includes('�'), `${viewport.label} ${route}: official links page still contains replacement characters`);
  assert(await rows.locator('time[datetime]').count() === 4, `${viewport.label} ${route}: checked dates are incomplete`);
}

async function assertMobileMenu(page, viewport) {
  const menu = page.locator('[data-mobile-navigation]');
  const trigger = menu.locator('[data-mobile-nav-trigger]');
  assert(await trigger.isVisible(), `${viewport.label}: mobile menu trigger is not visible`);

  await trigger.click();
  const panel = menu.locator('[data-mobile-nav-panel]');
  const box = await panel.boundingBox();
  assert(box, `${viewport.label}: mobile menu panel has no box`);
  assert(box.x >= -1, `${viewport.label}: mobile menu crosses the left edge`);
  assert(box.x + box.width <= viewport.width + 1, `${viewport.label}: mobile menu crosses the right edge`);
  assert(box.y + box.height <= viewport.height + 1, `${viewport.label}: mobile menu crosses the bottom edge`);

  await page.keyboard.press('Escape');
  assert(!(await menu.evaluate((element) => element.open)), `${viewport.label}: Escape did not close the menu`);
  assert(await trigger.evaluate((element) => element === document.activeElement), `${viewport.label}: Escape did not restore trigger focus`);

  await menu.evaluate((element) => { element.open = true; });
  const backdrop = menu.locator('[data-mobile-nav-backdrop]');
  const outsideState = await page.evaluate(() => {
    const details = document.querySelector('[data-mobile-navigation]');
    const button = document.querySelector('[data-mobile-nav-backdrop]');
    return {
      open: details?.hasAttribute('open'),
      display: button ? getComputedStyle(button).display : 'missing',
      rect: button?.getBoundingClientRect().toJSON(),
    };
  });
  assert(await backdrop.isVisible(), `${viewport.label}: outside-click backdrop is not visible (${JSON.stringify(outsideState)})`);
  await backdrop.click({ position: { x: 2, y: 2 } });
  assert(!(await menu.evaluate((element) => element.open)), `${viewport.label}: outside pointer did not close the menu`);
}

async function assertAnchors(page, route, viewport) {
  const navigation = page.locator('[data-reading-navigation]');
  if ((await navigation.count()) === 0) return;

  assert((await navigation.locator('xpath=ancestor::*[@data-reading-scope]').count()) === 1, `${viewport.label} ${route}: sticky navigation has no full-page scope`);
  const anchors = navigation.locator('a[href^="#"]');
  for (let index = 0; index < await anchors.count(); index += 1) {
    const anchor = anchors.nth(index);
    const href = await anchor.getAttribute('href');
    assert(href, `${viewport.label} ${route}: reading link has no href`);
    await anchor.click();
    await page.waitForTimeout(30);
    const positions = await page.evaluate((selector) => {
      const target = document.querySelector(selector);
      const stickyNavigation = document.querySelector('[data-reading-navigation]');
      return {
        targetTop: target?.getBoundingClientRect().top ?? -1,
        navigationBottom: stickyNavigation?.getBoundingClientRect().bottom ?? 0,
      };
    }, href);
    assert(
      positions.targetTop + 1 >= positions.navigationBottom,
      `${viewport.label} ${route} ${href}: anchor is hidden under sticky navigation (${positions.targetTop} < ${positions.navigationBottom})`,
    );
  }
}

async function assertTableMode(page, viewport, route) {
  const configs = {
    '/mechanics/when-to-harvest/': ['[data-mobile-harvest-strategies]', '[data-desktop-harvest-strategies]'],
    '/guides/progression/': ['[data-mobile-fertilizer-list]', '[data-desktop-fertilizer-table]'],
  };
  const selectors = configs[route];
  if (!selectors) return;

  const [mobileSelector, desktopSelector] = selectors;
  const mobileVisible = await page.locator(mobileSelector).isVisible();
  const desktopVisible = await page.locator(desktopSelector).isVisible();
  if (viewport.width < 768) {
    assert(mobileVisible && !desktopVisible, `${viewport.label} ${route}: mobile cards did not replace the table`);
  } else {
    assert(!mobileVisible && desktopVisible, `${viewport.label} ${route}: desktop table mode is incorrect`);
  }
}

async function expectText(page, selector, expected, message) {
  const text = (await page.locator(selector).textContent())?.trim() ?? '';
  assert(text.includes(expected), `${message}. Received "${text}"`);
}

async function assertRunLogFlow(browser, baseUrl) {
  const viewport = { label: '390 portrait run-log', width: 390, height: 844 };
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: true,
    isMobile: true,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const pageErrors = [];
  const runLogRequests = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.locator('main').waitFor({ state: 'visible' });
  await page.locator('[data-calculator-advanced]').evaluate((details) => { details.open = true; });

  const baseline = await page.evaluate(() => ({
    localStorageKeys: Object.keys(localStorage),
    sessionStorageKeys: Object.keys(sessionStorage),
    dataLayerLength: (window.dataLayer ?? []).length,
  }));
  const requestListener = (request) => {
    const url = new URL(request.url());
    if (url.hostname.endsWith('clarity.ms')) return;
    if (!request.isNavigationRequest()) runLogRequests.push(request.url());
  };
  page.on('request', requestListener);

  const fillScenario = async (label, harvestValue) => {
    await page.locator('[data-run-log-label]').fill(label);
    await page.locator('input[name="seedCost"]').fill('100');
    await page.locator('input[name="harvestValue"]').fill(String(harvestValue));
    await page.locator('input[name="waitMinutes"]').fill('1');
    await page.locator('input[name="fertilizerCost"]').fill('0');
    await page.locator('input[name="harvestMultiplier"]').fill('1');
    await page.locator('input[name="failedRuns"]').fill('0');
  };

  await page.locator('[data-run-log-label]').fill('Invalid wait time');
  await page.locator('input[name="waitMinutes"]').fill('0');
  await expectText(page, '[data-calculator-error]', 'Wait time must be greater than zero', `${viewport.label}: invalid calculator error was not visible`);
  assert(!(await page.locator('[data-run-log-add]').isDisabled()), `${viewport.label}: invalid-save action was not executable`);
  await page.locator('[data-run-log-add]').click();
  await expectText(page, '[data-run-log-error]', 'Fix the calculator inputs before saving this run.', `${viewport.label}: invalid save error was not visible`);
  assert(await page.locator('[data-run-log-list] > li').count() === 0, `${viewport.label}: invalid state saved a run`);

  for (const [label, harvestValue] of [['Run 1', 110], ['Run 2', 120], ['Run 3', 130], ['Run 4', 140], ['Run 5', 150]]) {
    await fillScenario(label, harvestValue);
    await page.locator('[data-run-log-add]').click();
  }
  assert(await page.locator('[data-run-log-list] > li').count() === 5, `${viewport.label}: five runs were not saved`);
  await expectText(page, '[data-run-log-count]', '5/5', `${viewport.label}: count is incorrect`);
  await expectText(page, '[data-run-log-median]', '30', `${viewport.label}: median is incorrect`);
  await expectText(page, '[data-run-log-range]', '10-50', `${viewport.label}: range is incorrect`);

  await fillScenario('Run 6', 160);
  await page.locator('[data-run-log-add]').click();
  await expectText(page, '[data-run-log-error]', 'You can save at most five runs', `${viewport.label}: sixth-run rejection was not visible`);
  assert(await page.locator('[data-run-log-list] > li').count() === 5, `${viewport.label}: sixth run changed the count`);

  await page.locator('[data-run-log-remove]').first().click();
  assert(await page.locator('[data-run-log-list] > li').count() === 4, `${viewport.label}: remove did not reduce the count`);
  await fillScenario('Run 6 retry', 160);
  await page.locator('[data-run-log-add]').click();

  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async (text) => { window.__copiedRunLogText = text; } },
    });
  });
  await page.locator('[data-run-log-copy]').click();
  await expectText(page, '[data-run-log-feedback]', 'Copied the run summary.', `${viewport.label}: copy feedback was not announced`);
  assert((await page.evaluate(() => window.__copiedRunLogText ?? '')).includes('Saved runs: 5/5'), `${viewport.label}: copied summary missed the count`);

  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async () => { throw new Error('blocked'); } },
    });
  });
  await page.locator('[data-run-log-copy]').click();
  await expectText(page, '[data-run-log-error]', 'Clipboard copy failed. Use the fallback text area below.', `${viewport.label}: copy fallback was not visible`);
  assert(await page.locator('[data-run-log-copy-fallback]').isVisible(), `${viewport.label}: copy fallback panel is hidden`);

  await page.locator('[data-run-log-clear]').click();
  assert(await page.locator('[data-run-log-list] > li').count() === 0, `${viewport.label}: clear did not empty the list`);
  assert(runLogRequests.length === 0, `${viewport.label}: run log triggered network requests (${runLogRequests.join(', ')})`);
  assert(await page.evaluate(() => (window.dataLayer ?? []).length) === baseline.dataLayerLength, `${viewport.label}: run log added analytics events`);

  await fillScenario('Reload check', 170);
  await page.locator('[data-run-log-add]').click();
  page.off('request', requestListener);
  await page.reload({ waitUntil: 'domcontentloaded' });
  assert(await page.locator('[data-run-log-list] > li').count() === 0, `${viewport.label}: reload kept runs`);
  const after = await page.evaluate(() => ({
    localStorageKeys: Object.keys(localStorage),
    sessionStorageKeys: Object.keys(sessionStorage),
  }));
  assert(JSON.stringify(after.localStorageKeys) === JSON.stringify(baseline.localStorageKeys), `${viewport.label}: localStorage keys changed`);
  assert(JSON.stringify(after.sessionStorageKeys) === JSON.stringify(baseline.sessionStorageKeys), `${viewport.label}: sessionStorage keys changed`);
  assert(pageErrors.length === 0, `${viewport.label}: ${pageErrors.join('; ')}`);
  await context.close();
}

async function runDesktopHomepageRailCheck(browser, baseUrl) {
  const context = await browser.newContext({
    viewport: { width: desktopHomepageViewport.width, height: desktopHomepageViewport.height },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.locator('main').waitFor({ state: 'visible' });
  await assertPageWidth(page, desktopHomepageViewport, '/');
  await assertCurrentTaskRail(page, desktopHomepageViewport, '/');
  assert(pageErrors.length === 0, `${desktopHomepageViewport.label} /: ${pageErrors.join('; ')}`);

  await context.close();
}
const { server, baseUrl } = await startStaticServer();
let browser;

try {
  browser = await chromium.launch({ headless: true });
  await assertRunLogSourceContract();
  if (desktopHomepageOnly) {
    await runDesktopHomepageRailCheck(browser, baseUrl);
    console.log('Browser smoke passed: 1 targeted desktop homepage rail check at 1440px.');
  } else {
    let combinations = 0;

    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        hasTouch: viewport.width < 1024,
        isMobile: viewport.width < 768,
        reducedMotion: 'reduce',
      });
      const page = await context.newPage();
      const pageErrors = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));

      for (const route of routes) {
        await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded' });
        await page.locator('main').waitFor({ state: 'visible' });
        await assertPageWidth(page, viewport, route);
        await assertAnchors(page, route, viewport);
        await assertTableMode(page, viewport, route);
        await assertCurrentTaskRail(page, viewport, route);
        await assertOfficialLinksPage(page, viewport, route);
        assert(pageErrors.length === 0, `${viewport.label} ${route}: ${pageErrors.join('; ')}`);
        combinations += 1;
      }

      await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
      if (viewport.width < 1024) await assertMobileMenu(page, viewport);
      await context.close();
    }

    await runDesktopHomepageRailCheck(browser, baseUrl);
    await assertRunLogFlow(browser, baseUrl);
    console.log(`Browser smoke passed: ${combinations} page/viewport combinations across ${viewports.length} viewports, plus 1 targeted desktop homepage rail check at 1440px and 1 calculator run-log flow at 390px.`);
  }
} finally {
  await browser?.close();
  await new Promise((resolveClose) => server.close(resolveClose));
}
