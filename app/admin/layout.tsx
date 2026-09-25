import { requireAdmin } from "@/lib/session";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  );
}