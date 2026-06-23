import React from 'react';
import { Link } from 'react-router-dom';
import type { Hotel } from '../../types/hotel.types';
import { Rating } from '../ui/Rating';
import { Badge } from '../ui/Badge';

interface PropertyCardProps {
  hotel: Hotel;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ hotel }) => {
  // Fallback image if none provided
  const imageUrl = hotel.photos && hotel.photos.length > 0 
    ? hotel.photos[0] 
    : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Image container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
          loading="lazy"
        />
        {hotel.featured && (
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="superhost">Featured</Badge>
          </div>
        )}
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="neutral" className="bg-white/95 text-gray-800 backdrop-blur-xs font-bold shadow-xs">
            {hotel.type}
          </Badge>
        </div>
      </div>

      {/* Info details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors text-base line-clamp-1 leading-tight">
              {hotel.name}
            </h3>
            <Rating value={hotel.rating || 4.5} className="flex-shrink-0" />
          </div>
          <p className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{hotel.city}</span>
            {hotel.distance && <span className="text-gray-300">•</span>}
            {hotel.distance && <span>{hotel.distance}</span>}
          </p>
          <p className="text-xs text-gray-600 line-clamp-2 mt-1">
            {hotel.description}
          </p>
        </div>

        {/* Price & CTA */}
        <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">From</span>
            <span className="text-lg font-extrabold text-primary">
              ${hotel.cheapestPrice}
              <span className="text-xs font-semibold text-gray-500"> / night</span>
            </span>
          </div>
          <Link
            to={`/hotels/${hotel._id}`}
            className="inline-flex items-center text-xs font-bold text-primary group-hover:text-primary-hover group-hover:translate-x-0.5 transition-all"
          >
            <span>Details</span>
            <svg className="w-3.5 h-3.5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};
