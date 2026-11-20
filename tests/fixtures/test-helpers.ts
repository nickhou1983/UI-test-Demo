import { expect, type Page } from '@playwright/test';
import { TRAVELVISTA_STORAGE_KEYS } from './test-utils';

export {
  disableAnimations,
  dismissDialogs,
  freezeTimers,
  preparePageForVisualTest,
  stabilize,
  triggerLazyAssets,
  waitForFontsAndImages,
  waitForImages,
} from './visual-helpers';

export interface CollectPageErrorsOptions {
  /** Also fail on `console.error` messages (default: true). */
  captureConsoleErrors?: boolean;
  /** Optional patterns of benign messages to ignore (e.g., missing favicon). */
  ignorePatterns?: RegExp[];
}

export interface PageErrorCollector {
  pageErrors: string[];
  consoleErrors: string[];
  /** Returns combined runtime errors observed during the test. */
  getAllErrors: () => string[];
  /** Zero-tolerance assertion failing the test if any unexpected error occurred. */
  assertNoErrors: () => void;
}

const DEFAULT_IGNORE_PATTERNS: RegExp[] = [/favicon\.ico/i];

/**
 * Attaches `pageerror` and `console.error` listeners to enforce zero-tolerance
 * runtime exception gating across E2E user journeys.
 */
export function collectPageErrors(
  page: Page,
  options: CollectPageErrorsOptions = {},
): PageErrorCollector {
  const { captureConsoleErrors = true, ignorePatterns = DEFAULT_IGNORE_PATTERNS } = options;
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];

  const isIgnored = (message: string) =>
    ignorePatterns.some((pattern) => pattern.test(message));

  page.on('pageerror', (error) => {
    const formatted = `[pageerror] ${error.stack || error.message}`;
    if (!isIgnored(formatted)) {
      pageErrors.push(formatted);
    }
  });

  if (captureConsoleErrors) {
    page.on('console', (msg) => {
      if (msg.type() !== 'error') return;
      const text = msg.text();
      if (!isIgnored(text)) {
        consoleErrors.push(`[console.error] ${text}`);
      }
    });
  }

  const getAllErrors = () => [...pageErrors, ...consoleErrors];

  return {
    pageErrors,
    consoleErrors,
    getAllErrors,
    assertNoErrors: () => {
      expect(
        getAllErrors(),
        'Expected zero uncaught pageerror or console.error exceptions during E2E flow',
      ).toEqual([]);
    },
  };
}

/**
 * Isolates TravelVista persistent storage once per test context while allowing
 * multi-page flows within the same test to preserve state across navigations.
 */
export async function isolateClientStorage(
  page: Page,
  keys: readonly string[] = TRAVELVISTA_STORAGE_KEYS,
): Promise<void> {
  await page.addInitScript((storageKeys) => {
    const marker = '__travelvista_storage_isolated__';
    if (!window.name.includes(marker)) {
      for (const key of storageKeys) {
        localStorage.removeItem(key);
      }
      sessionStorage.clear();
      window.name = window.name ? `${window.name}:${marker}` : marker;
    }
  }, [...keys]);
}
