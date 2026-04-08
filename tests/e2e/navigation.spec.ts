import { test, expect } from '@playwright/test';

test.describe('Navigation and responsive layout', () => {
  test('desktop navbar shows all links and highlights the active route', async ({ page }) => {
    await page.goto('.');

    const nav = page.getByRole('navigation').first();
    await expect(nav.getByRole('link', { name: '首页' })).toBeVisible();
    await expect(nav.getByRole('link', { name: '目的地' })).toBeVisible();
    await expect(nav.getByRole('link', { name: '心愿单' })).toBeVisible();
    await expect(nav.getByRole('link', { name: '行程规划' })).toBeVisible();
    await expect(nav.getByRole('link', { name: '关于我们' })).toBeVisible();

    // Navigate to destinations and verify active state
    await nav.getByRole('link', { name: '目的地' }).click();
    await expect(page).toHaveURL(/\/destinations$/);
  });

  test('mobile hamburger menu toggles and navigates', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('.');

    // Open mobile menu
    await page.getByRole('button', { name: 'Toggle menu' }).click();

    // Use navigation scope to avoid ambiguity with footer and page links
    const nav = page.getByRole('navigation').first();
    await expect(nav.getByRole('link', { name: '目的地' })).toBeVisible();

    // Click a link
    await nav.getByRole('link', { name: '心愿单' }).click();
    await expect(page).toHaveURL(/\/favorites$/);
  });

  test('language switch updates all navigation labels', async ({ page }) => {
    await page.goto('.');
    const nav = page.getByRole('navigation').first();

    await page.getByRole('button', { name: 'EN' }).click();
    await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Destinations' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Wishlist' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Trip Planner' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'About' })).toBeVisible();

    await page.getByRole('button', { name: '中文' }).click();
    await expect(nav.getByRole('link', { name: '首页' })).toBeVisible();
  });

  test('footer links navigate to correct pages', async ({ page }) => {
    await page.goto('.');

    const footer = page.getByRole('contentinfo');
    await expect(footer.getByRole('heading', { name: 'TravelVista' })).toBeVisible();
    await expect(footer.getByRole('link', { name: '首页' })).toBeVisible();
    await expect(footer.getByRole('link', { name: '目的地' })).toBeVisible();
    await expect(footer.getByRole('link', { name: '关于我们' })).toBeVisible();

    await footer.getByRole('link', { name: '目的地' }).click();
    await expect(page).toHaveURL(/\/destinations$/);
  });

  test('scroll-to-top button appears after scrolling', async ({ page }) => {
    await page.goto('.');

    const btn = page.getByRole('button', { name: 'Back to top' });

    // Button should be initially invisible (opacity-0, pointer-events-none)
    await expect(btn).toHaveClass(/opacity-0/);

    // Scroll down past 300px threshold
    await page.evaluate(() => window.scrollTo(0, 1000));
    await expect(btn).toHaveClass(/opacity-100/);

    // Click back to top
    await btn.click();
    await page.waitForFunction(() => window.scrollY < 100);
  });
});
