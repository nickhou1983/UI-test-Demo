import type { Page } from '@playwright/test';

export async function disableAnimations(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        caret-color: transparent !important;
      }
    `,
  });
}

export async function waitForImages(page: Page): Promise<void> {
  await page.waitForFunction(() =>
    Array.from(document.images)
      .filter((image) => Boolean(image.currentSrc || image.getAttribute('src')))
      .every((image) => image.complete),
  );
}

export function dismissDialogs(page: Page): void {
  page.on('dialog', (dialog) => dialog.dismiss());
}

export async function stabilize(page: Page): Promise<void> {
  dismissDialogs(page);
  await disableAnimations(page);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => window.scrollTo(0, 0));
  await waitForImages(page);
}