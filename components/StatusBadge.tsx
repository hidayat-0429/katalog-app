import { Clock, Loader, Truck, CheckCircle, XCircle } from "lucide-react";
import { statusLabel } from "@/lib/format";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";

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

  const getVariant = (): BadgeVariant => {
    switch (status.toUpperCase()) {
      case "PENDING": return "warning";
      case "DIPROSES": return "info";
      case "DIKIRIM": return "purple";
      case "SELESAI": return "success";
      case "DIBATALKAN": return "danger";
      default: return "default";
    }
  };

  return (
    <Badge variant={getVariant()}>
      {getIcon()}
      <span>{statusLabel(status)}</span>
    </Badge>
  );
}
