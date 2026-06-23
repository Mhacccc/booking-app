import React from 'react';

interface RatingProps {
  value: number;
  count?: number;
  showText?: boolean;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  count,
  showText = false,
  className = '',
}) => {
  const roundedValue = Math.round(value * 2) / 2; // round to nearest 0.5

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="flex items-center text-rating">
        {Array.from({ length: 5 }).map((_, index) => {
          const starVal = index + 1;
          const isFull = roundedValue >= starVal;
          const isHalf = !isFull && roundedValue >= starVal - 0.5;

          return (
            <svg
              key={index}
              className="w-4 h-4 fill-current"
              viewBox="0 0 20 20"
            >
              {isFull ? (
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              ) : isHalf ? (
                <g key={index}>
                  {/* Gray star under */}
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" className="text-gray-200 fill-current" />
                  {/* Left half filled */}
                  <clipPath id={`half-clip-${index}`}>
                    <rect x="0" y="0" width="10" height="20" />
                  </clipPath>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipPath={`url(#half-clip-${index})`} />
                </g>
              ) : (
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" className="text-gray-200 fill-current" />
              )}
            </svg>
          );
        })}
      </span>
      <span className="font-semibold text-gray-900 text-sm ml-1">
        {value.toFixed(1)}
      </span>
      {showText && count !== undefined && (
        <span className="text-gray-500 text-xs ml-0.5">
          ({count} {count === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};
