import { test as base, expect } from '@playwright/test';
import {
  collectPageErrors,
  isolateClientStorage,
  type PageErrorCollector,
} from './test-helpers';

export interface E2eFixtures {
  pageErrors: PageErrorCollector;
  storageIsolation: void;
}

/**
 * Shared E2E test fixture enforcing:
 * 1. Automatic storage isolation (`travelvista_favorites`, `travelvista_trips`)
 *    before the first navigation of every test.
 * 2. Automatic `collectPageErrors` zero-tolerance assertion after every test.
 */
export const test = base.extend<E2eFixtures>({
  storageIsolation: [
    async ({ page }, provide) => {
      await isolateClientStorage(page);
      await provide();
    },
    { auto: true },
  ],

  pageErrors: [
    async ({ page }, provide) => {
      const collector = collectPageErrors(page);
      await provide(collector);
      collector.assertNoErrors();
    },
    { auto: true },
  ],
});

export { expect };
