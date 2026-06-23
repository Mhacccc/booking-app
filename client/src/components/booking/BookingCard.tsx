import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Booking } from '../../types/booking.types';
import type { Hotel } from '../../types/hotel.types';
import { hotelApi } from '../../api/hotel.api';
import { StatusBadge } from './StatusBadge';
import { Skeleton } from '../ui/Skeleton';
import { Button } from '../ui/Button';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
  isCancelling?: boolean;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onCancel,
  isCancelling = false,
}) => {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hotelApi
      .getById(booking.hotelId)
      .then((res) => {
        setHotel(res.data.data);
      })
      .catch((err) => {
        console.error('Failed to load hotel details for booking', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [booking.hotelId]);

  if (loading) {
    return (
      <div className="flex gap-4 p-4 border border-gray-200 rounded-lg bg-white h-[120px]">
        <Skeleton variant="rect" className="w-[100px] h-full" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton variant="text" className="h-5 w-40" />
          <Skeleton variant="text" className="h-4 w-24" />
          <Skeleton variant="text" className="h-4 w-32" />
        </div>
      </div>
    );
  }

  const imageUrl = hotel?.photos && hotel.photos.length > 0
    ? hotel.photos[0]
    : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80';

  const checkInDate = new Date(booking.startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const checkOutDate = new Date(booking.endDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4 p-4 items-center">
      {/* Thumbnail */}
      <div className="w-full sm:w-[120px] aspect-[4/3] sm:aspect-square rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        <img src={imageUrl} alt={hotel?.name} className="w-full h-full object-cover" />
      </div>

      {/* Info details */}
      <div className="flex-1 flex flex-col gap-1 w-full text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-bold text-gray-900 text-lg hover:text-primary transition-colors">
            {hotel ? (
              <Link to={`/hotels/${hotel._id}`}>{hotel.name}</Link>
            ) : (
              'Unknown Hotel'
            )}
          </h3>
          <div className="mx-auto sm:mx-0">
            <StatusBadge status={booking.status} />
          </div>
        </div>

        <p className="text-sm font-semibold text-gray-500">
          📍 {hotel?.city || 'Unknown Location'}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-xs text-gray-500 font-semibold mt-1">
          <span>{checkInDate} — {checkOutDate}</span>
          <span className="hidden sm:inline text-gray-300">•</span>
          <span>Room: {booking.roomNumbers.join(', ')}</span>
        </div>

        <div className="border-t border-gray-100 pt-3 mt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-base font-extrabold text-primary">
            Total Paid: ${booking.totalPrice}
          </span>
          <div className="flex gap-2">
            <Link to={`/bookings/${booking._id}`}>
              <Button variant="ghost" className="h-[36px] px-4 text-xs font-bold">
                View Details
              </Button>
            </Link>
            {onCancel && booking.status !== 'cancelled' && (
              <Button
                variant="danger"
                className="h-[36px] px-4 text-xs font-bold"
                onClick={() => onCancel(booking._id)}
                isLoading={isCancelling}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
