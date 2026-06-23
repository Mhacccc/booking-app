import React from 'react';
import type { Hotel } from '../../types/hotel.types';
import { PropertyCard } from './PropertyCard';

interface PropertyGridProps {
  hotels: Hotel[];
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({ hotels }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
      {hotels.map((hotel) => (
        <PropertyCard key={hotel._id} hotel={hotel} />
      ))}
    </div>
  );
};
