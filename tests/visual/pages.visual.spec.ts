import { test, expect } from '../fixtures/visual-test';

test.describe('Visual Regression', () => {
  test('home page hero and discovery sections', async ({ page, assertScreenshotWithVlm }) => {
    await page.goto('./');
    await page.waitForLoadState('networkidle');

    const main = page.getByRole('main');

    await expect(main).toContainText('探索世界，发现美好');
    await expect(main).toContainText('热门目的地');
    await expect(main).toContainText('探索旅行主题');

    await assertScreenshotWithVlm({
      name: 'home-main.png',
      target: main,
      screenshotOptions: { animations: 'disabled', maxDiffPixelRatio: 0.01 },
      pageName: 'Home Page',
      route: '/',
    });
  });

  test('destinations page full layout', async ({ page, assertScreenshotWithVlm }) => {
    await page.goto('./destinations');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: '探索目的地' })).toBeVisible();
    await assertScreenshotWithVlm({
      name: 'destinations-page.png',
      target: page,
      screenshotOptions: { animations: 'disabled', fullPage: true, maxDiffPixelRatio: 0.01 },
      pageName: 'Destinations Page',
      route: '/destinations',
    });
  });

  test('about page full layout', async ({ page, assertScreenshotWithVlm }) => {
    await page.goto('./about');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: '关于我们' }).first()).toBeVisible();
    await assertScreenshotWithVlm({
      name: 'about-page.png',
      target: page,
      screenshotOptions: { animations: 'disabled', fullPage: true, maxDiffPixelRatio: 0.01 },
      pageName: 'About Page',
      route: '/about',
    });
  });

  test('destination detail page full layout', async ({ page, assertScreenshotWithVlm }) => {
    await page.goto('./destinations/bali');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: '巴厘岛' })).toBeVisible();
    await assertScreenshotWithVlm({
      name: 'destination-detail-bali.png',
      target: page,
      screenshotOptions: { animations: 'disabled', fullPage: true, maxDiffPixelRatio: 0.01 },
      pageName: 'Destination Detail - Bali',
      route: '/destinations/bali',
    });
  });
});