import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDestinationDetail, destinations } from '../data/destinations';
import DestinationCard from '../components/DestinationCard';
import FavoriteButton from '../components/FavoriteButton';
import WeatherWidget from '../components/WeatherWidget';

export default function DestinationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const detail = id ? getDestinationDetail(id) : undefined;

  if (!detail) {
    return (
      <main className="bg-orange-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-slate-400 mb-4">{t('detail.notFound')}</p>
          <Link to="/destinations" className="bg-orange-700 text-white px-6 py-2 rounded-full hover:bg-orange-800 transition">
            {t('detail.backToList')}
          </Link>
        </div>
      </main>
    );
  }

  const relatedDests = detail.related
    .map((rid) => destinations.find((d) => d.id === rid))
    .filter(Boolean);

  return (
    <main className="bg-orange-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="text-sm text-slate-500">
          <Link to="/" className="hover:text-orange-600">{t('detail.breadcrumb.home')}</Link>
          <span className="mx-2">/</span>
          <Link to="/destinations" className="hover:text-orange-600">{t('detail.breadcrumb.destinations')}</Link>
          <span className="mx-2">/</span>
          <span className="text-orange-800 font-medium">{t(detail.nameKey)}</span>
        </nav>
      </div>

      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 rounded-xl overflow-hidden">
            <img src={detail.images[0]} alt={t(detail.nameKey)} className="w-full aspect-video object-cover" />
          </div>
          <div className="grid grid-rows-2 gap-4">
            {detail.images.slice(1, 3).map((img, i) => (
              <div key={i} className="rounded-xl overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-orange-800">{t(detail.nameKey)}</h1>
              <FavoriteButton destinationId={detail.id} className="mt-1" />
            </div>
            <p className="text-emerald-600 text-lg mb-6">📍 {t(detail.countryKey)}</p>
            <p className="text-slate-600 leading-relaxed mb-10">{t(detail.descKey)}</p>

            {/* Attractions */}
            <h2 className="text-2xl font-bold text-orange-800 mb-6">{t('detail.attractions')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {detail.attractions.map((attr) => (
                <div key={attr.nameKey} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <img src={attr.image} alt={t(attr.nameKey)} className="w-full h-40 object-cover" loading="lazy" />
                  <div className="p-4">
                    <h3 className="font-bold text-orange-800 mb-1">{t(attr.nameKey)}</h3>
                    <p className="text-slate-500 text-sm">{t(attr.descKey)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reviews */}
            {detail.reviews && detail.reviews.length > 0 && (
              <>
                <h2 className="text-2xl font-bold text-orange-800 mb-6">{t('detail.reviews')}</h2>
                <div className="space-y-4 mb-10">
                  {detail.reviews.map((review) => (
                    <div key={review.contentKey} className="bg-white rounded-xl shadow-md p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-orange-800">{t(review.authorKey)}</span>
                        <span className="text-slate-400 text-sm">{t(review.dateKey)}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm mb-2">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={i < review.rating ? 'star-filled' : 'star-empty'}>★</span>
                        ))}
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">{t(review.contentKey)}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Overview */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-orange-800 text-lg mb-4">{t('detail.overview')}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">🗓️ {t('detail.season')}</span>
                  <span className="text-slate-700 font-medium">{t(detail.seasonKey)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">💰 {t('detail.cost')}</span>
                  <span className="text-slate-700 font-medium">{t(detail.costKey)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">⭐ {t('detail.rating')}</span>
                  <span className="text-slate-700 font-medium">{detail.rating} / 5.0</span>
                </div>
              </div>
            </div>

            {/* Weather Widget */}
            <WeatherWidget destinationId={detail.id} />

            {/* Practical info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-orange-800 text-lg mb-4">{t('detail.practical')}</h3>
              <div className="space-y-3 text-sm">
                <div><span className="text-slate-500">✈️ {t('detail.transport')}：</span><span className="text-slate-700">{t(detail.transport)}</span></div>
                <div><span className="text-slate-500">📋 {t('detail.visa')}：</span><span className="text-slate-700">{t(detail.visa)}</span></div>
                <div><span className="text-slate-500">💱 {t('detail.currency')}：</span><span className="text-slate-700">{detail.currency}</span></div>
                <div><span className="text-slate-500">🕐 {t('detail.timezone')}：</span><span className="text-slate-700">{detail.timezone}</span></div>
                <div><span className="text-slate-500">🗣️ {t('detail.language')}：</span><span className="text-slate-700">{t(detail.language)}</span></div>
              </div>
            </div>

            <Link
              to={`/trips?dest=${detail.id}`}
              className="block text-center bg-orange-700 hover:bg-orange-800 text-white py-3 rounded-lg transition"
            >
              📋 {t('trip.planTrip')}
            </Link>

            <Link
              to="/destinations"
              className="block text-center bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition"
            >
              {t('detail.backToList')}
            </Link>
          </div>
        </div>

        {/* Related */}
        {relatedDests.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-orange-800 mb-6">{t('detail.related')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedDests.map((d) => d && <DestinationCard key={d.id} destination={d} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
