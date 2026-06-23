import React from 'react';
import type { BookingStatus } from '../../types/booking.types';
import { Badge } from '../ui/Badge';

interface StatusBadgeProps {
  status: BookingStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const labelMap = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
  };

  const variantMap: Record<BookingStatus, 'warning' | 'success' | 'error'> = {
    pending: 'warning',
    confirmed: 'success',
    cancelled: 'error',
  };

  return (
    <Badge variant={variantMap[status]}>
      {labelMap[status]}
    </Badge>
  );
};
