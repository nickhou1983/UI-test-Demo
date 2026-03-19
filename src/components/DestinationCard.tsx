import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Destination } from '../types';
import FavoriteButton from './FavoriteButton';

interface Props {
  destination: Destination;
}

export default function DestinationCard({ destination }: Props) {
  const { t } = useTranslation();

  return (
    <Link
      to={`/destinations/${destination.id}`}
      className="card-hover bg-white rounded-lg shadow-md overflow-hidden block"
    >
      <div className="aspect-16-10 overflow-hidden relative">
        <img
          src={destination.image}
          alt={t(destination.nameKey)}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
          <FavoriteButton destinationId={destination.id} />
        </div>
      </div>
      <div className="p-4">
        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
          {t(`filter.${destination.type}`)}
        </span>
        <h3 className="font-bold text-lg text-orange-800 mt-2">{t(destination.nameKey)}</h3>
        <p className="text-sm text-emerald-600 mb-1">{t(destination.countryKey)}</p>
        <p className="text-slate-500 text-sm line-clamp-2">{t(destination.descKey)}</p>
        <div className="mt-2 flex items-center space-x-1 text-sm">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < destination.stars ? 'star-filled' : 'star-empty'}>★</span>
          ))}
          <span className="text-slate-400 ml-1">{destination.rating}</span>
        </div>
      </div>
    </Link>
  );
}
