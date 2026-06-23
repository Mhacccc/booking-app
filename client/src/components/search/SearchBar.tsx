import React, { useState } from 'react';
import { DatePicker } from './DatePicker';
import { GuestCounter } from './GuestCounter';
import { Button } from '../ui/Button';

interface SearchBarProps {
  onSearch: (params: { city: string; checkIn: string; checkOut: string; guests: number }) => void;
  initialValues?: {
    city?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
  };
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialValues = {} }) => {
  const [city, setCity] = useState(initialValues.city || '');
  const [checkIn, setCheckIn] = useState(initialValues.checkIn || '');
  const [checkOut, setCheckOut] = useState(initialValues.checkOut || '');
  const [guests, setGuests] = useState(initialValues.guests || 1);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ city, checkIn, checkOut, guests });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white rounded-lg shadow-lg border border-gray-100 p-4 md:p-6 flex flex-col gap-4"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
        {/* City Input */}
        <div className="flex flex-col gap-1.5 lg:col-span-4">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Where to?
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search destinations (e.g. Manila)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-[44px] pl-10 pr-3 border border-gray-200 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Date Inputs */}
        <div className="lg:col-span-5 w-full">
          <DatePicker
            checkIn={checkIn}
            checkOut={checkOut}
            onCheckInChange={setCheckIn}
            onCheckOutChange={setCheckOut}
          />
        </div>

        {/* Guest Input */}
        <div className="relative flex flex-col gap-1.5 lg:col-span-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Guests
          </label>
          <button
            type="button"
            onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
            className="h-[44px] px-3 border border-gray-200 rounded-md bg-white text-gray-900 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full text-left cursor-pointer"
          >
            <span className="truncate">{guests} {guests === 1 ? 'guest' : 'guests'}</span>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showGuestsDropdown && (
            <div className="absolute bottom-12 sm:bottom-auto sm:top-16 left-0 right-0 z-20 bg-white border border-gray-200 rounded-lg shadow-xl p-4 min-w-[200px]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-500">GUEST COUNTER</span>
                <button
                  type="button"
                  onClick={() => setShowGuestsDropdown(false)}
                  className="text-xs text-primary font-bold hover:underline cursor-pointer"
                >
                  Apply
                </button>
              </div>
              <GuestCounter
                label="Number of Guests"
                description="Total occupants"
                value={guests}
                min={1}
                max={10}
                onChange={setGuests}
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="lg:col-span-1 w-full">
          <Button type="submit" className="w-full h-[44px]">
            <span className="lg:hidden">Search Stays</span>
            <svg className="w-5 h-5 hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Button>
        </div>
      </div>
    </form>
  );
};
