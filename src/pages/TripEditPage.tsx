import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getTrip, updateTrip, addActivity, removeActivity, deleteTrip } from '../utils/tripPlanner';
import { getDestinationDetail, destinations } from '../data/destinations';
import WeatherWidget from '../components/WeatherWidget';
import type { Trip } from '../types';

export default function TripEditPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | undefined>(() => tripId ? getTrip(tripId) : undefined);
  const [activeDay, setActiveDay] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activityName, setActivityName] = useState('');
  const [activityTime, setActivityTime] = useState('');
  const [activityNotes, setActivityNotes] = useState('');

  const refreshTrip = useCallback(() => {
    if (tripId) setTrip(getTrip(tripId));
  }, [tripId]);

  useEffect(() => {
    const handler = () => refreshTrip();
    window.addEventListener('trips-changed', handler);
    return () => window.removeEventListener('trips-changed', handler);
  }, [refreshTrip]);

  if (!trip) {
    return (
      <main className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-slate-400 mb-4">{t('detail.notFound')}</p>
          <Link to="/trips" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
            {t('trip.backToList')}
          </Link>
        </div>
      </main>
    );
  }

  const detail = getDestinationDetail(trip.destinationId);
  const dest = destinations.find((d) => d.id === trip.destinationId);
  const currentDay = trip.days.find((d) => d.dayNumber === activeDay);

  const handleAddActivity = () => {
    if (!activityName.trim()) return;
    addActivity(trip.id, activeDay, {
      customName: activityName.trim(),
      time: activityTime,
      notes: activityNotes,
    });
    refreshTrip();
    setActivityName('');
    setActivityTime('');
    setActivityNotes('');
    setShowAddForm(false);
  };

  const handleQuickAdd = (name: string) => {
    addActivity(trip.id, activeDay, {
      customName: name,
      time: '',
      notes: '',
    });
    refreshTrip();
  };

  const handleRemoveActivity = (activityId: string) => {
    removeActivity(trip.id, activeDay, activityId);
    refreshTrip();
  };

  const handleDelete = () => {
    if (window.confirm(t('trip.deleteConfirm'))) {
      deleteTrip(trip.id);
      navigate('/trips');
    }
  };

  const handleNameChange = (newName: string) => {
    const updated = { ...trip, name: newName };
    updateTrip(updated);
    refreshTrip();
  };

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="bg-slate-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Link to="/trips" className="text-blue-200 hover:text-white text-sm mb-3 inline-block">
            ← {t('trip.backToList')}
          </Link>
          <input
            type="text"
            value={trip.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="block text-2xl md:text-3xl font-bold bg-transparent border-b border-slate-600 focus:border-cyan-400 outline-none w-full max-w-lg pb-1"
            aria-label={t('trip.name')}
          />
          <p className="text-blue-200 mt-2">
            📍 {dest ? t(dest.nameKey) : trip.destinationId} · {t('trip.daysCount', { n: trip.days.length })}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Day tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {trip.days.map((day) => (
                <button
                  key={day.dayNumber}
                  onClick={() => { setActiveDay(day.dayNumber); setShowAddForm(false); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    activeDay === day.dayNumber
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 shadow-sm'
                  }`}
                >
                  {t('trip.day', { n: day.dayNumber })}
                </button>
              ))}
            </div>

            {/* Activities */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-blue-600 mb-4">
                {t('trip.day', { n: activeDay })}
              </h2>

              {currentDay && currentDay.activities.length === 0 && !showAddForm && (
                <p className="text-slate-400 text-sm py-6 text-center">{t('trip.noActivities')}</p>
              )}

              {currentDay && currentDay.activities.length > 0 && (
                <div className="space-y-3 mb-4">
                  {currentDay.activities.map((activity, idx) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg group"
                    >
                      <span className="w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-800">{activity.customName}</div>
                        {activity.time && (
                          <div className="text-xs text-slate-500 mt-0.5">🕐 {activity.time}</div>
                        )}
                        {activity.notes && (
                          <div className="text-xs text-slate-400 mt-0.5">{activity.notes}</div>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveActivity(activity.id)}
                        className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition text-sm"
                        aria-label={t('trip.delete')}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick add attractions */}
              {detail && detail.attractions.length > 0 && !showAddForm && (
                <div className="mb-4">
                  <p className="text-xs text-slate-400 mb-2">{t('trip.quickAdd')}</p>
                  <div className="flex flex-wrap gap-2">
                    {detail.attractions.map((attr) => (
                      <button
                        key={attr.nameKey}
                        onClick={() => handleQuickAdd(t(attr.nameKey))}
                        className="bg-cyan-50 hover:bg-cyan-100 text-cyan-700 text-xs px-3 py-1.5 rounded-full transition"
                      >
                        + {t(attr.nameKey)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add custom activity */}
              {showAddForm ? (
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <input
                    type="text"
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                    placeholder={t('trip.activityName')}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={activityTime}
                      onChange={(e) => setActivityTime(e.target.value)}
                      placeholder={t('trip.activityTime')}
                      className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={activityNotes}
                      onChange={(e) => setActivityNotes(e.target.value)}
                      placeholder={t('trip.activityNotes')}
                      className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddActivity}
                      disabled={!activityName.trim()}
                      className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm transition"
                    >
                      {t('trip.save')}
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="text-slate-500 hover:text-slate-700 px-4 py-2 text-sm transition"
                    >
                      {t('trip.cancel')}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full border-2 border-dashed border-slate-300 hover:border-blue-400 text-slate-400 hover:text-blue-400 py-3 rounded-lg text-sm transition"
                >
                  + {t('trip.addActivity')}
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Destination card */}
            {dest && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <img src={dest.image} alt={t(dest.nameKey)} className="w-full h-36 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-blue-600">{t(dest.nameKey)}</h3>
                  <p className="text-sm text-slate-500">{t(dest.countryKey)}</p>
                </div>
              </div>
            )}

            {/* Weather */}
            <WeatherWidget destinationId={trip.destinationId} />

            {/* Delete */}
            <button
              onClick={handleDelete}
              className="w-full text-center text-red-500 hover:text-red-700 text-sm py-2 transition"
            >
              🗑 {t('trip.delete')}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
