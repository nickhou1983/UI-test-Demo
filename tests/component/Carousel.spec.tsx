import { test, expect } from '@playwright/experimental-ct-react';
import Carousel from '../../src/components/Carousel';

test('renders all slide items', async ({ mount }) => {
  const component = await mount(
    <Carousel items={[<div key="a">Slide A</div>, <div key="b">Slide B</div>, <div key="c">Slide C</div>]} />
  );
  await expect(component.getByText('Slide A')).toBeVisible();
  await expect(component.getByText('Slide B')).toBeAttached();
  await expect(component.getByText('Slide C')).toBeAttached();
});

test('renders navigation dots matching item count', async ({ mount }) => {
  const component = await mount(
    <Carousel items={[<div key="1">One</div>, <div key="2">Two</div>, <div key="3">Three</div>]} />
  );
  const dots = component.getByRole('button', { name: /Slide/ });
  await expect(dots).toHaveCount(3);
});

test('clicking dot navigates to slide', async ({ mount }) => {
  const component = await mount(
    <Carousel items={[<div key="1">First</div>, <div key="2">Second</div>, <div key="3">Third</div>]} />
  );
  // Initially on first slide
  const container = component.locator('.flex.transition-transform');
  await expect(container).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');

  // Click second dot
  await component.getByRole('button', { name: 'Slide 2' }).click();
  // Transform should change (slide moved)
  await expect(container).not.toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
});

test('first dot is highlighted initially', async ({ mount }) => {
  const component = await mount(
    <Carousel items={[<div key="1">A</div>, <div key="2">B</div>]} />
  );
  const dot1 = component.getByRole('button', { name: 'Slide 1' });
  await expect(dot1).toHaveClass(/bg-blue-800/);
});

test('renders single item without error', async ({ mount }) => {
  const component = await mount(
    <Carousel items={[<div key="solo">Solo</div>]} />
  );
  await expect(component.getByText('Solo')).toBeVisible();
  await expect(component.getByRole('button', { name: 'Slide 1' })).toHaveCount(1);
});

test('auto-plays to next slide', async ({ mount }) => {
  const component = await mount(
    <Carousel
      items={[<div key="1">Alpha</div>, <div key="2">Beta</div>]}
      autoPlayInterval={500}
    />
  );
  const dot2 = component.getByRole('button', { name: 'Slide 2' });
  // Wait for auto-play to advance
  await expect(dot2).toHaveClass(/bg-blue-800/, { timeout: 2000 });
});
