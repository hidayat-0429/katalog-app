import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'outline' | 'info' | 'success' | 'warning' | 'danger' | 'earth';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  className?: string;
}

const baseClasses = cn(
  'inline-flex items-center px-2 py-1',
  'text-xs font-medium rounded-sm',
  'motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out'
);

const variantMap: Record<BadgeVariant, string> = {
  default: cn(
    'bg-brand-forest-600 text-white',
    'dark:bg-brand-forest-500 dark:text-white'
  ),
  outline: cn(
    'border border-neutral-300 text-neutral-700',
    'dark:border-neutral-600 dark:text-neutral-300'
  ),
  info: cn(
    'bg-semantic-info-light text-semantic-info-dark',
    'border border-semantic-info-DEFAULT',
    'dark:bg-semantic-info-darkBg dark:text-blue-200'
  ),
  success: cn(
    'bg-semantic-success-light text-semantic-success-dark',
    'border border-semantic-success-DEFAULT',
    'dark:bg-semantic-success-darkBg dark:text-green-200'
  ),
  warning: cn(
    'bg-semantic-warning-light text-semantic-warning-dark',
    'border border-semantic-warning-DEFAULT',
    'dark:bg-semantic-warning-darkBg dark:text-amber-200'
  ),
  danger: cn(
    'bg-semantic-danger-light text-semantic-danger-dark',
    'border border-semantic-danger-DEFAULT',
    'dark:bg-semantic-danger-darkBg dark:text-red-200'
  ),
  earth: cn(
    'bg-brand-earth-50 text-brand-earth-700',
    'border border-brand-earth-200',
    'dark:bg-brand-earth-900/40 dark:text-brand-earth-300'
  ),
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', className, children, ...props }) => {
  const classes = cn(baseClasses, variantMap[variant], className);
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;
