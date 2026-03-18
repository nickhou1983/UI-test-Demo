import type { Page } from '@playwright/test';
import { test, expect } from '../fixtures/visual-test';

const FAVORITES_KEY = 'travelvista_favorites';
const TRIPS_KEY = 'travelvista_trips';

const seededTrips = [
  {
    id: 'visual-trip',
    name: '巴厘岛海风假期',
    destinationId: 'bali',
    days: [
      {
        dayNumber: 1,
        activities: [
          { id: 'act-1', customName: '乌布皇宫漫步', time: '09:00', notes: '穿轻便服装' },
          { id: 'act-2', customName: '梯田下午茶', time: '14:30', notes: '拍照取景点在山脊' },
        ],
      },
      {
        dayNumber: 2,
        activities: [{ id: 'act-3', customName: '海神庙日落', time: '17:45', notes: '提前半小时出发' }],
      },
      {
        dayNumber: 3,
        activities: [],
      },
    ],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

type VisualScreenshotOptions = {
  name: string;
  target: Page;
  screenshotOptions: {
    animations: 'disabled';
    fullPage: true;
    maxDiffPixelRatio: number;
  };
  pageName: string;
  route: string;
};

type AssertScreenshotWithVlm = (options: VisualScreenshotOptions) => Promise<void>;

async function seedLocalStorage(page: Page, seed: Record<string, unknown>) {
  await page.addInitScript((entries: Record<string, unknown>) => {
    localStorage.clear();
    for (const [key, value] of Object.entries(entries)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, seed);
}

async function openAndCapture(
  page: Page,
  assertScreenshotWithVlm: AssertScreenshotWithVlm,
  {
    route,
    name,
    pageName,
    ready,
    seed,
  }: {
    route: string;
    name: string;
    pageName: string;
    ready: () => Promise<void>;
    seed?: Record<string, unknown>;
  }
) {
  if (seed) {
    await seedLocalStorage(page, seed);
  }

  await page.goto(route);
  await page.waitForLoadState('networkidle');
  await ready();

  await assertScreenshotWithVlm({
    name,
    target: page,
    screenshotOptions: {
      animations: 'disabled',
      fullPage: true,
      maxDiffPixelRatio: 0.0005,
    },
    pageName,
    route,
  });
}

test.describe('Visual Regression', () => {
  test('home page baseline', async ({ page, assertScreenshotWithVlm }) => {
    await openAndCapture(page, assertScreenshotWithVlm, {
      route: './',
      name: 'home-page.png',
      pageName: 'Home Page',
      ready: async () => {
        await expect(page.getByRole('heading', { name: '探索世界，发现美好' })).toBeVisible();
      },
    });
    // Hero section screenshot — catches title text changes
    await expect(page.locator('section').first()).toHaveScreenshot('home-hero.png', {
      animations: 'disabled',
      maxDiffPixels: 100,
    });
  });

  test('destinations page baseline', async ({ page, assertScreenshotWithVlm }) => {
    await openAndCapture(page, assertScreenshotWithVlm, {
      route: './destinations',
      name: 'destinations-page.png',
      pageName: 'Destinations Page',
      ready: async () => {
        await expect(page.getByRole('heading', { name: '探索目的地' })).toBeVisible();
      },
    });
    await expect(page.locator('section').first()).toHaveScreenshot('destinations-hero.png', {
      animations: 'disabled',
      maxDiffPixels: 100,
    });
  });

  test('destination detail page baseline', async ({ page, assertScreenshotWithVlm }) => {
    await openAndCapture(page, assertScreenshotWithVlm, {
      route: './destinations/bali',
      name: 'destination-detail-bali.png',
      pageName: 'Destination Detail - Bali',
      ready: async () => {
        await expect(page.getByRole('heading', { name: '巴厘岛' })).toBeVisible();
      },
    });
    await expect(page.locator('section').first()).toHaveScreenshot('destination-detail-hero.png', {
      animations: 'disabled',
      maxDiffPixels: 100,
    });
  });

  test('about page baseline', async ({ page, assertScreenshotWithVlm }) => {
    await openAndCapture(page, assertScreenshotWithVlm, {
      route: './about',
      name: 'about-page.png',
      pageName: 'About Page',
      ready: async () => {
        await expect(page.getByRole('heading', { name: '关于本站' }).first()).toBeVisible();
      },
    });
    // Hero section screenshot — prevents title text dilution in full-page shot
    await expect(page.locator('section').first()).toHaveScreenshot('about-hero.png', {
      animations: 'disabled',
      maxDiffPixels: 100,
    });
  });

  test('favorites page baseline', async ({ page, assertScreenshotWithVlm }) => {
    await openAndCapture(page, assertScreenshotWithVlm, {
      route: './favorites',
      name: 'favorites-page.png',
      pageName: 'Favorites Page',
      seed: {
        [FAVORITES_KEY]: ['bali', 'paris', 'kyoto'],
      },
      ready: async () => {
        await expect(page.getByRole('link', { name: '巴厘岛' })).toBeVisible();
      },
    });
  });

  test('trip planner page baseline', async ({ page, assertScreenshotWithVlm }) => {
    await openAndCapture(page, assertScreenshotWithVlm, {
      route: './trips',
      name: 'trip-planner-page.png',
      pageName: 'Trip Planner Page',
      seed: {
        [TRIPS_KEY]: seededTrips,
      },
      ready: async () => {
        await expect(page.getByText('巴厘岛海风假期')).toBeVisible();
      },
    });
  });

  test('trip edit page baseline', async ({ page, assertScreenshotWithVlm }) => {
    await openAndCapture(page, assertScreenshotWithVlm, {
      route: './trips/visual-trip',
      name: 'trip-edit-page.png',
      pageName: 'Trip Edit Page',
      seed: {
        [TRIPS_KEY]: seededTrips,
      },
      ready: async () => {
        await expect(page.locator('input[value="巴厘岛海风假期"]')).toBeVisible();
      },
    });
  });

  test('not found page baseline', async ({ page, assertScreenshotWithVlm }) => {
    await openAndCapture(page, assertScreenshotWithVlm, {
      route: './missing-route',
      name: 'not-found-page.png',
      pageName: 'Not Found Page',
      ready: async () => {
        await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
      },
    });
  });
});