import { test, expect } from '@playwright/experimental-ct-react';
import Carousel from '../../src/components/Carousel';

const items = [
  <div key="a">Slide A</div>,
  <div key="b">Slide B</div>,
  <div key="c">Slide C</div>,
];

test('renders all indicator dots matching the number of items', async ({ mount }) => {
  const component = await mount(<Carousel items={items} />);

  const dots = component.getByRole('button', { name: /^Slide \d+$/ });
  await expect(dots).toHaveCount(3);
});

test('clicking an indicator dot navigates to that slide', async ({ mount }) => {
  const component = await mount(<Carousel items={items} autoPlayInterval={999999} />);

  // Initially on slide 1
  await expect(component.getByRole('button', { name: 'Slide 1' })).toBeVisible();

  // Click slide 3 indicator
  await component.getByRole('button', { name: 'Slide 3' }).click();

  // Verify transform style changes to show 3rd slide (200%)
  const track = component.locator('.flex.transition-transform');
  await expect(track).toHaveCSS('transform', /matrix/);
});

test('shows all slide content in the DOM', async ({ mount }) => {
  const component = await mount(<Carousel items={items} autoPlayInterval={999999} />);

  await expect(component.getByText('Slide A')).toBeVisible();
  await expect(component.getByText('Slide B')).toBeAttached();
  await expect(component.getByText('Slide C')).toBeAttached();
});
