import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional class names */
  className?: string;
  /** Whether the card has hover effect */
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, hover = false, children, ...props }) => {
  const cardStyles = cn(
    // Base structure
    'rounded-lg border border-neutral-200',
    'bg-white p-6',
    
    // Dark mode
    'dark:bg-neutral-800 dark:border-neutral-700',
    
    // Transition
    'motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out'
  );

  const interactiveCardStyles = cn(
    cardStyles,
    'hover:border-neutral-300 hover:bg-neutral-50',
    'dark:hover:border-neutral-600 dark:hover:bg-neutral-700',
    'cursor-pointer'
  );

  const classes = cn(hover ? interactiveCardStyles : cardStyles, className);
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;
