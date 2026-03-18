import { useState } from 'react';
import { isFavorite, toggleFavorite } from '../utils/favorites';

interface Props {
  destinationId: string;
  className?: string;
}

export default function FavoriteButton({ destinationId, className = '' }: Props) {
  const [favorited, setFavorited] = useState(() => isFavorite(destinationId));

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleFavorite(destinationId);
    setFavorited(newState);
    window.dispatchEvent(new Event('favorites-changed'));
  };

  return (
    <button
      onClick={handleClick}
      aria-label={favorited ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`transition-transform hover:scale-110 active:scale-95 ${className}`}
    >
      {favorited ? (
        <svg className="w-6 h-6 text-red-500 drop-shadow" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ) : (
        <svg className="w-6 h-6 text-white drop-shadow" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      )}
    </button>
  );
}
