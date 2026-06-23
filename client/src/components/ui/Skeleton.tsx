import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rect',
  width,
  height,
  className = '',
}) => {
  const styles = {
    text: 'h-4 w-full rounded-sm',
    rect: 'w-full rounded-md',
    circle: 'rounded-full',
  };

  const styleObj: React.CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <div
      className={`animate-pulse bg-gray-200 ${styles[variant]} ${className}`}
      style={styleObj}
    />
  );
};
