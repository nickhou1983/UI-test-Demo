import type { Page } from '@playwright/test';

/**
 * Step 2 helper (pre-navigation): freeze auto-advancing intervals such as
 * carousels or testimonial rotators before page scripts execute.
 */
export async function freezeTimers(page: Page): Promise<void> {
  await page.addInitScript(() => {
    window.setInterval = (() => 0) as unknown as typeof window.setInterval;
    window.clearInterval = (() => undefined) as unknown as typeof window.clearInterval;
  });
}

/**
 * Step 3: inject global zero-duration CSS to disable animations, transitions,
 * smooth scrolling, and blinking text cursors.
 */
export async function disableAnimations(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        caret-color: transparent !important;
        scroll-behavior: auto !important;
      }
    `,
  });
}

/**
 * Step 4: eagerly promote lazy-loaded images and scroll through the document
 * so intersection/scroll-triggered assets begin loading, then reset to top.
 */
export async function triggerLazyAssets(page: Page): Promise<void> {
  await page.evaluate(() => {
    for (const img of Array.from(document.querySelectorAll('img[loading="lazy"]'))) {
      img.setAttribute('loading', 'eager');
    }
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => window.scrollTo(0, 0));
}

/**
 * Step 5: wait for web fonts (`document.fonts.ready`) and every visible image
 * to finish decoding (`img.complete`).
 */
export async function waitForFontsAndImages(page: Page): Promise<void> {
  await page.evaluate(async () => {
    if ('fonts' in document) {
      await document.fonts.ready;
    }
  });
  await page.waitForFunction(() =>
    Array.from(document.images)
      .filter((image) => Boolean(image.currentSrc || image.getAttribute('src')))
      .every((image) => image.complete),
  );
}

export async function waitForImages(page: Page): Promise<void> {
  await waitForFontsAndImages(page);
}

export function dismissDialogs(page: Page): void {
  page.on('dialog', (dialog) => dialog.dismiss());
}

/**
 * Five-step deterministic visual stabilization pipeline:
 * 1. DOM & hydration ready (`domcontentloaded` + `networkidle` + RAF settle)
 * 2. Dialog guard & timer stabilization
 * 3. Global animation/transition suppression CSS
 * 4. Lazy-image eager promotion & full-page scroll pass
 * 5. Web font (`document.fonts.ready`) & image decode completion
 */
export async function preparePageForVisualTest(page: Page): Promise<void> {
  dismissDialogs(page);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
  await disableAnimations(page);
  await triggerLazyAssets(page);
  await waitForFontsAndImages(page);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
}

export async function stabilize(page: Page): Promise<void> {
  await preparePageForVisualTest(page);
}