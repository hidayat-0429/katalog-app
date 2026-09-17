import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'outline' | 'info' | 'success' | 'warning' | 'danger' | 'purple';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  className?: string;
}

const baseClasses = 'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-sans font-medium rounded-sm transition-colors duration-150';

const variantMap: Record<BadgeVariant, string> = {
  default: 'bg-primary text-white',
  outline: 'border border-border text-charcoal',
  info: 'bg-info-bg text-info',
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
  danger: 'bg-danger-bg text-danger',
  purple: 'bg-purple-50 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300',
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
