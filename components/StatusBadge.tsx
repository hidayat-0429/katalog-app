import { Clock, Loader, Truck, CheckCircle, XCircle } from "lucide-react";
import { statusLabel, statusColor } from "@/lib/format";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getIcon = () => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return <Clock className="w-3.5 h-3.5" />;
      case "DIPROSES":
        return <Loader className="w-3.5 h-3.5 animate-spin" />;
      case "DIKIRIM":
        return <Truck className="w-3.5 h-3.5" />;
      case "SELESAI":
        return <CheckCircle className="w-3.5 h-3.5" />;
      case "DIBATALKAN":
        return <XCircle className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  const className = `badge flex items-center gap-1.5 ${statusColor(status)}`;

  return (
    <span className={className}>
      {getIcon()}
      {statusLabel(status)}
    </span>
  );
}
