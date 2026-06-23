import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col w-full gap-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-700 select-none">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`h-[44px] px-3 border rounded-md bg-white text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-400 ${
            error ? 'border-error focus:ring-error' : 'border-gray-200 focus:ring-primary'
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-error font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
