/**
 * VLM-Enhanced Visual Test Fixture
 *
 * Extends Playwright's test fixture with a hybrid visual regression strategy:
 * 1. Run native toHaveScreenshot() pixel comparison
 * 2. If pixel diff fails AND VLM_REVIEW=true → send to Azure OpenAI GPT-4o for semantic review
 * 3. VLM judges cosmetic (confidence ≥ 0.7) → WARN, test passes with annotation
 * 4. VLM judges breaking OR low confidence → test fails as usual
 */

import { test as base, expect, type Page, type Locator } from '@playwright/test';
import { existsSync } from 'fs';
import { join, basename } from 'path';
import {
  reviewVisualDiff,
  isVlmEnabled,
  hasVlmCredentials,
  type VlmReviewResult,
} from '../utils/vlm-reviewer';

/** Collected VLM review results, exported for the reporter */
export const vlmResults: Array<{
  testTitle: string;
  screenshotName: string;
  pixelDiffFailed: boolean;
  vlmResult?: VlmReviewResult;
  vlmError?: string;
  action: 'skipped' | 'passed_pixel' | 'passed_vlm' | 'warned_vlm' | 'failed';
}> = [];

const CONFIDENCE_THRESHOLD = Number(process.env.VLM_CONFIDENCE_THRESHOLD) || 0.7;

interface ScreenshotWithVlmOptions {
  /** Screenshot name (e.g., 'home-main.png') */
  name: string;
  /** Page or locator to screenshot */
  target: Page | Locator;
  /** Standard Playwright screenshot options */
  screenshotOptions?: {
    animations?: 'disabled' | 'allow';
    fullPage?: boolean;
    maxDiffPixelRatio?: number;
    maxDiffPixels?: number;
    mask?: Locator[];
    stylePath?: string | string[];
  };
  /** VLM context */
  pageName: string;
  route?: string;
  viewport?: string;
  language?: string;
}

/**
 * Perform hybrid visual comparison: pixel-first, VLM-fallback.
 *
 * Usage in tests:
 * ```ts
 * import { test } from '../fixtures/visual-test';
 *
 * test('home page', async ({ page, assertScreenshotWithVlm }) => {
 *   await page.goto('./');
 *   await assertScreenshotWithVlm({
 *     name: 'home-main.png',
 *     target: page.getByRole('main'),
 *     screenshotOptions: { animations: 'disabled', maxDiffPixelRatio: 0.01 },
 *     pageName: 'Home Page',
 *     route: '/',
 *   });
 * });
 * ```
 */
export const test = base.extend<{
  assertScreenshotWithVlm: (options: ScreenshotWithVlmOptions) => Promise<void>;
}>({
  // eslint-disable-next-line no-empty-pattern
  assertScreenshotWithVlm: async ({}, use, testInfo) => {
    const fn = async (options: ScreenshotWithVlmOptions) => {
      const { name, target, screenshotOptions = {}, pageName, route, viewport, language } = options;

      try {
        // Step 1: Try native pixel comparison
        if ('getByRole' in target) {
          // target is Page
          await expect(target as Page).toHaveScreenshot(name, screenshotOptions);
        } else {
          // target is Locator
          await expect(target as Locator).toHaveScreenshot(name, screenshotOptions);
        }

        // Pixel comparison passed — no VLM needed
        vlmResults.push({
          testTitle: testInfo.title,
          screenshotName: name,
          pixelDiffFailed: false,
          action: 'passed_pixel',
        });
        return;
      } catch (pixelError) {
        // Step 2: Pixel comparison failed — should we invoke VLM?
        if (!isVlmEnabled()) {
          vlmResults.push({
            testTitle: testInfo.title,
            screenshotName: name,
            pixelDiffFailed: true,
            action: 'failed',
          });
          throw pixelError; // Re-throw original error
        }

        if (!hasVlmCredentials()) {
          console.warn('[VLM] VLM_REVIEW=true but Azure OpenAI credentials not found. Falling back to pixel diff.');
          vlmResults.push({
            testTitle: testInfo.title,
            screenshotName: name,
            pixelDiffFailed: true,
            vlmError: 'Missing Azure OpenAI credentials',
            action: 'failed',
          });
          throw pixelError;
        }

        // Step 3: Find the baseline and actual screenshot files
        // Use testInfo.snapshotPath() to correctly resolve project name + platform suffix
        const baselinePath = testInfo.snapshotPath(name);

        // Actual screenshot is in test results output dir
        const actualName = basename(name, '.png') + '-actual.png';
        const actualPath = join(testInfo.outputDir, actualName);

        if (!existsSync(baselinePath) || !existsSync(actualPath)) {
          console.warn(`[VLM] Cannot find baseline (${baselinePath}) or actual (${actualPath}). Falling back to pixel diff.`);
          vlmResults.push({
            testTitle: testInfo.title,
            screenshotName: name,
            pixelDiffFailed: true,
            vlmError: `Screenshot files not found: baseline=${existsSync(baselinePath)}, actual=${existsSync(actualPath)}`,
            action: 'failed',
          });
          throw pixelError;
        }

        // Step 4: Call VLM for semantic review
        console.log(`[VLM] Pixel diff failed for "${name}". Sending to Azure OpenAI GPT-4o for semantic review...`);

        let vlmResult: VlmReviewResult;
        try {
          vlmResult = await reviewVisualDiff(baselinePath, actualPath, {
            pageName,
            route,
            viewport,
            language,
          });
        } catch (vlmError) {
          console.warn(`[VLM] API call failed: ${vlmError}. Falling back to pixel diff result.`);
          vlmResults.push({
            testTitle: testInfo.title,
            screenshotName: name,
            pixelDiffFailed: true,
            vlmError: String(vlmError),
            action: 'failed',
          });
          throw pixelError;
        }

        console.log(`[VLM] Verdict: severity=${vlmResult.severity}, confidence=${vlmResult.confidence}, recommendation=${vlmResult.recommendation}`);
        console.log(`[VLM] Description: ${vlmResult.description}`);

        // Step 5: Apply confidence threshold
        if (vlmResult.confidence < CONFIDENCE_THRESHOLD) {
          console.warn(`[VLM] Low confidence (${vlmResult.confidence} < ${CONFIDENCE_THRESHOLD}). Treating as failure for safety.`);
          vlmResults.push({
            testTitle: testInfo.title,
            screenshotName: name,
            pixelDiffFailed: true,
            vlmResult,
            action: 'failed',
          });
          testInfo.annotations.push({
            type: 'vlm-low-confidence',
            description: `VLM confidence ${vlmResult.confidence} < threshold ${CONFIDENCE_THRESHOLD}: ${vlmResult.description}`,
          });
          throw pixelError;
        }

        // Step 6: Act on VLM recommendation
        if (vlmResult.recommendation === 'pass') {
          // Cosmetic or none — pass the test with a warning annotation
          vlmResults.push({
            testTitle: testInfo.title,
            screenshotName: name,
            pixelDiffFailed: true,
            vlmResult,
            action: vlmResult.severity === 'none' ? 'passed_vlm' : 'warned_vlm',
          });
          testInfo.annotations.push({
            type: 'vlm-override',
            description: `[VLM ${vlmResult.severity}] ${vlmResult.description} (confidence: ${vlmResult.confidence})`,
          });
          console.log(`[VLM] ✅ Pixel diff overridden — VLM classified as "${vlmResult.severity}". Test passes with annotation.`);
          return; // Test passes
        }

        if (vlmResult.recommendation === 'warn') {
          // Minor — pass with warning
          vlmResults.push({
            testTitle: testInfo.title,
            screenshotName: name,
            pixelDiffFailed: true,
            vlmResult,
            action: 'warned_vlm',
          });
          testInfo.annotations.push({
            type: 'vlm-warning',
            description: `[VLM minor] ${vlmResult.description} (confidence: ${vlmResult.confidence})`,
          });
          console.log(`[VLM] ⚠️ VLM classified as "minor". Test passes with warning.`);
          return; // Test passes with warning
        }

        // Breaking — test fails
        vlmResults.push({
          testTitle: testInfo.title,
          screenshotName: name,
          pixelDiffFailed: true,
          vlmResult,
          action: 'failed',
        });
        testInfo.annotations.push({
          type: 'vlm-breaking',
          description: `[VLM breaking] ${vlmResult.description} (areas: ${vlmResult.areas.join(', ')})`,
        });
        throw pixelError; // Re-throw — this is a real regression
      }
    };

    await use(fn);
  },
});

export { expect };
