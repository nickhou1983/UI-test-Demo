import { test, expect } from '@playwright/test';

test.describe('HomePage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
  });

  test('should display hero section with title and search', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '探索世界，发现美好' })).toBeVisible();
    await expect(page.getByPlaceholder('搜索目的地...')).toBeVisible();
  });

  test('should display popular destinations section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '热门目的地' })).toBeVisible();
    // Homepage shows first 8 destinations
    const cards = page.locator('a[href*="/destinations/"]');
    await expect(cards.first()).toBeVisible();
  });

  test('should filter destinations via hero search', async ({ page }) => {
    const searchInput = page.getByPlaceholder('搜索目的地...');
    await searchInput.fill('巴厘岛');
    // Should filter to matching destinations
    const cards = page.locator('a[href*="/destinations/"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show no results message for unmatched search', async ({ page }) => {
    const searchInput = page.getByPlaceholder('搜索目的地...');
    await searchInput.fill('xyznotexist12345');
    await expect(page.getByText('没有找到匹配的目的地')).toBeVisible();
  });

  test('should display travel themes section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '探索旅行主题' })).toBeVisible();
  });

  test('should navigate to destinations page via View All button', async ({ page }) => {
    await page.getByRole('link', { name: '查看全部目的地' }).click();
    await expect(page).toHaveURL(/\/UI-test-Demo\/destinations/);
    await expect(page.getByRole('heading', { name: '探索目的地' })).toBeVisible();
  });

  test('should display reviews carousel', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '旅行者评价' })).toBeVisible();
  });
});
