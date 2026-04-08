import { existsSync } from 'fs';
import { basename, join } from 'path';
import { test as base, expect, type Locator, type Page } from '@playwright/test';
import {
  hasVlmCredentials,
  isVlmEnabled,
  reviewVisualDiff,
  type VlmReviewResult,
} from '../utils/vlm-reviewer';

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
  name: string;
  target: Page | Locator;
  screenshotOptions?: {
    animations?: 'disabled' | 'allow';
    fullPage?: boolean;
    maxDiffPixelRatio?: number;
    maxDiffPixels?: number;
    mask?: Locator[];
    stylePath?: string | string[];
  };
  pageName: string;
  route?: string;
  viewport?: string;
  language?: string;
}

function isPage(target: Page | Locator): target is Page {
  return 'goto' in target;
}

export const test = base.extend<{
  assertScreenshotWithVlm: (options: ScreenshotWithVlmOptions) => Promise<void>;
}>({
  assertScreenshotWithVlm: async ({}, use, testInfo) => {
    const fn = async ({
      name,
      target,
      screenshotOptions = {},
      pageName,
      route,
      viewport,
      language,
    }: ScreenshotWithVlmOptions) => {
      try {
        if (isPage(target)) {
          await expect(target).toHaveScreenshot(name, screenshotOptions);
        } else {
          await expect(target).toHaveScreenshot(name, screenshotOptions);
        }

        vlmResults.push({
          testTitle: testInfo.title,
          screenshotName: name,
          pixelDiffFailed: false,
          action: 'passed_pixel',
        });
        return;
      } catch (pixelError) {
        if (!isVlmEnabled()) {
          vlmResults.push({
            testTitle: testInfo.title,
            screenshotName: name,
            pixelDiffFailed: true,
            action: 'failed',
          });
          throw pixelError;
        }

        if (!hasVlmCredentials()) {
          vlmResults.push({
            testTitle: testInfo.title,
            screenshotName: name,
            pixelDiffFailed: true,
            vlmError: 'Missing Azure OpenAI credentials',
            action: 'failed',
          });
          throw pixelError;
        }

        const baselinePath = testInfo.snapshotPath(name);
        const actualPath = join(testInfo.outputDir, `${basename(name, '.png')}-actual.png`);
        const diffPath = join(testInfo.outputDir, `${basename(name, '.png')}-diff.png`);

        if (!existsSync(baselinePath) || !existsSync(actualPath)) {
          vlmResults.push({
            testTitle: testInfo.title,
            screenshotName: name,
            pixelDiffFailed: true,
            vlmError: 'Screenshot files not found for VLM review',
            action: 'failed',
          });
          throw pixelError;
        }

        await testInfo.attach(`vlm-baseline-${name}`, { path: baselinePath, contentType: 'image/png' });
        await testInfo.attach(`vlm-actual-${name}`, { path: actualPath, contentType: 'image/png' });
        if (existsSync(diffPath)) {
          await testInfo.attach(`vlm-diff-${name}`, { path: diffPath, contentType: 'image/png' });
        }

        let vlmResult: VlmReviewResult;
        try {
          vlmResult = await reviewVisualDiff(baselinePath, actualPath, {
            pageName,
            route,
            viewport,
            language,
          });
        } catch (vlmError) {
          vlmResults.push({
            testTitle: testInfo.title,
            screenshotName: name,
            pixelDiffFailed: true,
            vlmError: String(vlmError),
            action: 'failed',
          });
          throw pixelError;
        }

        if (vlmResult.confidence < CONFIDENCE_THRESHOLD) {
          vlmResults.push({
            testTitle: testInfo.title,
            screenshotName: name,
            pixelDiffFailed: true,
            vlmResult,
            action: 'failed',
          });
          testInfo.annotations.push({
            type: 'vlm-low-confidence',
            description: `[${name}] ${vlmResult.description} (areas: ${vlmResult.areas.join(', ') || 'unknown'}) (changedProperties: ${vlmResult.changedProperties.join(', ') || 'unknown'}) (confidence: ${vlmResult.confidence})`,
          });
          throw pixelError;
        }

        if (vlmResult.recommendation === 'pass') {
          vlmResults.push({
            testTitle: testInfo.title,
            screenshotName: name,
            pixelDiffFailed: true,
            vlmResult,
            action: vlmResult.severity === 'none' ? 'passed_vlm' : 'warned_vlm',
          });
          testInfo.annotations.push({
            type: 'vlm-override',
            description: `[${name}] ${vlmResult.description} (areas: ${vlmResult.areas.join(', ') || 'none'}) (changedProperties: ${vlmResult.changedProperties.join(', ') || 'none'}) (confidence: ${vlmResult.confidence})`,
          });
          return;
        }

        if (vlmResult.recommendation === 'warn') {
          vlmResults.push({
            testTitle: testInfo.title,
            screenshotName: name,
            pixelDiffFailed: true,
            vlmResult,
            action: 'warned_vlm',
          });
          testInfo.annotations.push({
            type: 'vlm-warning',
            description: `[${name}] ${vlmResult.description} (areas: ${vlmResult.areas.join(', ') || 'none'}) (changedProperties: ${vlmResult.changedProperties.join(', ') || 'none'}) (confidence: ${vlmResult.confidence})`,
          });
          return;
        }

        vlmResults.push({
          testTitle: testInfo.title,
          screenshotName: name,
          pixelDiffFailed: true,
          vlmResult,
          action: 'failed',
        });
        testInfo.annotations.push({
          type: 'vlm-breaking',
          description: `[${name}] ${vlmResult.description} (areas: ${vlmResult.areas.join(', ') || 'none'}) (changedProperties: ${vlmResult.changedProperties.join(', ') || 'none'}) (confidence: ${vlmResult.confidence})`,
        });
        throw pixelError;
      }
    };

    await use(fn);
  },
});

export { expect };