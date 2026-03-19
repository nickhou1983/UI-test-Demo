import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { destinations } from '../data/destinations';
import { getTrips, createTrip, deleteTrip } from '../utils/tripPlanner';
import type { Trip } from '../types';

export default function TripPlannerPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const preselectedDest = searchParams.get('dest') || '';
  const [trips, setTrips] = useState<Trip[]>(() => getTrips());
  const [showModal, setShowModal] = useState(() => !!preselectedDest);
  const [formDest, setFormDest] = useState(preselectedDest);
  const [formName, setFormName] = useState('');
  const [formDays, setFormDays] = useState(3);

  useEffect(() => {
    const handler = () => setTrips(getTrips());
    window.addEventListener('trips-changed', handler);
    return () => window.removeEventListener('trips-changed', handler);
  }, []);

  const handleCreate = () => {
    if (!formDest || !formName.trim() || formDays < 1) return;
    createTrip(formDest, formName.trim(), formDays);
    setTrips(getTrips());
    setShowModal(false);
    setFormName('');
    setFormDays(3);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('trip.deleteConfirm'))) {
      deleteTrip(id);
      setTrips(getTrips());
    }
  };

  const getDestImage = (destId: string) => {
    return destinations.find((d) => d.id === destId)?.image || '';
  };

  const getDestName = (destId: string) => {
    const dest = destinations.find((d) => d.id === destId);
    return dest ? t(dest.nameKey) : destId;
  };

  return (
    <main className="bg-orange-50 min-h-screen">
      {/* Hero */}
      <section className="bg-orange-800 text-white py-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('trip.title')}</h1>
        <p className="text-orange-200">{t('trip.subtitle')}</p>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Create button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg transition font-medium"
          >
            + {t('trip.create')}
          </button>
        </div>

        {/* Trip list */}
        {trips.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-slate-400 text-lg">{t('trip.empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trips.map((trip) => (
              <div key={trip.id} className="bg-white rounded-xl shadow-md overflow-hidden group">
                <div className="relative h-40">
                  <img
                    src={getDestImage(trip.destinationId)}
                    alt={getDestName(trip.destinationId)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white">
                    <h3 className="text-lg font-bold">{trip.name}</h3>
                    <p className="text-sm text-white/80">📍 {getDestName(trip.destinationId)}</p>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    🗓 {t('trip.daysCount', { n: trip.days.length })}
                  </span>
                  <div className="flex gap-2">
                    <Link
                      to={`/trips/${trip.id}`}
                      className="bg-orange-700 hover:bg-orange-800 text-white text-sm px-4 py-1.5 rounded-lg transition"
                    >
                      {t('trip.editTrip')}
                    </Link>
                    <button
                      onClick={() => handleDelete(trip.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 text-sm px-3 py-1.5 rounded-lg transition"
                    >
                      {t('trip.delete')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-orange-800 mb-5">{t('trip.create')}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('trip.selectDest')}</label>
                <select
                  value={formDest}
                  onChange={(e) => setFormDest(e.target.value)}
                  aria-label={t('trip.selectDest')}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">{t('trip.selectDest')}</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>{t(d.nameKey)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('trip.name')}</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder={t('trip.namePlaceholder')}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('trip.days')}</label>
                <input
                  type="number"
                  min={1}
                  max={14}
                  value={formDays}
                  onChange={(e) => setFormDays(Math.max(1, Math.min(14, Number(e.target.value))))}
                  aria-label={t('trip.days')}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition"
              >
                {t('trip.cancel')}
              </button>
              <button
                onClick={handleCreate}
                disabled={!formDest || !formName.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white px-6 py-2 rounded-lg text-sm transition"
              >
                {t('trip.create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
