import React from 'react';
import { cn } from '@/lib/utils';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  className?: string;
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ className, children, ...props }) => {
  const classes = cn('min-w-full divide-y divide-border', className);
  return (
    <table className={classes} {...props}>
      {children}
    </table>
  );
};

export const TableHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <thead className={cn('bg-bg-subtle', className)}>{children}</thead>
);

export const TableBody: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <tbody className={cn('bg-surface divide-y divide-border', className)}>{children}</tbody>
);

export const TableRow: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <tr className={cn('hover:bg-bg-subtle transition-colors duration-150', className)}>{children}</tr>
);

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  header?: boolean;
}

export const TableCell: React.FC<TableCellProps> = ({ header, className, ...props }) => {
  const Component = header ? 'th' : 'td';
  const baseClasses = header 
    ? 'px-4 py-2 text-xs font-semibold text-charcoal-muted uppercase tracking-wider text-left' 
    : 'px-4 py-2 text-sm text-charcoal align-middle';
  
  return <Component className={cn(baseClasses, className)} {...(props as any)} />;
};

export default Table;
