import { test, expect } from '@playwright/experimental-ct-react';
import FavoriteButton from '../../src/components/FavoriteButton';

test.beforeEach(async ({ page }) => {
  await page.evaluate(() => {
    localStorage.clear();
    (window as Window & { __favoriteEventCount?: number }).__favoriteEventCount = 0;
    window.addEventListener('favorites-changed', () => {
      (window as Window & { __favoriteEventCount?: number }).__favoriteEventCount =
        ((window as Window & { __favoriteEventCount?: number }).__favoriteEventCount || 0) + 1;
    });
  });
});

test('toggles favorite state and persists to localStorage', async ({ mount, page }) => {
  await mount(<FavoriteButton destinationId="bali" />);

  await expect(page.getByRole('button', { name: 'Add to wishlist' })).toBeVisible();
  await page.getByRole('button', { name: 'Add to wishlist' }).click();
  await expect(page.getByRole('button', { name: 'Remove from wishlist' })).toBeVisible();

  const favorites = await page.evaluate(() => JSON.parse(localStorage.getItem('travelvista_favorites') ?? '[]'));
  const eventCount = await page.evaluate(() => (window as Window & { __favoriteEventCount?: number }).__favoriteEventCount || 0);

  expect(favorites).toContain('bali');
  expect(eventCount).toBe(1);
});

test('uses stored favorite state on first render', async ({ mount, page }) => {
  await page.evaluate(() => {
    localStorage.setItem('travelvista_favorites', JSON.stringify(['bali']));
  });

  await mount(<FavoriteButton destinationId="bali" />);

  await expect(page.getByRole('button', { name: 'Remove from wishlist' })).toBeVisible();
});
