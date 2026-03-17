import { test, expect } from '@playwright/test';

test.describe('DestinationsPage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./destinations');
  });

  test('should display page title and all 12 destinations', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '探索目的地' })).toBeVisible();
    await expect(page.getByText('共 12 个目的地')).toBeVisible();
  });

  test('should filter by keyword search', async ({ page }) => {
    await page.getByPlaceholder('搜索目的地名称...').fill('巴厘岛');
    // Count should decrease
    await expect(page.getByText(/共 \d+ 个目的地/)).toBeVisible();
    const countText = await page.getByText(/共 \d+ 个目的地/).textContent();
    const count = parseInt(countText?.match(/\d+/)?.[0] || '0');
    expect(count).toBeLessThan(12);
    expect(count).toBeGreaterThan(0);
  });

  test('should filter by region', async ({ page }) => {
    await page.getByRole('combobox', { name: '所有地区' }).selectOption('europe');
    // Europe has: santorini, paris, swiss = 3
    await expect(page.getByText('共 3 个目的地')).toBeVisible();
  });

  test('should filter by type', async ({ page }) => {
    await page.getByRole('combobox', { name: '所有类型' }).selectOption('beach');
    // Beach: bali, santorini, maldives, greatbarrierreef = 4
    await expect(page.getByText('共 4 个目的地')).toBeVisible();
  });

  test('should show no results for impossible filter combination', async ({ page }) => {
    await page.getByPlaceholder('搜索目的地名称...').fill('xyznotexist12345');
    await expect(page.getByText('没有找到匹配的目的地')).toBeVisible();
  });

  test('should navigate to destination detail when clicking a card', async ({ page }) => {
    // Click the first destination card
    const firstCard = page.locator('a[href*="/destinations/"]').first();
    await firstCard.click();
    await expect(page).toHaveURL(/\/UI-test-Demo\/destinations\/.+/);
  });

  test('should initialize filter from URL query params', async ({ page }) => {
    await page.goto('./destinations?type=city');
    // City: paris, newyork = 2
    await expect(page.getByText('共 2 个目的地')).toBeVisible();
  });
});
