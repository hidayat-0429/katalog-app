import React from 'react';
import { cn } from '@/lib/utils';

export interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional label displayed next to the switch */
  label?: string;
  /** Position of the label relative to the switch */
  labelPosition?: 'left' | 'right';
}

export const Toggle: React.FC<ToggleProps> = ({ label, labelPosition = 'right', className, ...props }) => {
  const switchEl = (
    <input
      type="checkbox"
      className={cn(
        'relative h-5 w-9 cursor-pointer rounded-full bg-border transition-colors duration-200 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition-transform after:duration-200',
        props.checked && 'bg-primary after:translate-x-4',
        className
      )}
      {...props}
    />
  );

  return label ? (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      {labelPosition === 'left' && <span className="text-sm text-charcoal-muted">{label}</span>}
      {switchEl}
      {labelPosition === 'right' && <span className="text-sm text-charcoal-muted">{label}</span>}
    </label>
  ) : (
    switchEl
  );
};

export default Toggle;
