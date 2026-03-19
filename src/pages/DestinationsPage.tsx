import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FilterBar from '../components/FilterBar';
import DestinationCard from '../components/DestinationCard';
import { destinations } from '../data/destinations';

export default function DestinationsPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const [keyword, setKeyword] = useState('');
  const [region, setRegion] = useState(searchParams.get('region') ?? '');
  const [type, setType] = useState(searchParams.get('type') ?? '');
  const [sortBy, setSortBy] = useState('');

  const filtered = useMemo(() => {
    const kw = keyword.toLowerCase();
    const result = destinations.filter((d) => {
      const matchKeyword = !kw || t(d.nameKey).toLowerCase().includes(kw) || t(d.descKey).toLowerCase().includes(kw);
      const matchRegion = !region || d.region === region;
      const matchType = !type || d.type === type;
      return matchKeyword && matchRegion && matchType;
    });
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name') {
      result.sort((a, b) => t(a.nameKey).localeCompare(t(b.nameKey)));
    }
    return result;
  }, [keyword, region, type, sortBy, t]);

  return (
    <main className="bg-orange-50 min-h-screen">
      {/* Page header */}
      <section className="bg-orange-800 text-white py-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('destinations.title')}</h1>
        <p className="text-orange-200">{t('destinations.subtitle')}</p>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <FilterBar
          keyword={keyword}
          region={region}
          type={type}
          sortBy={sortBy}
          onKeywordChange={setKeyword}
          onRegionChange={setRegion}
          onTypeChange={setType}
          onSortChange={setSortBy}
        />

        {/* Count */}
        <p className="text-slate-500 text-sm mt-6 mb-4">
          {t('destinations.count', { count: filtered.length })}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-400 py-16">{t('destinations.noResult')}</p>
        )}
      </div>
    </main>
  );
}
