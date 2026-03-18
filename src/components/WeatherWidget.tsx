import { useTranslation } from 'react-i18next';
import { getWeatherForDestination, conditionEmoji } from '../data/weather';

interface WeatherWidgetProps {
  destinationId: string;
}

export default function WeatherWidget({ destinationId }: WeatherWidgetProps) {
  const { t } = useTranslation();
  const weather = getWeatherForDestination(destinationId);

  if (!weather) return null;

  const { current, forecast } = weather;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="font-bold text-blue-800 text-lg mb-4">🌤 {t('weather.title')}</h3>

      {/* Current weather */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-3xl font-bold text-blue-800">{current.temp}°C</div>
          <div className="text-sm text-slate-500 mt-1">
            {conditionEmoji[current.condition]} {t(`weather.${current.condition}`)}
          </div>
        </div>
        <div className="text-right text-sm text-slate-500 space-y-1">
          <div>🌡 {current.high}° / {current.low}°</div>
          <div>💧 {t('weather.humidity')} {current.humidity}%</div>
          <div>💨 {t('weather.wind')} {current.windSpeed}km/h</div>
        </div>
      </div>

      {/* 5-day forecast */}
      <div className="border-t border-slate-100 pt-3">
        <p className="text-xs text-slate-400 mb-2">{t('weather.forecast')}</p>
        <div className="grid grid-cols-5 gap-1 text-center">
          {forecast.map((day) => (
            <div key={day.dayKey} className="text-xs">
              <div className="text-slate-500 mb-1">{t(day.dayKey)}</div>
              <div className="text-base">{conditionEmoji[day.condition]}</div>
              <div className="text-slate-700 font-medium">{day.high}°</div>
              <div className="text-slate-400">{day.low}°</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
