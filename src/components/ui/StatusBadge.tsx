import React from 'react';
import { Badge } from './Badge';
import type { BadgeVariant } from './Badge';

type AppointmentStatus =
  | 'confirmed'
  | 'pending'
  | 'waiting'
  | 'canceled'
  | 'completed';

interface StatusBadgeProps {
  status: AppointmentStatus;
}

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  confirmed: 'Confirmed',
  pending: 'Pending',
  waiting: 'Waiting',
  canceled: 'Canceled',
  completed: 'Completed',
};

const StatusBadge = React.memo<StatusBadgeProps>(({ status }) => {
  const label = STATUS_LABELS[status] || status;
  const variant: BadgeVariant = status;

  return <Badge label={label} variant={variant} />;
});

StatusBadge.displayName = 'StatusBadge';

export { StatusBadge };
export type { StatusBadgeProps, AppointmentStatus };
