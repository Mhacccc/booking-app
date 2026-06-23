import React from 'react';

interface AvatarProps {
  username?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  username = '',
  src,
  size = 'md',
  className = '',
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-20 h-20 text-xl',
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className={`relative inline-flex items-center justify-center rounded-full overflow-hidden bg-primary-light text-primary font-semibold select-none ${sizes[size]} ${className}`}>
      {src ? (
        <img src={src} alt={username} className="w-full h-full object-cover" />
      ) : (
        <span>{getInitials(username)}</span>
      )}
    </div>
  );
};
