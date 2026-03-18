import { test, expect } from '@playwright/test';

test.describe('Complete User Journey', () => {
  test('browse destinations → filter → view detail → navigate back', async ({ page }) => {
    // 1. Start at homepage
    await page.goto('./');
    await expect(page.getByRole('heading', { name: '探索世界，发现美好' })).toBeVisible();

    // 2. Navigate to destinations page
    await page.getByRole('link', { name: '查看全部目的地' }).click();
    await expect(page).toHaveURL(/\/UI-test-Demo\/destinations$/);
    await expect(page.getByText('共 12 个目的地')).toBeVisible();

    // 3. Filter by region: Asia
    await page.getByRole('combobox', { name: '所有地区' }).selectOption('asia');
    // Asia: bali, kyoto, maldives, chengdu, nepal = 5
    await expect(page.getByText('共 5 个目的地')).toBeVisible();

    // 4. Click on first card to go to detail
    const firstCard = page.locator('a[href*="/destinations/"]').first();
    await firstCard.click();
    await expect(page).toHaveURL(/\/UI-test-Demo\/destinations\/.+/);

    // 5. Verify detail page loaded (heading visible)
    await expect(page.getByRole('heading').first()).toBeVisible();

    // 6. Navigate back via breadcrumb
    await page.getByRole('main').getByRole('link', { name: '目的地', exact: true }).click();
    await expect(page).toHaveURL(/\/UI-test-Demo\/destinations$/);

    // 7. Go to about page
    await page.getByRole('navigation').getByRole('link', { name: '关于我们' }).click();
    await expect(page).toHaveURL(/\/UI-test-Demo\/about$/);
    await expect(page.getByRole('heading', { name: '关于本站' }).first()).toBeVisible();

    // 8. Return home via logo
    await page.getByRole('navigation').getByRole('link', { name: 'TravelVista' }).click();
    await expect(page).toHaveURL(/\/UI-test-Demo\/?$/);
  });

  test('theme category navigation from homepage', async ({ page }) => {
    // 1. Go to homepage
    await page.goto('./');

    // 2. Click on a travel theme (beach category)
    const themeLinks = page.locator('a[href*="/destinations?type="]');
    await expect(themeLinks.first()).toBeVisible();
    await themeLinks.first().click();

    // 3. Verify destinations page with type filter active
    await expect(page).toHaveURL(/\/UI-test-Demo\/destinations\?type=/);
    // Count should be less than 12 (filtered)
    const countText = await page.getByText(/共 \d+ 个目的地/).textContent();
    const count = parseInt(countText?.match(/\d+/)?.[0] || '0');
    expect(count).toBeLessThan(12);
    expect(count).toBeGreaterThan(0);
  });
});
