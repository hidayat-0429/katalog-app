import React from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'ghost'
  | 'icon';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const baseStyles = cn(
  'inline-flex items-center justify-center gap-2 font-medium',
  'motion-safe:transition-all motion-safe:duration-150 motion-safe:ease-out',
  'active:scale-95',
  'focus:outline-none focus:ring-2 focus:ring-offset-2',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'disabled:hover:bg-current'
);

const variantClasses: Record<ButtonVariant, string> = {
  primary: cn(
    'bg-brand-forest-600 text-white',
    'hover:bg-brand-forest-700',
    'active:bg-brand-forest-800',
    'border border-brand-forest-700',
    'dark:bg-brand-forest-500 dark:hover:bg-brand-forest-600',
    'dark:border-brand-forest-600',
    'focus:ring-brand-forest-500/20'
  ),
  secondary: cn(
    'bg-white text-neutral-700 border border-neutral-300',
    'hover:bg-neutral-50 hover:border-neutral-400',
    'dark:bg-neutral-800 dark:text-neutral-200',
    'dark:border-neutral-600 dark:hover:bg-neutral-700',
    'focus:ring-neutral-500/20'
  ),
  danger: cn(
    'bg-semantic-danger-DEFAULT text-white',
    'hover:bg-semantic-danger-600 border border-semantic-danger-600',
    'dark:bg-semantic-danger-600 dark:hover:bg-semantic-danger-700',
    'focus:ring-semantic-danger-500/20'
  ),
  ghost: cn(
    'bg-transparent text-neutral-700 border border-transparent',
    'hover:bg-neutral-100 hover:border-neutral-200',
    'dark:text-neutral-200 dark:hover:bg-neutral-800',
    'focus:ring-neutral-500/20'
  ),
  icon: cn(
    'bg-transparent text-neutral-600 border-0 p-2',
    'hover:bg-neutral-100 hover:text-neutral-900',
    'dark:text-neutral-300 dark:hover:bg-neutral-800',
    'focus:ring-neutral-500/20'
  ),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-base rounded-md',
  lg: 'px-6 py-3 text-lg rounded-lg',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const classes = cn(baseStyles, variantClasses[variant], sizeClasses[size], className);
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
