import { test, expect } from '@playwright/experimental-ct-react';
import Footer from '../../src/components/Footer';

test('renders brand, navigation links, and social media in Chinese', async ({ mount }) => {
  const component = await mount(<Footer />, {
    hooksConfig: { language: 'zh', route: '/' },
  });

  await expect(component.getByRole('heading', { name: 'TravelVista' })).toBeVisible();
  await expect(component.getByRole('link', { name: '首页' })).toBeVisible();
  await expect(component.getByRole('link', { name: '目的地' })).toBeVisible();
  await expect(component.getByRole('link', { name: '关于我们' })).toBeVisible();
});

test('renders footer content in English when language is en', async ({ mount }) => {
  const component = await mount(<Footer />, {
    hooksConfig: { language: 'en', route: '/' },
  });

  await expect(component.getByRole('link', { name: 'Home' })).toBeVisible();
  await expect(component.getByRole('link', { name: 'Destinations' })).toBeVisible();
  await expect(component.getByRole('link', { name: 'About' })).toBeVisible();
});

test('footer links have correct href attributes', async ({ mount }) => {
  const component = await mount(<Footer />, {
    hooksConfig: { language: 'zh', route: '/' },
  });

  await expect(component.getByRole('link', { name: '首页' })).toHaveAttribute('href', '/');
  await expect(component.getByRole('link', { name: '目的地' })).toHaveAttribute('href', '/destinations');
  await expect(component.getByRole('link', { name: '关于我们' })).toHaveAttribute('href', '/about');
});
