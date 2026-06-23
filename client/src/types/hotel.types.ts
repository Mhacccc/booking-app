export interface Hotel {
  _id: string;
  name: string;
  type: string;
  city: string;
  address: string;
  distance: string;
  photos: string[];
  title: string;
  description: string;
  rating: number;
  rooms: string[];
  cheapestPrice: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}
