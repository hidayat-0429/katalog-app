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
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="w-12 h-12 bg-bg-subtle dark:bg-dark-surface rounded flex items-center justify-center text-charcoal-muted dark:text-dark-muted border border-border dark:border-dark-border">
        {icon || <PackageOpen className="w-6 h-6" />}
      </div>
      <div className="max-w-sm">
        <h3 className="font-semibold text-base text-charcoal dark:text-dark-text mb-1">{title}</h3>
        {description && (
          <p className="text-charcoal-muted dark:text-dark-muted text-xs sm:text-sm">{description}</p>
        )}
      </div>
      {action && (
        <Link href={action.href} className="btn-secondary text-xs mt-2">
          {action.label}
        </Link>
      )}
    </div>
  );
}
