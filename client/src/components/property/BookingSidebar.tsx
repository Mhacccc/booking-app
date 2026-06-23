import React, { useState } from 'react';
import { DatePicker } from '../search/DatePicker';
import { Button } from '../ui/Button';

interface BookingSidebarProps {
  pricePerNight: number;
  selectedRoomTitle?: string;
  selectedRoomNumbers?: number[];
  onReserve: (bookingDetails: { checkIn: string; checkOut: string; guests: number }) => void;
  isLoading?: boolean;
  isAuthenticated: boolean;
}

export const BookingSidebar: React.FC<BookingSidebarProps> = ({
  pricePerNight,
  selectedRoomTitle,
  selectedRoomNumbers = [],
  onReserve,
  isLoading = false,
  isAuthenticated,
}) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  // Calculate nights
  const getNightsCount = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const nights = getNightsCount();
  const subtotal = pricePerNight * (nights || 1);
  const serviceFee = Math.round(subtotal * 0.05); // 5% fee
  const tax = Math.round(subtotal * 0.12); // 12% VAT
  const total = subtotal + serviceFee + tax;

  const canReserve = isAuthenticated && checkIn && checkOut && nights > 0 && selectedRoomNumbers.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canReserve) {
      onReserve({ checkIn, checkOut, guests });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md w-full sticky top-24 flex flex-col gap-6">
      {/* Price header */}
      <div>
        <span className="text-2xl font-extrabold text-primary">${pricePerNight}</span>
        <span className="text-sm font-semibold text-gray-500"> / night</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Date inputs */}
        <DatePicker
          checkIn={checkIn}
          checkOut={checkOut}
          onCheckInChange={setCheckIn}
          onCheckOutChange={setCheckOut}
        />

        {/* Guests selector */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="h-[44px] px-3 border border-gray-200 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full cursor-pointer font-semibold text-sm"
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i + 1 === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Room Details */}
        {selectedRoomTitle && selectedRoomNumbers.length > 0 ? (
          <div className="bg-primary-light/50 border border-primary/10 rounded-md p-3 text-xs flex flex-col gap-1 mt-2">
            <span className="font-bold text-primary uppercase tracking-wider">Selected Room</span>
            <span className="font-semibold text-gray-700">{selectedRoomTitle}</span>
            <span className="font-semibold text-gray-500">Room Number: {selectedRoomNumbers.join(', ')}</span>
          </div>
        ) : (
          <div className="bg-warning-light/30 border border-warning/10 rounded-md p-3 text-xs text-warning font-semibold mt-2 text-center">
            Please choose a room number from the list
          </div>
        )}

        {/* Pricing breakdown */}
        {nights > 0 && (
          <div className="flex flex-col gap-2 border-t border-gray-100 pt-4 mt-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span className="underline">${pricePerNight} x {nights} nights</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span className="underline">Service fee (5%)</span>
              <span>${serviceFee}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span className="underline">Tax (12%)</span>
              <span>${tax}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-100 pt-3 mt-1">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        )}

        {/* Submit action */}
        {!isAuthenticated ? (
          <div className="flex flex-col gap-2 mt-4">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => (window.location.href = '/login')}
            >
              Sign In to Book
            </Button>
            <p className="text-[10px] text-gray-500 text-center font-medium">
              You must be signed in to make a booking.
            </p>
          </div>
        ) : (
          <Button
            type="submit"
            className="w-full mt-4"
            disabled={!canReserve}
            isLoading={isLoading}
          >
            {selectedRoomNumbers.length === 0 ? 'Select a room' : 'Reserve'}
          </Button>
        )}
      </form>
    </div>
  );
};
