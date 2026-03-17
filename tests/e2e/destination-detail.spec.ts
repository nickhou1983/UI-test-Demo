import { test, expect } from '@playwright/test';

test.describe('DestinationDetailPage — Bali', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./destinations/bali');
  });

  test('should display destination name and country', async ({ page }) => {
    // Bali detail page should show the destination name
    await expect(page.getByRole('heading').first()).toBeVisible();
  });

  test('should display breadcrumb navigation', async ({ page }) => {
    await expect(page.getByRole('main').getByRole('link', { name: '首页' })).toBeVisible();
    await expect(page.getByRole('main').getByRole('link', { name: '目的地', exact: true })).toBeVisible();
  });

  test('should display image gallery', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('should display attractions section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '必游景点' })).toBeVisible();
  });

  test('should display overview sidebar with rating', async ({ page }) => {
    // Rating should be visible somewhere
    await expect(page.getByText('4.7')).toBeVisible();
  });

  test('should display related destinations', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '你可能也喜欢' })).toBeVisible();
    // Related: santorini, maldives, kyoto
    const relatedCards = page.locator('a[href*="/destinations/"]');
    const count = await relatedCards.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('should navigate back to destinations list', async ({ page }) => {
    await page.getByRole('link', { name: '返回目的地列表' }).click();
    await expect(page).toHaveURL(/\/UI-test-Demo\/destinations$/);
  });

  test('should navigate via breadcrumb', async ({ page }) => {
    await page.getByRole('main').getByRole('link', { name: '目的地', exact: true }).click();
    await expect(page).toHaveURL(/\/UI-test-Demo\/destinations$/);
  });
});

test.describe('DestinationDetailPage — Not Found', () => {
  test('should show not found message for invalid destination', async ({ page }) => {
    await page.goto('./destinations/nonexistent-id');
    await expect(page.getByText('未找到该目的地信息')).toBeVisible();
    await expect(page.getByRole('main').getByRole('link', { name: /目的地/ })).toBeVisible();
  });
});
