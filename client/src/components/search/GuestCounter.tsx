import React from 'react';

interface GuestCounterProps {
  label: string;
  description?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
}

export const GuestCounter: React.FC<GuestCounterProps> = ({
  label,
  description,
  value,
  min = 1,
  max = 10,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 w-full">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-900">{label}</span>
        {description && <span className="text-xs text-gray-500">{description}</span>}
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-800 disabled:opacity-30 disabled:hover:border-gray-300 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
          </svg>
        </button>
        <span className="text-sm font-bold text-gray-900 w-4 text-center select-none">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-800 disabled:opacity-30 disabled:hover:border-gray-300 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
};
