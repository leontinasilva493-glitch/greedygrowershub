import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { chromium } from 'playwright';

const root = resolve('dist/client');
const routes = [
  '/',
  '/seeds/list/',
  '/mechanics/mutations/',
  '/mechanics/when-to-harvest/',
  '/guides/progression/',
];
const viewports = [
  { label: '320 portrait', width: 320, height: 780 },
  { label: '360 portrait', width: 360, height: 780 },
  { label: '375 portrait', width: 375, height: 812 },
  { label: '390 portrait', width: 390, height: 844 },
  { label: '430 portrait', width: 430, height: 932 },
  { label: '768 tablet', width: 768, height: 1024 },
  { label: '812 landscape', width: 812, height: 375 },
  { label: '1024 desktop', width: 1024, height: 768 },
];

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
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

const { server, baseUrl } = await startStaticServer();
let browser;

try {
  browser = await chromium.launch({ headless: true });
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
      assert(pageErrors.length === 0, `${viewport.label} ${route}: ${pageErrors.join('; ')}`);
      combinations += 1;
    }

    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    if (viewport.width < 1024) await assertMobileMenu(page, viewport);
    await context.close();
  }

  console.log(`Browser smoke passed: ${combinations} page/viewport combinations across ${viewports.length} viewports.`);
} finally {
  await browser?.close();
  await new Promise((resolveClose) => server.close(resolveClose));
}
