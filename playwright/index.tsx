import '../src/index.css';
import '../src/i18n';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { beforeMount } from '@playwright/experimental-ct-react/hooks';
import i18n from '../src/i18n';

interface HooksConfig {
	route?: string;
	language?: 'zh' | 'en';
}

beforeMount<HooksConfig>(async ({ App, hooksConfig }) => {
	await i18n.changeLanguage(hooksConfig?.language ?? 'zh');

	return (
		<I18nextProvider i18n={i18n}>
			<MemoryRouter initialEntries={[hooksConfig?.route ?? '/']}>
				<App />
			</MemoryRouter>
		</I18nextProvider>
	);
});
