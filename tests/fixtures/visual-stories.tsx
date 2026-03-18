import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Layout from '../../src/components/Layout';
import i18n from '../../src/i18n';

const widthClasses = {
  120: 'w-[120px]',
  420: 'w-[420px]',
  560: 'w-[560px]',
  880: 'w-[880px]',
  1200: 'w-[1200px]',
} as const;

export function VisualFrame({ children, width = 1200 }: { children: React.ReactNode; width?: keyof typeof widthClasses }) {
  return <div className={`bg-sky-100 p-6 ${widthClasses[width]}`}>{children}</div>;
}

export function LayoutVisualStory() {
  return (
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />}>
            <Route
              path="/"
              element={(
                <main className="min-h-[420px] bg-white px-8 py-12">
                  <h1 className="text-3xl font-bold text-blue-800">布局内容区</h1>
                  <p className="mt-4 text-slate-500">用于生成 Layout 组件的稳定基线截图。</p>
                </main>
              )}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    </I18nextProvider>
  );
}