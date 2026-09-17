import React from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant =
  | 'primary'
  | 'cta'
  | 'secondary'
  | 'danger'
  | 'ghost'
  | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-sans font-medium text-sm px-5 py-2.5 rounded-md transition-colors duration-150 ease-out disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1',
  cta: 'inline-flex items-center justify-center gap-2 bg-cta hover:bg-cta-hover text-charcoal font-sans font-medium text-sm px-5 py-2.5 rounded-md transition-colors duration-150 ease-out disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cta/20 focus:ring-offset-1',
  secondary: 'inline-flex items-center justify-center gap-2 bg-transparent border border-border text-charcoal font-sans font-medium text-sm px-5 py-2.5 rounded-md hover:bg-bg-subtle transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-charcoal/20 focus:ring-offset-1',
  danger: 'inline-flex items-center justify-center gap-2 bg-transparent border border-danger text-danger font-sans font-medium text-xs sm:text-sm px-3 py-1.5 rounded-md hover:bg-danger-bg transition-colors duration-150 ease-out disabled:opacity-50 disabled:cursor-not-allowed',
  ghost: 'inline-flex items-center justify-center gap-2 text-charcoal-muted font-sans font-medium text-sm px-3 py-2 rounded-md hover:bg-bg-subtle hover:text-charcoal transition-colors duration-150 ease-out',
  icon: 'inline-flex items-center justify-center w-9 h-9 rounded-md text-charcoal-muted hover:bg-bg-subtle hover:text-charcoal transition-colors duration-150 ease-out',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className,
  children,
  ...props
}) => {
  const classes = cn(variantClasses[variant], className);
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
