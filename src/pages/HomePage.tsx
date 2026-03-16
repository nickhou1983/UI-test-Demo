import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchBar from '../components/SearchBar';
import DestinationCard from '../components/DestinationCard';
import Carousel from '../components/Carousel';
import { homepageDestinations, categories } from '../data/destinations';
import { reviews } from '../data/reviews';

export default function HomePage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return homepageDestinations;
    const kw = search.toLowerCase();
    return homepageDestinations.filter((d) => {
      const name = t(d.nameKey).toLowerCase();
      const desc = t(d.descKey).toLowerCase();
      return name.includes(kw) || desc.includes(kw);
    });
  }, [search, t]);

  const reviewSlides = reviews.map((r) => (
    <div key={r.authorKey} className="bg-white rounded-xl shadow-md p-8 text-center">
      <p className="text-slate-600 italic mb-4">"{t(r.quoteKey)}"</p>
      <p className="font-bold text-blue-800">{t(r.authorKey)}</p>
      <p className="text-sm text-slate-400">{t(r.roleKey)}</p>
    </div>
  ));

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[70vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
        <img
          src="/images/hero/hero-main.jpg"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 text-center text-white px-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('hero.title')}</h1>
          <p className="text-lg md:text-xl mb-8 text-blue-100">{t('hero.subtitle')}</p>
          <div className="max-w-xl mx-auto">
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-800 text-center mb-2">{t('home.popular')}</h2>
        <p className="text-slate-500 text-center mb-10">{t('home.popular.subtitle')}</p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-400 py-12">{t('home.noResult')}</p>
        )}

        <div className="text-center mt-10">
          <Link
            to="/destinations"
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-full transition"
          >
            {t('home.viewAll')}
          </Link>
        </div>
      </section>

      {/* Travel Themes */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 text-center mb-2">{t('home.themes')}</h2>
          <p className="text-slate-500 text-center mb-10">{t('home.themes.subtitle')}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.type}
                to={`/destinations?type=${cat.type}`}
                className="group relative rounded-xl overflow-hidden aspect-square"
              >
                <img
                  src={cat.image}
                  alt={t(cat.nameKey)}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-bold text-lg">{t(cat.nameKey)}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-800 text-center mb-2">{t('home.reviews')}</h2>
        <p className="text-slate-500 text-center mb-10">{t('home.reviews.subtitle')}</p>
        <Carousel items={reviewSlides} />
      </section>
    </main>
  );
}
