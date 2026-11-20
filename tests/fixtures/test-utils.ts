import { createElement, type ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import type { Page } from '@playwright/test';
import i18n from '../../src/i18n';

export interface TestWrapperProps {
  children: ReactNode;
  route?: string;
  language?: 'zh' | 'en';
}

export const TRAVELVISTA_STORAGE_KEYS = [
  'travelvista_favorites',
  'travelvista_trips',
] as const;

/**
 * Provider wrapper for isolated React component mounting (Router + i18n).
 * Owned by the `playwright-ct` skill (Fixture Gate).
 */
export function TestWrapper({
  children,
  route = '/',
  language = 'zh',
}: TestWrapperProps) {
  if (i18n.language !== language) {
    void i18n.changeLanguage(language);
  }

  return createElement(
    I18nextProvider,
    { i18n },
    createElement(MemoryRouter, { initialEntries: [route] }, children),
  );
}

/**
 * Clears persistent TravelVista client storage inside a component test page.
 */
export async function resetComponentStorage(page: Page): Promise<void> {
  await page.evaluate((keys) => {
    for (const key of keys) {
      localStorage.removeItem(key);
    }
    sessionStorage.clear();
  }, [...TRAVELVISTA_STORAGE_KEYS]);
}
