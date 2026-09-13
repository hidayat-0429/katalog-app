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
      <div className="w-16 h-16 bg-bg-subtle rounded-full flex items-center justify-center text-primary border border-border">
        {icon || <PackageOpen className="w-8 h-8" />}
      </div>
      <div className="max-w-sm">
        <h3 className="font-heading font-bold text-lg text-charcoal mb-1.5">{title}</h3>
        {description && (
          <p className="font-sans text-charcoal-muted text-sm">{description}</p>
        )}
      </div>
      {action && (
        <Link href={action.href} className="btn-secondary text-sm mt-3">
          {action.label}
        </Link>
      )}
    </div>
  );
}
