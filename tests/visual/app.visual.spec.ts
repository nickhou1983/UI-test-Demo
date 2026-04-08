import { test } from '../fixtures/visual-test';
import { stabilize } from '../fixtures/visual-helpers';

test.describe('TravelVista visual regression with VLM fallback', () => {
  test('captures the home page in Chinese', async ({ page, assertScreenshotWithVlm }) => {
    await page.addInitScript(() => {
      localStorage.clear();
      window.setInterval = (() => 0) as typeof window.setInterval;
      window.clearInterval = (() => undefined) as typeof window.clearInterval;
    });

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

  test('captures the home page in English', async ({ page, assertScreenshotWithVlm }) => {
    await page.addInitScript(() => {
      localStorage.clear();
      window.setInterval = (() => 0) as typeof window.setInterval;
      window.clearInterval = (() => undefined) as typeof window.clearInterval;
    });

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

  test('captures the filtered destinations page', async ({ page, assertScreenshotWithVlm }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto('destinations');
    await page.getByRole('combobox', { name: '所有地区' }).selectOption('asia');
    await page.getByRole('combobox', { name: '所有类型' }).selectOption('beach');
    await stabilize(page);

    await assertScreenshotWithVlm({
      name: 'destinations-filtered-zh.png',
      target: page,
      screenshotOptions: { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.01 },
      pageName: 'Destinations Page',
      route: '/destinations',
      viewport: '1280x720',
      language: 'zh',
    });
  });

  test('captures the destination detail page on mobile', async ({ page, assertScreenshotWithVlm }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('destinations/bali');
    await stabilize(page);

    await assertScreenshotWithVlm({
      name: 'detail-bali-mobile-zh.png',
      target: page,
      screenshotOptions: { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.01 },
      pageName: 'Destination Detail Page',
      route: '/destinations/bali',
      viewport: '375x812',
      language: 'zh',
    });
  });

  test('captures the trip planner create modal', async ({ page, assertScreenshotWithVlm }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto('trips?dest=bali');
    await stabilize(page);

    await assertScreenshotWithVlm({
      name: 'trip-planner-create-modal-zh.png',
      target: page,
      screenshotOptions: { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.01 },
      pageName: 'Trip Planner Page',
      route: '/trips?dest=bali',
      viewport: '1280x720',
      language: 'zh',
    });
  });
});