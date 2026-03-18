export interface Destination {
  id: string;
  nameKey: string;
  countryKey: string;
  descKey: string;
  image: string;
  region: string;
  type: string;
  rating: number;
  stars: number;
}

export interface DestinationDetail {
  id: string;
  nameKey: string;
  countryKey: string;
  descKey: string;
  images: string[];
  region: string;
  type: string;
  rating: number;
  stars: number;
  seasonKey: string;
  costKey: string;
  attractions: Attraction[];
  transport: string;
  visa: string;
  currency: string;
  timezone: string;
  language: string;
  related: string[];
  reviews: DestinationReview[];
}

export interface DestinationReview {
  authorKey: string;
  dateKey: string;
  rating: number;
  contentKey: string;
}

export interface Attraction {
  nameKey: string;
  descKey: string;
  image: string;
}

export interface TeamMember {
  nameKey: string;
  titleKey: string;
  bioKey: string;
  image: string;
}

export interface Review {
  quoteKey: string;
  authorKey: string;
  roleKey: string;
}

export interface Category {
  nameKey: string;
  type: string;
  image: string;
}

// Weather types
export interface WeatherInfo {
  temp: number;
  high: number;
  low: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';
  humidity: number;
  windSpeed: number;
}

export interface WeatherForecast {
  dayKey: string;
  condition: WeatherInfo['condition'];
  high: number;
  low: number;
}

export interface DestinationWeather {
  current: WeatherInfo;
  forecast: WeatherForecast[];
}

// Trip planner types
export interface TripActivity {
  id: string;
  customName: string;
  time: string;
  notes: string;
}

export interface TripDay {
  dayNumber: number;
  activities: TripActivity[];
}

export interface Trip {
  id: string;
  name: string;
  destinationId: string;
  days: TripDay[];
  createdAt: string;
  updatedAt: string;
}
