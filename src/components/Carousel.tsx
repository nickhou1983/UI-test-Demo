import { useState, useEffect, useCallback } from 'react';

interface Props {
  items: React.ReactNode[];
  autoPlayInterval?: number;
}

export default function Carousel({ items, autoPlayInterval = 4000 }: Props) {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((index: number) => {
    setCurrent(((index % items.length) + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    const timer = setInterval(() => goTo(current + 1), autoPlayInterval);
    return () => clearInterval(timer);
  }, [current, autoPlayInterval, goTo]);

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {items.map((item, i) => (
          <div key={i} className="w-full flex-shrink-0 px-4">
            {item}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6 space-x-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`w-3 h-3 rounded-full transition ${
              i === current ? 'bg-orange-800' : 'bg-orange-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
