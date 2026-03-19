import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <main className="bg-orange-50 min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-8xl font-bold text-orange-800 mb-4">404</h1>
        <p className="text-xl text-slate-500 mb-8">{t('notFound.desc')}</p>
        <Link
          to="/"
          className="bg-orange-700 hover:bg-orange-800 text-white px-8 py-3 rounded-lg transition inline-block"
        >
          {t('notFound.backHome')}
        </Link>
      </div>
    </main>
  );
}
