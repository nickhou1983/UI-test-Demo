import { test, expect } from '@playwright/experimental-ct-react';
import Navbar from '../../src/components/Navbar';

test('renders all navigation links in Chinese by default', async ({ mount }) => {
  const component = await mount(<Navbar />, {
    hooksConfig: { language: 'zh', route: '/' },
  });

  await expect(component.getByRole('link', { name: '首页' })).toBeVisible();
  await expect(component.getByRole('link', { name: '目的地' })).toBeVisible();
  await expect(component.getByRole('link', { name: '心愿单' })).toBeVisible();
  await expect(component.getByRole('link', { name: '行程规划' })).toBeVisible();
  await expect(component.getByRole('link', { name: '关于我们' })).toBeVisible();
  await expect(component.getByRole('link', { name: 'TravelVista' })).toBeVisible();
});

test('switches language when language button is clicked', async ({ mount }) => {
  const component = await mount(<Navbar />, {
    hooksConfig: { language: 'zh', route: '/' },
  });

  await component.getByRole('button', { name: 'EN' }).click();
  await expect(component.getByRole('link', { name: 'Home' })).toBeVisible();
  await expect(component.getByRole('link', { name: 'Destinations' })).toBeVisible();
  await expect(component.getByRole('link', { name: 'Wishlist' })).toBeVisible();
});

test('renders nav links in English when language is en', async ({ mount }) => {
  const component = await mount(<Navbar />, {
    hooksConfig: { language: 'en', route: '/' },
  });

  await expect(component.getByRole('link', { name: 'Home' })).toBeVisible();
  await expect(component.getByRole('link', { name: 'Destinations' })).toBeVisible();
  await expect(component.getByRole('button', { name: '中文' })).toBeVisible();
});

test('mobile hamburger button toggles menu visibility', async ({ mount, page }) => {
  await page.setViewportSize({ width: 375, height: 812 });

  const component = await mount(<Navbar />, {
    hooksConfig: { language: 'zh', route: '/' },
  });

  const toggleBtn = component.getByRole('button', { name: 'Toggle menu' });
  await expect(toggleBtn).toBeVisible();

  // Menu should be collapsed initially (max-h-0)
  await toggleBtn.click();

  // After clicking, mobile links should appear
  const mobileMenu = component.locator('.md\\:hidden').last();
  await expect(mobileMenu.getByRole('link', { name: '目的地' })).toBeVisible();
});
