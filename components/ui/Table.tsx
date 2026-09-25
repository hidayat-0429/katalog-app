import React from 'react';
import { cn } from '@/lib/utils';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  className?: string;
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ className, children, ...props }) => {
  const classes = cn(
    'w-full border-collapse',
    'text-sm text-left',
    className
  );
  return (
    <table className={classes} {...props}>
      {children}
    </table>
  );
};

export const TableHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <thead className={cn(
    'border-b border-neutral-200',
    'dark:border-neutral-700',
    className
  )}>{children}</thead>
);

export const TableBody: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <tbody className={className}>{children}</tbody>
);

export const TableRow: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <tr className={cn(
    'border-b border-neutral-100',
    'motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-out',
    'hover:bg-neutral-50',
    'dark:border-neutral-800',
    'dark:hover:bg-neutral-800/50',
    className
  )}>{children}</tr>
);

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  header?: boolean;
  numeric?: boolean;
}

export const TableCell: React.FC<TableCellProps> = ({ header, numeric, className, ...props }) => {
  const Component = header ? 'th' : 'td';
  const baseClasses = header 
    ? cn(
        'px-4 py-3',
        'text-xs font-semibold uppercase tracking-wide',
        'text-neutral-600 bg-neutral-50',
        'dark:text-neutral-400 dark:bg-neutral-800/50'
      )
    : cn(
        'px-4 py-3',
        'text-neutral-900',
        'dark:text-neutral-200',
        numeric && 'font-mono tabular-nums'
      );
  
  return <Component className={cn(baseClasses, className)} {...(props as any)} />;
};

// Helper for numeric data columns
export const numericCellStyles = 'font-mono tabular-nums';

export default Table;
