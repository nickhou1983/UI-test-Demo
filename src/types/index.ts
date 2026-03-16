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
