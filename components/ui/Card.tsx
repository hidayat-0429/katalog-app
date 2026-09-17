import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional class names */
  className?: string;
  /** Whether the card has hover effect */
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, hover = false, children, ...props }) => {
  const base = 'bg-surface border border-border rounded-md p-5 transition-colors duration-150 ease-out shadow-none';
  const hoverClass = hover ? 'hover:border-charcoal-muted cursor-pointer' : '';
  const classes = cn(base, hoverClass, className);
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;
