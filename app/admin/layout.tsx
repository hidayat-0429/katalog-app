import { requireAdmin } from "@/lib/session";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="grid md:grid-cols-[240px_1fr] gap-8 py-2">
      <AdminSidebar />

      {/* Main Content */}
      <div className="min-w-0">{children}</div>
    </div>
  );
}
