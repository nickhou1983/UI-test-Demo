import type { Destination, DestinationDetail, Category } from '../types';
import { assetUrl } from '../utils/assetUrl';

const img = (path: string) => assetUrl(`images/${path}`);

export const destinations: Destination[] = [
  { id: 'bali', nameKey: 'dest.bali.name', countryKey: 'dest.bali.country', descKey: 'dest.bali.desc', image: img('destinations/bali.jpg'), region: 'asia', type: 'beach', rating: 4.7, stars: 5 },
  { id: 'kyoto', nameKey: 'dest.kyoto.name', countryKey: 'dest.kyoto.country', descKey: 'dest.kyoto.desc', image: img('destinations/kyoto.jpg'), region: 'asia', type: 'culture', rating: 4.8, stars: 5 },
  { id: 'santorini', nameKey: 'dest.santorini.name', countryKey: 'dest.santorini.country', descKey: 'dest.santorini.desc', image: img('destinations/santorini.jpg'), region: 'europe', type: 'beach', rating: 4.6, stars: 5 },
  { id: 'paris', nameKey: 'dest.paris.name', countryKey: 'dest.paris.country', descKey: 'dest.paris.desc', image: img('destinations/paris.jpg'), region: 'europe', type: 'city', rating: 4.5, stars: 4 },
  { id: 'maldives', nameKey: 'dest.maldives.name', countryKey: 'dest.maldives.country', descKey: 'dest.maldives.desc', image: img('destinations/maldives.jpg'), region: 'asia', type: 'beach', rating: 4.9, stars: 5 },
  { id: 'swiss', nameKey: 'dest.swiss.name', countryKey: 'dest.swiss.country', descKey: 'dest.swiss.desc', image: img('destinations/swiss.jpg'), region: 'europe', type: 'mountain', rating: 4.7, stars: 5 },
  { id: 'newyork', nameKey: 'dest.newyork.name', countryKey: 'dest.newyork.country', descKey: 'dest.newyork.desc', image: img('destinations/newyork.jpg'), region: 'north-america', type: 'city', rating: 4.4, stars: 4 },
  { id: 'chengdu', nameKey: 'dest.chengdu.name', countryKey: 'dest.chengdu.country', descKey: 'dest.chengdu.desc', image: img('destinations/chengdu.jpg'), region: 'asia', type: 'culture', rating: 4.5, stars: 4 },
  { id: 'machupicchu', nameKey: 'dest.machupicchu.name', countryKey: 'dest.machupicchu.country', descKey: 'dest.machupicchu.desc', image: img('destinations/machupicchu.jpg'), region: 'south-america', type: 'culture', rating: 4.8, stars: 5 },
  { id: 'capetown', nameKey: 'dest.capetown.name', countryKey: 'dest.capetown.country', descKey: 'dest.capetown.desc', image: img('destinations/capetown.jpg'), region: 'africa', type: 'mountain', rating: 4.5, stars: 4 },
  { id: 'greatbarrierreef', nameKey: 'dest.greatbarrierreef.name', countryKey: 'dest.greatbarrierreef.country', descKey: 'dest.greatbarrierreef.desc', image: img('destinations/greatbarrierreef.jpg'), region: 'oceania', type: 'beach', rating: 4.7, stars: 5 },
  { id: 'nepal', nameKey: 'dest.nepal.name', countryKey: 'dest.nepal.country', descKey: 'dest.nepal.desc', image: img('destinations/nepal.jpg'), region: 'asia', type: 'mountain', rating: 4.6, stars: 5 },
];

export const homepageDestinations = destinations.slice(0, 8);

export const categories: Category[] = [
  { nameKey: 'cat.beach', type: 'beach', image: img('categories/beach.jpg') },
  { nameKey: 'cat.mountain', type: 'mountain', image: img('categories/mountain.jpg') },
  { nameKey: 'cat.city', type: 'city', image: img('categories/city.jpg') },
  { nameKey: 'cat.culture', type: 'culture', image: img('categories/culture.jpg') },
];

export const destinationDetails: Record<string, DestinationDetail> = {
  bali: {
    id: 'bali',
    nameKey: 'dest.bali.name',
    countryKey: 'dest.bali.country',
    descKey: 'detail.bali.desc',
    images: [
      img('destinations/bali.jpg'),
      img('destinations/bali-temple.jpg'),
      img('destinations/bali-rice.jpg'),
    ],
    region: 'asia',
    type: 'beach',
    rating: 4.7,
    stars: 5,
    seasonKey: 'detail.bali.season',
    costKey: 'detail.bali.cost',
    attractions: [
      { nameKey: 'detail.bali.attr1.name', descKey: 'detail.bali.attr1.desc', image: img('destinations/bali-temple.jpg') },
      { nameKey: 'detail.bali.attr2.name', descKey: 'detail.bali.attr2.desc', image: img('destinations/bali-rice.jpg') },
      { nameKey: 'detail.bali.attr3.name', descKey: 'detail.bali.attr3.desc', image: img('destinations/bali.jpg') },
      { nameKey: 'detail.bali.attr4.name', descKey: 'detail.bali.attr4.desc', image: img('destinations/bali-temple.jpg') },
    ],
    transport: 'detail.bali.transport',
    visa: 'detail.bali.visa',
    currency: 'IDR',
    timezone: 'UTC+8',
    language: 'detail.bali.language',
    related: ['santorini', 'maldives', 'kyoto'],
  },
};

export function getDestinationDetail(id: string): DestinationDetail | undefined {
  return destinationDetails[id];
}
