export interface Stay {
  id: number;
  name: string;
  region: string;
  district: string;
  categories: string[];
  capacity: string;
  price: number;
  badges: string[];
  description: string;
  images: string[];
  _color?: string;
}

export interface StayDetail {
  id: number;
  name: string;
  location: string;
  colorClass: string;
  badges: string[];
  reviews: { score: number; count: number };
  originalPrice: number | null;
  discount: number | null;
  finalPrice: number;
  coupon: string | null;
  promo: string | null;
  introImage?: string;
  roomImage?: string;
  room: { name: string; type: string; minGuests: number; maxGuests: number };
  description: string;
  address: string;
  locationDesc: string;
  checkin: string;
  checkout: string;
  rules: string[];
  sampleReviews: Review[];
}

export interface Review {
  name: string;
  date: string;
  score: number;
  text: string;
}

export interface SearchParams {
  region: string;
  checkin: Date | null;
  checkout: Date | null;
  guests: { adult: number; child: number; infant: number };
}

export interface GuestCounts {
  adult: number;
  child: number;
  infant: number;
}
