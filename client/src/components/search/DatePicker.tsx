import React from 'react';

interface DatePickerProps {
  checkIn: string;
  checkOut: string;
  onCheckInChange: (val: string) => void;
  onCheckOutChange: (val: string) => void;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  className = '',
}) => {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={`flex flex-col sm:flex-row gap-4 w-full ${className}`}>
      <div className="flex flex-col w-full gap-1.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Check-in
        </label>
        <input
          type="date"
          min={today}
          value={checkIn}
          onChange={(e) => onCheckInChange(e.target.value)}
          className="h-[44px] px-3 border border-gray-200 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full cursor-pointer"
        />
      </div>
      <div className="flex flex-col w-full gap-1.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Check-out
        </label>
        <input
          type="date"
          min={checkIn || today}
          value={checkOut}
          onChange={(e) => onCheckOutChange(e.target.value)}
          className="h-[44px] px-3 border border-gray-200 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full cursor-pointer"
        />
      </div>
    </div>
  );
};
