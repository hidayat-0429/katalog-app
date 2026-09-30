import { prisma } from "@/lib/prisma";
import { Users } from "lucide-react";
import ResetPasswordButton from "./ResetPasswordButton";
import { Badge, Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      companyName: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 text-neutral-900 dark:text-neutral-100">
      <div>
        <h1 className="font-display text-xl sm:text-3xl font-bold tracking-tight">Kelola Pengguna</h1>
        <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
          <span className="font-mono tabular-nums">{users.length}</span> akun terdaftar. Pakai tombol
          kunci untuk membuatkan sandi baru bila pengguna lupa.
        </p>
      </div>

      <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden bg-surface">
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell header>Pengguna</TableCell>
                  <TableCell header>Usaha</TableCell>
                  <TableCell header>Peran</TableCell>
                  <TableCell header>Pesanan</TableCell>
                  <TableCell header>Terdaftar</TableCell>
                  <TableCell header className="text-right">
                    Sandi
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full flex items-center justify-center shrink-0 text-charcoal-muted">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate">
                            {user.name}
                          </div>
                          <div className="text-xs text-charcoal-muted truncate">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{user.companyName || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "ADMIN" ? "default" : "outline"}>
                        {user.role === "ADMIN" ? "Admin" : "Pembeli"}
                      </Badge>
                    </TableCell>
                    <TableCell numeric>{user._count.orders}</TableCell>
                    <TableCell className="text-xs text-charcoal-muted">
                      {new Date(user.createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <ResetPasswordButton
                        userId={user.id}
                        userEmail={user.email}
                        userName={user.name}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-8 text-center text-charcoal-muted text-xs">
            Belum ada pengguna terdaftar.
          </div>
        )}
      </div>
    </div>
  );
}
