import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Additional class names */
  className?: string;
}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  const classes = cn(
    'w-full border border-border rounded-md px-3.5 py-2 bg-surface text-charcoal placeholder:text-charcoal-muted/60 text-sm font-sans transition-colors duration-150 ease-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light hover:border-charcoal-muted',
    className
  );
  return <input className={classes} {...props} />;
};

export default Input;
