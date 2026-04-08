import { test, expect } from '@playwright/experimental-ct-react';
import ScrollToTop from '../../src/components/ScrollToTop';

test('renders a back-to-top button with correct aria-label', async ({ mount, page }) => {
  await mount(<ScrollToTop />);

  // The button uses `fixed` positioning, so look on page level
  await expect(page.getByRole('button', { name: 'Back to top' })).toBeAttached();
});

test('button has opacity-0 class when not scrolled', async ({ mount, page }) => {
  await mount(<ScrollToTop />);

  const btn = page.getByRole('button', { name: 'Back to top' });
  await expect(btn).toHaveClass(/opacity-0/);
});
