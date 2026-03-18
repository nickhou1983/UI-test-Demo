import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getFavorites } from '../utils/favorites';
import { destinations } from '../data/destinations';
import DestinationCard from '../components/DestinationCard';

export default function FavoritesPage() {
  const { t } = useTranslation();
  const [favoriteIds, setFavoriteIds] = useState(getFavorites);

  useEffect(() => {
    const handler = () => setFavoriteIds(getFavorites());
    window.addEventListener('favorites-changed', handler);
    return () => window.removeEventListener('favorites-changed', handler);
  }, []);

  const favoriteDests = destinations.filter((d) => favoriteIds.includes(d.id));

  return (
    <main className="bg-sky-50 min-h-screen">
      <section className="bg-blue-800 text-white py-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('favorites.title')}</h1>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {favoriteDests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteDests.map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-slate-400 mb-6">{t('favorites.empty')}</p>
            <Link
              to="/destinations"
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg transition inline-block"
            >
              {t('favorites.explore')}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
