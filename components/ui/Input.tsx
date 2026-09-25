import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Additional class names */
  className?: string;
}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  const classes = cn(
    // Base styles
    'w-full px-3 py-2 rounded-md',
    'border border-neutral-300',
    'bg-white text-neutral-900',
    'font-sans text-base',
    
    // Focus state
    'focus:outline-none focus:ring-2 focus:ring-brand-forest-500',
    'focus:border-brand-forest-500',
    'motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-out',
    
    // Placeholder
    'placeholder:text-neutral-400',
    
    // Dark mode
    'dark:bg-neutral-800 dark:text-neutral-100',
    'dark:border-neutral-600',
    'dark:placeholder:text-neutral-500',
    
    // Disabled state
    'disabled:bg-neutral-50 disabled:text-neutral-500',
    'disabled:cursor-not-allowed',
    'dark:disabled:bg-neutral-900',
    
    className
  );
  return <input className={classes} {...props} />;
};

export default Input;
