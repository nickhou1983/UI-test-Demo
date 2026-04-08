import { test } from '../fixtures/visual-test';
import { stabilize } from '../fixtures/visual-helpers';

/**
 * Comprehensive visual regression suite with VLM (Vision Language Model) fallback.
 * Covers all 8 routes × 2 languages × desktop/mobile viewports.
 * Run with VLM: npm run test:visual:vlm
 */

// ---------- HOME PAGE ----------

test.describe('Home page visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
      // Freeze carousel to prevent flaky diffs
      window.setInterval = (() => 0) as typeof window.setInterval;
      window.clearInterval = (() => undefined) as typeof window.clearInterval;
    });
  });

  test('home — zh — desktop', async ({ page, assertScreenshotWithVlm }) => {
    await page.goto('.');
    await stabilize(page);

    await assertScreenshotWithVlm({
      name: 'home-zh-desktop.png',
      target: page,
      screenshotOptions: { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.01 },
      pageName: 'Home Page',
      route: '/',
      viewport: '1280x720',
      language: 'zh',
    });
  });

  test('home — en — desktop', async ({ page, assertScreenshotWithVlm }) => {
    await page.goto('.');
    await page.getByRole('button', { name: 'EN' }).click();
    await stabilize(page);

    await assertScreenshotWithVlm({
      name: 'home-en-desktop.png',
      target: page,
      screenshotOptions: { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.01 },
      pageName: 'Home Page',
      route: '/',
      viewport: '1280x720',
      language: 'en',
    });
  });

  test('home — zh — mobile', async ({ page, assertScreenshotWithVlm }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('.');
    await stabilize(page);

    await assertScreenshotWithVlm({
      name: 'home-zh-mobile.png',
      target: page,
      screenshotOptions: { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.01 },
      pageName: 'Home Page',
      route: '/',
      viewport: '375x812',
      language: 'zh',
    });
  });
});

// ---------- DESTINATIONS PAGE ----------

test.describe('Destinations page visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
  });

  test('destinations — zh — desktop (all)', async ({ page, assertScreenshotWithVlm }) => {
    await page.goto('destinations');
    await stabilize(page);

    await assertScreenshotWithVlm({
      name: 'destinations-all-zh-desktop.png',
      target: page,
      screenshotOptions: { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.01 },
      pageName: 'Destinations Page',
      route: '/destinations',
      viewport: '1280x720',
      language: 'zh',
    });
  });

  test('destinations — filtered asia+beach — zh — desktop', async ({ page, assertScreenshotWithVlm }) => {
    await page.goto('destinations');
    await page.getByRole('combobox', { name: '所有地区' }).selectOption('asia');
    await page.getByRole('combobox', { name: '所有类型' }).selectOption('beach');
    await stabilize(page);

    await assertScreenshotWithVlm({
      name: 'destinations-filtered-zh.png',
      target: page,
      screenshotOptions: { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.01 },
      pageName: 'Destinations Page (filtered)',
      route: '/destinations',
      viewport: '1280x720',
      language: 'zh',
    });
  });

  test('destinations — en — desktop', async ({ page, assertScreenshotWithVlm }) => {
    await page.goto('destinations');
    await page.getByRole('button', { name: 'EN' }).click();
    await stabilize(page);

    await assertScreenshotWithVlm({
      name: 'destinations-all-en-desktop.png',
      target: page,
      screenshotOptions: { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.01 },
      pageName: 'Destinations Page',
      route: '/destinations',
      viewport: '1280x720',
      language: 'en',
    });
  });

  test('destinations — zh — mobile', async ({ page, assertScreenshotWithVlm }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('destinations');
    await stabilize(page);

    await assertScreenshotWithVlm({
      name: 'destinations-all-zh-mobile.png',
      target: page,
      screenshotOptions: { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.01 },
      pageName: 'Destinations Page',
      route: '/destinations',
      viewport: '375x812',
      language: 'zh',
    });
  });
});

// ---------- DESTINATION DETAIL PAGE ----------

test.describe('Destination detail page visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
  });

  test('detail bali — zh — desktop', async ({ page, assertScreenshotWithVlm }) => {
    await page.goto('destinations/bali');
    await stabilize(page);

    await assertScreenshotWithVlm({
      name: 'detail-bali-zh-desktop.png',
      target: page,
      screenshotOptions: { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.01 },
      pageName: 'Destination Detail — Bali',
      route: '/destinations/bali',
      viewport: '1280x720',
      language: 'zh',
    });
  });

  test('detail bali — mobile — zh', async ({ page, assertScreenshotWithVlm }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('destinations/bali');
    await stabilize(page);

    await assertScreenshotWithVlm({
      name: 'detail-bali-mobile-zh.png',
      target: page,
      screenshotOptions: { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.01 },
      pageName: 'Destination Detail — Bali',
      route: '/destinations/bali',
      viewport: '375x812',
      language: 'zh',
    });
  });

  test('detail kyoto — en — desktop', async ({ page, assertScreenshotWithVlm }) => {
    await page.goto('destinations/kyoto');
    await page.getByRole('button', { name: 'EN' }).click();
    await stabilize(page);

    await assertScreenshotWithVlm({
      name: 'detail-kyoto-en-desktop.png',
      target: page,
      screenshotOptions: { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.01 },
      pageName: 'Destination Detail — Kyoto',
      route: '/destinations/kyoto',
      viewport: '1280x720',
      language: 'en',
    });
  });
});

// ---------- FAVORITES PAGE ----------

test.describe('Favorites page visual regression', () => {
  test('favorites empty — zh — desktop', async ({ page, assertScreenshotWithVlm }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto('favorites');
    await stabilize(page);

    await assertScreenshotWithVlm({
      name: 'favorites-empty-zh-desktop.png',
      target: page,
      screenshotOptions: { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.01 },
      pageName: 'Favorites Page (Empty)',
      route: '/favorites',
      viewport: '1280x720',
      language: 'zh',
    });
  });

  test('favorites with items — zh — desktop', async ({ page, assertScreenshotWithVlm }) => {
    await page.addInitScript(() => {
      localStorage.setItem('travelvista_favorites', JSON.stringify(['bali', 'kyoto', 'paris']));
    });
    await page.goto('favorites');
    await stabilize(page);

    await assertScreenshotWithVlm({
      name: 'favorites-with-items-zh-desktop.png',
      target: page,
      screenshotOptions: { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.01 },
      pageName: 'Favorites Page (With Items)',
      route: '/favorites',
      viewport: '1280x720',
      language: 'zh',
    });
  });
});

// ---------- ABOUT PAGE ----------

test.describe('About page visual regression', () => {
  test('about — zh — desktop', async ({ page, assertScreenshotWithVlm }) => {
    await page.goto('about');
    await stabilize(page);

    await assertScreenshotWithVlm({
      name: 'about-zh-desktop.png',
      target: page,
      screenshotOptions: { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.01 },
      pageName: 'About Page',
      route: '/about',
      viewport: '1280x720',
      language: 'zh',
    });
  });

  test('about — en — desktop', async ({ page, assertScreenshotWithVlm }) => {
    await page.goto('about');
    await page.getByRole('button', { name: 'EN' }).click();
    await stabilize(page);

    await assertScreenshotWithVlm({
      name: 'about-en-desktop.png',
      target: page,
      screenshotOptions: { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.01 },
      pageName: 'About Page',
      route: '/about',
      viewport: '1280x720',
      language: 'en',
    });
  });

  test('about — zh — mobile', async ({ page, assertScreenshotWithVlm }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('about');
    await stabilize(page);

    await assertScreenshotWithVlm({
      name: 'about-zh-mobile.png',
      target: page,
      screenshotOptions: { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.01 },
      pageName: 'About Page',
      route: '/about',
      viewport: '375x812',
      language: 'zh',
    });
  });
});

// ---------- TRIP PLANNER PAGE ----------

test.describe('Trip planner page visual regression', () => {
  test('trip planner empty — zh — desktop', async ({ page, assertScreenshotWithVlm }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto('trips');
    await stabilize(page);

    await assertScreenshotWithVlm({
      name: 'trip-planner-empty-zh-desktop.png',
      target: page,
      screenshotOptions: { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.01 },
      pageName: 'Trip Planner Page (Empty)',
      route: '/trips',
      viewport: '1280x720',
      language: 'zh',
    });
  });

  test('trip planner create modal — zh — desktop', async ({ page, assertScreenshotWithVlm }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto('trips?dest=bali');
    await stabilize(page);

    await assertScreenshotWithVlm({
      name: 'trip-planner-create-modal-zh.png',
      target: page,
      screenshotOptions: { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.01 },
      pageName: 'Trip Planner — Create Modal',
      route: '/trips?dest=bali',
      viewport: '1280x720',
      language: 'zh',
    });
  });
});

// ---------- 404 PAGE ----------

test.describe('404 page visual regression', () => {
  test('404 — zh — desktop', async ({ page, assertScreenshotWithVlm }) => {
    await page.goto('nonexistent-page');
    await stabilize(page);

    await assertScreenshotWithVlm({
      name: '404-zh-desktop.png',
      target: page,
      screenshotOptions: { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.01 },
      pageName: '404 Page',
      route: '/nonexistent-page',
      viewport: '1280x720',
      language: 'zh',
    });
  });

  test('404 — en — desktop', async ({ page, assertScreenshotWithVlm }) => {
    await page.goto('nonexistent-page');
    await page.getByRole('button', { name: 'EN' }).click();
    await stabilize(page);

    await assertScreenshotWithVlm({
      name: '404-en-desktop.png',
      target: page,
      screenshotOptions: { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.01 },
      pageName: '404 Page',
      route: '/nonexistent-page',
      viewport: '1280x720',
      language: 'en',
    });
  });
});
