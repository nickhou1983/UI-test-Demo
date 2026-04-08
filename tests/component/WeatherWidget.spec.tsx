import { test, expect } from '@playwright/experimental-ct-react';
import WeatherWidget from '../../src/components/WeatherWidget';

test('renders current weather and forecast for a supported destination', async ({ mount }) => {
  const component = await mount(<WeatherWidget destinationId="bali" />, {
    hooksConfig: { language: 'zh' },
  });

  await expect(component.getByRole('heading', { level: 3, name: /天气预报/ })).toBeVisible();
  await expect(component.getByText('30°C')).toBeVisible();
  await expect(component.getByText('5日预报')).toBeVisible();
  await expect(component.locator('.grid.grid-cols-5 > div')).toHaveCount(5);
});

test('renders nothing for an unsupported destination', async ({ mount }) => {
  const component = await mount(<WeatherWidget destinationId="unknown-destination" />, {
    hooksConfig: { language: 'zh' },
  });

  await expect(component).toBeEmpty();
});