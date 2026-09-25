import { PackageOpen } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-800/50 rounded-full flex items-center justify-center text-brand-forest-600 dark:text-brand-forest-400 border border-neutral-200 dark:border-neutral-700">
        {icon || <PackageOpen className="w-8 h-8" />}
      </div>
      <div className="max-w-sm">
        <h3 className="font-heading font-bold text-lg text-neutral-900 dark:text-neutral-100 mb-2">{title}</h3>
        {description && (
          <p className="font-sans text-neutral-500 dark:text-neutral-400 text-sm">{description}</p>
        )}
      </div>
      {action && (
        <Link href={action.href} className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-150 ease-out mt-4">
          {action.label}
        </Link>
      )}
    </div>
  );
}
