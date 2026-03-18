import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../src/i18n';

/**
 * Test wrapper providing Router + i18n context for component tests.
 */
export function TestWrapper({
  children,
  initialEntries = ['/'],
}: {
  children: React.ReactNode;
  initialEntries?: string[];
}) {
  return (
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </I18nextProvider>
  );
}
